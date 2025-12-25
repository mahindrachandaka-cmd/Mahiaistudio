
import React, { useState } from 'react';
import { generatePerspectives } from '../geminiService';

const PerspectivePrism: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runPrism = async () => {
    if (!query) return;
    setLoading(true);
    const res = await generatePerspectives(query);
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-layer-group"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Perspective Prism</h2>
          <p className="text-sm text-slate-500">Break down problems through 4 distinct mindsets</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <input
          className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          placeholder="Enter a topic... e.g. Artificial Intelligence in Schools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={runPrism}
          disabled={loading || !query}
          className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-project-diagram"></i>}
          Analyze Prism
        </button>
      </div>

      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
          {Object.entries(results).map(([title, text]: [string, any]) => (
            <div key={title} className="glass p-5 rounded-3xl border-l-4 border-violet-500">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-violet-600 mb-2">{title} View</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerspectivePrism;
