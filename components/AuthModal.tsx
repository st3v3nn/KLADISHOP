
import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useFirebaseAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      // Callback will be handled by App.tsx through auth state change
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white border-4 border-black w-full max-w-md relative neo-shadow-lg p-8 animate-in zoom-in duration-200">
        <button onClick={onClose} className="absolute -top-4 -right-4 bg-[#FF007F] border-4 border-black p-2 neo-shadow hover:neo-shadow-hover transition-all">
          <X size={24} color="white" strokeWidth={3} />
        </button>

        <h2 className="text-3xl font-black italic uppercase mb-2">{isLogin ? 'Welcome Back' : 'Join the Tribe'}</h2>
        <p className="font-bold text-gray-500 mb-6 uppercase text-sm">Get access to exclusive drops and fast checkout.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-black uppercase flex items-center gap-2"><UserIcon size={14}/> Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full border-4 border-black p-3 focus:bg-[#A3FF00]/10 outline-none font-bold" 
                required 
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase flex items-center gap-2"><Mail size={14}/> Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full border-4 border-black p-3 focus:bg-[#A3FF00]/10 outline-none font-bold" 
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase flex items-center gap-2"><Lock size={14}/> Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border-4 border-black p-3 focus:bg-[#A3FF00]/10 outline-none font-bold" 
              required 
            />
          </div>

          <Button type="submit" fullWidth variant="primary" size="lg" className="mt-4 uppercase italic" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-500 rounded text-sm font-bold text-red-800">
            {error}
          </div>
        )}

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-6 text-sm font-black uppercase hover:text-[#FF007F] transition-colors"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};
