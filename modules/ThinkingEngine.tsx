
import React, { useState } from 'react';
import { generateAIReasoning } from '../geminiService';

const ThinkingEngine: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleReason = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    const res = await generateAIReasoning(query, "You are a deep logical reasoning engine. Break down the query step-by-step internally then provide a comprehensive synthesized answer.");
    setResult(res.text);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-microchip"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Neural Reasoning Lab</h2>
          <p className="text-sm text-slate-500">Complex Logic & Decision Processing</p>
        </div>
      </div>

      <div className="glass p-5 rounded-[32px] space-y-4 border-2 border-indigo-100 dark:border-indigo-900/30">
        <textarea
          className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          placeholder="Inject complex logic query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleReason} disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl">
          {loading ? <i className="fas fa-atom fa-spin"></i> : <i className="fas fa-bolt"></i>}
          Execute Inference
        </button>
      </div>

      {result && (
        <div className="glass p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
          <h4 className="font-black text-[10px] uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
            <i className="fas fa-terminal"></i> Synthesized Logical Output
          </h4>
          <p className="text-sm leading-relaxed font-medium">{result}</p>
        </div>
      )}
    </div>
  );
};

export default ThinkingEngine;
