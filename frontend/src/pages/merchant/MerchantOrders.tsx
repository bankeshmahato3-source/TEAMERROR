import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { ShoppingCart, Plus, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { IOrder } from '../../types';

export const MerchantOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [amount, setAmount] = useState('1899');
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerEmail, setCustomerEmail] = useState('rahul.verma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 9876543210');
  const [description, setDescription] = useState('Annual Premium Subscription');
  const [createdOrder, setCreatedOrder] = useState<IOrder | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', {
        amount: Number(amount),
        customerName,
        customerEmail,
        customerPhone,
        description,
      });
      if (res.data.success) {
        setCreatedOrder(res.data.order);
        fetchOrders();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order creation failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Order Lifecycle Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate sandbox payment orders and test checkout workflows.
          </p>
        </div>

        {/* Order Creation Card */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Create Sandbox Order</span>
          </h2>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 light:text-slate-700 font-semibold mb-1">
                Amount (INR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 font-mono text-white light:text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 light:text-slate-700 font-semibold mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 text-white light:text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 light:text-slate-700 font-semibold mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 text-white light:text-slate-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 light:text-slate-700 font-semibold mb-1">
                Product / Invoice Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 text-white light:text-slate-900"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md shadow-blue-600/25"
              >
                Create Order (order_PF...)
              </button>
            </div>
          </form>

          {createdOrder && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
              <div>
                Order created: <strong className="font-mono">{createdOrder.orderId}</strong> for ₹{createdOrder.amount}
              </div>
              <Link
                to={`/checkout/${createdOrder.orderId}`}
                className="font-bold underline text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Open Checkout Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4">
            Orders Archive ({orders.length})
          </h3>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Checkout Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {orders.map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono font-medium text-slate-200 light:text-slate-800">
                    {o.orderId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 light:text-slate-700">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-[10px] text-slate-500">{o.customerEmail}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white light:text-slate-900">
                    ₹{o.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">{o.description}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        o.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : o.status === 'refunded'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to={`/checkout/${o.orderId}`}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-mono text-[11px]"
                    >
                      <span>Pay Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
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
