from fastapi import APIRouter, UploadFile, File
from fastapi.responses import Response

router = APIRouter(prefix="/room", tags=["Room"])

@router.post("/upload")
async def upload_check(file: UploadFile = File(...)):

    content = await file.read()

    return Response(content, media_type=file.content_type)
