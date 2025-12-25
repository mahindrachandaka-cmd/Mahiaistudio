
import React, { useState } from 'react';
import { generateMedicalAnalysis } from '../geminiService';

interface DoctorModuleProps {
  addToHistory: (item: any) => void;
}

const DoctorModule: React.FC<DoctorModuleProps> = ({ addToHistory }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runAnalysis = async () => {
    if (!symptoms) return;
    setLoading(true);
    try {
      const data = await generateMedicalAnalysis(symptoms);
      setReport(data);
      addToHistory({ module: 'DOCTOR', title: 'Medical Simulation', description: `Analyzed case: ${symptoms.substring(0, 30)}...` });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-[20px] bg-rose-600 flex items-center justify-center text-white text-3xl shadow-xl shadow-rose-200 dark:shadow-rose-950/20 ring-4 ring-rose-50 dark:ring-rose-900/10">
          <i className="fas fa-user-md"></i>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Diagnostic Lab</h2>
          <p className="text-sm text-slate-500 font-medium">Bio-Medical Intelligence & Research Simulator</p>
        </div>
      </div>

      <div className="bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/30 p-5 rounded-3xl flex gap-4 animate-pulse">
        <i className="fas fa-shield-virus text-rose-500 text-2xl"></i>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Mandatory Disclosure</p>
          <p className="text-[11px] text-rose-800 dark:text-rose-300 font-bold leading-relaxed">
            THIS IS A SCIENTIFIC RESEARCH SIMULATOR. IT IS NOT A MEDICAL DEVICE. ALL OUTPUTS ARE STATISTICAL PREDICTIONS FOR EDUCATIONAL PURPOSES. CONSULT A LICENSED PHYSICIAN FOR ACTUAL CARE.
          </p>
        </div>
      </div>

      <div className="glass p-6 rounded-[32px] space-y-4 border-2 border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <i className="fas fa-notes-medical text-rose-500"></i>
            Enter Case Data
          </h3>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-500">Fast Model Active</span>
        </div>
        <textarea
          className="w-full h-32 bg-slate-50 dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400"
          placeholder="Describe symptoms, duration, and patient profile... (e.g. 45-year old male with persistent dry cough and fatigue for 2 weeks...)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button 
          onClick={runAnalysis}
          disabled={loading || !symptoms}
          className="w-full py-4 bg-slate-900 dark:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-stethoscope"></i>}
          {loading ? 'Processing Neural Pathways...' : 'Run Diagnostic Simulation'}
        </button>
      </div>

      {report && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Hypothesis & Confidence */}
            <div className="glass p-6 rounded-[32px] md:col-span-2 border-t-4 border-rose-600 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">Primary Research Hypothesis</h4>
                  <p className="text-xl font-bold">{report.primary_hypothesis}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">AI Confidence</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-rose-600">{report.confidence_level}%</span>
                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${report.confidence_level}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border-l-4 border-slate-200">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Logical Reasoning Path</p>
                <div className="space-y-2">
                  {report.reasoning_path?.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="text-rose-500 font-black">{i+1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Uncertainty Engine */}
            <div className="glass p-6 rounded-[32px] border-l-4 border-amber-500">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-3 flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i> Uncertainty Audit
              </h4>
              <p className="text-[11px] font-bold text-slate-500 mb-2 italic uppercase">Factors inducing doubt:</p>
              <div className="space-y-2">
                {report.doubt_factors?.map((fact: string, i: number) => (
                  <div key={i} className="flex gap-2 text-xs font-medium p-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-amber-800 dark:text-amber-200">
                    • {fact}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Self-Limitation */}
            <div className="glass p-6 rounded-[32px] border-l-4 border-slate-900 dark:border-white">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <i className="fas fa-ban"></i> Limitation Disclosure
              </h4>
              <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                {report.self_limitation}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Recommended Specialist</p>
                <div className="flex items-center gap-2 text-sm font-bold text-rose-600">
                  <i className="fas fa-user-md"></i>
                  {report.recommended_specialist}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorModule;
