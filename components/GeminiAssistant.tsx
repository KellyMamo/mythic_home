
import React, { useState, useRef } from 'react';
import { getDesignConsultation, analyzeHouseImage } from '../services/geminiService';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    
    const response = await getDesignConsultation(userMsg);
    setMessages(prev => [...prev, { role: 'ai', content: response || "I'm not sure how to answer that." }]);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setMessages(prev => [...prev, { role: 'user', content: "[Image uploaded]" }]);
      const response = await analyzeHouseImage(base64);
      setMessages(prev => [...prev, { role: 'ai', content: response || "I couldn't analyze the image." }]);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
      >
        <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
        <span className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Consult our AI Architect
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/20 pointer-events-none">
          <div className="bg-white w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10">
            <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Mythic Homes Consultant</h3>
                  <p className="text-[10px] text-slate-400">Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-slate-300">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center mt-10">
                  <div className="text-4xl mb-4 text-slate-200">
                    <i className="fa-solid fa-house-chimney"></i>
                  </div>
                  <h4 className="font-bold text-slate-800">Welcome to Mythic Homes AI</h4>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto mt-2">
                    Ask me about styles, layout efficiency, or upload a photo of a house you love!
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' ? 'bg-slate-100 text-slate-800 rounded-br-none' : 'bg-blue-50 text-slate-800 rounded-bl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 p-3 rounded-2xl animate-pulse text-xs text-slate-400">
                    Designing thoughts...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-2 mb-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-200"
                >
                  <i className="fa-solid fa-image mr-1"></i> Analyze Photo
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tell me about your dream home..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button 
                  onClick={handleSend}
                  className="bg-slate-900 text-white w-12 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
