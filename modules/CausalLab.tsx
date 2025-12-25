
import React, { useState } from 'react';
import { predictCausalChain } from '../geminiService';

const CausalLab: React.FC = () => {
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runCausal = async () => {
    if (!action) return;
    setLoading(true);
    const res = await predictCausalChain(action);
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-network-wired"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Causal Tree Lab</h2>
          <p className="text-sm text-slate-500">Predict chain reactions and societal ripples</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold">Input Action</h3>
        <input
          className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="e.g. Switching to 100% solar energy in a small town"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />
        <button onClick={runCausal} disabled={loading} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase hover:bg-emerald-700">
          {loading ? 'Calculating Ripples...' : 'Generate Causal Map'}
        </button>
      </div>

      {results && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col items-center">
             <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-emerald-500 font-bold text-sm">
                {action}
             </div>
             <div className="h-8 w-1 bg-emerald-500"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-600 text-center">Short-Term Effects</h4>
              {results.short_term?.map((eff: string, i: number) => (
                <div key={i} className="glass p-3 rounded-xl border-l-2 border-emerald-400 text-xs text-center">{eff}</div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-indigo-600 text-center">Long-Term Legacy</h4>
              {results.long_term?.map((eff: string, i: number) => (
                <div key={i} className="glass p-3 rounded-xl border-l-2 border-indigo-400 text-xs text-center">{eff}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CausalLab;
