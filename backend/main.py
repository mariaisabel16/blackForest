from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import room_routes

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
