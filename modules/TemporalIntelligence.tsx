
import React, { useState } from 'react';
import { generateTemporalResponses } from '../geminiService';

const TemporalIntelligence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const runTemporalAnalysis = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await generateTemporalResponses(query);
      setData(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const timelineItems = [
    { key: 'Today', icon: 'fa-calendar-day', color: 'border-blue-500 text-blue-500' },
    { key: '5 Years Later', icon: 'fa-calendar-check', color: 'border-emerald-500 text-emerald-500' },
    { key: '20 Years Later', icon: 'fa-calendar-plus', color: 'border-indigo-500 text-indigo-500' },
    { key: '50 Years Later', icon: 'fa-rocket', color: 'border-amber-500 text-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-hourglass-half"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Temporal Intelligence</h2>
          <p className="text-sm text-slate-500">How answers evolve over time (1-50 years)</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold">Predictive Topic</h3>
        <input
          className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          placeholder="e.g. The future of education or global energy"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={runTemporalAnalysis} 
          disabled={loading || !query} 
          className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold uppercase hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-history"></i>}
          Calculate Temporal Evolution
        </button>
      </div>

      {data && (
        <div className="relative space-y-8 pb-10">
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
          {timelineItems.map((item, index) => (
            <div key={index} className="relative flex flex-col md:flex-row gap-6 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 150}ms` }}>
              <div className={`w-12 h-12 rounded-full glass border-2 ${item.color} flex items-center justify-center bg-white dark:bg-slate-900 z-10 flex-shrink-0 mx-auto md:mx-0 shadow-sm`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className={`glass flex-1 p-6 rounded-3xl border-l-4 ${item.color} shadow-sm`}>
                <h4 className="font-black text-xs uppercase tracking-widest mb-2 opacity-70">{item.key}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {data[item.key] || "Data unavailable for this period."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemporalIntelligence;
