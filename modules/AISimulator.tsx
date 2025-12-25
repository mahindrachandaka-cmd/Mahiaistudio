
import React, { useState } from 'react';
import { simulateAI } from '../geminiService';

const AISimulator: React.FC = () => {
  const [params, setParams] = useState({ temperature: 0.7, topP: 0.9 });
  const [prompt, setPrompt] = useState('Write a short poem about space.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    const res = await simulateAI(prompt, params);
    setOutput(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-vials"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Mini AI Lab</h2>
          <p className="text-sm text-slate-500">Experiment with AI "Nervous System" Parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-5 rounded-3xl space-y-6">
            <h3 className="font-bold text-sm border-b pb-2">Control Panel</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span>Creativity (Temp)</span>
                <span className="text-emerald-500">{params.temperature}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.1" 
                className="w-full accent-emerald-500"
                value={params.temperature}
                onChange={(e) => setParams({...params, temperature: parseFloat(e.target.value)})}
              />
              <p className="text-[9px] text-slate-400 italic leading-none">High = More random, Low = Precise.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span>Focus (Top-P)</span>
                <span className="text-emerald-500">{params.topP}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" 
                className="w-full accent-emerald-500"
                value={params.topP}
                onChange={(e) => setParams({...params, topP: parseFloat(e.target.value)})}
              />
              <p className="text-[9px] text-slate-400 italic leading-none">Filters words based on probability.</p>
            </div>

            <button 
              onClick={runSimulation}
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase hover:bg-emerald-700 transition-all shadow-lg"
            >
              {loading ? 'Running...' : 'Execute Task'}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="glass p-5 rounded-3xl">
            <h3 className="font-bold text-sm mb-3">Simulation Input</h3>
            <input 
              className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="glass p-5 rounded-3xl min-h-[250px] relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
               <h3 className="font-bold text-sm flex items-center gap-2">
                 <i className="fas fa-terminal text-emerald-500"></i>
                 Output Stream
               </h3>
               <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">Status: {loading ? 'Active' : 'Idle'}</span>
            </div>
            <div className="flex-1 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {loading ? (
                <div className="flex flex-col gap-2">
                   <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                   <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
                   <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : output || 'Execution result will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISimulator;
