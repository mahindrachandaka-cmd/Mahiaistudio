
import React, { useState } from 'react';
import { analyzeCropImage, searchGroundedData, generateAIResponse } from '../geminiService';

interface AgricultureModuleProps {
  addToHistory: (item: any) => void;
}

const AgricultureModule: React.FC<AgricultureModuleProps> = ({ addToHistory }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [textQuery, setTextQuery] = useState('');
  const [textResult, setTextResult] = useState('');
  const [marketData, setMarketData] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await analyzeCropImage(image.split(',')[1]);
      setAnalysis(res);
      addToHistory({ module: 'AGRICULTURE', title: 'Vision Audit', description: 'Plant disease diagnosis' });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAgriQuery = async () => {
    if (!textQuery) return;
    setLoading(true);
    try {
      const data = await searchGroundedData(textQuery, "Farmer assistant expert. Include Mandi prices, crop weather alerts, and sustainable practices.");
      setTextResult(data.text);
      setMarketData(data.sources);
      addToHistory({ module: 'AGRICULTURE', title: 'Agri Query', description: textQuery });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-leaf"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">Agri-Smarter</h2>
          <p className="text-sm text-slate-500 font-medium">Free Neural Vision & Market Intelligence</p>
        </div>
      </div>

      {/* Real-time Ticker Simulation */}
      <div className="bg-slate-900 text-emerald-400 py-2 px-4 rounded-xl overflow-hidden whitespace-nowrap border border-emerald-500/20 shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-marquee inline-block mr-8">
          LIVE: Paddy Price (Mandi) ↑ • Soil Moisture: 34% • Rain Alert: 2pm • Urea Stock: Available • Monsoon Forecast: Normal • Tomato: ₹2,400/qtl • Cotton: ₹7,100/qtl ↑ •
        </p>
      </div>

      {/* Multi-modal Input */}
      <section className="glass p-5 rounded-[32px] space-y-4 border-2 border-emerald-100 dark:border-emerald-900/20">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-600 flex items-center gap-2">
          <i className="fas fa-plus-circle"></i> Diagnostic Lab
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vision Part */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-h-[140px] bg-slate-50/50 dark:bg-slate-900/20 relative transition-all hover:border-emerald-400 group">
            {image ? (
              <div className="relative h-full w-full flex items-center justify-center">
                <img src={image} alt="Crop" className="h-full object-cover rounded-xl" />
                <button onClick={() => setImage(null)} className="absolute top-0 right-0 w-6 h-6 bg-rose-500 text-white rounded-full text-[10px]"><i className="fas fa-times"></i></button>
              </div>
            ) : (
              <div className="text-center group-hover:scale-110 transition-transform">
                <i className="fas fa-camera text-2xl text-slate-300 mb-1"></i>
                <p className="text-[9px] font-black uppercase text-slate-400">Scan Crop Disease</p>
              </div>
            )}
            {!image && <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />}
          </div>

          {/* Text Part */}
          <div className="relative">
            <textarea
              className="w-full h-full min-h-[140px] bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none font-medium"
              placeholder="Ask about seeds, Mandi prices, or weather alerts..."
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={image ? analyzeImage : handleAgriQuery}
          disabled={loading || (!image && !textQuery)}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-brain"></i>}
          {image ? 'Analyze Specimen' : 'Fetch Real-World Intel'}
        </button>
      </section>

      {/* Results */}
      {(analysis || textResult) && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="glass p-6 rounded-[32px] bg-white dark:bg-slate-900/50 border-2 border-emerald-100 dark:border-emerald-800 shadow-lg">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Growth Specialist Protocol</h4>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-emerald-500 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">Neural Expert</span>
                </div>
             </div>
             <div className="text-xs leading-relaxed whitespace-pre-wrap font-medium">
                {analysis || textResult}
             </div>
             
             {marketData && marketData.length > 0 && (
               <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                 <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Live Web Sources:</p>
                 <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth hide-scrollbar">
                   {marketData.map((src, i) => (
                     <a key={i} href={src.web?.uri} target="_blank" rel="noreferrer" className="flex-shrink-0 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-100 dark:border-emerald-800 rounded-xl text-[9px] font-bold hover:bg-emerald-100 transition-colors">
                       {src.web?.title || 'Gov Price Index'} <i className="fas fa-external-link-alt ml-1"></i>
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AgricultureModule;
