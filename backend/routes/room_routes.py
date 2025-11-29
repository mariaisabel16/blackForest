from fastapi import APIRouter, UploadFile, File
from fastapi import HTTPException
from PIL import Image
import io

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def upload_check(file: UploadFile = File(...)):
    try:
        # Leer los bytes del archivo
        content = await file.read()

        # Validar que realmente es una imagen
        image = Image.open(io.BytesIO(content))
        image.load()  # valida headers

        return {"status": "ok", "msg": "Image received correctly"}

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading image: {str(e)}"
        )