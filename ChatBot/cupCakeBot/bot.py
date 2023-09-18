import numpy as np
import tflearn
import random
import json
import pickle
import nltk
from nltk.stem.lancaster import LancasterStemmer

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

def chat() -> None:
    print("Start talking with the bot!")
    intents = {item["tag"]: item["responses"] for item in intent_data["intents"]}

    while True:
        inp = input("You: ")
        if inp.lower() == "quit":
            break

        results = model.predict([bag_of_words(inp, word_dictionary)])
        results_index = np.argmax(results)
        tag = classes[results_index]

        print(random.choice(intents.get(tag, ["I don't understand."])))

chat()
