import os
import time
import requests
from datetime import datetime
import base64
import math
from PIL import Image


API_KEY = "9f8ee884-d0e5-41e4-948b-d1e62f837c36"
API_URL = "https://api.bfl.ai/v1/flux-2-pro"

HEADERS = {
    "accept": "application/json",
    "x-key": API_KEY,
    "Content-Type": "application/json"
}

def encode_image_base64(image_path: str) -> str:
    with open(image_path, "rb") as img:
        return base64.b64encode(img.read()).decode("utf-8")

def resize_to_multiple_of_16(image_path: str) -> str:
    img = Image.open(image_path).convert("RGB")

    w, h = img.size

    new_w = math.ceil(w / 16) * 16
    new_h = math.ceil(h / 16) * 16

    # Resize
    resized = img.resize((new_w, new_h), Image.LANCZOS)

    # Save resized version
    new_path = image_path.replace(".jpg", "_resized.jpg").replace(".png", "_resized.png")
    resized.save(new_path)

    return new_path


def generate_flux2(prompt: str, image_path: str):

    if API_KEY is None:
        raise Exception("FLUX_API_KEY is missing. Load .env or export variable.")

    resized_path = resize_to_multiple_of_16(image_path)

    img_b64 = encode_image_base64(resized_path)

    img = Image.open(resized_path)
    w, h = img.size

    payload = {
        "prompt": prompt,
        "input_image": img_b64,
        "width": w,
        "height": h,
        "safety_tolerance": 2
    }


    r = requests.post(API_URL, headers=HEADERS, json=payload)
    r.raise_for_status()

    data = r.json()
    polling_url = data["polling_url"]
    cost = data.get("cost")

    # 2. Polling loop
    while True:
        status_res = requests.get(
            polling_url,
            headers={"accept": "application/json", "x-key": API_KEY}
        )
        status_res.raise_for_status()

        status = status_res.json()

        if status["status"] == "Ready":
            image_url = status["result"]["sample"]
            return { 
                "image_url": image_url, 
                "cost": cost 
            }

        if status["status"] in ("Error", "Failed"):
            raise Exception(status)

        time.sleep(0.5)

def generate_add_flux2(prompt: str, image_path1: str, image_path2: str):

    if API_KEY is None:
        raise Exception("FLUX_API_KEY is missing. Load .env or export variable.")

    resized_path_1 = resize_to_multiple_of_16(image_path1)

    img_1_b64 = encode_image_base64(resized_path_1)

    img = Image.open(resized_path_1)
    w, h = img.size


    img_1_b64 = encode_image_base64(resized_path_1)
    img_2_b64 = encode_image_base64(image_path2)

    payload = {
        "prompt": prompt,
        "input_image": img_1_b64,
        "input_image_2": img_2_b64,
        "width": 1024,
        "height": 1024,
        "safety_tolerance": 2
    }   


    r = requests.post(API_URL, headers=HEADERS, json=payload)
    r.raise_for_status()

    data = r.json()
    polling_url = data["polling_url"]
    cost = data.get("cost")

    # 2. Polling loop
    while True:
        status_res = requests.get(
            polling_url,
            headers={"accept": "application/json", "x-key": API_KEY}
        )
        status_res.raise_for_status()

        status = status_res.json()

        if status["status"] == "Ready":
            image_url = status["result"]["sample"]
            return { 
                "image_url": image_url, 
                "cost": cost 
            }

        if status["status"] in ("Error", "Failed"):
            raise Exception(status)

        time.sleep(0.5)
