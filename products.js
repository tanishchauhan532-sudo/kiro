import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../lib/api';
import useStore from '../../store/useStore';

const emptyForm = { name: '', description: '', price: '', originalPrice: '', discount: '', category: 'Electronics', stock: '', images: [''], isFeatured: false, isTrending: false };
const categories = ['Electronics', 'Fashion', 'Home Essentials', 'Gadgets', 'Beauty', 'Sports', 'Books'];

export default function AdminProducts() {
  const router = useRouter();
  const { user } = useStore();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    fetchProducts();
  }, [user, page, search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 15, ...(search && { search }) });
      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch {}
  };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, images: p.images?.length ? p.images : [''] });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), discount: Number(form.discount), stock: Number(form.stock) };
      if (editing) await API.put(`/products/${editing}`, payload);
      else await API.post('/products', payload);
      toast.success(editing ? 'Product updated!' : 'Product created!');
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <Head><title>Manage Products - Admin</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Products ({total})</h1>
            <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus /> Add Product</button>
          </div>

          <div className="relative mb-4 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field w-full pl-10 text-sm" />
          </div>

          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-gray-400">
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Rating</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]} className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-white line-clamp-1 max-w-48">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{p.category}</td>
                      <td className="p-4 text-white font-medium">₹{p.price.toLocaleString()}</td>
                      <td className="p-4"><span className={p.stock < 10 ? 'text-red-400' : 'text-green-400'}>{p.stock}</span></td>
                      <td className="p-4 text-amber-400">{p.ratings}★</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/10 rounded-lg text-blue-400"><FiEdit2 size={14} /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-white/10 rounded-lg text-red-400"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <input className="input-field w-full" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <textarea className="input-field w-full h-20 resize-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className="input-field" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  <input type="number" className="input-field" placeholder="Original Price (₹)" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} required />
                  <input type="number" className="input-field" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                  <input type="number" className="input-field" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <select className="input-field w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
                <input className="input-field w-full" placeholder="Image URL" value={form.images?.[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-purple-500" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} className="accent-purple-500" />
                    Trending
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Product'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
