from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model("test_images/test.png", save=True)

print("Detection completed")