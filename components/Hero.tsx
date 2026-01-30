
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 -left-10 w-40 h-40 bg-[#A3FF00] rounded-full border-4 border-black -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FF007F] border-4 border-black -z-10 rotate-12 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-black italic uppercase neo-shadow-sm -rotate-2">
          <Zap size={20} className="text-[#A3FF00]" /> NEW STUFF JUST LANDED
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] italic">
          STOP WEARING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] via-[#7B2CBF] to-[#A3FF00] drop-shadow-[4px_4px_0px_#000]">BASIC</span>
          <br /> CLOTHES
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl md:text-2xl font-bold leading-tight">
          Kladi Shop brings you the sickest <span className="bg-[#A3FF00] px-1 border-2 border-black">Mitumba</span> grails. Verified drip, zero boring vibes. 
          Shipping across Kenya 24/7.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
          <a href="#shop">
            <Button size="lg" variant="secondary" className="text-2xl px-12 italic">
              SHOP NEW DROPS <ArrowRight size={28} strokeWidth={4} />
            </Button>
          </a>
          <div className="flex -space-x-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-12 h-12 rounded-full border-4 border-black overflow-hidden bg-gray-200 neo-shadow-sm">
                 <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="User" />
               </div>
             ))}
             <div className="pl-6 pt-3 text-sm font-black uppercase">JOIN 5K+ DRIP HUNTERS</div>
          </div>
        </div>
      </div>
      
      {/* Marquee Effect */}
      <div className="mt-20 border-y-4 border-black bg-[#7B2CBF] py-4 rotate-1 w-[110%] -ml-[5%] overflow-hidden whitespace-nowrap">
        <div className="flex animate-[marquee_20s_linear_infinite] gap-12 text-3xl font-black text-white italic uppercase">
          {Array(10).fill(0).map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              THRIFT IS LIFE <Star size={24} fill="white" /> VINTAGE ONLY <Star size={24} fill="white" /> FAST SHIPPING
            </span>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

const Star = ({ size, fill, className }: { size?: number, fill?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
