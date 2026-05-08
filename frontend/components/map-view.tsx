"use client";
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function MapView({ itinerary }: { itinerary: any }) {
  return (
    <div className="w-full h-full bg-[#0a0c10] flex items-center justify-center relative overflow-hidden group">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        
        {/* Fake Map Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />

        {!itinerary ? (
            <div className="z-10 text-center opacity-10">
                <Navigation className="w-20 h-20 text-white mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">Navigation Offline</h2>
            </div>
        ) : (
            <>
                <div className="z-20 absolute top-10 left-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        <h2 className="text-4xl font-black text-white tracking-tighter">KYOTO</h2>
                    </div>
                    <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Global Ops Active</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{itinerary.days?.length || 0} SECTORS</span>
                    </div>
                </div>

                {/* Simulated Path Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <path 
                        d="M 300 200 Q 500 400 700 300" 
                        fill="none" 
                        stroke="url(#grad)" 
                        strokeWidth="2" 
                        strokeDasharray="10 5"
                        className="animate-[dash_10s_linear_infinite]"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Dynamically render pins */}
                {itinerary.days?.map((day: any, idx: number) => {
                    const top = `${25 + (idx * 25)}%`;
                    const left = `${40 + (idx * 20)}%`;
                    
                    return (
                        <div key={idx} style={{ top, left }} className="absolute z-20 group/pin cursor-pointer">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover/pin:opacity-100 transition-opacity duration-500" />
                                <div className="relative w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
                                    <MapPin className="text-white w-5 h-5" />
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none">
                                        <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold text-white whitespace-nowrap">
                                            DAY {day.day_number}: {day.segments?.[0]?.poi_name || "POI"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        )}
        
        <style jsx>{`
            @keyframes dash {
                to { stroke-dashoffset: -100; }
            }
        `}</style>
    </div>
  );
}
