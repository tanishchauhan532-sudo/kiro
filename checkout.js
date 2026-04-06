import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../lib/api';
import useStore from '../store/useStore';

const steps = ['Address', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cart, fetchCart } = useStore();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', country: 'India' });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => { if (user) fetchCart(); }, [user]);

  if (!user) { router.push('/auth/login'); return null; }

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id, name: i.product.name,
        image: i.product.images?.[0], price: i.product.price, quantity: i.quantity,
      }));
      const { data } = await API.post('/orders', {
        items: orderItems, shippingAddress: address, paymentMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: 0, totalPrice: total,
      });
      if (paymentMethod === 'cod') {
        await API.put(`/orders/${data.order._id}/pay`, { status: 'pending', id: 'COD' });
      }
      await API.delete('/cart/clear');
      await fetchCart();
      setOrderId(data.order._id);
      setStep(2);
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed'); }
    setPlacing(false);
  };

  return (
    <>
      <Head><title>Checkout - Treandspot</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {i < step ? <FiCheck size={14} /> : i + 1}
                </div>
                <span className={`text-sm ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`w-12 h-px ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step 0: Address */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiTruck /> Delivery Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">Street Address</label>
                  <input className="input-field w-full" placeholder="House no, Street, Area"
                    value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">City</label>
                  <input className="input-field w-full" placeholder="City"
                    value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">State</label>
                  <input className="input-field w-full" placeholder="State"
                    value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Pincode</label>
                  <input className="input-field w-full" placeholder="Pincode"
                    value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Country</label>
                  <input className="input-field w-full" value={address.country} readOnly />
                </div>
              </div>
              <button onClick={() => {
                if (!address.street || !address.city || !address.state || !address.pincode)
                  return toast.error('Please fill all fields');
                setStep(1);
              }} className="btn-primary mt-6 w-full">Continue to Payment</button>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiCreditCard /> Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
                      { id: 'stripe', label: 'Credit / Debit Card', icon: '💳', desc: 'Secure payment via Stripe' },
                    ].map((m) => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === m.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20'}`}>
                        <span className="text-2xl">{m.icon}</span>
                        <div className="text-left">
                          <p className="text-white font-medium text-sm">{m.label}</p>
                          <p className="text-gray-400 text-xs">{m.desc}</p>
                        </div>
                        <div className={`ml-auto w-4 h-4 rounded-full border-2 ${paymentMethod === m.id ? 'border-purple-500 bg-purple-500' : 'border-gray-500'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                    <button onClick={() => setStep(1.5)} className="btn-primary flex-1">Review Order</button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.product?._id} className="flex items-center gap-3">
                        <img src={item.product?.images?.[0]} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white line-clamp-1">{item.product?.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                        <span className="text-sm text-white">₹{(item.product?.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                    <div className="flex justify-between text-white font-bold text-base pt-1"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              {/* Confirm step inline */}
              {step === 1.5 && (
                <div className="mt-4 glass-card p-4 flex items-center justify-between">
                  <p className="text-white">Place order for <span className="font-bold text-purple-400">₹{total.toLocaleString()}</span> via {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}?</p>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary">
                    {placing ? 'Placing...' : 'Confirm Order'}
                  </button>
                </div>
              )}
              {step === 1 && (
                <button onClick={() => setStep(1.5)} className="btn-primary w-full mt-4">Review & Place Order</button>
              )}
            </motion.div>
          )}

          {/* Step 2: Success */}
          {step === 2 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck size={40} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Order Placed!</h2>
              <p className="text-gray-400 mb-2">Your order has been confirmed successfully.</p>
              <p className="text-purple-400 text-sm mb-8">Order ID: {orderId}</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => router.push('/dashboard/orders')} className="btn-primary">Track Order</button>
                <button onClick={() => router.push('/products')} className="btn-outline">Continue Shopping</button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
