import os
from pathlib import Path
from typing import List, Optional, Tuple

import cv2
import numpy as np


def _sanitize_bbox(bbox: List[int], width: int, height: int) -> Tuple[int, int, int, int]:
    """Clamp bbox coordinates to image dimensions."""
    x1, y1, x2, y2 = bbox
    x1 = max(0, min(x1, width - 1))
    y1 = max(0, min(y1, height - 1))
    x2 = max(0, min(x2, width - 1))
    y2 = max(0, min(y2, height - 1))
    return x1, y1, x2, y2


def segment_object(image_path: str, bbox: List[int], mask_output_path: Optional[str] = None) -> str:
    """
    Create a binary segmentation mask using a rectangular bounding box.

    Args:
        image_path: Path to the source image.
        bbox: [x1, y1, x2, y2] bounding box in pixel coordinates.
        mask_output_path: Optional path for the saved mask image.

    Returns:
        The path to the saved mask (white object on black background).
    """
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Cannot read image at {image_path}")

    height, width = image.shape[:2]
    x1, y1, x2, y2 = _sanitize_bbox(bbox, width, height)

    mask = np.zeros((height, width), dtype=np.uint8)
    mask[y1:y2, x1:x2] = 255

    if mask_output_path is None:
        base = Path(image_path).stem
        mask_output_path = Path(image_path).parent / f"{base}_mask.png"

    os.makedirs(Path(mask_output_path).parent, exist_ok=True)
    cv2.imwrite(str(mask_output_path), mask)
    return str(mask_output_path)
