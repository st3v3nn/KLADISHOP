
import React, { useState } from 'react';
import { X, Phone, User, CheckCircle2, Loader2, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { Product, PaymentStatus } from '../types';

interface CheckoutModalProps {
  cart: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (name: string, phone: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ cart, isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleMpesaPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return alert('Fill in your details, fam!');
    setStatus(PaymentStatus.LOADING);
    
    // Simulate STK Push delay
    setTimeout(() => {
      setStatus(PaymentStatus.SUCCESS);
      if (onSuccess) onSuccess(name, phone);
    }, 2500);
  };

  const handleClose = () => {
    setStatus(PaymentStatus.IDLE);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-md relative neo-shadow-lg p-8 animate-in zoom-in duration-300">
        
        <button 
          onClick={handleClose}
          className="absolute -top-4 -right-4 bg-[#FF007F] border-4 border-black p-2 neo-shadow hover:neo-shadow-hover transition-all z-10"
        >
          <X size={24} color="white" strokeWidth={3} />
        </button>

        {status === PaymentStatus.SUCCESS ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="bg-[#A3FF00] p-4 rounded-full border-4 border-black neo-shadow">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">DRIP SECURED!</h2>
            <p className="font-bold text-gray-700">Payment request sent! Enter your M-Pesa PIN on your phone to finalize the haul.</p>
            <Button variant="accent" onClick={handleClose} fullWidth size="lg">SWEET, THANKS!</Button>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-gray-50 border-4 border-black p-4 neo-shadow-sm">
              <h3 className="text-lg font-black uppercase italic mb-2 border-b-2 border-black pb-1">Order Summary</h3>
              <div className="max-h-32 overflow-y-auto space-y-1 mb-2 pr-2">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm font-bold">
                    <span className="truncate flex-1">{item.name}</span>
                    <span className="shrink-0 ml-2">KES {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-black pt-2 flex justify-between font-black text-xl italic">
                <span>TOTAL</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleMpesaPush} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase flex items-center gap-2">
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kiprop Maina"
                  className="w-full border-4 border-black p-3 focus:bg-[#A3FF00]/10 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase flex items-center gap-2">
                  <Phone size={14} /> M-Pesa Number
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full border-4 border-black p-3 focus:bg-[#A3FF00]/10 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="primary" 
                  size="lg"
                  disabled={status === PaymentStatus.LOADING}
                >
                  {status === PaymentStatus.LOADING ? (
                    <>
                      <Loader2 className="animate-spin" />
                      SECURING DRIP...
                    </>
                  ) : (
                    <>
                      <CreditCard />
                      PAY KES {total.toLocaleString()}
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <p className="mt-4 text-[10px] text-center uppercase font-bold text-gray-500">
              Secured by M-Pesa STK Push. No cash required.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
