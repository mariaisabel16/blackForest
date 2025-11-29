from pathlib import Path
from typing import Optional

import numpy as np
from PIL import Image, ImageFilter


def improve_object(
    image_path: str,
    mask_path: str,
    prompt: str,
    output_path: Optional[str] = None,
) -> str:
    """
    Placeholder inpainting step to keep the pipeline working locally.

    Replaces the masked region with a blurred version of the image to emulate
    inpainting. Replace this implementation with a real Flux/SAM pipeline when
    ready.

    Args:
        image_path: Original image path.
        mask_path: Binary mask image path (white where the object is).
        prompt: Text prompt describing the replacement.
        output_path: Optional output path; defaults to <image>_inpainted.png.

    Returns:
        Path to the inpainted image.
    """
    image = Image.open(image_path).convert("RGB")
    mask = Image.open(mask_path).convert("L")

    if output_path is None:
        base = Path(image_path).stem
        output_path = Path(image_path).parent / f"{base}_inpainted.png"

    # Soft blur the area inside the mask as a stand-in for real inpainting.
    blurred = image.filter(ImageFilter.GaussianBlur(radius=12))
    # Normalize mask to 0..255 in case it is not already binary.
    mask_array = np.array(mask)
    mask = Image.fromarray(np.clip(mask_array, 0, 255).astype("uint8"))
    composite = Image.composite(blurred, image, mask)
    composite.save(output_path)

    print(f"[improve_object] Prompt: {prompt}")
    print(f"[improve_object] Saved to: {output_path}")

    return str(output_path)
