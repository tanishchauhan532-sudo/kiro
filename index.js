import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import API from '../lib/api';

const categories = [
  { name: 'Electronics', icon: '⚡', color: 'from-blue-600 to-cyan-500', href: '/products?category=Electronics' },
  { name: 'Fashion', icon: '👗', color: 'from-pink-600 to-rose-500', href: '/products?category=Fashion' },
  { name: 'Home Essentials', icon: '🏠', color: 'from-green-600 to-emerald-500', href: '/products?category=Home+Essentials' },
  { name: 'Gadgets', icon: '🔧', color: 'from-purple-600 to-violet-500', href: '/products?category=Gadgets' },
  { name: 'Beauty', icon: '✨', color: 'from-amber-500 to-orange-500', href: '/products?category=Beauty' },
  { name: 'Sports', icon: '🏃', color: 'from-red-600 to-orange-500', href: '/products?category=Sports' },
  { name: 'Books', icon: '📚', color: 'from-indigo-600 to-blue-500', href: '/products?category=Books' },
];

const features = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% safe & encrypted' },
  { icon: FiRefreshCw, title: 'Easy Returns', desc: '7-day return policy' },
  { icon: FiZap, title: 'Fast Shipping', desc: 'Delivered in 2-3 days' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [t, f] = await Promise.all([
          API.get('/products?trending=true&limit=8'),
          API.get('/products?featured=true&limit=8'),
        ]);
        setTrending(t.data.products);
        setFeatured(f.data.products);
      } catch {}
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Head><title>Treandspot - Shop the Future</title></Head>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm px-4 py-2 rounded-full mb-6">
                🚀 The Future of Shopping is Here
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-white">Discover </span>
                <span className="neon-text">Trending</span>
                <br />
                <span className="text-white">Products at </span>
                <span className="neon-text">Best Prices</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Shop from 200+ curated products across 7 categories. Affordable prices, premium quality, lightning-fast delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center">
                  Shop Now <FiArrowRight />
                </Link>
                <Link href="/products?trending=true" className="btn-outline text-lg px-8 py-4 flex items-center gap-2 justify-center">
                  🔥 Trending
                </Link>
              </div>
            </motion.div>

            {/* Floating stats */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-6 mt-16">
              {[['200+', 'Products'], ['50K+', 'Happy Customers'], ['₹99', 'Starting Price'], ['4.8★', 'Avg Rating']].map(([val, label]) => (
                <div key={label} className="glass-card px-6 py-3 text-center">
                  <div className="text-2xl font-black neon-text">{val}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs flex flex-col items-center gap-2">
            <span>Scroll to explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent" />
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-12 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} whileHover={{ scale: 1.02 }}
                  className="glass-card p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Icon size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{title}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-gray-400 text-sm">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={cat.href}>
                  <div className="glass-card p-4 text-center hover:border-purple-500/50 transition-all group cursor-pointer">
                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="py-8 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">🔥 Trending Now</h2>
              <p className="text-gray-400 text-sm">Most popular products this week</p>
            </div>
            <Link href="/products?trending=true" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="glass-card aspect-[3/4] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trending.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="py-8 max-w-7xl mx-auto px-4">
          <motion.div whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-purple-800 to-cyan-900 p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-500/20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-purple-300 text-sm font-medium mb-2">Limited Time Offer</p>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">Up to 70% OFF</h3>
                <p className="text-gray-300">On Electronics & Gadgets. Use code <span className="text-cyan-400 font-bold">TREND10</span></p>
              </div>
              <Link href="/products?category=Electronics" className="btn-primary flex-shrink-0 text-lg px-8 py-4">
                Shop Electronics
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Featured Products */}
        <section className="py-8 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">⭐ Featured Products</h2>
              <p className="text-gray-400 text-sm">Hand-picked by our team</p>
            </div>
            <Link href="/products?featured=true" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="glass-card aspect-[3/4] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="py-16 text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white mb-4">Ready to start shopping?</h2>
          <p className="text-gray-400 mb-8">Join thousands of happy customers. New products added daily.</p>
          <Link href="/products" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Explore All Products <FiArrowRight />
          </Link>
        </section>
      </main>
    </>
  );
}
