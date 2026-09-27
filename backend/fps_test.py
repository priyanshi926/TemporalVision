import cv2
import time
from ultralytics import YOLO

print("Starting...")

model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture("videos/traffic.mp4")

if not cap.isOpened():
    print("ERROR: Video could not be opened")
    exit()

while True:

    ret, frame = cap.read()


    if not ret:
        break

    start = time.time()

    results = model(frame, verbose=False)

    end = time.time()

    fps = 1 / (end - start)

    print("FPS:", round(fps, 2))

cap.release()

print("Video processing completed")