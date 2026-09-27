import cv2

cfg = "models/yolov4/yolov4.cfg"
weights = "models/yolov4/yolov4.weights"

net = cv2.dnn.readNetFromDarknet(cfg, weights)

print("YOLOv4 loaded")

cap = cv2.VideoCapture("videos/traffic.mp4")

if not cap.isOpened():
    print("ERROR: Video could not be opened")
    exit()

print("Video opened")

ret, frame = cap.read()

if ret:
    blob = cv2.dnn.blobFromImage(
        frame,
        1 / 255.0,
        (416, 416),
        swapRB=True,
        crop=False
    )

    net.setInput(blob)

    outputs = net.forward(net.getUnconnectedOutLayersNames())

    print("YOLOv4 detection completed")
    print("Number of output layers:", len(outputs))

cap.release()

print("YOLOv4 test completed")