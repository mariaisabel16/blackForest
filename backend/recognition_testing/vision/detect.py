from ultralytics import YOLO
from PIL import Image
import io
from pathlib import Path

model = YOLO("yolov8x-world.pt")
FURNITURE_CLASSES = ["bed", "sofa", "couch", "chair", "desk", "table",
    "nightstand", "drawer", "dresser", "wardrobe", "closet",
    "bookshelf", "shelf", "cabinet", "counter",
    "lamp", "floor lamp", "table lamp",
    "potted plant", "plant", "vase",
    "mirror", "window", "picture", "painting",
    "carpet", "rug",
    "tv", "monitor", "laptop", "computer",
    "pillow", "blanket"]

model.set_classes(FURNITURE_CLASSES)


def detect_objects(img: Image.Image):
    results = model.predict(img, verbose=False, imgsz=960)[0]


    detections = []
    for i,box in enumerate(results.boxes):
        
        cls_id    = int(box.cls[0])
        name      = results.names[cls_id]

        if name not in FURNITURE_CLASSES:
          continue

        x1, y1, x2, y2 = [str(int(v)) for v in box.xyxy[0]]
        print(f"DEBUG {i}: LABEL={name}, BBOX={(x1, y1, x2, y2)}")

        detections.append({
            "label": name,
            "bbox": [x1, y1, x2, y2],
        })


    return detections


def run_yolo_on_bytes(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    detections = detect_objects(img)
    return img, detections