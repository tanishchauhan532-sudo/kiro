import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiBell } from 'react-icons/fi';
import useStore from '../store/useStore';
import API from '../lib/api';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, cartCount } = useStore();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.length > 1) {
        try {
          const { data } = await API.get(`/products/search-suggestions?q=${search}`);
          setSuggestions(data.suggestions || []);
          setShowSugg(true);
        } catch {}
      } else { setSuggestions([]); setShowSugg(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { router.push(`/products?search=${search}`); setShowSugg(false); }
  };

  const categories = ['Electronics', 'Fashion', 'Home Essentials', 'Gadgets', 'Beauty', 'Sports'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-black neon-text">Treandspot</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400">
                <FiSearch size={18} />
              </button>
            </form>
            <AnimatePresence>
              {showSugg && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full glass-card p-2 z-50"
                >
                  {suggestions.map((s) => (
                    <button key={s._id} onClick={() => { router.push(`/products/${s._id}`); setShowSugg(false); setSearch(''); }}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-gray-300 flex items-center gap-2">
                      <FiSearch size={14} className="text-purple-400" />
                      <span>{s.name}</span>
                      <span className="ml-auto text-xs text-gray-500">{s.category}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/wishlist" className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden md:flex items-center gap-1 text-gray-300 hover:text-pink-400">
              <FiHeart size={20} />
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-300 hover:text-purple-400">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors text-sm text-white">
                  <FiUser size={16} />
                  <span className="hidden md:block">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/dashboard" className="block px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-gray-300">Dashboard</Link>
                  <Link href="/dashboard/orders" className="block px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-gray-300">My Orders</Link>
                  {user.role === 'admin' && <Link href="/admin" className="block px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-purple-400">Admin Panel</Link>}
                  <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-red-400">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-primary text-sm py-2 px-4 hidden md:block">Login</Link>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-xl text-gray-300">
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="hidden md:flex items-center gap-1 mt-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Link key={cat} href={`/products?category=${cat}`}
              className="flex-shrink-0 text-xs text-gray-400 hover:text-purple-400 px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="p-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..." className="input-field w-full text-sm" />
              </form>
              {categories.map((cat) => (
                <Link key={cat} href={`/products?category=${cat}`} onClick={() => setMobileOpen(false)}
                  className="block text-gray-300 hover:text-purple-400 py-2 border-b border-white/5">{cat}</Link>
              ))}
              {!user && <Link href="/auth/login" className="btn-primary block text-center" onClick={() => setMobileOpen(false)}>Login / Register</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
