
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'farmer' | 'parent'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 1. Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Update display name in Auth
        await updateProfile(user, { displayName: name });

        // 3. Save extra data to Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name,
            email,
            role,
            language: 'Bilingual',
            createdAt: new Date().toISOString()
          });
        } catch (firestoreErr: any) {
          console.error("Firestore Error:", firestoreErr);
          if (firestoreErr.message.includes('permission')) {
            throw new Error('Auth successful, but Database permissions denied. Please check your Firestore Rules in Firebase Console.');
          }
          throw firestoreErr;
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/email-already-in-use') message = 'This email is already registered.';
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') message = 'Invalid email or password.';
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full glass p-8 rounded-[40px] shadow-2xl border-2 border-indigo-50 dark:border-indigo-900/20 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl mb-6 shadow-xl rotate-3 ring-8 ring-indigo-50 dark:ring-indigo-950/20">
            <i className="fas fa-dna"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Join the Studio'}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
            Mahi AI Studio Environment
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <i className="fas fa-exclamation-circle mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none transition-all font-medium text-sm"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none transition-all font-medium text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 outline-none transition-all font-medium text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Primary Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'farmer', 'parent'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      role === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>}
            {isLogin ? 'Authorize Entry' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 font-medium">
            {isLogin ? "Don't have a Studio ID?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-2 text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest hover:underline"
          >
            {isLogin ? 'Create Studio Profile' : 'Back to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;