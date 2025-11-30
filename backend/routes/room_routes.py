from pydantic import BaseModel
from services.flux_service import generate_flux2, generate_add_flux2 
import requests
import os
import base64
from fastapi.responses import Response
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.yolo_services import detect_room_objects
import uuid

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def upload_check(file: UploadFile = File(...)):

     try:
        content = await file.read()
        pil_img,objects = detect_room_objects(content)

        return objects

     except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"YOLO detection failed: {exc}"
        )

@router.post("/delete_object")
async def delete_object(prompt: str = Form(...), file: UploadFile = File(...)):
    temp_path = f"temp/{file.filename}"

    os.makedirs("temp", exist_ok=True)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    prompt_final = f"remove {prompt}"

    result = generate_flux2(prompt_final, temp_path)
    image_url = result["image_url"]
    cost = result["cost"]

    img_data = requests.get(image_url).content

    os.makedirs("static", exist_ok=True)
    filename = f"flux2_output_{uuid.uuid4().hex}.jpg"
    path = f"static/{filename}"

    with open(path, "wb") as f:
        f.write(img_data)

    return {
        "status": "ready",
        "public_url": f"http://localhost:8000/{path}",
        "cost":cost
}


@router.post("/add-flux2")
async def add_flux2(
    position: str = Form(...),
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
):
    os.makedirs("temp", exist_ok=True)

    # Save file 1
    temp_path_1 = f"temp/{file1.filename}"
    content1 = await file1.read()
    with open(temp_path_1, "wb") as f:
        f.write(content1)

    # Save file 2
    temp_path_2 = f"temp/{file2.filename}"
    with open(temp_path_2, "wb") as f:
        f.write(await file2.read())
        

    prompt_final = f"Add image {file1.filename} to {file2.filename} at {position}"

    result = generate_add_flux2(prompt_final, temp_path_1, temp_path_2)
    image_url = result["image_url"]
    cost = result["cost"]

    img_data = requests.get(image_url).content

    detected_name = None
    try:
        _, objects = detect_room_objects(content1)
        if isinstance(objects, list) and len(objects) > 0:
            first = objects[0]
            if isinstance(first, dict):
                detected_name = first.get("label") or first.get("name")
    except Exception:
        detected_name = None

    os.makedirs("static", exist_ok=True)
    filename = f"flux2_output_{uuid.uuid4().hex}.jpg"
    path = f"static/{filename}"

    with open(path, "wb") as f:
        f.write(img_data)

    return {
        "status": "ready",
        "public_url": f"http://localhost:8000/{path}",
        "cost": cost,
        "name": detected_name,
    }

@router.post("/apply_color")
async def apply_color(prompt: str = Form(...), file: UploadFile = File(...)):
    temp_path = f"temp/{file.filename}"

    os.makedirs("temp", exist_ok=True)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    prompt_final = f"Change the object to the specified color: {prompt}"

    result = generate_flux2(prompt_final, temp_path)
    image_url = result["image_url"]
    cost = result["cost"]

    img_data = requests.get(image_url).content

    os.makedirs("static", exist_ok=True)
    filename = f"flux2_output_{uuid.uuid4().hex}.jpg"
    path = f"static/{filename}"

    with open(path, "wb") as f:
        f.write(img_data)

    return {
        "status": "ready",
        "public_url": f"http://localhost:8000/{path}",
        "cost":cost
}