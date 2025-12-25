
import React, { useState, useRef, useEffect } from 'react';
import { connectLiveSession } from '../geminiService';

const LiveLab: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState('Standby');
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<any>(null);
  
  // Audio handling
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
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

  const startLive = async () => {
    setStatus('Initializing Media...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = connectLiveSession({
        onopen: () => {
          setStatus('Live Connection Established');
          setIsActive(true);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const audioData = decode(msg.serverContent.modelTurn.parts[0].inlineData.data);
            const buffer = await decodeAudioData(audioData, audioCtxRef.current!);
            const source = audioCtxRef.current!.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtxRef.current!.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current!.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
          }
        },
        onerror: () => setStatus('Connection Error'),
        onclose: () => setIsActive(false),
      }, "You are Mahi Live, a real-time multimodal lab assistant. Help the user by observing their video and listening to their voice.");

      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('Media Access Denied');
    }
  };

  const stopLive = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus('Session Terminated');
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl shadow-xl animate-pulse">
          <i className="fas fa-satellite-dish"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Live Lab assistant</h2>
          <p className="text-sm text-slate-500 font-medium">Real-time Multimodal Neural Session</p>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-800">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-50" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {isActive ? (
            <div className="flex items-end gap-1.5 h-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-slate-700 flex items-center justify-center text-slate-700">
              <i className="fas fa-video-slash text-2xl"></i>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="bg-slate-950/80 backdrop-blur px-4 py-2 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">
            {status}
          </div>
          <button 
            onClick={isActive ? stopLive : startLive}
            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl pointer-events-auto ${
              isActive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isActive ? 'Terminate' : 'Initiate Session'}
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-[32px] text-center border-2 border-indigo-100 dark:border-indigo-900/30">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Laboratory Directives</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
             <i className="fas fa-microphone text-indigo-400"></i>
             <p className="text-[9px] font-bold text-slate-500">VOICE INPUT</p>
          </div>
          <div className="space-y-1">
             <i className="fas fa-eye text-emerald-400"></i>
             <p className="text-[9px] font-bold text-slate-500">VISION FEED</p>
          </div>
          <div className="space-y-1">
             <i className="fas fa-bolt text-amber-400"></i>
             <p className="text-[9px] font-bold text-slate-500">LOW LATENCY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLab;
