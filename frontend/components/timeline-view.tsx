"use client";
import React, { useState } from 'react';
import { MapPin, Clock, AlertTriangle, CloudLightning, ChevronRight } from 'lucide-react';

export default function TimelineView({ itinerary }: { itinerary: any }) {
  const [showDisruption, setShowDisruption] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
        {/* Disruption Alert */}
        <div 
            onClick={() => setShowDisruption(!showDisruption)}
            className={`cursor-pointer overflow-hidden transition-all duration-500 rounded-2xl border ${
                showDisruption 
                ? "bg-red-500/10 border-red-500/20 max-h-40" 
                : "bg-white/5 border-white/5 hover:bg-white/10 max-h-12"
            }`}
        >
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${showDisruption ? 'bg-red-500/20' : 'bg-white/5'}`}>
                        <CloudLightning className={showDisruption ? 'text-red-400' : 'text-white/40'} size={14} />
                    </div>
                    <span className={`text-xs font-semibold ${showDisruption ? 'text-red-400' : 'text-white/40'}`}>
                        {showDisruption ? 'Alert: Disruption Detected' : 'Live Condition Check'}
                    </span>
                </div>
                <ChevronRight className={`text-white/20 transition-transform ${showDisruption ? 'rotate-90' : ''}`} size={14} />
            </div>
            {showDisruption && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[11px] text-white/60 leading-relaxed">
                        Typhoon approaching Kyoto. Safety protocols active. We've updated Day 3 with indoor alternatives and adjusted transit times.
                    </p>
                </div>
            )}
        </div>

        {!itinerary ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white mb-4" />
                <p className="text-xs font-medium text-white tracking-widest uppercase">Planning Engine Idle</p>
            </div>
        ) : (
            <div className="space-y-6">
                {itinerary.days?.map((day: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l border-white/5">
                        <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-white tracking-wide">DAY {day.day_number}</h4>
                            <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 text-white/40 rounded uppercase">Standard</span>
                        </div>

                        <div className="space-y-4">
                            {day.segments?.map((seg: any, sIdx: number) => (
                                <div key={sIdx} className="group relative">
                                    <div className="absolute -inset-2 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
                                    <div className="relative">
                                        <div className="flex items-center text-[10px] text-blue-400/60 font-bold mb-1">
                                            <Clock size={10} className="mr-1" /> {seg.time}
                                        </div>
                                        <h5 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{seg.poi_name}</h5>
                                        <p className="text-[11px] text-white/40 mt-1 line-clamp-2 leading-relaxed">
                                            {seg.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
