from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from services.flux_service import generate_flux2, generate_add_flux2 
import requests
import os
import base64
from fastapi.responses import Response
from fastapi import APIRouter, UploadFile, File, HTTPException
from .services.yolo_services import detect_room_objects

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def upload_check(file: UploadFile = File(...)):

    content = await file.read()

    return Response(content, media_type=file.content_type)

@router.post("/eliminate-flux2")
async def eliminate_flux2(prompt: str = Form(...), file: UploadFile = File(...)):
    temp_path = f"temp/{file.filename}"

    os.makedirs("temp", exist_ok=True)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    prompt_final = f"remove {prompt}"

    result = generate_flux2(prompt_final, temp_path)
    image_url = result["image_url"]
    cost = result["cost"]

    img_data = requests.get(image_url).content

    os.makedirs("images", exist_ok=True)
    filename = "flux2_output.jpg"
    path = f"images/{filename}"

    with open(path, "wb") as f:
        f.write(img_data)

    return {
        "status": "ready",
        "public_url": f"http://localhost:8000/static/{path}",
        "cost": cost
    }


@router.post("/add-flux2")
async def add_flux2(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)

    # Save file 1
    temp_path_1 = f"temp/{file1.filename}"
    with open(temp_path_1, "wb") as f:
        f.write(await file1.read())

    # Save file 2
    temp_path_2 = f"temp/{file2.filename}"
    with open(temp_path_2, "wb") as f:
        f.write(await file2.read())
        

    prompt_final = f"Add image {file1.filename} to {file2.filename}"

    result = generate_add_flux2(prompt_final, temp_path_1, temp_path_2)
    image_url = result["image_url"]
    cost = result["cost"]

    img_data = requests.get(image_url).content

    os.makedirs("images", exist_ok=True)
    filename = "flux2_output.jpg"
    path = f"images/{filename}"

    with open(path, "wb") as f:
        f.write(img_data)

    return {
        "status": "ready",
        "public_url": f"http://localhost:8000/static/{path}",
        "cost": cost
    }
async def upload_room(file: UploadFile = File(...)):
    try:
    
        content = await file.read()
        yolo_result = detect_room_objects(content)

        return {
            "status": "ok",
            "filename": file.filename,
            "objects": yolo_result["objects"],
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"YOLO detection failed: {exc}"
        )
