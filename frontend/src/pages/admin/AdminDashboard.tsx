import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  Users,
  Store,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowRight,
  RotateCw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, mRes, sRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/merchants'),
        api.get('/dashboard/stats'),
      ]);

      if (uRes.data.success) setUsers(uRes.data.users);
      if (mRes.data.success) setMerchants(mRes.data.merchants);
      if (sRes.data.success) setStats(sRes.data.stats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleMerchant = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.patch(`/admin/merchants/${id}/status`, { status: newStatus });
      if (res.data.success) {
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="ADMIN" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white light:text-slate-900">
              System Administration Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Platform governance, merchant status enforcement, and global rule monitoring.
            </p>
          </div>

          <Link
            to="/admin/fraud-rules"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Manage Fraud Rules Engine</span>
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Users</span>
            <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
              {users.length}
            </div>
            <span className="text-[10px] text-slate-500">4 system roles active</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Registered Merchants</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
              {merchants.length}
            </div>
            <span className="text-[10px] text-slate-500">Business accounts</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-rose-500/20">
            <span className="text-[10px] font-mono uppercase text-rose-400">Blocked Attacks</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {stats?.blockedCount || 0}
            </div>
            <span className="text-[10px] text-rose-500">Fraud prevention rate: 100%</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-purple-500/20">
            <span className="text-[10px] font-mono uppercase text-purple-400">Total Orders</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              {stats?.totalTransactions || 0}
            </div>
            <span className="text-[10px] text-slate-500">Sandbox lifecycle records</span>
          </div>
        </div>

        {/* Merchants Roster Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto space-y-3">
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            Merchants Governance Roster ({merchants.length})
          </h3>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Merchant Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Trust Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white light:text-slate-900">{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.email}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{m.category}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                    {m.trustScore}/100
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleToggleMerchant(m.id, m.status)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        m.status === 'ACTIVE'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {m.status === 'ACTIVE' ? 'Suspend Merchant' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
