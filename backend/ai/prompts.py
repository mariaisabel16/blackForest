PROMPTS = {
    "bed": "Replace the bed with a modern minimalist queen-size platform bed with light wood and neutral linens.",
    "chair": "Replace the chair with a cozy accent chair in forest green velvet and slim black metal legs.",
    "couch": "Replace the couch with a modular dark gray fabric sofa with clean lines and oak legs.",
    "dining table": "Replace the dining table with a Scandinavian-style light oak round table.",
    "tvmonitor": "Replace the TV with a thin bezel 65-inch OLED mounted on the wall.",
    "default": "Replace the object with a modern Black Forest inspired design using natural wood and muted tones.",
}


def get_prompt(object_type: str) -> str:
    """Return a prompt tailored to the detected object type."""
    key = object_type.lower()
    return PROMPTS.get(key, PROMPTS["default"])
