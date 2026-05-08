"use client";
import React, { useState } from 'react';
import { Mic, Send, Image as ImageIcon } from 'lucide-react';

export default function ChatInterface({ messages, isLoading, onSend }: { messages: any[], isLoading: boolean, onSend: (input: string) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-4">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((msg, idx) => (
                <div key={idx} className={
                    msg.role === 'assistant' 
                    ? "bg-blue-50 text-blue-900 p-4 rounded-2xl rounded-tl-sm w-[85%] border border-blue-100" 
                    : "bg-slate-900 text-white p-4 rounded-2xl rounded-tr-sm w-[85%] self-end ml-auto"
                }>
                    {msg.content}
                </div>
            ))}
            
            {isLoading && (
                <div className="bg-blue-50 text-blue-900 p-4 rounded-2xl rounded-tl-sm w-[85%] border border-blue-100">
                    <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-200"></div>
                        <div className="h-2 w-2 bg-blue-400 rounded-full animation-delay-400"></div>
                    </div>
                </div>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="relative flex items-center">
            <button type="button" className="absolute left-3 text-slate-400 hover:text-slate-600 transition-colors">
                <ImageIcon size={20} />
            </button>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or speak your plans..." 
                className="w-full bg-slate-100 border-none rounded-full py-4 pl-12 pr-24 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
            />
            <div className="absolute right-2 flex space-x-1">
                <button type="button" className="p-2 bg-amber-400 text-slate-900 rounded-full hover:bg-amber-500 shadow-md transition-all">
                    <Mic size={18} />
                </button>
                <button type="submit" className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 shadow-md transition-all">
                    <Send size={18} />
                </button>
            </div>
        </form>
    </div>
  );
}
