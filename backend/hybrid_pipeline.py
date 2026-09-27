import cv2
import numpy as np

from ultralytics import YOLO

from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense


print("Starting hybrid pipeline...")

# YOLO
yolo = YOLO("yolov8n.pt")
print("YOLO loaded")

# VGG16
vgg = VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)
print("VGG16 loaded")


# LSTM
lstm_model = Sequential([
    LSTM(256, input_shape=(10, 25088)),
    Dense(512)
])

print("LSTM loaded")


# Open video
cap = cv2.VideoCapture("videos/traffic.mp4")

if not cap.isOpened():
    print("ERROR: Video could not be opened")
    exit()

print("Video opened")


features_list = []

while len(features_list) < 10:

    ret, frame = cap.read()

    if not ret:
        break

    # YOLO detection
    results = yolo(frame, verbose=False)

    # VGG16 preprocessing
    resized = cv2.resize(frame, (224, 224))

    resized = np.expand_dims(resized, axis=0)

    resized = preprocess_input(resized)

    # VGG16 features
    features = vgg.predict(resized, verbose=0)

    features = features.reshape(-1)

    features_list.append(features)

    print("Processed frame:", len(features_list))


cap.release()


# Check 10 frames
if len(features_list) == 10:

    features_array = np.array(features_list)

    print("Feature shape:", features_array.shape)

    # LSTM
    temporal_features = lstm_model.predict(
        features_array.reshape(1, 10, 25088),
        verbose=0
    )

    print("LSTM output shape:", temporal_features.shape)

    print("Hybrid pipeline completed")

else:

    print("Not enough frames")


print("Done")