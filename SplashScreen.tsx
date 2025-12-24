
import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const [statusText, setStatusText] = useState('Initializing Systems...');
  
  const statuses = [
    'Calibrating Neural Networks...',
    'Syncing Research Database...',
    'Optimizing Logic Engines...',
    'Loading Studio Assets...',
    'Ready for Entry'
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        setStatusText(statuses[i]);
        i++;
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-1000">
        <div className="relative mb-8">
          {/* Pulsing rings */}
          <div className="absolute inset-0 bg-indigo-500 rounded-[40px] blur-xl opacity-20 animate-ping"></div>
          <div className="absolute inset-0 bg-indigo-500 rounded-[40px] blur-2xl opacity-10 animate-pulse delay-300"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[32px] flex items-center justify-center text-white text-4xl shadow-2xl relative z-10 border border-white/20">
            <i className="fas fa-vial animate-bounce-slow"></i>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Mahi <span className="text-indigo-400">AI</span> Studio
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80 h-4">
              {statusText}
            </p>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(0%); }
          100% { width: 100%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
      `}</style>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Advanced Intelligence Protocol
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
