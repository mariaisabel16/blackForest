from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import room_routes, object_routes, organize_routes

app = FastAPI(title="RoomAI Designer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(room_routes.router)
app.include_router(object_routes.router)
app.include_router(organize_routes.router)

@app.get("/ping")
async def ping():
    return {"msg": "pong"}