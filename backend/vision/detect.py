import os
from pathlib import Path

from ultralytics import YOLO

print("detect.py loaded")   # <--- DEBUG 1

MODEL_PATH = Path(__file__).with_name("yolov8m.pt")
model = YOLO(str(MODEL_PATH))
print("Model loaded")            # <--- DEBUG 2

FURNITURE_CLASSES = ["bed","plant", "chair", "couch", "dining table", "tvmonitor", "table"]

def detect_objects(image_path: str):
    print("detect_objects called with:", image_path)   # <--- DEBUG 3
    print("Image exists?:", os.path.exists(image_path))  # <--- DEBUG 4

    results = model(image_path)[0]
    detections = []

    for box in results.boxes:
        cls_id = int(box.cls[0])
        name = results.names[cls_id]

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        if name in FURNITURE_CLASSES:
            detections.append({"type": name, "bbox": [x1, y1, x2, y2]})

    return detections

if __name__ == "__main__":
    print("MAIN running")   # <--- DEBUG 5
    objs = detect_objects("room2.jpg")
    print("Final result:", objs)    # <--- DEBUG 6
