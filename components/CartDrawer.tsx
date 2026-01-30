
import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white border-l-4 border-black h-full flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b-4 border-black flex justify-between items-center bg-[#A3FF00]">
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-2">
            <ShoppingBag /> YOUR HAUL
          </h2>
          <button onClick={onClose} className="p-2 border-4 border-black bg-white neo-shadow-sm hover:neo-shadow-none transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingBag size={64} />
              <p className="font-black uppercase text-xl italic">Empty streets, fam.</p>
              <Button variant="secondary" onClick={onClose}>GO SHOPPING</Button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 border-4 border-black p-3 neo-shadow-sm bg-white">
                <img src={item.image} className="w-20 h-20 object-cover border-2 border-black" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black uppercase truncate">{item.name}</h4>
                  <p className="font-bold text-[#7B2CBF]">KES {item.price.toLocaleString()}</p>
                </div>
                <button onClick={() => onRemove(item.id)} className="p-2 text-red-500 hover:bg-red-50 transition-colors self-start">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t-4 border-black bg-white space-y-4">
            <div className="flex justify-between items-end">
              <span className="font-black text-sm uppercase text-gray-500">Total Damage</span>
              <span className="text-3xl font-black italic">KES {total.toLocaleString()}</span>
            </div>
            <Button variant="primary" fullWidth size="lg" className="italic uppercase text-xl" onClick={onCheckout}>
              PROCEED TO CHECKOUT
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
