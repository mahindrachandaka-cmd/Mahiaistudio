import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppModule, UserProfile, HistoryItem } from './types';
import Dashboard from './components/Dashboard';
import EducationModule from './modules/Education';
import HealthModule from './modules/Health';
import AgricultureModule from './modules/Agriculture';
import EnvironmentModule from './modules/Environment';
import SafetyModule from './modules/Safety';
import CreatorModule from './modules/Creator';
import ThinkingEngine from './modules/ThinkingEngine';
import AISimulator from './modules/AISimulator';
import EthicsLab from './modules/EthicsLab';
import MetaCognition from './modules/MetaCognition';
import PerspectivePrism from './modules/PerspectivePrism';
import CausalLab from './modules/CausalLab';
import TemporalIntelligence from './modules/TemporalIntelligence';
import DoctorModule from './modules/Doctor';
import LiveLab from './modules/LiveLab';
import Navigation from './components/Navigation';
import ProfilePage from './components/ProfilePage';
import Auth from './components/Auth';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<AppModule>('DASHBOARD');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    // Check API Key availability on mount
    const key = process.env.API_KEY || (window as any).process?.env?.API_KEY;
    if (!key) {
      console.error("Mahi Studio: API_KEY is missing from environment.");
      setIsApiKeyMissing(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({
              name: data.name || user.displayName || 'Researcher',
              role: data.role || 'guest',
              language: data.language || 'Bilingual',
              isGuest: false
            });
          } else {
            setUserProfile({
              name: user.displayName || 'Researcher',
              role: 'guest',
              language: 'Bilingual',
              isGuest: false
            });
          }
        } catch (error) {
          setUserProfile({ name: user.displayName || 'Researcher', role: 'guest', language: 'Bilingual', isGuest: false });
        }
      } else {
        setUserProfile(null);
      }
      setTimeout(() => setLoading(false), 1500);
    });

    const savedHistory = localStorage.getItem('mahi_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    return () => unsubscribe();
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = { 
      ...item, 
      id: Math.random().toString(36).substr(2, 9), 
      date: new Date().toLocaleDateString() 
    };
    const updated = [newItem, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('mahi_history', JSON.stringify(updated));
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading) return <SplashScreen />;
  if (!firebaseUser || !userProfile) return <Auth />;

  const renderModule = () => {
    switch (currentModule) {
      case 'DASHBOARD': return <Dashboard onSelectModule={setCurrentModule} user={userProfile} history={history} />;
      case 'EDUCATION': return <EducationModule addToHistory={addToHistory} />;
      case 'HEALTH': return <HealthModule addToHistory={addToHistory} />;
      case 'AGRICULTURE': return <AgricultureModule addToHistory={addToHistory} />;
      case 'ENVIRONMENT': return <EnvironmentModule addToHistory={addToHistory} />;
      case 'SAFETY': return <SafetyModule addToHistory={addToHistory} />;
      case 'CREATOR': return <CreatorModule addToHistory={addToHistory} />;
      case 'THINKING': return <ThinkingEngine />;
      case 'SIMULATOR': return <AISimulator />;
      case 'ETHICS': return <EthicsLab />;
      case 'META_COGNITION': return <MetaCognition />;
      case 'PERSPECTIVES': return <PerspectivePrism />;
      case 'CAUSAL_LAB': return <CausalLab />;
      case 'TIME_AWARE': return <TemporalIntelligence />;
      case 'DOCTOR': return <DoctorModule addToHistory={addToHistory} />;
      case 'PROFILE': return <ProfilePage user={userProfile} history={history} onClearHistory={() => {setHistory([]); localStorage.removeItem('mahi_history');}} />;
      default: return <Dashboard onSelectModule={setCurrentModule} user={userProfile} history={history} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} pb-24 transition-colors duration-300`}>
      {isApiKeyMissing && (
        <div className="bg-amber-500 text-white text-[10px] font-black uppercase text-center py-1 tracking-widest animate-pulse">
          Alert: API Key not detected. Features will be limited. Add API_KEY to Netlify Settings.
        </div>
      )}
      <header className="sticky top-0 z-50 glass border-b border-indigo-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentModule('DASHBOARD')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md"><i className="fas fa-vial"></i></div>
          <div>
            <h1 className="font-black text-lg leading-tight uppercase tracking-tighter flex items-center gap-2">
              Mahi AI Studio
              <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">LIVE</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
             <span className="text-[8px] font-black uppercase text-slate-400">Public Access</span>
             <span className={`text-[8px] font-black uppercase ${isApiKeyMissing ? 'text-rose-500' : 'text-emerald-500 animate-pulse'}`}>
               API: {isApiKeyMissing ? 'OFFLINE' : 'ONLINE'}
             </span>
          </div>
          <button onClick={toggleDarkMode} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl p-4 sm:p-6 animate-in fade-in duration-500">
        {renderModule()}
      </main>
      <Navigation currentModule={currentModule} setCurrentModule={setCurrentModule} />
    </div>
  );
};

export default App;