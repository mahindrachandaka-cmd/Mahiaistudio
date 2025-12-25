
import React, { useState } from 'react';

interface SafetyModuleProps {
  addToHistory: (item: any) => void;
}

const SafetyModule: React.FC<SafetyModuleProps> = ({ addToHistory }) => {
  const [alertStatus, setAlertStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const triggerEmergency = () => {
    setAlertStatus('SENDING');
    
    // Attempt to get location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        // Mock sending alert
        setTimeout(() => {
          setAlertStatus('SENT');
          addToHistory({ 
            module: 'SAFETY', 
            title: 'Emergency Alert Sent', 
            description: `Alert sent with location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` 
          });
        }, 1500);
      }, (error) => {
        console.error("Location error:", error);
        setAlertStatus('SENT'); // Still mark as sent (mock)
      });
    } else {
      setTimeout(() => setAlertStatus('SENT'), 1500);
    }
  };

  const safetyTips = [
    { icon: 'fa-female', title: 'Women Safety', desc: 'Keep your phone charged and use trusted apps for travel.' },
    { icon: 'fa-user-shield', title: 'Self Defense', desc: 'Basic techniques like palm strikes can help in emergencies.' },
    { icon: 'fa-lock', title: 'Cyber Safety', desc: 'Never share OTPs or passwords with anyone online.' },
    { icon: 'fa-phone-alt', title: 'Speed Dial', desc: 'Set up 112 as your emergency contact on your device.' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white text-2xl shadow-md">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Safety Shield</h2>
          <p className="text-sm text-slate-500">Your personal guardian</p>
        </div>
      </div>

      <div className="glass p-8 rounded-3xl text-center flex flex-col items-center space-y-4">
        <h3 className="text-xl font-bold">Emergency Alert System</h3>
        <p className="text-sm text-slate-500 max-w-xs">Press the button below to send your live location to emergency contacts (Mock Feature).</p>
        
        <button
          onClick={triggerEmergency}
          disabled={alertStatus === 'SENDING'}
          className={`w-40 h-40 rounded-full border-[12px] flex items-center justify-center transition-all shadow-2xl ${
            alertStatus === 'IDLE' 
              ? 'bg-rose-600 border-rose-100 hover:scale-105 active:scale-95 text-white' 
              : alertStatus === 'SENDING' 
                ? 'bg-amber-500 border-amber-100 animate-pulse text-white' 
                : 'bg-emerald-600 border-emerald-100 text-white'
          }`}
        >
          <div className="text-center">
            <i className={`fas ${alertStatus === 'IDLE' ? 'fa-exclamation-triangle' : alertStatus === 'SENDING' ? 'fa-spinner fa-spin' : 'fa-check'} text-4xl mb-2`}></i>
            <div className="font-black text-sm uppercase tracking-tighter">
              {alertStatus === 'IDLE' ? 'SOS HELP' : alertStatus === 'SENDING' ? 'Sending...' : 'Alert Sent'}
            </div>
          </div>
        </button>

        {alertStatus === 'SENT' && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl w-full text-left">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Status Update</p>
            <p className="text-[10px] text-slate-500">Live location {location ? `(${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : ''} has been broadcasted to your emergency network.</p>
            <button onClick={() => setAlertStatus('IDLE')} className="mt-2 text-xs font-bold text-indigo-500">Reset System</button>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <h3 className="font-bold text-lg">Safety Tips for You</h3>
        <div className="grid grid-cols-2 gap-3">
          {safetyTips.map((tip, idx) => (
            <div key={idx} className="glass p-4 rounded-2xl space-y-2 card-hover transition-all">
              <i className={`fas ${tip.icon} text-orange-500 text-xl`}></i>
              <h4 className="text-xs font-bold">{tip.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SafetyModule;
