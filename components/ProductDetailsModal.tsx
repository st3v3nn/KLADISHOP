
import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from './Button';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, isOpen, onClose, onAddToCart, isFavorite, onToggleFavorite 
}) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    if (!product.gallery || product.gallery.length === 0) return;
    setActiveImage((prev) => (prev + 1) % product.gallery.length);
  };
  const prevImage = () => {
    if (!product.gallery || product.gallery.length === 0) return;
    setActiveImage((prev) => (prev - 1 + product.gallery.length) % product.gallery.length);
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-5xl relative neo-shadow-lg flex flex-col md:flex-row animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-[#FF007F] border-4 border-black p-2 neo-shadow hover:neo-shadow-hover transition-all z-10"
        >
          <X size={24} color="white" strokeWidth={3} />
        </button>

        {/* Left: Gallery */}
        <div className="w-full md:w-1/2 border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-100 relative">
          <div className="aspect-[4/5] overflow-hidden">
            {product.gallery && product.gallery.length > 0 ? (
              <img 
                src={product.gallery[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6 bg-white">
                <div className="font-black text-center text-gray-500">No images available<br/>Add images via the admin panel</div>
              </div>
            )}
          </div>
          
          {/* Gallery Navigation */}
          {product.gallery.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-4 border-black p-2 neo-shadow-sm hover:neo-shadow-none transition-all"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-4 border-black p-2 neo-shadow-sm hover:neo-shadow-none transition-all"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-white/50 border-t-4 border-black">
              {product.gallery.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 border-4 shrink-0 transition-all ${activeImage === i ? 'border-[#FF007F] scale-105' : 'border-black opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col gap-6 overflow-y-auto max-h-[80vh] md:max-h-none">
          <div>
            <span className="bg-[#A3FF00] border-2 border-black px-3 py-1 font-black text-xs uppercase italic inline-block mb-4">
              {product.category}
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-none mb-2">{product.name}</h2>
            <p className="text-3xl font-black text-[#7B2CBF]">KES {product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-1">
              <Info size={16} /> The Rundown
            </h4>
            <p className="font-bold text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              size="lg" 
              variant="primary" 
              fullWidth 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="uppercase italic"
            >
              <ShoppingBag /> ADD TO HAUL
            </Button>
            <button 
              onClick={() => onToggleFavorite(product.id)}
              className={`p-4 border-4 border-black neo-shadow-sm transition-all ${
                isFavorite ? 'bg-[#FF007F] text-white' : 'bg-white text-black'
              }`}
            >
              <Heart size={32} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={3} />
            </button>
          </div>

          {/* AI Guru removed */}
        </div>
      </div>
    </div>
  );
};
