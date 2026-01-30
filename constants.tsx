
import { Product, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Oversized Blazer',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548624149-f9b1859aa700?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Outerwear',
    description: 'A structured vintage piece that screams 90s corporate chic. Perfect for power moves in the city. Heavy wool blend, slightly padded shoulders.',
    tag: 'RARE',
    stock: 1
  },
  {
    id: '2',
    name: '90s Graphic Band Tee',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Tops',
    description: 'Authentic tour merch from a legendary era. Distressed collar and fade for that perfect lived-in look. 100% heavy cotton.',
    tag: 'NEW',
    stock: 5
  },
  {
    id: '3',
    name: 'Baggy Carpenter Jeans',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Bottoms',
    description: 'Wide-leg silhouette with utility loops. Perfect for skating or just vibing. Deep indigo wash with contrast stitching.',
    tag: 'BESTSELLER',
    stock: 2
  },
  {
    id: '4',
    name: 'Retro Colorblock Windbreaker',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Outerwear',
    description: 'Neon accents and lightweight nylon. Water-resistant and 100% loud. Folds into its own pocket for travel.',
    stock: 1
  },
  {
    id: '5',
    name: 'Y2K Pleated Mini Skirt',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577900232427-18219b9166a0?q=80&w=800&auto=format&fit=crop'
    ],
    category: 'Bottoms',
    description: 'Classic schoolcore aesthetic with a streetwear twist. Hidden shorts underneath for comfort. Tartan pattern.',
    tag: 'HOT',
    stock: 3
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Kiprop Maina',
    phone: '0712345678',
    items: [
      { productId: '1', name: 'Vintage Oversized Blazer', price: 2500 }
    ],
    amount: 2500,
    status: 'Delivered',
    date: '2024-03-20'
  }
];
