import cv2

video = cv2.VideoCapture("videos/traffic_fixed.mp4")

while True:
    ret, frame = video.read()

    if not ret:
        break

    cv2.imshow("Traffic Video", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video.release()
cv2.destroyAllWindows()