
import React from 'react';
import { AppModule, UserProfile, HistoryItem } from '../types';

interface DashboardProps {
  onSelectModule: (m: AppModule) => void;
  user: UserProfile;
  history: HistoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectModule, user, history }) => {
  const highlights = [
    { id: 'META_COGNITION' as AppModule, name: 'Self-Critique', icon: 'fa-brain', color: 'bg-violet-600', desc: 'AI logical self-monitoring' },
    { id: 'DOCTOR' as AppModule, name: 'Diagnostic Lab', icon: 'fa-user-md', color: 'bg-rose-600', desc: 'Scientific Medical Simulation' },
    { id: 'PERSPECTIVES' as AppModule, name: 'Perspective Prism', icon: 'fa-layer-group', color: 'bg-indigo-600', desc: 'Multivariate Analysis' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <section className="space-y-2">
        <div className="flex items-center gap-3">
           <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">100% Free Open Access Protocol</p>
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Scientific AI Studio <br/> <span className="text-indigo-600">Community Edition</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Advanced Neural Lab Environment for Students & Farmers</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[32px] bg-slate-900 text-white shadow-2xl relative overflow-hidden group border border-slate-700">
          <div className="relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Researcher Profile</h4>
            <p className="text-lg font-black leading-tight">Welcome, {user.name}</p>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Your research tools are fully synchronized and free of charge.</p>
          </div>
          <i className="fas fa-microscope absolute -right-4 -bottom-4 text-7xl opacity-10"></i>
        </div>

        <div className="glass p-6 rounded-[32px] bg-indigo-600 text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-certificate text-amber-400"></i>
            <h4 className="text-[10px] font-black uppercase tracking-widest">Global Access Tier</h4>
          </div>
          <p className="text-xl font-black">Unlimited Laboratory Credits</p>
          <p className="text-[10px] opacity-70 mt-1 uppercase font-bold tracking-tighter">Provided by Mahi Smarter Open Initiative</p>
        </div>
      </div>

      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
           <i className="fas fa-atom animate-spin-slow"></i> Advanced Logic Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {highlights.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="glass p-5 rounded-3xl text-left card-hover transition-all flex flex-col gap-4 border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
            >
              <div className={`w-12 h-12 rounded-2xl ${mod.color} flex items-center justify-center text-white text-xl shadow-xl`}>
                <i className={`fas ${mod.icon}`}></i>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-400">{mod.name}</span>
                <p className="text-[11px] font-bold leading-tight mt-1">{mod.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
           <i className="fas fa-history"></i> Session Activity Logs
        </h3>
        <div className="space-y-2">
           {history.length === 0 ? (
             <p className="text-[11px] text-slate-400 italic">No recent experiments recorded.</p>
           ) : (
             history.slice(0, 3).map((h, i) => (
               <div key={i} className="glass p-4 rounded-2xl flex items-center justify-between text-[11px] font-bold border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="text-indigo-500 uppercase tracking-widest">{h.module}</span>
                  </div>
                  <span className="text-slate-400 truncate max-w-[150px]">{h.title}</span>
               </div>
             ))
           )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
