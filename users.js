import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiTrash2, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../lib/api';
import useStore from '../../store/useStore';

export default function AdminUsers() {
  const router = useRouter();
  const { user } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.push('/'); return; }
    API.get('/users').then(({ data }) => { setUsers(data.users); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await API.delete(`/users/${id}`); setUsers((u) => u.filter((x) => x._id !== id)); toast.success('User deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <>
      <Head><title>Manage Users - Admin</title></Head>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><FiUsers /> Users ({users.length})</h1>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-gray-400">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-gray-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {u._id !== user._id && (
                          <button onClick={() => handleDelete(u._id)} className="p-1.5 hover:bg-white/10 rounded-lg text-red-400">
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
