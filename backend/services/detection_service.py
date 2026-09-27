import os
import cv2
import time


# =========================================================
# MODEL PATHS
# =========================================================

MODEL_CFG = os.path.join(
    "..",
    "models",
    "yolov4",
    "yolov4.cfg"
)

MODEL_WEIGHTS = os.path.join(
    "..",
    "models",
    "yolov4",
    "yolov4.weights"
)

NAMES_FILE = os.path.join(
    "..",
    "models",
    "yolov4",
    "coco.names"
)


# =========================================================
# LOAD CLASS NAMES
# =========================================================

def load_classes():

    with open(
        NAMES_FILE,
        "r"
    ) as file:

        classes = [
            line.strip()
            for line in file.readlines()
        ]

    return classes


# =========================================================
# LOAD YOLO MODEL
# =========================================================

def load_model():

    print("Loading YOLOv4 model...")

    net = cv2.dnn.readNetFromDarknet(
        MODEL_CFG,
        MODEL_WEIGHTS
    )


    # Try CUDA
    try:

        net.setPreferableBackend(
            cv2.dnn.DNN_BACKEND_CUDA
        )

        net.setPreferableTarget(
            cv2.dnn.DNN_TARGET_CUDA
        )

        print("YOLOv4 using GPU")

    except Exception:

        net.setPreferableBackend(
            cv2.dnn.DNN_BACKEND_OPENCV
        )

        net.setPreferableTarget(
            cv2.dnn.DNN_TARGET_CPU
        )

        print("YOLOv4 using CPU")


    return net


# =========================================================
# GET OUTPUT LAYERS
# =========================================================

def get_output_layers(net):

    layer_names = net.getLayerNames()

    output_layers = net.getUnconnectedOutLayersNames()

    return output_layers


# =========================================================
# DETECT OBJECTS
# =========================================================

def detect_objects(
    frame,
    net,
    classes,
    confidence_threshold=0.5
):

    height, width = frame.shape[:2]


    # Convert image to blob
    blob = cv2.dnn.blobFromImage(
        frame,
        1 / 255.0,
        (416, 416),
        swapRB=True,
        crop=False
    )


    net.setInput(blob)


    output_layers = get_output_layers(net)


    outputs = net.forward(
        output_layers
    )


    boxes = []
    confidences = []
    class_ids = []


    # Process YOLO output
    for output in outputs:

        for detection in output:

            scores = detection[5:]

            class_id = scores.argmax()

            confidence = scores[class_id]


            if confidence > confidence_threshold:

                center_x = int(
                    detection[0] * width
                )

                center_y = int(
                    detection[1] * height
                )

                box_width = int(
                    detection[2] * width
                )

                box_height = int(
                    detection[3] * height
                )


                x = int(
                    center_x -
                    box_width / 2
                )

                y = int(
                    center_y -
                    box_height / 2
                )


                boxes.append([
                    x,
                    y,
                    box_width,
                    box_height
                ])

                confidences.append(
                    float(confidence)
                )

                class_ids.append(
                    class_id
                )


    # Non Maximum Suppression
    indexes = cv2.dnn.NMSBoxes(
        boxes,
        confidences,
        confidence_threshold,
        0.45
    )


    detections = []


    if len(indexes) > 0:

        for i in indexes.flatten():

            x, y, w, h = boxes[i]

            class_id = class_ids[i]


            label = classes[class_id]


            detections.append({

                "class": label,

                "confidence":
                    round(
                        confidences[i],
                        3
                    ),

                "box": [
                    x,
                    y,
                    w,
                    h
                ]

            })


    return detections


# =========================================================
# PROCESS VIDEO
# =========================================================

def process_video(
    analysis_id,
    input_path,
    analysis_status,
    result_folder
):

    try:

        print(
            f"Starting analysis: {analysis_id}"
        )


        # Load model
        net = load_model()

        classes = load_classes()


        # Open video
        cap = cv2.VideoCapture(
            input_path
        )


        if not cap.isOpened():

            raise Exception(
                "Unable to open video"
            )


        # Video properties
        width = int(
            cap.get(
                cv2.CAP_PROP_FRAME_WIDTH
            )
        )

        height = int(
            cap.get(
                cv2.CAP_PROP_FRAME_HEIGHT
            )
        )

        fps = cap.get(
            cv2.CAP_PROP_FPS
        )


        if fps <= 0:

            fps = 25


        total_frames = int(
            cap.get(
                cv2.CAP_PROP_FRAME_COUNT
            )
        )


        # Output video
        output_path = os.path.join(
            result_folder,
            analysis_id + "_result.mp4"
        )


        fourcc = cv2.VideoWriter_fourcc(
            *"mp4v"
        )


        writer = cv2.VideoWriter(
            output_path,
            fourcc,
            fps,
            (width, height)
        )


        # Statistics
        processed_frames = 0

        total_objects = 0

        confidence_sum = 0

        start_time = time.time()


        # =================================================
        # FRAME LOOP
        # =================================================

        while True:

            ret, frame = cap.read()


            if not ret:

                break


            # Detect objects
            detections = detect_objects(
                frame,
                net,
                classes
            )


            # Draw detections
            for detection in detections:

                x, y, w, h = \
                    detection["box"]


                label = detection["class"]

                confidence = \
                    detection["confidence"]


                cv2.rectangle(
                    frame,
                    (x, y),
                    (x + w, y + h),
                    (0, 234, 255),
                    2
                )


                text = (
                    f"{label} "
                    f"{confidence * 100:.1f}%"
                )


                cv2.putText(
                    frame,
                    text,
                    (x, max(y - 8, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (0, 234, 255),
                    2
                )


            # Write processed frame
            writer.write(frame)


            # Statistics
            processed_frames += 1

            total_objects += len(
                detections
            )


            for detection in detections:

                confidence_sum += \
                    detection["confidence"]


            # Update status every 10 frames
            if processed_frames % 10 == 0:

                elapsed = (
                    time.time()
                    - start_time
                )


                current_fps = (
                    processed_frames /
                    elapsed
                    if elapsed > 0
                    else 0
                )


                progress = (
                    processed_frames /
                    total_frames * 100
                    if total_frames > 0
                    else 0
                )


                analysis_status[
                    analysis_id
                ]["progress"] = round(
                    progress,
                    2
                )


                analysis_status[
                    analysis_id
                ]["fps"] = round(
                    current_fps,
                    2
                )


        # =================================================
        # RELEASE
        # =================================================

        cap.release()

        writer.release()


        # Final statistics
        elapsed = (
            time.time()
            - start_time
        )


        final_fps = (
            processed_frames /
            elapsed
            if elapsed > 0
            else 0
        )


        average_confidence = (

            confidence_sum /
            total_objects

            if total_objects > 0

            else 0
        )


        # =================================================
        # SAVE RESULT
        # =================================================

        result = {

            "analysis_id":
                analysis_id,

            "status":
                "completed",

            "frames":
                processed_frames,

            "total_objects":
                total_objects,

            "fps":
                round(
                    final_fps,
                    2
                ),

            "average_confidence":
                round(
                    average_confidence * 100,
                    2
                ),

            "video":
                output_path

        }


        analysis_status[
            analysis_id
        ] = {

            "status":
                "completed",

            "filename":
                os.path.basename(
                    input_path
                ),

            "result":
                result

        }


        print(
            f"Analysis completed: "
            f"{analysis_id}"
        )


    except Exception as error:

        print(
            "Detection error:",
            error
        )


        analysis_status[
            analysis_id
        ] = {

            "status":
                "failed",

            "error":
                str(error)

        }