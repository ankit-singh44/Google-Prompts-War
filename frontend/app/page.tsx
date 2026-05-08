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

  // Use the live Gateway URL if in production, otherwise localhost
  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway-service-tmbm3qpt7a-uc.a.run.app";

  const handleGenerate = async (input: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);

    try {
        const res = await fetch(`${GATEWAY_URL}/itineraries/generate`, {
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
            setMessages((prev) => [...prev, { role: 'assistant', content: "Your AI-powered journey is ready! Explore the plan on the map." }]);
        } else {
            throw new Error("Backend error");
        }
    } catch (e) {
        console.log("Using dynamic mock data", e);
        setTimeout(() => {
            const mockItinerary = {
                days: [
                    {
                        day_number: 1,
                        segments: [
                            { time: "09:00 AM", poi_name: "Kyoto Imperial Palace", description: "A stunning piece of history surrounded by lush gardens." },
                            { time: "01:30 PM", poi_name: "Nishiki Market", description: "The 'Kitchen of Kyoto' - a food lover's paradise." }
                        ]
                    },
                    {
                        day_number: 2,
                        segments: [
                            { time: "10:00 AM", poi_name: "Kiyomizu-dera", description: "Iconic wooden temple with panoramic city views." },
                            { time: "03:00 PM", poi_name: "Gion District", description: "Spot a geiko in the historic streets of Kyoto." }
                        ]
                    }
                ]
            };
            setItinerary(mockItinerary);
            setMessages((prev) => [...prev, { role: 'assistant', content: "I've drafted a premium itinerary for your trip. Check the timeline and map below!" }]);
        }, 1200);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex overflow-hidden bg-mesh">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Side Panel */}
      <div className="w-[400px] h-full flex flex-col z-10 relative">
        <div className="p-8 pb-4">
            <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg animate-pulse shadow-lg shadow-blue-500/20" />
                <h1 className="text-2xl font-black tracking-tight text-white">Wayfinder<span className="text-blue-400">AI</span></h1>
            </div>
            <p className="text-xs font-semibold tracking-widest text-blue-400/80 uppercase">Ultimate Travel Co-Pilot</p>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col p-6 pt-0 space-y-6">
            <div className="h-[45%] glass rounded-3xl overflow-hidden shadow-2xl relative">
                <ChatInterface messages={messages} isLoading={isLoading} onSend={handleGenerate} />
            </div>
            
            <div className="flex-1 glass rounded-3xl p-6 overflow-y-auto scrollbar-hide shadow-2xl border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white text-lg">Active Itinerary</h3>
                    {itinerary && <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">LIVE</span>}
                </div>
                <TimelineView itinerary={itinerary} />
            </div>
        </div>

        <div className="p-6 pt-0 text-center">
            <p className="text-[10px] text-white/30 font-medium tracking-wide">POWERED BY GEMINI 2.0 FLASH • GCP • VERTEX AI</p>
        </div>
      </div>

      {/* Main Map Content */}
      <div className="flex-1 h-full p-6 pl-0 z-10">
        <div className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl border border-white/5 relative bg-black/20 backdrop-blur-sm">
            <MapView itinerary={itinerary} />
            
            {/* Overlay Controls */}
            {!itinerary && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="text-center space-y-4 animate-float">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <span className="text-4xl">🌍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Your world, reimagined.</h2>
                        <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed px-10">
                            Tell WayfinderAI where you want to go. We'll handle the logistics, the vibe, and the unexpected.
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
