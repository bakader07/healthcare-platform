from flask import Flask, request, jsonify
from keras.models import load_model
import keras
import numpy as np
import cv2 as cv


model = "achouak_model.h5"
image = "achouak_test.jpg"
model = keras.models.load_model("../uploads/"+model)

config = model.get_config() # Returns pretty much every information about your model
shape = config["layers"][0]["config"]["batch_input_shape"] # returns a tuple of width, height and channels
print("SHAPE: ", shape)

image = cv.imread("../test/"+image)
print("image originale shape:", image.shape)
image = cv.resize(image, (shape[1], shape[2]))
print("resized image shape:", image.shape)

# image = image.reshape(shape)
# print("edited image shape:", image.shape)

cv.imshow("test", image)
# input_arr = keras.preprocessing.image.img_to_array()

prediction = model.predict(np.array([image]))[0]
print(prediction)
