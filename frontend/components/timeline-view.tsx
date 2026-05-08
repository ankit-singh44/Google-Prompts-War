"use client";
import React, { useState } from 'react';
import { MapPin, Clock, AlertTriangle, CloudLightning } from 'lucide-react';

export default function TimelineView({ itinerary }: { itinerary: any }) {
  const [showDisruption, setShowDisruption] = useState(false);

  return (
    <div className="flex flex-col space-y-6 pt-4">
        {/* Simulate Disruption Button (Demo purposes) */}
        <button 
            onClick={() => setShowDisruption(!showDisruption)}
            className="flex items-center justify-center space-x-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors"
        >
            <CloudLightning size={16} />
            <span>Simulate Disruption</span>
        </button>

        {/* Disruption Banner */}
        {showDisruption && (
            <div className="bg-amber-100 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start shadow-sm transition-all duration-300">
                <AlertTriangle className="mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                    <h4 className="font-bold text-sm">Disruption Detected</h4>
                    <p className="text-xs mt-1">Typhoon approaching. Day 3 updated with indoor alternatives.</p>
                </div>
            </div>
        )}

        {!itinerary ? (
            <div className="text-center text-slate-400 py-10 text-sm">
                Awaiting your trip details...
            </div>
        ) : (
            itinerary.days?.map((day: any, idx: number) => (
                <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="bg-rose-50 px-5 py-3 border-b border-rose-100 flex justify-between items-center">
                        <span className="font-bold text-rose-900">Day {day.day_number}</span>
                        <span className="text-xs font-medium text-rose-600 bg-rose-200/50 px-2 py-1 rounded-full">Chill Pace</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {day.segments?.map((seg: any, sIdx: number) => (
                            <div key={sIdx} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                    <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                    <div className="w-0.5 h-full bg-rose-100 my-1"></div>
                                </div>
                                <div>
                                    <div className="flex items-center text-xs text-slate-400 mb-1">
                                        <Clock size={12} className="mr-1" /> {seg.time}
                                    </div>
                                    <h4 className="font-bold text-slate-800">{seg.poi_name}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{seg.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
    </div>
  );
}
