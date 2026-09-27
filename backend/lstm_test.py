import cv2
import numpy as np
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

vgg = VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

cap = cv2.VideoCapture("videos/traffic.mp4")

features_list = []

while len(features_list) < 10:

    ret, frame = cap.read()

    if not ret:
        break

    frame = cv2.resize(frame, (224, 224))
    frame = np.expand_dims(frame, axis=0)
    frame = preprocess_input(frame)

    features = vgg.predict(frame, verbose=0)

    features = features.reshape(-1)

    features_list.append(features)

cap.release()

features_array = np.array(features_list)

print("Input feature shape:", features_array.shape)

lstm_model = Sequential([
    LSTM(256, input_shape=(10, 25088)),
    Dense(512)
])

output = lstm_model.predict(
    features_array.reshape(1, 10, 25088),
    verbose=0
)

print("LSTM output shape:", output.shape)
print("LSTM temporal aggregation completed")