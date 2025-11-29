from backend.recognition_testing.vision.detect import run_yolo_on_bytes

def detect_room_objects(image_bytes: bytes):
    pil_img, detections = run_yolo_on_bytes(image_bytes)

    return {
        "objects": detections
    }