import argparse
from pathlib import Path

from ai.flux_inpaint import improve_object
from ai.prompts import get_prompt
from vision.detect import FURNITURE_CLASSES, detect_objects
from vision.segment import segment_object


def pick_target(detections):
    """Pick the first detection that matches our furniture list, or fallback to first."""
    for det in detections:
        if det["type"] in FURNITURE_CLASSES:
            return det
    return detections[0]


def run_pipeline(image_path: str):
    print(f"[pipeline] Image: {image_path}")
    detections = detect_objects(image_path)
    if not detections:
        raise RuntimeError("No objects detected in the image.")

    target = pick_target(detections)
    print(f"[pipeline] Using detection: {target}")

    mask_path = segment_object(image_path, target["bbox"])
    print(f"[pipeline] Mask saved to: {mask_path}")

    prompt = get_prompt(target["type"])
    output_path = improve_object(image_path, mask_path, prompt)

    print(f"[pipeline] Final result at: {output_path}")
    return {
        "detections": detections,
        "target": target,
        "mask_path": mask_path,
        "prompt": prompt,
        "output_path": output_path,
    }


def parse_args():
    parser = argparse.ArgumentParser(description="Local test for the detect->segment->inpaint pipeline.")
    parser.add_argument(
        "--image",
        type=str,
        default=str(Path(__file__).with_name("room.jpg")),
        help="Path to the local test image.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run_pipeline(args.image)
