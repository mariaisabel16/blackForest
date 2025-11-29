from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def upload_check(file: UploadFile = File(...)):
    return {
        "status": "ok",
        "filename": file.filename,
        "msg": "archivo recibido"
    }
