"use client";
import React, { useState } from 'react';
import MapView from "@/components/map-view";
import ChatInterface from "@/components/chat-interface";
import TimelineView from "@/components/timeline-view";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm WayfinderAI. Where would you like to go, and what's the vibe?" }
  ]);
  const [itinerary, setItinerary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (input: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);

    try {
        // Try calling the actual local backend (planner service directly)
        const res = await fetch("http://localhost:8000/itineraries/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                destination: input,
                start_date: "2024-10-01",
                end_date: "2024-10-04",
                budget_inr: 80000,
                mood: "chill",
                raw_voice_input: input
            })
        });
        
        if (res.ok) {
            const data = await res.json();
            setItinerary(data.data);
            setMessages((prev) => [...prev, { role: 'assistant', content: "I've generated your custom itinerary using Vertex AI! Check out the timeline and map." }]);
        } else {
            throw new Error("Backend error");
        }
    } catch (e) {
        console.log("Backend not reachable, using offline mock data", e);
        // Fallback mock for demo if Python backend isn't running
        setTimeout(() => {
            const mockItinerary = {
                days: [
                    {
                        day_number: 1,
                        segments: [
                            { time: "09:00 AM", poi_name: "Fushimi Inari Taisha", description: "Locals love it because of the quiet upper trails." },
                            { time: "12:30 PM", poi_name: "Vermillion Cafe", description: "Excellent vegan options right by the shrine exit." }
                        ]
                    },
                    {
                        day_number: 2,
                        segments: [
                            { time: "10:00 AM", poi_name: "Arashiyama Bamboo Grove", description: "A serene walk through towering bamboo." },
                            { time: "02:00 PM", poi_name: "Tenryu-ji Temple", description: "Beautiful Zen garden views." }
                        ]
                    }
                ]
            };
            setItinerary(mockItinerary);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Offline Mode: Generated a custom itinerary for you. I've updated the timeline and map!" }]);
        }, 1500);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex overflow-hidden bg-[#f8fafc]">
      {/* Left Panel: Chat & Timeline (35%) */}
      <div className="w-[35%] h-full flex flex-col p-6 pr-3">
        <header className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Wayfinder<span className="text-blue-600">AI</span></h1>
            <p className="text-sm font-medium text-slate-500 mt-1">The trip that thinks for itself.</p>
        </header>
        
        <div className="flex-1 overflow-hidden flex flex-col space-y-6">
            <div className="h-[40%] min-h-[300px]">
                <ChatInterface messages={messages} isLoading={isLoading} onSend={handleGenerate} />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-8 scrollbar-hide">
                <h3 className="font-bold text-slate-800 mb-4 px-1">Your Itinerary</h3>
                <TimelineView itinerary={itinerary} />
            </div>
        </div>
      </div>

      {/* Right Panel: Map (65%) */}
      <div className="w-[65%] h-full py-4 pr-4">
        <MapView itinerary={itinerary} />
      </div>
    </main>
  );
}
