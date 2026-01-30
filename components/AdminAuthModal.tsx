
import React, { useState } from 'react';
import { ShieldCheck, X, Lock } from 'lucide-react';
import { Button } from './Button';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2540') { // Security Pin for Kenyan Store
      onSuccess();
      onClose();
      setPin('');
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95">
      <div className="bg-white border-4 border-black w-full max-w-sm p-8 neo-shadow-lg text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-[#FF007F]"><X /></button>
        
        <div className="bg-[#A3FF00] w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm">
          <ShieldCheck size={32} />
        </div>

        <h3 className="text-2xl font-black italic uppercase mb-2">CURATOR ACCESS</h3>
        <p className="font-bold text-gray-500 mb-6 text-sm uppercase">ENTER YOUR SECRET PIN TO UNLOCK COMMAND CENTER</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full border-4 border-black p-4 pl-12 text-2xl tracking-[1em] text-center font-black focus:outline-none ${error ? 'bg-red-50' : 'bg-gray-50'}`}
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 font-black text-xs uppercase animate-bounce">WRONG PIN. ACCESS DENIED.</p>}
          <Button type="submit" fullWidth variant="primary" size="lg">VERIFY IDENTITY</Button>
        </form>
      </div>
    </div>
  );
};
