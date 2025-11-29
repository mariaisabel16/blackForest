from fastapi import APIRouter

router = APIRouter(prefix="/room", tags=["Room"])

@router.get("/test")
async def test_room():
    return {"msg": "ruta de room funcionando"}