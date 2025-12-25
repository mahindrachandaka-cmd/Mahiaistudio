
import React, { useState } from 'react';
import { evaluateEthics } from '../geminiService';

const EthicsLab: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    if (!inputText) return;
    setLoading(true);
    const res = await evaluateEthics(inputText);
    setReport(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-user-shield"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Ethics Guard</h2>
          <p className="text-sm text-slate-500">Bias Detection & Responsible AI Audit</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-sm">Submit AI Response for Auditing</h3>
        <p className="text-xs text-slate-500">Paste any AI-generated text here to check for ethical risks or biased patterns.</p>
        <textarea
          className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-rose-500"
          placeholder="Paste AI response here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button 
          onClick={runAudit}
          disabled={loading || !inputText}
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-700 shadow-xl disabled:opacity-50"
        >
          {loading ? <i className="fas fa-microscope fa-spin mr-2"></i> : <i className="fas fa-search-plus mr-2"></i>}
          Run Ethics Audit
        </button>
      </div>

      {report && (
        <div className="glass p-6 rounded-3xl border-t-8 border-rose-500 animate-in zoom-in duration-300">
          <h3 className="font-black text-rose-600 mb-4 flex items-center gap-2">
            <i className="fas fa-file-contract"></i>
            Auditor's Report
          </h3>
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {report}
          </div>
          <div className="mt-6 flex items-center gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
             <i className="fas fa-info-circle text-rose-500"></i>
             <p className="text-[10px] text-slate-500 font-medium">This audit uses AI to monitor AI. It helps identify common pitfalls in machine learning like demographic bias or hallucination.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthicsLab;
