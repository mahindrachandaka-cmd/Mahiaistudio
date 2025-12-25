
import React, { useState } from 'react';
import { generateMetaCognitiveResponse } from '../geminiService';

const MetaCognition: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runAnalysis = async () => {
    if (!query) return;
    setLoading(true);
    const res = await generateMetaCognitiveResponse(query);
    setData(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-brain"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Meta-Cognitive Lab</h2>
          <p className="text-sm text-slate-500">Watching the AI think about itself</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4 border-2 border-indigo-100 dark:border-indigo-900/30">
        <h3 className="font-bold text-sm">Experimental Query</h3>
        <textarea
          className="w-full h-24 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="Ask something complex... e.g. Is universal basic income sustainable?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={runAnalysis}
          disabled={loading || !query}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-microscope"></i>}
          Execute Self-Critique
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-500">
          <div className="glass p-6 rounded-3xl border-t-4 border-indigo-500 md:col-span-2">
            <h4 className="font-black text-xs uppercase tracking-widest text-indigo-500 mb-2">Final Conclusion</h4>
            <p className="text-sm leading-relaxed">{data.answer}</p>
          </div>

          <div className="glass p-6 rounded-3xl border-t-4 border-rose-500">
            <h4 className="font-black text-xs uppercase tracking-widest text-rose-500 mb-2">Internal Critique</h4>
            <p className="text-xs italic text-slate-600 dark:text-slate-400">"{data.critique}"</p>
          </div>

          <div className="glass p-6 rounded-3xl border-t-4 border-amber-500">
            <h4 className="font-black text-xs uppercase tracking-widest text-amber-500 mb-2">Confidence Level</h4>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{data.confidence}%</span>
              <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${data.confidence}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] mt-2 text-slate-400">Uncertainty source: {data.uncertainty_reason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaCognition;
