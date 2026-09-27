import cv2

model = "models/ssd/ssd.onnx"

net = cv2.dnn.readNetFromONNX(model)

cap = cv2.VideoCapture("videos/traffic.mp4")

if not cap.isOpened():
    print("ERROR: Video could not be opened")
    exit()

print("SSD ONNX loaded")
print("Video opened")

while True:

    ret, frame = cap.read()

    if not ret:
        break

    blob = cv2.dnn.blobFromImage(
        frame,
        1 / 127.5,
        (300, 300),
        (127.5, 127.5, 127.5),
        swapRB=True
    )

    net.setInput(blob)

    detections = net.forward()

    print("Detection shape:", detections.shape)

    break

cap.release()

print("SSD test completed")