
import React, { useState, useRef } from 'react';
import { generateWebsiteCode, refineWebsiteCode, generateAIImage, generateAISpeech } from '../geminiService';

interface CreatorModuleProps {
  addToHistory: (item: any) => void;
}

const VOICE_AGENTS = [
  { id: 'Kore', name: 'Mahi Tutor', icon: 'fa-user-graduate', color: 'bg-blue-500', desc: 'Educational & Precise' },
  { id: 'Fenrir', name: 'Agri-Sage', icon: 'fa-seedling', color: 'bg-emerald-500', desc: 'Deep & Authoritative' },
  { id: 'Zephyr', name: 'Safety Guard', icon: 'fa-user-shield', color: 'bg-orange-500', desc: 'Calm & Reassuring' },
  { id: 'Puck', name: 'Muse', icon: 'fa-paint-brush', color: 'bg-pink-500', desc: 'Fast & Creative' }
];

const CreatorModule: React.FC<CreatorModuleProps> = ({ addToHistory }) => {
  const [activeTab, setActiveTab] = useState<'WEBSITE' | 'IMAGE' | 'VOICE'>('WEBSITE');
  const [prompt, setPrompt] = useState('');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Audio Playback Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Website State
  const [generatedCode, setGeneratedCode] = useState('');
  const [viewMode, setViewMode] = useState<'PREVIEW' | 'CODE'>('PREVIEW');

  // Media State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedAudioBase64, setGeneratedAudioBase64] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState(VOICE_AGENTS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // PCM Decoding & WAV Encoding Helpers
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  /**
   * Adds a WAV header to raw 16-bit PCM data
   */
  const createWavBlob = (pcmData: Uint8Array, sampleRate: number = 24000) => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // "RIFF"
    // file length
    view.setUint32(4, 36 + pcmData.length, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false); // "WAVE"
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false); // "fmt "
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (1 is PCM)
    view.setUint16(20, 1, true);
    // channel count (1 for mono)
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sampleRate * 1 channel * 2 bytes per sample)
    view.setUint32(28, sampleRate * 2, true);
    // block align (1 channel * 2 bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false); // "data"
    // data chunk length
    view.setUint32(40, pcmData.length, true);

    return new Blob([header, pcmData], { type: 'audio/wav' });
  };

  const downloadAudio = () => {
    if (!generatedAudioBase64) return;
    const pcmData = decodeBase64(generatedAudioBase64);
    const wavBlob = createWavBlob(pcmData);
    const url = URL.createObjectURL(wavBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mahi_${selectedAgent.name}_Speech.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const playRawPCM = async (base64: string) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioCtxRef.current;
      
      setIsAudioPlaying(true);
      const audioData = decodeBase64(base64);
      const audioBuffer = await decodeAudioData(audioData, ctx);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsAudioPlaying(false);
      source.start();
    } catch (err) {
      console.error("Playback failed:", err);
      setIsAudioPlaying(false);
    }
  };

  const buildWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    setLoadingStatus('Architecting layout...');
    try {
      const code = await generateWebsiteCode(prompt);
      setGeneratedCode(code);
      addToHistory({ module: 'CREATOR', title: 'Website Built', description: prompt });
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const handleRefine = async () => {
    if (!refinementPrompt || !generatedCode) return;
    setLoading(true);
    setLoadingStatus('Refining components...');
    try {
      const code = await refineWebsiteCode(generatedCode, refinementPrompt);
      setGeneratedCode(code);
      setRefinementPrompt('');
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const handleImageGen = async () => {
    if (!prompt) return;
    setLoading(true);
    setLoadingStatus('Synthesizing pixels...');
    try {
      const url = await generateAIImage(prompt);
      setGeneratedImage(url);
      addToHistory({ module: 'CREATOR', title: 'Image Generated', description: prompt });
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  const handleVoiceGen = async () => {
    if (!prompt) return;
    setLoading(true);
    setGeneratedAudioBase64(null);
    setLoadingStatus(`Synthesizing ${selectedAgent.name}'s voice...`);
    try {
      const pcmBase64 = await generateAISpeech(prompt, selectedAgent.id);
      if (pcmBase64) {
        setGeneratedAudioBase64(pcmBase64);
        await playRawPCM(pcmBase64);
        addToHistory({ module: 'CREATOR', title: 'Neural Speech', description: `Agent: ${selectedAgent.name}` });
      } else {
        throw new Error("Voice synthesis yielded no data.");
      }
    } catch (err: any) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-900/20">
          <i className="fas fa-wand-sparkles"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Mahi Studio</h2>
          <p className="text-sm text-slate-500 font-medium">Creative Intelligence Toolkit</p>
        </div>
      </div>

      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto whitespace-nowrap hide-scrollbar">
        {(['WEBSITE', 'IMAGE', 'VOICE'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(null); }}
            className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
            }`}
          >
            <i className={`fas ${tab === 'WEBSITE' ? 'fa-code' : tab === 'IMAGE' ? 'fa-image' : 'fa-microphone-alt'} mr-2`}></i>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'VOICE' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in slide-in-from-top-2 duration-300">
          {VOICE_AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedAgent.id === agent.id 
                  ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-lg scale-105' 
                  : 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center text-white text-xs`}>
                <i className={`fas ${agent.icon}`}></i>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-tighter">{agent.name}</p>
                <p className="text-[8px] opacity-50 font-bold">{agent.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="glass p-6 rounded-[32px] space-y-4 border-2 border-indigo-100 dark:border-indigo-900/30">
        <textarea
          className="w-full h-24 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
          placeholder={
            activeTab === 'WEBSITE' ? "Describe your website... (e.g. Minimalist coffee shop site with a dark theme)" :
            activeTab === 'IMAGE' ? "Describe your image... (e.g. A futuristic city in the style of cyberpunk)" :
            `What should ${selectedAgent.name} say?`
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (activeTab === 'WEBSITE') buildWebsite();
              else if (activeTab === 'IMAGE') handleImageGen();
              else handleVoiceGen();
            }}
            disabled={loading || !prompt || isAudioPlaying}
            className="flex-1 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className={`fas ${isAudioPlaying ? 'fa-volume-up animate-pulse' : 'fa-bolt'}`}></i>}
            {loading ? (loadingStatus || 'Processing...') : isAudioPlaying ? 'Speaking...' : `Generate ${activeTab}`}
          </button>
          
          {activeTab === 'VOICE' && generatedAudioBase64 && !loading && (
            <button 
              onClick={downloadAudio}
              className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center"
              title="Download Voice"
            >
              <i className="fas fa-download"></i>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'WEBSITE' && generatedCode && (
          <div className="glass rounded-3xl overflow-hidden animate-in zoom-in duration-500 border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
              <div className="flex bg-slate-800 p-1 rounded-lg">
                <button onClick={() => setViewMode('PREVIEW')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'PREVIEW' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Preview</button>
                <button onClick={() => setViewMode('CODE')} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'CODE' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Source</button>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <div className="h-[400px] bg-white relative">
              {viewMode === 'PREVIEW' ? <iframe title="Preview" srcDoc={generatedCode} className="w-full h-full border-none" /> : <pre className="p-6 text-[10px] font-mono text-indigo-400 bg-slate-950 h-full overflow-auto">{generatedCode}</pre>}
            </div>
            <div className="p-4 bg-slate-900 flex gap-2">
              <input className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-xs text-white outline-none" placeholder="Modification..." value={refinementPrompt} onChange={(e) => setRefinementPrompt(e.target.value)} />
              <button onClick={handleRefine} className="bg-indigo-600 px-4 py-2 rounded-xl text-white font-bold text-xs">Apply</button>
            </div>
          </div>
        )}

        {activeTab === 'IMAGE' && generatedImage && (
          <div className="glass p-4 rounded-[40px] animate-in zoom-in duration-500">
             <img src={generatedImage} alt="Generated" className="w-full rounded-[32px] shadow-2xl" />
             <div className="mt-4 flex justify-between items-center px-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Render Engine</p>
                <a href={generatedImage} download="mahi_render.png" className="text-indigo-600 font-black text-[10px] uppercase">Download</a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorModule;
