"use client";
import React from 'react';

export default function MapView({ itinerary }: { itinerary: any }) {
  return (
    <div className="w-full h-full bg-blue-900 flex items-center justify-center relative overflow-hidden rounded-l-3xl shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Kyoto&zoom=12&size=800x800&maptype=roadmap&style=feature:all|element:labels|visibility:off&key=YOUR_KEY')] bg-cover bg-center" />
        
        {!itinerary ? (
            <div className="z-10 text-center">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Interactive Map</h2>
                <p className="text-blue-200">Map pins and routing will appear here</p>
            </div>
        ) : (
            <>
                <div className="z-10 absolute top-8 left-8">
                    <h2 className="text-3xl font-bold text-white mb-1 shadow-sm">Kyoto, Japan</h2>
                    <p className="text-blue-200">Showing {itinerary.days?.length || 0} days</p>
                </div>
                {/* Dynamically render mock pins based on days */}
                {itinerary.days?.map((day: any, idx: number) => {
                    // Just randomize positions for demo
                    const top = `${20 + (idx * 20)}%`;
                    const left = `${30 + (idx * 15)}%`;
                    const colors = ['bg-rose-500', 'bg-emerald-500', 'bg-amber-400', 'bg-purple-500'];
                    const color = colors[idx % colors.length];

                    return (
                        <div key={idx} style={{ top, left }} className={`absolute w-6 h-6 ${color} rounded-full border-4 border-white shadow-lg animate-bounce`} />
                    );
                })}
            </>
        )}
    </div>
  );
}
