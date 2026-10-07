import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  CreditCard,
  ShoppingCart,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RiskBadge } from '../../components/common/RiskBadge';

export const MerchantDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('2499');
  const [newCustomer, setNewCustomer] = useState('Ananya Sharma');
  const [newEmail, setNewEmail] = useState('ananya@example.com');
  const [newDesc, setNewDesc] = useState('Pro Wireless Audio Pods');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes, paymentsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/analytics'),
        api.get('/payments?limit=8'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.payments);
    } catch (err) {
      console.error('Failed to load merchant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', {
        amount: Number(newAmount),
        customerName: newCustomer,
        customerEmail: newEmail,
        description: newDesc,
      });
      if (res.data.success) {
        setCreatedOrder(res.data.order);
      }
    } catch (err) {
      console.error('Order creation failed:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white light:text-slate-900">
              Merchant Operations Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sandbox revenue tracking, order management, and fraud chargeback mitigation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCreatedOrder(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Order</span>
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Revenue</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              ₹{(stats?.totalVolume || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Gross sandbox volume</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Success Payments</span>
            <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
              {stats?.successfulCount || 0}
            </div>
            <span className="text-[10px] text-emerald-400">Settled without dispute</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-rose-500/20">
            <span className="text-[10px] font-mono uppercase text-rose-400">Fraud Blocked</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {stats?.blockedCount || 0}
            </div>
            <span className="text-[10px] text-rose-400">Stopped by PayGuard</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Refunds Processed</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              ₹{(stats?.refundedVolume || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">{stats?.refundedCount || 0} refunds</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-amber-500/20">
            <span className="text-[10px] font-mono uppercase text-amber-400">Under Review</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {stats?.reviewCount || 0}
            </div>
            <span className="text-[10px] text-amber-400">Pending clearance</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-blue-500/20">
            <span className="text-[10px] font-mono uppercase text-cyan-400">Security Score</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
              {stats?.securityScore || 87}/100
            </div>
            <Link to="/merchant/security" className="text-[10px] text-cyan-400 hover:underline">
              Inspect Health →
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4">
              Revenue Volume Flow (₹)
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics?.volumeTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="volume" name="Revenue (₹)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4">
              Payment Rail Breakdown
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.methodBreakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="method" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Bar dataKey="total" name="Transactions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white light:text-slate-900">
              Recent Inflow Transactions
            </h3>
            <Link
              to="/merchant/payments"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All Payments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Payment ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
                {payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-800/20">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-200 light:text-slate-800">
                      {p.paymentId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 light:text-slate-700">
                      {p.customerName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white light:text-slate-900">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{p.method}</td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to={`/security/investigation/${p.paymentId}`}
                        className="text-cyan-400 hover:underline text-[11px]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Order Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="p-6 rounded-3xl bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200">
                <h3 className="text-base font-bold text-white light:text-slate-900">
                  Generate Sandbox Order
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {!createdOrder ? (
                <form onSubmit={handleCreateOrder} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                      Order Amount (INR)
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-700 text-xs text-white light:text-slate-900 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-700 text-xs text-white light:text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-700 text-xs text-white light:text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                      Product Description
                    </label>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-700 text-xs text-white light:text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all"
                  >
                    Generate Order ID
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    Order generated: {createdOrder.orderId}
                  </div>
                  <p className="text-xs text-slate-300">
                    Your customer can now pay ₹{createdOrder.amount.toLocaleString()} through the sandbox checkout.
                  </p>
                  <Link
                    to={`/checkout/${createdOrder.orderId}`}
                    onClick={() => setIsModalOpen(false)}
                    className="block w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Open Live Checkout Screen →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
