from fastapi import APIRouter, UploadFile, File
from fastapi import HTTPException
from PIL import Image
import io
from backend.recognition_testing.vision.detect import run_yolo_on_bytes
from backend.recognition_testing.vision.utils import crop_bbox
from backend.recognition_testing.ai.flux_inpaint import generate_object_thumbnail

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def dupload_check(file: UploadFile = File(...)):
    try:
        content = await file.read()
        Image.open(io.BytesIO(content)).verify()  # validate image header
        return {"status": "ok", "message": "Image received correctly"}
    except Exception:
        raise HTTPException(status_code=400, detail="Error reading image; please retry")