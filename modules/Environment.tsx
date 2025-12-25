
import React, { useState, useEffect } from 'react';

interface EnvironmentModuleProps {
  addToHistory: (item: any) => void;
}

const EnvironmentModule: React.FC<EnvironmentModuleProps> = ({ addToHistory }) => {
  const [data, setData] = useState({ air: 42, waterPh: 7.0, waste: 'Recyclable' });
  const [ecoScore, setEcoScore] = useState(0);
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    const savedScore = localStorage.getItem('mahi_eco_score');
    if (savedScore) setEcoScore(parseInt(savedScore));
  }, []);

  const incrementScore = (pts: number) => {
    const newScore = ecoScore + pts;
    setEcoScore(newScore);
    localStorage.setItem('mahi_eco_score', newScore.toString());
    setShowPoints(true);
    setTimeout(() => setShowPoints(false), 2000);
  };

  const getStatusColor = (val: number, type: 'air' | 'water') => {
    if (type === 'air') {
      if (val < 50) return 'text-emerald-500';
      if (val < 100) return 'text-amber-500';
      return 'text-rose-500';
    } else {
      if (val >= 6.5 && val <= 8.5) return 'text-emerald-500';
      return 'text-rose-500';
    }
  };

  const handleScan = () => {
    const types = ['Plastic Bottle (Recyclable)', 'Apple Core (Organic)', 'Metal Can (Recyclable)', 'Paper (Recyclable)'];
    const randomWaste = types[Math.floor(Math.random() * types.length)];
    setData({...data, waste: randomWaste});
    incrementScore(15);
    addToHistory({ module: 'ENVIRONMENT', title: 'Waste Audit', description: `Identified: ${randomWaste}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white text-2xl shadow-md">
            <i className="fas fa-cloud-sun"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black">Eco Monitor</h2>
            <p className="text-sm text-slate-500 font-medium">Sustainability & Global Health</p>
          </div>
        </div>
        
        <div className="glass px-4 py-2 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/20 text-center relative">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Eco-Impact Score</p>
          <p className="text-lg font-black text-emerald-500">{ecoScore}</p>
          {showPoints && (
            <div className="absolute -top-4 left-0 right-0 animate-bounce text-emerald-500 font-black text-xs">
              +15 XP
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[32px] space-y-4 border-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
             <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
               <i className="fas fa-wind text-cyan-500"></i>
               Air Quality (AQI)
             </h3>
             <span className={`font-black text-xl ${getStatusColor(data.air, 'air')}`}>{data.air}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(data.air, 100)}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium italic">Current status: {data.air < 50 ? 'Healthy Environment' : 'Exercise Caution'}.</p>
          <button onClick={() => {
            const next = Math.floor(Math.random() * 60) + 30;
            setData({...data, air: next});
            incrementScore(5);
            addToHistory({ module: 'ENVIRONMENT', title: 'Air Quality Check', description: `AQI measured at ${next}` });
          }} className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
            Calibrate Sensor
          </button>
        </div>

        <div className="glass p-6 rounded-[32px] space-y-4 border-2 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
             <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
               <i className="fas fa-tint text-blue-500"></i>
               Water pH
             </h3>
             <span className={`font-black text-xl ${getStatusColor(data.waterPh, 'water')}`}>{data.waterPh}</span>
          </div>
          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter">
             <span>Acidic</span>
             <span>Neutral</span>
             <span>Alkaline</span>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-rose-400 via-emerald-400 to-indigo-400 rounded-full relative">
             <div className="absolute top-0 bottom-0 w-1 bg-white border border-slate-300 transition-all duration-1000" style={{ left: `${(data.waterPh / 14) * 100}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium italic">Status: {data.waterPh >= 6.5 && data.waterPh <= 8.5 ? 'Safe Consumption' : 'Testing Recommended'}.</p>
        </div>
      </div>

      <section className="glass p-6 rounded-[40px] border-2 border-indigo-100 dark:border-indigo-900/20 bg-indigo-50/20 dark:bg-indigo-900/10">
        <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-600">
          <i className="fas fa-trash-alt"></i>
          AI Waste Segregator
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-8">
           <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-[40px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 dark:border-slate-700 relative group cursor-pointer hover:border-indigo-400 transition-all">
              <i className="fas fa-camera text-3xl mb-2"></i>
              <p className="text-[8px] font-black uppercase">Scan Object</p>
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleScan} />
           </div>
           <div className="flex-1 space-y-4 text-center sm:text-left">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Diagnostic Result:</p>
                 <p className="text-xl font-black text-slate-900 dark:text-white">{data.waste}</p>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                 <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl text-[10px] font-black uppercase">Organic</div>
                 <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl text-[10px] font-black uppercase">Recyclable</div>
                 <div className="px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl text-[10px] font-black uppercase">Toxic</div>
              </div>
              <p className="text-xs text-slate-500 font-medium">Earn <span className="text-emerald-500 font-black">+15 Eco-Points</span> for every item you correctly segregate and recycle.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default EnvironmentModule;
