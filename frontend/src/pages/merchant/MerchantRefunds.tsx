import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { RotateCcw, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { IRefund } from '../../types';

export const MerchantRefunds: React.FC = () => {
  const [refunds, setRefunds] = useState<IRefund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/payments?status=REFUNDED');
        if (res.data.success) {
          // Re-format payments that have refund state
          const list = res.data.payments.map((p: any, idx: number) => ({
            id: `ref_${p.paymentId}`,
            refundId: `ref_PF${p.paymentId.replace('pay_PF', '')}`,
            paymentId: p.paymentId,
            orderId: p.orderId,
            merchantId: p.merchantId,
            amount: p.refundedAmount || p.amount,
            currency: p.currency,
            reason: 'Customer initiated return within warranty window',
            type: 'FULL' as const,
            status: 'PROCESSED' as const,
            createdAt: p.createdAt,
          }));
          setRefunds(list);
        }
      } catch (err) {
        console.error('Failed to load refunds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalRefunded = refunds.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Refunds & Return Disbursements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sandbox refund ledger syncing payment reverse state machines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Refunded</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              ₹{totalRefunded.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Reverse settlements</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400">Refund Count</span>
            <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
              {refunds.length}
            </div>
            <span className="text-[10px] text-slate-500">Processed successfully</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-emerald-500/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Dispute Ratio</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              0.00%
            </div>
            <span className="text-[10px] text-emerald-500">Within Visa/Mastercard thresholds</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4">
            Refunds Journal ({refunds.length})
          </h3>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Refund ID</th>
                <th className="py-2.5 px-3">Payment ID</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {refunds.map((r) => (
                <tr key={r.refundId} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono font-medium text-purple-400">
                    {r.refundId}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300 light:text-slate-700">
                    {r.paymentId}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white light:text-slate-900">
                    ₹{r.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{r.reason}</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400">{r.type}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
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
