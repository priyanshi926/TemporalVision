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

while True:
    ret, frame = cap.read()

    if not ret:
        break

    frame = cv2.resize(frame, (224, 224))

    frame = np.expand_dims(frame, axis=0)

    frame = preprocess_input(frame)

    features = model.predict(frame, verbose=0)

    print("Feature shape:", features.shape)

    break

cap.release()

print("VGG16 video feature extraction completed")