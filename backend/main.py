from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from routes.room_routes import router as room_router

load_dotenv()
app = FastAPI(title="RoomAI Designer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/static",
    StaticFiles(directory="static"),  # carpeta backend/static
    name="static",
)
# Register routes
app.include_router(room_router)