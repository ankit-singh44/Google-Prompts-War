"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ChatInterface({ messages, isLoading, onSend }: { messages: any[], isLoading: boolean, onSend: (input: string) => void }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full relative">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/5 to-transparent z-10 pointer-events-none" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-hide">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className={
                        msg.role === 'assistant' 
                        ? "bg-white/5 backdrop-blur-md text-white/90 p-4 rounded-2xl rounded-tl-sm max-w-[90%] border border-white/10 shadow-lg text-sm leading-relaxed" 
                        : "bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-blue-600/20 text-sm font-medium"
                    }>
                        {msg.role === 'assistant' && <Sparkles className="w-3 h-3 mb-2 text-blue-400" />}
                        {msg.content}
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm border border-white/10">
                        <div className="flex space-x-1">
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 pt-0">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 group-focus-within:opacity-100 transition duration-500 blur-sm"></div>
                <div className="relative flex items-center bg-black/40 border border-white/10 rounded-full">
                    <button type="button" className="pl-4 text-white/40 hover:text-white/80 transition-colors">
                        <ImageIcon size={18} />
                    </button>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Where to next?" 
                        className="w-full bg-transparent border-none py-3 px-4 focus:ring-0 text-white text-sm outline-none placeholder:text-white/20"
                    />
                    <div className="pr-2 flex items-center space-x-1">
                        <button type="button" className="p-2 text-white/40 hover:text-white transition-colors">
                            <Mic size={18} />
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="p-2 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
  );
}
