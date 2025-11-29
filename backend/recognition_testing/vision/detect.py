from ultralytics import YOLO
from PIL import Image
import io

model = YOLO("yolov8m.pt")

FURNITURE_CLASSES = ["bed", "chair", "couch", "dining table", "tvmonitor", "potted plant", "lamp"]

def detect_objects(img: Image.Image):
    results = model(img)[0]

    detections = []
    for box in results.boxes:
        cls_id    = int(box.cls[0])
        name      = results.names[cls_id]

        if name not in FURNITURE_CLASSES:
            continue

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        detections.append({
            "label": name,
            "bbox": [x1, y1, x2, y2]
        })

    return detections


def run_yolo_on_bytes(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    detections = detect_objects(img)
    return img, detections