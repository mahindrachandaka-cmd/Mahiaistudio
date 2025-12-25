
import React, { useState } from 'react';
import { generateAIResponse } from '../geminiService';

interface HealthModuleProps {
  addToHistory: (item: any) => void;
}

const HealthModule: React.FC<HealthModuleProps> = ({ addToHistory }) => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState<{name: string, time: string}[]>([]);
  const [newMed, setNewMed] = useState({ name: '', time: '' });

  const checkSymptoms = async () => {
    if (!symptoms) return;
    setLoading(true);
    const prompt = `Symptoms provided: "${symptoms}". Give a general explanation of what this might be and basic home care advice. YOU MUST START WITH: "Disclaimer: I am an AI, not a doctor. This is for awareness only."`;
    const res = await generateAIResponse(prompt, "You are a helpful and cautious health advisor. Always emphasize that users should see a real doctor for medical concerns.");
    setResult(res);
    setLoading(false);
    addToHistory({ module: 'HEALTH', title: 'Symptom Check', description: 'Assessed health symptoms with AI' });
  };

  const addReminder = () => {
    if (!newMed.name || !newMed.time) return;
    setReminders([...reminders, newMed]);
    setNewMed({ name: '', time: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-heartbeat"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Health Guard</h2>
          <p className="text-sm text-slate-500">Wellness & Medical Awareness</p>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex gap-3">
        <i className="fas fa-exclamation-circle text-red-500 text-lg mt-0.5"></i>
        <p className="text-[10px] text-red-700 dark:text-red-400 font-bold leading-relaxed uppercase tracking-tight">
          Disclaimer: This app is for awareness and educational purposes only. It is not a replacement for professional medical advice, diagnosis, or treatment. Always consult a doctor for health issues.
        </p>
      </div>

      <section className="glass p-5 rounded-3xl space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <i className="fas fa-notes-medical text-rose-500"></i>
          Symptom Checker
        </h3>
        <div className="space-y-3">
          <textarea
            className="w-full h-24 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none resize-none transition-all"
            placeholder="Describe how you are feeling (e.g., headache and mild fever since yesterday)..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button 
            onClick={checkSymptoms}
            disabled={loading || !symptoms}
            className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-stethoscope"></i>}
            {loading ? 'Consulting AI...' : 'Check Symptoms'}
          </button>
        </div>
        {result && (
          <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in">
            {result}
          </div>
        )}
      </section>

      <section className="glass p-5 rounded-3xl space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <i className="fas fa-pills text-blue-500"></i>
          Medicine Reminders
        </h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Med name" 
            className="flex-1 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl outline-none text-sm"
            value={newMed.name}
            onChange={(e) => setNewMed({...newMed, name: e.target.value})}
          />
          <input 
            type="time" 
            className="w-28 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl outline-none text-sm"
            value={newMed.time}
            onChange={(e) => setNewMed({...newMed, time: e.target.value})}
          />
          <button onClick={addReminder} className="w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        <div className="space-y-2">
          {reminders.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-4 italic">No reminders set yet</p>
          ) : (
            reminders.map((rem, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-900 flex items-center justify-center text-indigo-500 text-sm">
                    <i className="fas fa-capsules"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{rem.name}</p>
                    <p className="text-[10px] text-slate-400">At {rem.time}</p>
                  </div>
                </div>
                <button onClick={() => setReminders(reminders.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HealthModule;
