from fastapi import APIRouter, HTTPException
from core.itinerary_generator import generate_itinerary, TripConstraints
from pydantic import BaseModel

router = APIRouter()

class ReplanRequest(BaseModel):
    trip_id: str
    reason: str
    affected_segments: list[str]

@router.post("/generate")
async def create_itinerary(constraints: TripConstraints):
    # In a real app, we'd fetch user preferences and RAG corpus
    user_preferences = {}
    rag_corpus = None # Placeholder
    try:
        itinerary = await generate_itinerary(constraints, user_preferences, rag_corpus)
        return {"status": "success", "data": itinerary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/replan")
async def replan_itinerary(req: ReplanRequest):
    # In a real app, this would trigger Gemini to update the specific trip
    return {"status": "success", "message": f"Replanned trip {req.trip_id} due to {req.reason}"}
