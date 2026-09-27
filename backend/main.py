from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.detection import router

app = FastAPI(
    title="TemporalVision AI",
    description="AI-powered real-time object detection system",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/results",
    StaticFiles(directory="results"),
    name="results"
)

app.include_router(
    router,
    prefix="/api"
)

@app.get("/")
def home():
    return {
        "system": "TemporalVision",
        "status": "online",
        "message": "AI Detection Backend is running"
    }
@app.get("/health")
def health():
    return {
        "status": "healthy"
    } 


