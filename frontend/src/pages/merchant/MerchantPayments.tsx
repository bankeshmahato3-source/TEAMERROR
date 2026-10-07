import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import {
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { IPayment } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { StatusBadge } from '../../components/common/StatusBadge';

export const MerchantPayments: React.FC = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  // Refund Modal State
  const [refundPayment, setRefundPayment] = useState<IPayment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer return');
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/payments?status=${status}&search=${search}&limit=50`);
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [status]);

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundPayment) return;

    try {
      const res = await api.post(`/payments/${refundPayment.paymentId}/refund`, {
        amount: Number(refundAmount) || refundPayment.amount,
        reason: refundReason,
      });
      if (res.data.success) {
        setRefundMsg(`Refund of ₹${res.data.refund.amount} completed!`);
        fetchPayments();
        setTimeout(() => {
          setRefundPayment(null);
          setRefundMsg(null);
        }, 1500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Refund failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white light:text-slate-900">
              Transaction Surveillance Ledger
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Full audit trail of customer payments, risk telemetry, and refund state machines.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPayments();
            }}
            className="relative flex-1"
          >
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Payment ID, Order ID, Customer, Merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
            />
          </form>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none"
            >
              <option value="All">All Transactions</option>
              <option value="SUCCESS">Successful</option>
              <option value="BLOCKED">Fraud Blocked</option>
              <option value="REVIEW">Under Review</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Declined</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-3 px-3">Payment ID</th>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {payments.map((p) => (
                <tr key={p.paymentId} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono font-medium text-slate-200 light:text-slate-800">
                    {p.paymentId}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{p.orderId}</td>
                  <td className="py-3 px-3 text-slate-300 light:text-slate-700">
                    <div className="font-medium">{p.customerName}</div>
                    <div className="text-[10px] text-slate-500">{p.customerEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white light:text-slate-900">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{p.method}</td>
                  <td className="py-3 px-3">
                    <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] font-mono">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'SUCCESS' && (
                        <button
                          onClick={() => {
                            setRefundPayment(p);
                            setRefundAmount(String(p.amount));
                          }}
                          className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[11px] font-medium"
                        >
                          Refund
                        </button>
                      )}
                      <Link
                        to={`/security/investigation/${p.paymentId}`}
                        className="p-1 rounded-lg hover:bg-slate-800 text-cyan-400"
                        title="Forensic Audit"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Refund Modal */}
        {refundPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-700 max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">Process Sandbox Refund</h3>
                <button
                  onClick={() => setRefundPayment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {refundMsg ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
                  {refundMsg}
                </div>
              ) : (
                <form onSubmit={handleRefundSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400">Payment ID:</span>
                    <div className="font-mono font-bold text-white mt-0.5">
                      {refundPayment.paymentId}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Refund Amount (Max ₹{refundPayment.amount.toLocaleString()}):
                    </label>
                    <input
                      type="number"
                      max={refundPayment.amount}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Reason for Return:
                    </label>
                    <input
                      type="text"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                  >
                    Execute Sandbox Refund
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
