from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tflearn
import random
import json
import pickle
import nltk
from nltk.stem.lancaster import LancasterStemmer
import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from collections import Counter
import re
import openai

# Initialize the WordNetLemmatizer and PorterStemmer
wnl = WordNetLemmatizer()
ps = PorterStemmer()

app = Flask(__name__)
CORS(app)

nltk.download('punkt')
stemmer = LancasterStemmer()

# Load data
with open("intents.json") as file:
    intent_data = json.load(file)

with open("./botData/data.pickle", "rb") as f:
    word_dictionary, classes, X_train, Y_train = pickle.load(f)
    
merged2 = pd.read_csv("./data/merged.csv")
with open('./data/augmented_dict.pkl', 'rb') as f:
    augmented_dict = pickle.load(f)

# Build and load model
net = tflearn.input_data(shape=[None, len(X_train[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(Y_train[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)
model.load("./botData/model.tflearn")

def bag_of_words(s: str, words: list) -> np.array:
    bag = np.zeros(len(words), dtype=np.float32)
    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1.0
    return bag


# Function to tokenize, stem, and lemmatize a string
def process_text(text):
    tokens = word_tokenize(text)
    lemmatized_tokens = [wnl.lemmatize(token.lower()) for token in tokens]
    stemmed_tokens = [ps.stem(token.lower()) for token in tokens]
    return tokens, lemmatized_tokens, stemmed_tokens

# Function to search for matches in an augmented dictionary
def search_in_augmented_dict(augmented_dict, input_string):
    original, lemmatized, stemmed = process_text(input_string)
    search_tokens = original + lemmatized + stemmed
    
    results = []
    
    for key, values in augmented_dict.items():
        matches_counter = Counter()
        for value_dict in values:
            for original_value, variations in value_dict.items():
                for variation in variations:
                    if variation.lower() in search_tokens:
                        matches_counter[original_value] += 1
        
        if matches_counter:
            results.append({key: dict(matches_counter)})
    
    return results

def filter_dataframe(df, conditions):
    # Initialize a list to hold temporary DataFrames for each condition
    temp_dfs = []
    
    # Loop through each condition dictionary
    for condition in conditions:
        for key, sub_dict in condition.items():
            # Initialize a list to hold filtered DataFrames for each value in a single column
            temp_dfs_single_column = []

            # Special handling for 'columns' key, especially for 'is_' columns
            if key == 'columns':
                for column, frequency in sub_dict.items():
                    if column.startswith('is_'):
                        temp_df = df[df[column] == True]
                        if not temp_df.empty:
                            temp_dfs_single_column.append(temp_df)
            else:
                # General case: filter using given column value and frequency
                for column_value, frequency in sub_dict.items():
                    temp_df = df[df[key] == column_value]
                    if not temp_df.empty:
                        temp_dfs_single_column.append(temp_df)
                        
            # Combine the rows that satisfy any of the conditions within a single column
            if temp_dfs_single_column:
                combined_df_single_column = pd.concat(temp_dfs_single_column).drop_duplicates()
                temp_dfs.append(combined_df_single_column)

    # Combine all the conditions into one DataFrame and drop duplicate rows
    if temp_dfs:
        filtered_df = pd.concat(temp_dfs).drop_duplicates()
        return filtered_df
    else:
        print("No matching records found.")
        return pd.DataFrame()


@app.route('/api/cupcakebot', methods=['POST'])
def cupcakebot():
    user_input = request.json.get('user_input', '')

    if not user_input:
        return jsonify({"response": "Please provide user input."}), 400

    results = model.predict([bag_of_words(user_input, word_dictionary)])
    results_index = np.argmax(results)
    tag = classes[results_index]

    intents = {item["tag"]: item["responses"] for item in intent_data["intents"]}
    response = random.choice(intents.get(tag, ["I don't understand."]))

    return jsonify({"response": response})

@app.route('/api/cupcakebot/query', methods=['POST'])
def cupcakebotquery():
    user_input = request.json.get('user_input', '')
    conditions_res = search_in_augmented_dict(augmented_dict, user_input)
    result = filter_dataframe(merged2, conditions_res)
    result_limited = result.head(20)
    print(conditions_res)
    return jsonify({"response": result_limited.to_json()})

@app.route('/api/cupcakebot/analytics', methods=['POST'])
def cupcakebotanalytics():
    user_input = request.json.get('user_input', '')
    labels_removed = re.split('Query:|,|Prompt:', user_input)
    info_list = [item for item in labels_removed if item != '']
    query = info_list[0]
    conditions_res = search_in_augmented_dict(augmented_dict, query)
    result = filter_dataframe(merged2, conditions_res)
    result_limited = result.head(10)
    db_info = result_limited.to_json()
    prompt = info_list[1]
    
    # Send data to GPT-4 for analysis
    openai.api_key = "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"
    full_prompt = f"{prompt}\nDatabase Info: {db_info}"

    # Make API call to GPT-4
    response = openai.Completion.create(
        engine="text-davinci-002",  # Choose the appropriate engine
        prompt=full_prompt,
        max_tokens=150  # Set the token limit as needed
    )

    gpt_output = response.choices[0].text.strip()

    return jsonify({"response": gpt_output})
    
if __name__ == '__main__':
    app.run(debug=True)
