from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tflearn
import random
import json
import pickle
import nltk
from nltk.stem.lancaster import LancasterStemmer

app = Flask(__name__)
CORS(app)

nltk.download('punkt')
stemmer = LancasterStemmer()

# Load data
with open("intents.json") as file:
    intent_data = json.load(file)

with open("./botData/data.pickle", "rb") as f:
    word_dictionary, classes, X_train, Y_train = pickle.load(f)

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

if __name__ == '__main__':
    app.run(debug=True)
