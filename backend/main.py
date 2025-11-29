from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import room_routes
from dotenv import load_dotenv
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

# Register routes
app.include_router(room_routes)
