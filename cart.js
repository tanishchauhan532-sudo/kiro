import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiTag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../lib/api';
import useStore from '../store/useStore';

export default function CartPage() {
  const router = useRouter();
  const { user, cart, setCart, fetchCart } = useStore();
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  useEffect(() => { if (user) fetchCart(); }, [user]);

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await API.put('/cart/update', { productId, quantity: qty });
      setCart(data.cart);
    } catch { toast.error('Failed to update'); }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`);
      setCart(data.cart);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove'); }
  };

  const applyCoupon = async () => {
    setApplying(true);
    try {
      const { data } = await API.post('/cart/coupon', { code: coupon });
      setCouponDiscount(data.discount);
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
    setApplying(false);
  };

  if (!user) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">🛒</p>
      <p className="text-gray-400">Please login to view your cart</p>
      <Link href="/auth/login" className="btn-primary">Login</Link>
    </div>
  );

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const discountAmt = couponDiscount ? Math.round(subtotal * couponDiscount / 100) : 0;
  const total = subtotal + shipping - discountAmt;

  return (
    <>
      <Head><title>Cart - Treandspot</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart ({items.length} items)</h1>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🛒</p>
              <p className="text-gray-400 mb-6">Your cart is empty</p>
              <Link href="/products" className="btn-primary">Start Shopping</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div key={item.product?._id} layout className="glass-card p-4 flex gap-4">
                    <Link href={`/products/${item.product?._id}`}>
                      <img src={item.product?.images?.[0]} alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product?._id}`}>
                        <h3 className="text-sm font-medium text-white hover:text-purple-400 line-clamp-2">{item.product?.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{item.product?.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 glass-card px-2 py-1">
                          <button onClick={() => updateQty(item.product?._id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white p-0.5"><FiMinus size={14} /></button>
                          <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product?._id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white p-0.5"><FiPlus size={14} /></button>
                        </div>
                        <span className="text-white font-bold">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeItem(item.product?._id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                {/* Coupon */}
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiTag size={16} /> Apply Coupon</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter code" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="input-field flex-1 text-sm py-2" />
                    <button onClick={applyCoupon} disabled={applying} className="btn-primary text-sm py-2 px-4">Apply</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Try: TREND10, SAVE20, FIRST50</p>
                </div>

                {/* Summary */}
                <div className="glass-card p-4">
                  <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    {discountAmt > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Coupon ({couponDiscount}%)</span><span>-₹{discountAmt.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-base">
                      <span>Total</span><span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => router.push('/checkout')} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                    Proceed to Checkout <FiArrowRight />
                  </button>
                  {subtotal < 499 && (
                    <p className="text-xs text-center text-gray-500 mt-2">Add ₹{499 - subtotal} more for free shipping</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
