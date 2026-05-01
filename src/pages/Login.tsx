import { useState } from 'react';
import { Shield, Lock, UserPlus, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFirebaseSync = async (idToken: string, displayName: string | null) => {
    try {
      const response = await apiClient.post('/auth/firebase-sync', {
        id_token: idToken,
        name: displayName || "SENTRYA User"
      });
      await login(response.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Backend Sync failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Custom Backend Registration
        const response = await apiClient.post('/auth/register', { email, password, name });
        await login(response.data.access_token);
        navigate('/');
      } else {
        // Custom Backend Login
        const params = new URLSearchParams();
        params.append('username', email);
        params.append('password', password);
        
        const response = await apiClient.post('/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        await login(response.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Incorrect email or password.');
      } else if (err.response?.status === 400 && err.response?.data?.detail === 'Email already registered') {
        setError('This email is already registered. Please login.');
      } else {
        setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      await handleFirebaseSync(token, userCredential.user.displayName);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Auth failed.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        layout
        className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100"
      >
        <motion.div layout className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-3xl flex items-center justify-center shadow-sm mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SENTRYA</h1>
          <p className="text-slate-500 font-medium">Protecting your financial identity</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-bold text-center border border-rose-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
                  <div className="relative mt-1">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900 transition-all"
                      placeholder="Jane Doe"
                      required={isRegistering} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900 transition-all"
                placeholder="user@test.com"
                required 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-brand-500 outline-none font-bold text-slate-900 transition-all"
                placeholder="••••••"
                required 
              />
            </div>
          </div>

          <motion.button 
            layout
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-brand-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-slate-200"
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : isRegistering ? (
              <><UserPlus className="w-5 h-5" /> Create Account</>
            ) : (
              <><Lock className="w-5 h-5" /> Continue with Email</>
            )}
          </motion.button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <motion.div layout className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button 
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="ml-2 text-brand-600 font-black hover:text-brand-700 transition-colors"
            >
              {isRegistering ? "Login here" : "Create one now"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
