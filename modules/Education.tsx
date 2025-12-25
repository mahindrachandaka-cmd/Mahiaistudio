
import React, { useState } from 'react';
import AIChat from '../components/AIChat';
import { searchGroundedData } from '../geminiService';

interface EducationModuleProps {
  addToHistory: (item: any) => void;
}

const EducationModule: React.FC<EducationModuleProps> = ({ addToHistory }) => {
  const [activeTab, setActiveTab] = useState<'TUTOR' | 'VAULT'>('TUTOR');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVaultSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const data = await searchGroundedData(searchQuery, "Find academic study notes, educational resources, and syllabus guides");
      setResults(data);
      addToHistory({ module: 'EDUCATION', title: 'Vault Search', description: searchQuery });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const downloadNotes = () => {
    if (!results) return;
    const element = document.createElement("a");
    const file = new Blob([results.text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Mahi_Study_Notes_${searchQuery.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black">Education Hub</h2>
          <p className="text-sm text-slate-500 font-medium">Neural Tutoring & Web-Grounded Vault</p>
        </div>
      </div>

      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('TUTOR')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TUTOR' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Neural Tutor
        </button>
        <button 
          onClick={() => setActiveTab('VAULT')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Academic Vault (Web Notes)
        </button>
      </div>

      {activeTab === 'TUTOR' ? (
        <AIChat 
          systemInstruction="You are Mahi, a neural tutor. Answer student doubts in simple language with Telugu summaries when helpful."
          placeholder="Ask any academic doubt..."
        />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass p-5 rounded-[32px] space-y-4 border-2 border-blue-100 dark:border-blue-900/20">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <i className="fas fa-search"></i> Universal Study Search
            </h3>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="Search topic (e.g. 10th Class Physics Chapter 2 notes...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={handleVaultSearch}
                disabled={loading || !searchQuery}
                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2"
              >
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
              </button>
            </div>
          </div>

          {results && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <div className="glass p-6 rounded-[32px] bg-white dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Grounded Research Synthesis</h4>
                  <button onClick={downloadNotes} className="text-blue-600 font-bold text-[10px] uppercase flex items-center gap-1">
                    <i className="fas fa-download"></i> Save as File
                  </button>
                </div>
                <div className="text-[12px] leading-relaxed whitespace-pre-wrap">
                  {results.text}
                </div>
                
                {results.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Reference Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {results.sources.map((src, i) => (
                        <a key={i} href={src.web?.uri} target="_blank" rel="noreferrer" className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-blue-500 truncate max-w-[150px]">
                          {src.web?.title || 'Resource'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EducationModule;
