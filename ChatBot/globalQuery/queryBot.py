import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer, PorterStemmer
from collections import Counter
import pickle

# Initialize the WordNetLemmatizer and PorterStemmer
wnl = WordNetLemmatizer()
ps = PorterStemmer()

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
    # Initialize a copy of the original DataFrame
    filtered_df = df.copy()
    
    # Loop through each condition dictionary
    for condition in conditions:
        for key, sub_dict in condition.items():
            if key == 'columns':
                # Handle "columns" with a special case for 'is_' columns
                for column, frequency in sub_dict.items():
                    if column.startswith('is_'):
                        filtered_df = filtered_df[filtered_df[column] == True]
            else:
                # For other keys, directly filter using values
                for column_value, frequency in sub_dict.items():
                    filtered_df = filtered_df[filtered_df[key] == column_value]
                    
    return filtered_df

merged2 = pd.read_csv("./data/merged.csv")
with open('./data/augmented_dict.pkl', 'rb') as f:
    augmented_dict = pickle.load(f)

conditions = search_in_augmented_dict(augmented_dict, "Get me all the records from the customer Gastonia")

result = filter_dataframe(merged2,conditions)

result.to_json()