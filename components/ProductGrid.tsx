
import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { Button } from './Button';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void; // New callback
  products: Product[];
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  showFavoritesOnly?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  onAddToCart, 
  onViewDetails,
  products, 
  searchQuery, 
  favorites, 
  onToggleFavorite,
  showFavoritesOnly = false
}) => {
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'KNITWEAR', 'ACCESSORIES'];
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'ALL' || p.category.toUpperCase() === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || favorites.includes(p.id);
    return matchesCategory && matchesSearch && matchesFavorite;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {showFavoritesOnly ? (
              <>YOUR <span className="text-[#FF007F]">FAVES</span></>
            ) : (
              <>THE <span className="text-[#FF007F]">DROPS</span></>
            )}
          </h2>
          <p className="text-xl font-bold bg-[#7B2CBF] text-white px-2 py-1 w-fit mt-2">
            {showFavoritesOnly ? 'WISHLIST STATUS: LOCKED' : 'FRESHLY CURATED JUST FOR YOU'}
          </p>
        </div>
        {!showFavoritesOnly && (
          <div className="flex flex-wrap gap-2 md:gap-4 justify-start w-full md:w-auto">
             {categories.map(cat => (
               <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={`font-black transition-all border-b-4 uppercase text-sm md:text-base ${
                      filter === cat 
                      ? 'text-[#FF007F] border-black' 
                      : 'text-gray-400 border-transparent hover:text-black hover:border-gray-300'
                  }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="group relative bg-white border-4 border-black p-4 neo-shadow-lg transition-all hover:-translate-y-2 hover:neo-shadow-[14px_14px_0px_0px_rgba(0,0,0,1)]"
            >
              {product.tag && (
                <span className="absolute -top-3 -left-3 bg-[#A3FF00] border-4 border-black px-3 py-1 font-black italic text-sm z-10 neo-shadow-sm flex items-center gap-1">
                  <Star size={14} fill="currentColor" /> {product.tag}
                </span>
              )}

              <div className="aspect-[3/4] overflow-hidden border-4 border-black mb-4 relative bg-gray-100 cursor-pointer" onClick={() => onViewDetails(product)}>
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-4 bg-white">
                    <div className="font-black text-sm text-gray-500 uppercase">No image provided<br />Add your own in the dashboard</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="bg-[#A3FF00] p-4 border-4 border-black neo-shadow-sm font-black italic">VIEW DETAILS</div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className={`absolute top-4 right-4 p-2 border-2 border-black neo-shadow-sm transition-all z-10 ${
                    favorites.includes(product.id) ? 'bg-[#FF007F] text-white' : 'bg-white text-black'
                  }`}
                >
                  <Heart size={20} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-black text-gray-500 uppercase">{product.category}</p>
                <h3 className="text-xl font-black leading-tight uppercase group-hover:text-[#7B2CBF] transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-2xl font-black italic">
                    KES {product.price.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                     <button 
                      onClick={() => onViewDetails(product)}
                      className="p-2 border-4 border-black bg-white hover:bg-gray-100 transition-colors"
                      title="Quick View"
                    >
                      <Eye size={18} strokeWidth={3} />
                    </button>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingBag size={18} strokeWidth={3} />
                      GET
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <p className="text-2xl font-black uppercase text-gray-400">Nothing here yet, fam.</p>
             <Button variant="accent" className="mt-4" onClick={() => setFilter('ALL')}>SHOW ALL</Button>
          </div>
        )}
      </div>
    </div>
  );
};
