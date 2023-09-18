import numpy
import tflearn
import tensorflow
import random
import json
import nltk
import pickle
nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer #Used to stem words
stemmer = LancasterStemmer()

# Opening the intents file
with open("intents.json") as file:
    intent_data = json.load(file)
    
word_dictionary = []
classes = []
word_x = []
word_y = []

# Iterating through all the intents, we will have to tokenize and stem
for intent in intent_data["intents"]:
    for pattern in intent["patterns"]:
        tokenized_pattern = nltk.word_tokenize(pattern)
        word_dictionary.extend(tokenized_pattern)
        word_x.append(tokenized_pattern)
        word_y.append(intent["tag"]) #Adding the class it belongs to
        
    # creating list of all possible classes -> tags
    if intent["tag"] not in classes:
        classes.append(intent["tag"])
        
#Stemming the words in the dicitonary 
word_dictionary = [stemmer.stem(w.lower()) for w in word_dictionary]
word_dictionary = sorted(list(set(word_dictionary))) #removing all the duplicates
classes = sorted(classes)

#Creating an X_train and Y_train => We need to check which words are in which pattern and what output they are

#First we one_hot encode the outputs
Y_train = []
for ele in word_y:
    Y_oneHot = [0 for i in range(len(classes))]
    Y_oneHot[classes.index(ele)] = 1
    Y_train.append(Y_oneHot)

#Now we one_hot encode the patterns, but first we must stem and lemmatize
X_train = []
for i in word_x:
    X_oneHot = [0 for i in range(len(word_dictionary))]
    stemmed_x = [stemmer.stem(w.lower()) for w in i]
    for ind, ele in enumerate(word_dictionary):
        if ele in stemmed_x:
            X_oneHot[ind] = 1
    X_train.append(X_oneHot)
    
#Saving everything in pickle
with open("./botData/data.pickle", "wb") as f:
    pickle.dump((word_dictionary, classes, X_train, Y_train), f)
    
#Making everything into an array so we can use in model
X_train_arr = numpy.array(X_train)
Y_train_arr = numpy.array(Y_train)

tensorflow.compat.v1.reset_default_graph() #Getting rid of previous setting

net = tflearn.input_data(shape=[None, len(X_train_arr[0])])#Defining input shape of training
net = tflearn.fully_connected(net, 8) #Add the fully connected layer with 8 neurons hidden layer
net = tflearn.fully_connected(net, 8) 
net = tflearn.fully_connected(net, len(Y_train_arr[0]), activation="softmax")#Get probabilities for each output
net = tflearn.regression(net)#Loss and optimization

model = tflearn.DNN(net)

model.fit(X_train_arr, Y_train_arr, n_epoch=1000, batch_size=8, show_metric=True)
model.save("./botData/model.tflearn")