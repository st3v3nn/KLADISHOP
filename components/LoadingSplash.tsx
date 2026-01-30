import React from 'react';

export const LoadingSplash: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95">
      <div className="flex flex-col items-center gap-6">
        <img src="/kladishop.png" alt="KLADISHOP" className="w-40 h-40 object-contain animate-pulse-slow" />
        <div className="text-white font-black uppercase text-lg tracking-widest">Loading KLADISHOP...</div>
      </div>
      <style>{`
        @keyframes pulse-slow { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.06); opacity: 0.85 } 100% { transform: scale(1); opacity: 1 } }
        .animate-pulse-slow { animation: pulse-slow 1.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
