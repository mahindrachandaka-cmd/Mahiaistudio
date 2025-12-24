
import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse, generateAISpeech } from '../geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  systemInstruction: string;
  placeholder?: string;
}

const AIChat: React.FC<AIChatProps> = ({ systemInstruction, placeholder = "Type your message..." }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const handleSpeak = async (text: string, idx: number) => {
    if (playingId === idx) return;
    setPlayingId(idx);
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioCtxRef.current;
      
      const pcmBase64 = await generateAISpeech(text, 'Kore');
      if (pcmBase64) {
        const audioData = decodeBase64(pcmBase64);
        const buffer = await decodeAudioData(audioData, ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setPlayingId(null);
        source.start();
      } else {
        setPlayingId(null);
      }
    } catch (err) {
      console.error(err);
      setPlayingId(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const fullHistory = messages.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = `${fullHistory}\nUser: ${input}`;
    
    const response = await generateAIResponse(prompt, systemInstruction);
    
    const aiMsg: ChatMessage = { role: 'model', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] glass rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-indigo-600 mb-4">
              <i className="fas fa-comments text-2xl"></i>
            </div>
            <p className="text-sm font-bold">Free Assistant Mahi is here.</p>
            <p className="text-xs">Ask anything, I'm fully open for public use.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
            }`}>
              {msg.content}
              {msg.role === 'model' && (
                <button 
                  onClick={() => handleSpeak(msg.content, idx)}
                  className={`absolute -right-10 top-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    playingId === idx ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <i className={`fas ${playingId === idx ? 'fa-volume-up' : 'fa-play'} text-[10px]`}></i>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input
          className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        >
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default AIChat;
