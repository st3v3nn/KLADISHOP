
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  gallery: string[]; // Added gallery support
  category: string;
  description: string; // Added description
  tag?: string;
  stock?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: { productId: string; name: string; price: number }[];
  amount: number;
  status: OrderStatus;
  date: string;
}
