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
from datetime import datetime
import pytz
from statsmodels.tsa.arima.model import ARIMA
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import numpy as np

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

def LSTM_forecast(time_series_data):
    # Normalize the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    time_series_data_scaled = scaler.fit_transform(np.array(time_series_data).reshape(-1, 1))

    # Converting time series data to supervised learning problem
    def create_dataset(dataset, look_back=1):
        dataX, dataY = [], []
        for i in range(len(dataset) - look_back - 1):
            a = dataset[i:(i + look_back), 0]
            dataX.append(a)
            dataY.append(dataset[i + look_back, 0])
        return np.array(dataX), np.array(dataY)

    # Preparing the dataset with a look_back period of 1 month
    look_back = 1
    X, y = create_dataset(time_series_data_scaled, look_back)

    # Reshaping the input to be [samples, time steps, features]
    X = np.reshape(X, (X.shape[0], 1, X.shape[1]))

    # Build the LSTM model
    model = Sequential()
    model.add(LSTM(4, input_shape=(1, look_back)))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')

    model.fit(X, y, epochs=100, batch_size=1, verbose=1)
    forecast = model.predict(np.array([[time_series_data_scaled[-1]]]).reshape(1, 1, 1))
    # Inverse transform the forecasted value to get it back to the original scale
    forecast = scaler.inverse_transform(forecast)

    return forecast[0][0]

def timeGetter(timestamp_milliseconds):
    timestamp_seconds = int(timestamp_milliseconds) / 1000.0
    dt_object = datetime.utcfromtimestamp(timestamp_seconds)
    dt_object = dt_object.replace(tzinfo=pytz.UTC)
    dt_string = dt_object.isoformat()
    return dt_string

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



@app.route('/api/model', methods=['POST'])
def financeQuery():
    user_input = request.json.get('user_input', '')
    query_destruct = user_input.split(",")
    query_destruct[2] = timeGetter(query_destruct[2])
    query_destruct[3] = timeGetter(query_destruct[3])
    
    #filtering after startdate
    filtered_df = merged2[merged2["issue_date"]>=query_destruct[2]]
    #filtering before enddate
    filtered_df = filtered_df[merged2["issue_date"]<=query_destruct[3]]
    if(query_destruct[1]!="all"):
        filtered_df = filtered_df[merged2["item_code"]==query_destruct[1]]
    #get the column 
    print(filtered_df.columns)
    result_df = filtered_df[["issue_date", query_destruct[0]]].sort_values(by='issue_date', ascending=True)
    result_df = result_df.reset_index()
    output = result_df.to_json()
    return jsonify({"response": output})

@app.route('/api/predict', methods=['POST'])
def predictor():
    user_input = request.json.get('user_input', '')
    df = pd.DataFrame(user_input[0][0])
    df['issue_date'] = pd.to_datetime(df['issue_date'])
    time_series = df.resample('M', on='issue_date').sum()['value']
    

    model_value = ARIMA(time_series, order=(5, 1, 0))
    model_fit_value = model_value.fit()

    forecast_sales_ARIMA = model_fit_value.forecast(steps=1)
    forcast_LSTM = LSTM_forecast(time_series)
    print(forcast_LSTM)
    output = {
    "arima": forecast_sales_ARIMA.tolist(),
    "lstm": forcast_LSTM.tolist()  # assuming forcast_LSTM is also a Series
    }

    return jsonify(output)
    

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
