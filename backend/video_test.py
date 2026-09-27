from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.predict(
    source="test_videos/traffic.mp4",
    save=True,
    show=False
)

print("Video detection completed")