
import React, { useEffect } from 'react';
import { ShieldCheck, X, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (isOpen && !loading && isAdmin) {
      onSuccess();
      onClose();
    }
  }, [isOpen, loading, isAdmin, onSuccess, onClose]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95">
        <div className="bg-white border-4 border-black w-full max-w-sm p-8 neo-shadow-lg text-center">
          <div className="bg-[#A3FF00] w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm">
            <ShieldCheck size={32} className="animate-spin" />
          </div>
          <p className="font-black italic uppercase">VERIFYING ACCESS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95">
        <div className="bg-white border-4 border-black w-full max-w-sm p-8 neo-shadow-lg text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-[#FF007F]"><X /></button>

          <div className="bg-[#7B2CBF] w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm">
            <AlertCircle size={32} className="text-white" />
          </div>

          <h3 className="text-2xl font-black italic uppercase mb-2">SIGN IN FIRST</h3>
          <p className="font-bold text-gray-500 mb-6 text-sm uppercase">You must sign in to access the admin panel</p>

          <Button onClick={onClose} fullWidth variant="primary" size="lg">CLOSE</Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95">
        <div className="bg-white border-4 border-black w-full max-w-sm p-8 neo-shadow-lg text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-[#FF007F]"><X /></button>

          <div className="bg-red-400 w-16 h-16 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm">
            <AlertCircle size={32} />
          </div>

          <h3 className="text-2xl font-black italic uppercase mb-2">ACCESS DENIED</h3>
          <p className="font-bold text-gray-500 mb-4 text-sm uppercase">You don't have admin privileges</p>
          <p className="text-xs text-gray-600 mb-6">Only authorized curators can access the command center. If you should have access, contact support.</p>

          <Button onClick={onClose} fullWidth variant="primary" size="lg">CLOSE</Button>
        </div>
      </div>
    );
  }

  // Should never reach here - isAdmin is true, so onSuccess was already called
  return null;
};
