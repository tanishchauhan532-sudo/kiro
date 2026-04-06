import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import API from '../lib/api';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { user } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    API.get('/wishlist').then(({ data }) => { setProducts(data.wishlist); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <FiHeart size={48} className="text-pink-500" />
      <p className="text-gray-400">Please login to view your wishlist</p>
      <Link href="/auth/login" className="btn-primary">Login</Link>
    </div>
  );

  return (
    <>
      <Head><title>Wishlist - Treandspot</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <FiHeart className="text-pink-500" /> My Wishlist ({products.length})
          </h1>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="glass-card aspect-[3/4] animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <FiHeart size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">Your wishlist is empty</p>
              <Link href="/products" className="btn-primary">Discover Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
