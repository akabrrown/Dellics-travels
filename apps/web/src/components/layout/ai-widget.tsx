"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Sparkles } from "lucide-react";
import { useChat } from "ai/react";

export function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
    
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  
  return (
    <div className="fixed bottom-28 right-6 z-50 flex flex-col items-end group">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 bg-white border border-slate-200 rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden origin-bottom-right animate-in zoom-in-95 duration-200">
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Bot className="size-5" />
              <span className="font-semibold text-sm">Dellics AI Agent</span>
            </div>
            <button 
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 mt-10">
                <Sparkles className="size-8 mx-auto mb-2 text-blue-300" />
                <p>Hi! I can help you book flights, hotels, and cars.</p>
                <p className="mt-2 text-xs">Try saying: "Find me a hotel in Dubai for next week"</p>
              </div>
            )}
            
            {messages.map((message: any) => (
              <div 
                key={message.id} 
                className={`flex items-start gap-2 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user' ? 'bg-slate-200' : 'bg-blue-100'}`}>
                  {message.role === 'user' ? <User className="size-4 text-slate-600" /> : <Bot className="size-4 text-blue-600" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${message.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="size-4 text-blue-600" />
                </div>
                <div className="p-3 rounded-2xl text-sm bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="size-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
              className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shrink-0"
            >
              <Send className="size-4 ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* FAB Button */}
      {!isOpen && (
        <button
          aria-label="Open AI Agent chat"
          onClick={() => {
            setIsOpen(true);
                      }}
          className="relative flex items-center justify-center size-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
        >
          <Sparkles className="size-6" />
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-30 animate-ping group-hover:hidden" style={{ animationDuration: '3s' }} />
        </button>
      )}
    </div>
  );
}
