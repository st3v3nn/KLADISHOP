
import React, { useState } from 'react';
import {
  Plus, Edit2, Trash2, Package, TrendingUp, Users,
  ArrowLeft, CheckCircle, Clock, Truck, ShieldCheck, X, Upload, Loader
} from 'lucide-react';
import { Button } from './Button';
import { Product, Order, OrderStatus } from '../types';
import { db } from '../src/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_PRODUCTS } from '../constants';
import { useFirebaseStorage } from '../hooks/useFirebaseStorage';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onExit: () => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products, orders, onExit, onUpdateProducts, onUpdateOrders
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { uploadImage, uploading, uploadProgress } = useFirebaseStorage();
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;

  // CRUD Functions
  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this drop?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Fixed the type error by including missing gallery and description fields
  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mainImage = formData.get('image') as string || 'https://picsum.photos/seed/new/600/800';
    const galleryStr = formData.get('gallery') as string;

    // Parse comma-separated gallery URLs or fallback to main image
    const gallery = galleryStr
      ? galleryStr.split(',').map(url => url.trim()).filter(url => url !== '')
      : (editingProduct?.gallery || [mainImage]);

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      image: mainImage,
      gallery: gallery,
      description: (formData.get('description') as string) || editingProduct?.description || 'A unique hand-picked thrifted find.',
      category: formData.get('category') as string,
      tag: formData.get('tag') as string || undefined,
      stock: Number(formData.get('stock')) || 1
    };

    if (editingProduct) {
      onUpdateProducts(products.map(p => p.id === editingProduct.id ? productData : p));
    } else {
      onUpdateProducts([...products, productData]);
    }
    setEditingProduct(null);
    setShowAddModal(false);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMainImage(true);
    setUploadError(null);

    // Reset file input
    e.target.value = '';

    try {
      console.log('Starting main image upload:', file.name);
      const url = await uploadImage(file, 'products/main');
      console.log('Main image uploaded successfully:', url);

      // Update the form input value
      const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (imageInput) {
        imageInput.value = url;
      }
    } catch (err: any) {
      console.error('Main image upload error:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingMainImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMainImage(true);
    setUploadError(null);

    // Reset file input
    e.target.value = '';

    try {
      const galleryInput = document.querySelector('input[name="gallery"]') as HTMLInputElement;
      const existingGallery = galleryInput?.value ? galleryInput.value.split(',').map(u => u.trim()) : [];

      for (const file of Array.from(files) as File[]) {
        try {
          console.log('Uploading gallery image:', file.name);
          const url = await uploadImage(file, 'products/gallery');
          console.log('Gallery image uploaded:', url);
          existingGallery.push(url);
        } catch (err: any) {
          console.error('Gallery image upload failed:', err);
          setUploadError(`Failed to upload ${file.name}: ${err.message}`);
        }
      }

      if (galleryInput) {
        galleryInput.value = existingGallery.join(', ');
      }
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      setUploadError(err.message || 'Gallery upload failed. Please try again.');
    } finally {
      setUploadingMainImage(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-4 md:p-8">
      {/* Admin Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase text-[#A3FF00] tracking-tighter">
            COMMAND<span className="text-white">CENTER</span>
          </h1>
          <p className="font-bold text-gray-400">ADMIN MODE: Logged in as Head Curator</p>
          {/* Debug Info */}
          <div className="text-xs mt-2 font-mono">
            ADMIN CLAIM: <span className={uploading ? 'text-yellow-500' : 'text-[#A3FF00]'}>DETECTED</span>
          </div>
        </div>
        <Button variant="danger" onClick={onExit} size="sm">
          <ArrowLeft size={18} /> EXIT DASHBOARD
        </Button>
      </div >

      {/* Tabs */}
      < div className="max-w-7xl mx-auto flex gap-4 mb-8 overflow-x-auto pb-2" >
        {(['overview', 'products', 'orders'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-black uppercase italic border-4 transition-all ${activeTab === tab
              ? 'bg-[#FF007F] border-black translate-x-1 translate-y-1'
              : 'bg-white text-black border-black neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:neo-shadow-none'
              }`}
          >
            {tab}
          </button>
        ))}
      </div >

      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={<TrendingUp size={32} />} label="REVENUE" value={`KES ${totalRevenue.toLocaleString()}`} color="#A3FF00" />
            <StatCard icon={<Package size={32} />} label="DROPS" value={activeProducts.toString()} color="#7B2CBF" />
            <StatCard icon={<Users size={32} />} label="ORDERS" value={totalOrders.toString()} color="#FF007F" />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white text-black border-4 border-black p-6 neo-shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic uppercase">Inventory</h2>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddModal(true)} variant="primary">
                  <Plus size={20} /> ADD NEW DROP
                </Button>
                <Button onClick={async () => {
                  if (!confirm('This will overwrite products in Firestore with initial product set. Continue?')) return;
                  try {
                    for (const p of INITIAL_PRODUCTS) {
                      await setDoc(doc(db, 'products', p.id), p);
                    }
                    alert('Initial products synced to Firestore.');
                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                    alert('Failed to sync products. Check console.');
                  }
                }} variant="accent">
                  SYNC INITIAL PRODUCTS
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th className="py-4 font-black uppercase">Drop</th>
                    <th className="py-4 font-black uppercase">Category</th>
                    <th className="py-4 font-black uppercase">Price</th>
                    <th className="py-4 font-black uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b-2 border-gray-200">
                      <td className="py-4 flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 border-2 border-black object-cover" />
                        <span className="font-bold">{p.name}</span>
                      </td>
                      <td className="py-4 font-bold uppercase">{p.category}</td>
                      <td className="py-4 font-bold">KES {p.price.toLocaleString()}</td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 hover:bg-[#A3FF00] hover:text-black transition-colors"><Edit2 size={18} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 hover:bg-red-500 hover:text-white transition-colors text-red-500"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white text-black border-4 border-black p-6 neo-shadow-lg flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-black text-white px-3 py-1 text-xs font-black">{order.id}</span>
                    <span className={`text-xs font-black uppercase px-2 py-1 border-2 border-black ${order.status === 'Delivered' ? 'bg-[#A3FF00]' : 'bg-yellow-300'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black uppercase">{order.customerName}</h3>
                  <p className="font-bold text-gray-500 mb-2">{order.phone} • {order.date}</p>
                  <div className="space-y-1 border-t-2 border-black pt-2">
                    {order.items?.map((item, i) => (
                      <p key={i} className="text-sm font-bold flex justify-between">
                        <span>- {item.name}</span>
                        <span>KES {item.price.toLocaleString()}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    <p className="text-3xl font-black italic">KES {order.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex border-4 border-black bg-gray-100">
                    {(['Pending', 'Processing', 'Shipped', 'Delivered'] as OrderStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        className={`p-3 border-r-2 last:border-0 border-black transition-colors ${order.status === status ? 'bg-black text-white' : 'hover:bg-[#FF007F] hover:text-white'
                          }`}
                        title={status}
                      >
                        {status === 'Pending' && <Clock size={20} />}
                        {status === 'Processing' && <ShieldCheck size={20} />}
                        {status === 'Shipped' && <Truck size={20} />}
                        {status === 'Delivered' && <CheckCircle size={20} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal Code */}
      {
        (showAddModal || editingProduct) && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-white text-black border-4 border-black w-full max-w-lg p-8 neo-shadow-lg relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => { setShowAddModal(false); setEditingProduct(null) }} className="absolute top-4 right-4"><X size={24} /></button>
              <h3 className="text-3xl font-black italic uppercase mb-6">{editingProduct ? 'Edit Drop' : 'New Drop'}</h3>

              {uploadError && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4 font-bold text-sm">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black mb-1">PRODUCT NAME</label>
                    <input name="name" defaultValue={editingProduct?.name} className="w-full border-4 border-black p-2 font-bold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1">PRICE (KES)</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price} className="w-full border-4 border-black p-2 font-bold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1">CATEGORY</label>
                    <select name="category" defaultValue={editingProduct?.category} className="w-full border-4 border-black p-2 font-bold">
                      <option>Tops</option>
                      <option>Bottoms</option>
                      <option>Outerwear</option>
                      <option>Knitwear</option>
                      <option>Accessories</option>
                    </select>
                  </div>

                  {/* Main Image Upload */}
                  <div className="col-span-2">
                    <label className="block text-xs font-black mb-1">MAIN IMAGE</label>
                    <div className="flex gap-2 mb-2">
                      <input name="image" defaultValue={editingProduct?.image} className="flex-1 border-4 border-black p-2 font-bold" placeholder="Image URL or upload below" />
                      <label className="flex items-center gap-1 px-3 py-2 border-4 border-black bg-[#A3FF00] text-black font-black cursor-pointer hover:neo-shadow-sm transition-all">
                        <Upload size={16} />
                        {uploadingMainImage ? (
                          <>
                            <Loader size={16} className="animate-spin" /> {uploadProgress !== null ? `${uploadProgress}%` : 'UPLOADING'}
                          </>
                        ) : 'UPLOAD'}
                        <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingMainImage || uploading} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Upload */}
                  <div className="col-span-2">
                    <label className="block text-xs font-black mb-1">GALLERY IMAGES</label>
                    <div className="flex gap-2 mb-2">
                      <input name="gallery" defaultValue={editingProduct?.gallery?.join(', ')} className="flex-1 border-4 border-black p-2 font-bold" placeholder="URLs separated by commas" />
                      <label className="flex items-center gap-1 px-3 py-2 border-4 border-black bg-[#7B2CBF] text-white font-black cursor-pointer hover:neo-shadow-sm transition-all">
                        <Upload size={16} />
                        {uploadingMainImage ? (
                          <>
                            <Loader size={16} className="animate-spin" /> {uploadProgress !== null ? `${uploadProgress}%` : 'UPLOADING'}
                          </>
                        ) : 'ADD'}
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingMainImage || uploading} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 font-bold">Upload multiple images or paste URLs separated by commas</p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black mb-1">DESCRIPTION</label>
                    <textarea name="description" defaultValue={editingProduct?.description} className="w-full border-4 border-black p-2 font-bold h-24" required />
                  </div>
                </div>
                <Button type="submit" fullWidth variant="primary" className="mt-4" disabled={uploadingMainImage || uploading}>
                  SAVE PRODUCT
                </Button>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

const StatCard = ({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => (
  <div className="bg-white text-black border-4 border-black p-6 neo-shadow-lg relative overflow-hidden group">
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-2 text-gray-500 font-black italic text-sm">
        {icon} {label}
      </div>
      <div className="text-4xl font-black italic">{value}</div>
    </div>
    <div className="absolute -bottom-4 -right-4 text-8xl font-black opacity-10 group-hover:scale-110 transition-transform pointer-events-none" style={{ color }}>
      {label[0]}
    </div>
  </div>
);
