print("Initializing WayfinderAI Planner...")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import itineraries, poi

app = FastAPI(title="WayfinderAI Planner Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itineraries.router, prefix="/itineraries", tags=["Itineraries"])
app.include_router(poi.router, prefix="/poi", tags=["POI"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
