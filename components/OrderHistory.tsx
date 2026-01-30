import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { Button } from './Button';
import { useFirestore } from '../hooks/useFirestore';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose }) => {
  const { user } = useFirebaseAuth();
  const { data: allOrders, subscribeToAll } = useFirestore<Order>('orders');
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Filter orders for current user
  useEffect(() => {
    if (user && allOrders) {
      const filtered = allOrders.filter(order => order.userId === user.id);
      setUserOrders(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, [user, allOrders]);

  if (!isOpen || !user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock size={20} />;
      case 'Processing':
        return <Package size={20} />;
      case 'Shipped':
        return <Truck size={20} />;
      case 'Delivered':
        return <CheckCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'Processing':
        return 'bg-blue-100 border-blue-500 text-blue-900';
      case 'Shipped':
        return 'bg-purple-100 border-purple-500 text-purple-900';
      case 'Delivered':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black w-full max-w-2xl p-8 neo-shadow-lg relative my-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 text-black hover:text-[#FF007F] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-4xl font-black italic uppercase text-center mb-8">ORDER HISTORY</h2>

        {userOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-2xl font-black uppercase text-gray-400 mb-4">No Orders Yet</p>
            <p className="text-gray-600 font-bold mb-6">Time to hit the thrift and get some fresh drops!</p>
            <Button variant="primary" onClick={onClose}>START SHOPPING</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="border-4 border-black p-6 neo-shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <span className="bg-black text-white px-3 py-1 text-xs font-black mb-2 inline-block">{order.id}</span>
                    <p className="font-bold text-gray-500 text-sm">{order.date}</p>
                  </div>
                  <div className={`border-2 px-4 py-2 font-black flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="uppercase text-sm">{order.status}</span>
                  </div>
                </div>

                <div className="border-t-2 border-black pt-4 space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                      <span className="font-bold">{item.name}</span>
                      <span className="font-black">KES {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-black mt-4 pt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Amount</p>
                    <p className="text-3xl font-black italic">KES {order.amount.toLocaleString()}</p>
                  </div>
                  {order.status === 'Delivered' && (
                    <div className="text-green-600 font-black text-sm flex items-center gap-2">
                      <CheckCircle size={20} fill="currentColor" />
                      COMPLETE
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
