import vertexai
from vertexai.generative_models import (
    GenerativeModel, GenerationConfig, Part
)
from pydantic import BaseModel, Field
from typing import Literal
import os
import json

# Initialize Vertex AI
PROJECT_ID = os.getenv("PROJECT_ID", "dummy-project")
try:
    vertexai.init(project=PROJECT_ID, location="us-central1")
except Exception:
    pass

MOOD_MAP = {
    "chill":     {"crowd_max": 2, "pace": "slow", "vibe": ["cafe","park","gallery"]},
    "adventure": {"crowd_max": 5, "pace": "fast", "vibe": ["hiking","sport","rooftop"]},
    "romantic":  {"crowd_max": 3, "pace": "medium","vibe": ["fine-dining","scenic","spa"]},
}

class TripConstraints(BaseModel):
    destination: str
    start_date: str
    end_date: str
    budget_inr: float
    mood: Literal["chill","adventure","romantic","cultural","foodie"] = "chill"
    travel_style: list[str] = Field(default_factory=list)
    dietary: list[str] = Field(default_factory=list)
    mobility_needs: str | None = None
    group_size: int = 1
    raw_voice_input: str | None = None  # unparsed user utterance

def build_system_prompt(mood: str) -> str:
    profile = MOOD_MAP.get(mood, MOOD_MAP["chill"])
    return f"""You are WayfinderAI, a world-class travel planner.
Mood profile: {profile}
Rules:
- Avoid tourist traps; prefer local gems
- Respect dietary, mobility and budget constraints strictly
- Output valid JSON matching ITINERARY_SCHEMA exactly
- Explain each POI choice in one sentence (locals love it because...)
- Always include a fallback option per day segment"""

def build_itinerary_prompt(constraints: TripConstraints, user_preferences: dict) -> str:
    return f"Create an itinerary for {constraints.destination} from {constraints.start_date} to {constraints.end_date}."

# Generic schema for the JSON response
ITINERARY_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "days": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "day_number": {"type": "INTEGER"},
                    "segments": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "time": {"type": "STRING"},
                                "poi_name": {"type": "STRING"},
                                "description": {"type": "STRING"},
                                "fallback_poi": {"type": "STRING"}
                            }
                        }
                    }
                }
            }
        }
    }
}

async def generate_itinerary(
    constraints: TripConstraints,
    user_preferences: dict,
    rag_corpus = None,
) -> dict:
    try:
        model = GenerativeModel(
            "gemini-2.0-flash-001",
            system_instruction=build_system_prompt(constraints.mood),
        )
        
        response = await model.generate_content_async(
            build_itinerary_prompt(constraints, user_preferences),
            generation_config=GenerationConfig(
                temperature=0.35,
                response_mime_type="application/json",
                response_schema=ITINERARY_SCHEMA,
            ),
        )
        return json.loads(response.candidates[0].content)
    except Exception as e:
        print(f"Vertex AI generation failed: {e}")
        # Return a mock for demo purposes if API fails
        return {
            "days": [
                {
                    "day_number": 1,
                    "segments": [
                        {
                            "time": "Morning",
                            "poi_name": "Local Cafe",
                            "description": "Locals love it because of the fresh pastries.",
                            "fallback_poi": "Nearby Bakery"
                        }
                    ]
                }
            ]
        }
