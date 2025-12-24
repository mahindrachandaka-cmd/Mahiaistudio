
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile, HistoryItem } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  history: HistoryItem[];
  onClearHistory: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, history, onClearHistory }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white text-4xl border-4 border-white dark:border-slate-800 shadow-xl">
            <i className="fas fa-user-astronaut"></i>
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px]">
            <i className="fas fa-bolt"></i>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex gap-2 justify-center mt-1">
             <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
               {user.role}
             </span>
             <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">
               Cloud Profile
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass p-4 rounded-3xl text-center">
           <p className="text-xl font-black text-indigo-600">{history.length}</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase">Experiments</p>
        </div>
        <div className="glass p-4 rounded-3xl text-center">
           <p className="text-xl font-black text-emerald-600">Sync Active</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase">Database</p>
        </div>
        <div className="glass p-4 rounded-3xl text-center">
           <p className="text-xl font-black text-amber-600">Full</p>
           <p className="text-[10px] text-slate-400 font-bold uppercase">Access</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
           <i className="fas fa-history text-indigo-500"></i>
           Recent Research Logs
        </h3>
        {history.length === 0 ? (
          <div className="glass p-10 rounded-3xl text-center space-y-2 opacity-60">
             <i className="fas fa-microscope text-4xl mb-2"></i>
             <p className="text-sm">No recent laboratory data.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="glass p-5 rounded-3xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600">
                      <i className={`fas ${getIcon(item.module)}`}></i>
                   </div>
                   <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.date} • {item.description}</p>
                   </div>
                </div>
                <i className="fas fa-chevron-right text-slate-200"></i>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="space-y-3 pb-10">
        <button 
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i> Secure Log Out
        </button>
        
        {history.length > 0 && (
          <button 
            onClick={() => {
              if(confirm('This will permanently delete your local research logs. Continue?')) {
                onClearHistory();
              }
            }}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-trash-alt"></i> Purge Lab History
          </button>
        )}
      </div>
    </div>
  );
};

const getIcon = (module: string) => {
  switch(module) {
    case 'EDUCATION': return 'fa-graduation-cap';
    case 'HEALTH': return 'fa-heartbeat';
    case 'AGRICULTURE': return 'fa-leaf';
    case 'ENVIRONMENT': return 'fa-cloud-sun';
    case 'SAFETY': return 'fa-shield-alt';
    case 'CREATOR': return 'fa-magic';
    default: return 'fa-history';
  }
}

export default ProfilePage;
