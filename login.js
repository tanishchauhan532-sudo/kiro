import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../lib/api';
import useStore from '../../store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      setUser(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(router.query.redirect || '/');
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Login - Treandspot</title></Head>
      <main className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <Link href="/"><h1 className="text-3xl font-black neon-text">Treandspot</h1></Link>
              <p className="text-gray-400 mt-2">Welcome back! Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field w-full pl-10" required />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field w-full pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 font-medium">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
