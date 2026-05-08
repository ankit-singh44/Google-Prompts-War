# Wayfinder AI - Master Hackathon Pitch

## Slide 1: The Problem
**Travel planning is fragmented and rigid.**
- Users juggle 6+ apps (flights, maps, reviews, weather, booking).
- Planners don't understand "moods", just category filters.
- **The real pain:** When disruptions hit (weather, closures), you're on your own.

## Slide 2: The Solution - Wayfinder AI
**"The trip that thinks for itself."**
1. **Mood-Aware Planning:** "Chill, not touristy" -> instant Vertex AI itinerary.
2. **Proactive Live Re-planning:** Pub/Sub disruption pipeline silently rewrites plans in real-time.
3. **Continuous Learning:** Photo-to-POI learning via Cloud Vision API.

## Slide 3: The Architecture & Demo
**14 Google Cloud Services, 1 `terraform apply`**
- **Demo Beats:**
  1. Voice-prompt generation (Gemini 2.0).
  2. Photo upload -> Vision API swaps Day 2.
  3. Simulate Typhoon -> Pub/Sub triggers <2s replan.
  4. One-tap Export & Accessibility mode.
