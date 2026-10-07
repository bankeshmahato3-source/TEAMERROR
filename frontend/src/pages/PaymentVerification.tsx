import React, { useState } from 'react';
import api from '../services/api';
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertOctagon,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Link } from 'react-router-dom';

export const PaymentVerification: React.FC = () => {
  const [identifier, setIdentifier] = useState('pay_PF800055');
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setVerification(null);

    try {
      const res = await api.get(`/verify/${identifier.trim()}`);
      if (res.data.success) {
        setVerification(res.data.verification);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Verification failed. Ensure this is an authentic PayGuard sandbox reference ID.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-mono font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Transaction Audit Gateway</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Payment & Receipt Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Verify the authenticity, fraud risk clearance, and ledger status of any PayGuard sandbox transaction.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-2xl">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
              Enter Payment ID (e.g. pay_PF800055) or Order ID (e.g. order_PF100055):
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="pay_PF..."
                className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Quick Test IDs:</span>
            <button
              type="button"
              onClick={() => {
                setIdentifier('pay_PF800055');
              }}
              className="text-cyan-400 hover:underline font-mono"
            >
              pay_PF800055 (Clean)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setIdentifier('pay_PF800049');
              }}
              className="text-rose-400 hover:underline font-mono"
            >
              pay_PF800049 (Blocked)
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Verification Result Receipt */}
      {verification && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800 light:border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  OFFICIAL SANDBOX RECEIPT
                </span>
                <StatusBadge status={verification.status} />
              </div>
              <h2 className="text-xl font-bold text-white light:text-slate-900 mt-1">
                ₹{verification.amount.toLocaleString()} {verification.currency}
              </h2>
              <span className="text-xs text-slate-400">Paid to {verification.merchantName}</span>
            </div>

            <div className="text-right">
              <RiskBadge level={verification.riskLevel} score={verification.riskScore} />
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {new Date(verification.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-100">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Payment ID</span>
              <span className="font-mono font-bold text-slate-200 light:text-slate-800 mt-0.5 block truncate">
                {verification.paymentId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-100">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Order ID</span>
              <span className="font-mono font-bold text-slate-200 light:text-slate-800 mt-0.5 block truncate">
                {verification.orderId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-100">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Payer Identity</span>
              <span className="font-medium text-slate-200 light:text-slate-800 mt-0.5 block truncate">
                {verification.customerName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-100">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Payment Method</span>
              <span className="font-mono font-bold text-slate-200 light:text-slate-800 mt-0.5 block">
                {verification.method}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 light:text-blue-900 text-xs flex items-center justify-between">
            <span>{verification.disclaimer}</span>
            <Link
              to={`/security/investigation/${verification.paymentId}`}
              className="text-cyan-400 font-bold hover:underline shrink-0 ml-2"
            >
              SOC Telemetry →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
