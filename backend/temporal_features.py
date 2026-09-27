import cv2
import numpy as np
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input

model = VGG16(
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

    features = model.predict(frame, verbose=0)

    features_list.append(features)

cap.release()

features_array = np.array(features_list)

print("Number of frames:", len(features_list))
print("Temporal feature shape:", features_array.shape)

print("Temporal feature extraction completed")