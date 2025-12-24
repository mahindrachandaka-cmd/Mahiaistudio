
import React from 'react';
import { AppModule } from '../types';

interface NavigationProps {
  currentModule: AppModule;
  setCurrentModule: (m: AppModule) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentModule, setCurrentModule }) => {
  const navItems = [
    { id: 'DASHBOARD' as AppModule, icon: 'fa-th-large', label: 'Home' },
    { id: 'EDUCATION' as AppModule, icon: 'fa-graduation-cap', label: 'Edu' },
    { id: 'AGRICULTURE' as AppModule, icon: 'fa-seedling', label: 'Agri' },
    { id: 'CREATOR' as AppModule, icon: 'fa-magic', label: 'Tools' },
    { id: 'PROFILE' as AppModule, icon: 'fa-user-circle', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center rounded-t-[40px] shadow-2xl">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentModule(item.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            currentModule === item.id 
              ? 'text-indigo-600 dark:text-indigo-400 scale-110' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
            currentModule === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
          }`}>
            <i className={`fas ${item.icon} text-lg`}></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
