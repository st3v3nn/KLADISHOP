
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, Instagram, Twitter, MessageSquare, Check, LayoutDashboard, LogIn, User as UserIcon } from 'lucide-react';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { db } from './src/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { Product, Order, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './constants';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import { useFirestore } from './hooks/useFirestore';

const App: React.FC = () => {
  // Firebase hooks
  const { user, loading: authLoading, logout } = useFirebaseAuth();
  const { data: products, subscribeToAll: subscribeToProducts } = useFirestore<Product>('products');
  const { data: orders, create: createOrder, subscribeToAll: subscribeToOrders } = useFirestore<Order>('orders');
  
  // Local UI States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modal/UI States
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Subscribe to Firestore real-time updates on mount
  useEffect(() => {
    const unsubProducts = subscribeToProducts();
    const unsubOrders = subscribeToOrders();
    return () => {
      unsubProducts?.();
      unsubOrders?.();
    };
  }, []);

  // Firestore write helpers used by AdminDashboard to update collections
  const setProducts = async (updatedProducts: Product[]) => {
    try {
      for (const p of updatedProducts) {
        await setDoc(doc(db, 'products', p.id), p);
      }
    } catch (err) {
      console.error('Failed to update products in Firestore:', err);
    }
  };

  const setOrders = async (updatedOrders: Order[]) => {
    try {
      for (const o of updatedOrders) {
        await setDoc(doc(db, 'orders', o.id), o);
      }
    } catch (err) {
      console.error('Failed to update orders in Firestore:', err);
    }
  };

  // Logic Handlers
  const handleAddToCart = (product: Product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleCheckoutSuccess = async (name: string, phone: string) => {
    if (!user) return;
    try {
      await createOrder({
        id: `ORD-${Date.now().toString().slice(-4)}`,
        customerName: name,
        phone: phone,
        items: cart.map(item => ({ productId: item.id, name: item.name, price: item.price })),
        amount: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        userId: user.id
      } as any);
      setCart([]);
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCart([]);
    setFavorites([]);
  };

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isAdminView) {
    return (
      <AdminDashboard 
        products={products} 
        orders={orders} 
        onExit={() => setIsAdminView(false)}
        onUpdateProducts={setProducts}
        onUpdateOrders={setOrders}
      />
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen relative bg-[#f0f0f0] selection:bg-[#A3FF00]">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-[#FF007F] p-8 flex flex-col animate-in slide-in-from-right duration-300">
          <button onClick={() => setMobileMenuOpen(false)} className="self-end p-2 bg-black text-white border-4 border-black neo-shadow-sm">
            <X size={32} />
          </button>
          <div className="flex-1 flex flex-col justify-center items-center gap-8 text-5xl font-black italic text-white uppercase tracking-tighter">
            <a href="#shop" onClick={() => { setMobileMenuOpen(false); setShowFavoritesOnly(false); }}>New Drops</a>
            <button onClick={() => { setMobileMenuOpen(false); setShowFavoritesOnly(true); }}>Favorites</button>
            <a href="#" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            {user && !authLoading ? (
               <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Log Out</button>
            ) : (
               <button onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}>Sign In</button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="fixed top-0 w-full z-[60] bg-white border-b-4 border-black px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <a href="#" onClick={() => setShowFavoritesOnly(false)} className="text-3xl font-black italic tracking-tighter hover:text-[#7B2CBF] transition-colors">
            KLADI<span className="text-[#A3FF00] drop-shadow-[2px_2px_0px_#000]">SHOP</span>
          </a>
          <div className="hidden lg:flex gap-8 font-black uppercase text-sm">
            <a href="#shop" onClick={() => setShowFavoritesOnly(false)} className="hover:text-[#FF007F] border-b-2 border-transparent hover:border-black transition-all">New Drops</a>
            <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`${showFavoritesOnly ? 'text-[#FF007F] border-black' : 'hover:text-[#FF007F]'} border-b-2 border-transparent hover:border-black transition-all uppercase`}>
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Toggle */}
          <div className={`flex items-center transition-all ${isSearchOpen ? 'w-40 md:w-64' : 'w-10 md:w-12'}`}>
            <input 
              type="text"
              placeholder="SEARCH DROPS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-10 border-4 border-black font-bold px-2 text-xs transition-all ${isSearchOpen ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
            />
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 border-2 border-transparent hover:border-black transition-all shrink-0 ${isSearchOpen ? 'text-[#FF007F]' : ''}`}>
              <Search size={24} />
            </button>
          </div>

          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`p-2 border-2 border-transparent hover:border-black transition-all relative ${showFavoritesOnly ? 'text-[#FF007F]' : ''}`}>
            <Heart size={24} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>

          <button onClick={() => setIsCartOpen(true)} className="p-2 bg-[#A3FF00] border-4 border-black neo-shadow-sm hover:neo-shadow-hover transition-all flex items-center gap-2 px-4 font-black relative overflow-visible group">
            <ShoppingCart size={24} />
            <span className="hidden sm:inline">CART</span>
            <span className="absolute -top-3 -right-3 bg-[#FF007F] text-white w-7 h-7 flex items-center justify-center text-xs border-2 border-black rounded-full neo-shadow-sm group-hover:scale-110 transition-transform">
              {cart.length}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-2 ml-2">
            {user && !authLoading ? (
              <button onClick={handleLogout} className="flex items-center gap-2 font-black uppercase text-xs hover:text-[#FF007F] border-b-2 border-transparent hover:border-black transition-all">
                <UserIcon size={20} /> LOGOUT ({user.name})
              </button>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 font-black uppercase text-xs hover:text-[#A3FF00] bg-black text-white px-4 py-2 border-4 border-black neo-shadow-sm active:translate-x-1 active:translate-y-1">
                <LogIn size={20} /> SIGN IN
              </button>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 transition-colors">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {!showFavoritesOnly && <Hero />}
        <section id="shop" className={`py-20 px-4 max-w-7xl mx-auto ${showFavoritesOnly ? 'mt-10' : ''}`}>
          <ProductGrid 
            onAddToCart={handleAddToCart} 
            onViewDetails={setSelectedDetailsProduct}
            products={products} 
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            showFavoritesOnly={showFavoritesOnly}
          />
        </section>
        
        {/* Why Us Section */}
        {!showFavoritesOnly && (
          <section className="bg-black text-white py-24 px-4 overflow-hidden relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { title: 'AUTHENTIC HEAT', desc: 'Every piece is hand-picked for maximum drip factor.' },
                { title: 'SUSTAINABLE AF', desc: 'Thrift is the only way to save the planet and your wallet.' },
                { title: 'MPESA PUSH', desc: 'STK push enabled. No more Paybill stress, just vibes.' }
              ].map((item, i) => (
                <div key={i} className="border-4 border-white p-8 neo-shadow-[8px_8px_0px_0px_#A3FF00] hover:neo-shadow-[4px_4px_0px_0px_#A3FF00] transition-all group">
                  <h3 className="text-3xl font-black mb-4 italic uppercase group-hover:text-[#A3FF00] transition-colors">{item.title}</h3>
                  <p className="text-xl font-bold opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-4xl font-black italic">KLADI SHOP</h2>
            <p className="text-xl font-bold max-w-sm text-gray-700">
              The #1 source for thrifted streetwear in Nairobi. We don't do boring, we only do rare. Hand-picked, verified, and shipped 24/7.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-black p-3 text-white border-4 border-black hover:bg-white hover:text-black transition-colors neo-shadow-sm">
                <Instagram size={24} />
              </a>
              <a href="#" className="bg-black p-3 text-white border-4 border-black hover:bg-white hover:text-black transition-colors neo-shadow-sm">
                <Twitter size={24} />
              </a>
              <button 
                onClick={() => setIsAdminAuthOpen(true)} 
                className="bg-black p-3 text-white border-4 border-black hover:bg-[#A3FF00] hover:text-black transition-colors neo-shadow-sm group flex items-center gap-2"
              >
                <LayoutDashboard size={24} />
                <span className="hidden group-hover:inline font-black text-xs uppercase">ADMIN PANEL</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-black text-lg uppercase underline decoration-4 decoration-[#A3FF00]">Support</h4>
            <ul className="space-y-2 font-bold uppercase text-sm">
              <li><a href="#" className="hover:text-[#FF007F] transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-[#FF007F] transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-[#FF007F] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#FF007F] transition-colors">Size Guide</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-lg uppercase underline decoration-4 decoration-[#7B2CBF]">Newsletter</h4>
            <p className="font-bold text-sm">GET 10% OFF YOUR FIRST ORDER. NO SPAM, JUST HEAT.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              setTimeout(() => setSubscribed(false), 3000);
              setNewsletterEmail('');
            }} className="flex flex-col gap-2">
              <input 
                type="email" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="EMAIL ADDRESS" 
                className="border-4 border-black p-3 focus:bg-[#A3FF00]/10 outline-none font-black" 
                required
              />
              <button 
                type="submit" 
                className={`p-3 font-black uppercase transition-all border-4 border-black neo-shadow-sm ${subscribed ? 'bg-[#A3FF00] text-black' : 'bg-black text-white hover:bg-[#FF007F]'}`}
              >
                {subscribed ? 'WELCOME FAM!' : "JOIN THE LIST"}
              </button>
            </form>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase">
          <p>© 2024 KLADI SHOP. BUILT FOR THE STREETS.</p>
          <p className="flex items-center gap-2">POWERED BY <span className="bg-[#A3FF00] px-2 py-0.5 border-2 border-black">BBS</span></p>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuth={() => setIsAuthModalOpen(false)} 
      />

      <AdminAuthModal 
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => setIsAdminView(true)}
      />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={(id) => setCart(prev => prev.filter(p => p.id !== id))}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        cart={cart}
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSuccess={handleCheckoutSuccess}
      />

      {selectedDetailsProduct && (
        <ProductDetailsModal 
          product={selectedDetailsProduct}
          isOpen={true}
          onClose={() => setSelectedDetailsProduct(null)}
          onAddToCart={handleAddToCart}
          isFavorite={favorites.includes(selectedDetailsProduct.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
    </ErrorBoundary>
  );
};

export default App;
