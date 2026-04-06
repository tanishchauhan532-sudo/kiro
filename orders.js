import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';
import API from '../../lib/api';
import useStore from '../../store/useStore';

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    API.get('/orders/my').then(({ data }) => { setOrders(data.orders); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Head><title>My Orders - Treandspot</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-white"><FiArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FiPackage /> My Orders</h1>
          </div>

          {loading ? (
            <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <FiPackage size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">No orders yet</p>
              <Link href="/products" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-3 py-1 rounded-full border capitalize ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                      <p className="text-white font-bold mt-1">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-white/5 rounded-xl p-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs text-white line-clamp-1 max-w-32">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity} · ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400">Payment: <span className="text-white capitalize">{order.paymentMethod}</span></p>
                    <p className="text-xs text-gray-400">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
