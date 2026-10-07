import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  Info,
  ExternalLink,
} from 'lucide-react';
import { IOrder, IPayment, IFraudAnalysis } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const Checkout: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment form states
  const [method, setMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('customer@payguard');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('PayGuard Cash');

  // Simulation flags for demo testing
  const [simulateTorIp, setSimulateTorIp] = useState(false);
  const [simulateSpikeAmount, setSimulateSpikeAmount] = useState(false);

  // Processing & Result states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    payment: IPayment;
    fraudAnalysis: IFraudAnalysis;
  } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const effectiveId = orderId || 'order_PF100001';
        const res = await api.get(`/orders/${effectiveId}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err: any) {
        // Fallback default demo order if not found
        setOrder({
          id: 'ord_default',
          orderId: orderId || 'order_PF100001',
          merchantId: 'merch_01',
          merchantName: 'NovaTech Electronics Sandbox Store',
          merchantCategory: 'Electronics & Hardware',
          amount: 4999,
          currency: 'INR',
          customerName: 'Rahul Verma',
          customerEmail: 'rahul.verma@example.com',
          description: 'NovaTech Gaming Headset Pro 7.1',
          status: 'created',
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const effectiveAmount = simulateSpikeAmount ? order.amount + 45000 : order.amount;
      const clientIp = simulateTorIp ? '185.220.101.5' : '157.34.120.45';

      const res = await api.post('/payments', {
        orderId: order.orderId,
        method,
        upiId: method === 'UPI' ? upiId : undefined,
        cardLast4: method === 'Card' ? cardNumber.slice(-4) : undefined,
        bankName: method === 'Net Banking' ? selectedBank : undefined,
        walletProvider: method === 'Wallet' ? selectedWallet : undefined,
        clientIp,
        device: 'MacBook Pro 16" (Sandbox Telemetry)',
        browser: 'Chrome 122.0',
        location: simulateTorIp ? 'Frankfurt, Germany' : 'Bengaluru, India',
      });

      if (res.data.success) {
        setPaymentResult({
          payment: res.data.payment,
          fraudAnalysis: res.data.fraudAnalysis,
        });

        // Trigger celebratory confetti if payment was allowed
        if (res.data.payment.status === 'SUCCESS') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment simulation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sandbox Warning Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 light:text-amber-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-bold">SANDBOX MODE:</strong> No real money is processed. Never enter real UPI PINs, CVVs, or bank passwords.
          </span>
        </div>
        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 shrink-0 hidden sm:inline">
          TEST RUNNER
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary Column */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500">Order Reference</span>
            <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">
              {order?.orderId}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 light:border-slate-200">
            <span className="text-xs text-slate-400">Merchant</span>
            <div className="text-sm font-semibold text-white light:text-slate-900 mt-0.5">
              {order?.merchantName}
            </div>
            {order?.merchantCategory && (
              <span className="text-[11px] text-slate-500">{order.merchantCategory}</span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 light:border-slate-200">
            <span className="text-xs text-slate-400">Customer</span>
            <div className="text-xs font-medium text-slate-200 light:text-slate-800 mt-0.5">
              {order?.customerName}
            </div>
            <div className="text-[11px] text-slate-500">{order?.customerEmail}</div>
          </div>

          <div className="pt-3 border-t border-slate-800 light:border-slate-200">
            <span className="text-xs text-slate-400">Amount Due</span>
            <div className="text-2xl font-extrabold text-white light:text-slate-900 font-mono mt-0.5">
              ₹{(order?.amount || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Instant Clearing</span>
            </div>
          </div>

          {/* Optional Attack Trigger Toggles for live testing */}
          <div className="pt-4 border-t border-slate-800 light:border-slate-200 space-y-2">
            <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
              Demo Threat Injections
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 light:text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateTorIp}
                onChange={(e) => setSimulateTorIp(e.target.checked)}
                className="rounded accent-blue-500"
              />
              <span>Simulate Proxy / Tor Exit IP</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 light:text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateSpikeAmount}
                onChange={(e) => setSimulateSpikeAmount(e.target.checked)}
                className="rounded accent-blue-500"
              />
              <span>Simulate High Spike (+₹45,000)</span>
            </label>
          </div>
        </div>

        {/* Payment Gateway Main Box */}
        <div className="md:col-span-2">
          {!paymentResult ? (
            <div className="p-6 rounded-2xl glass-card border border-blue-500/20 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white light:text-slate-900">
                      PayGuard Sandbox Checkout
                    </h3>
                    <p className="text-[11px] text-slate-400">Razorpay-inspired safe educational portal</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit Mock TLS</span>
                </div>
              </div>

              {/* Payment Rail Selector Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { id: 'UPI', label: 'UPI / VPA', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building2 },
                  { id: 'Wallet', label: 'Wallet', icon: Wallet },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = method === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMethod(tab.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-cyan-400 glow-blue font-semibold'
                          : 'bg-slate-900/60 light:bg-slate-100 border-slate-800 light:border-slate-300 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handlePay} className="space-y-5">
                {/* UPI Panel */}
                {method === 'UPI' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1.5">
                        Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. user@payguard"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs font-mono focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    {/* Quick test scenario chips */}
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5">
                        Quick Autofill Test Identities:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'success@payguard', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
                          { id: 'fraud@payguard', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
                          { id: 'pending@payguard', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
                          { id: 'failed@payguard', color: 'border-slate-700 text-slate-400 bg-slate-800' },
                        ].map((chip) => (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => setUpiId(chip.id)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all hover:scale-105 ${chip.color}`}
                          >
                            {chip.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Panel */}
                {method === 'Card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1">
                        Simulated Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-1">
                          CVV (Simulated)
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {method === 'Net Banking' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-2">
                      Select Sandbox Bank Switch
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                            selectedBank === b
                              ? 'bg-blue-600/20 border-blue-500 text-cyan-400'
                              : 'bg-slate-900/60 light:bg-white border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-700'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wallet */}
                {method === 'Wallet' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 light:text-slate-700 mb-2">
                      Select Sandbox Wallet
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['PayGuard Cash', 'PhonePe Sandbox', 'Paytm Sandbox'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedWallet(w)}
                          className={`p-3 rounded-xl border text-xs text-center font-medium transition-all ${
                            selectedWallet === w
                              ? 'bg-blue-600/20 border-blue-500 text-cyan-400'
                              : 'bg-slate-900/60 light:bg-white border-slate-700 light:border-slate-300 text-slate-300 light:text-slate-700'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Telemetry & Risk Scoring...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Simulate Payment of ₹{(order?.amount || 0).toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Post-Payment Result Receipt & Explainability Breakdown */
            <div className="p-6 rounded-2xl glass-card border border-blue-500/30 shadow-2xl space-y-6">
              <div className="text-center pb-4 border-b border-slate-800 light:border-slate-200">
                <div className="mb-2">
                  <StatusBadge status={paymentResult.payment.status} />
                </div>
                <h3 className="text-xl font-bold text-white light:text-slate-900">
                  {paymentResult.payment.status === 'SUCCESS'
                    ? 'Payment Authorized & Completed'
                    : paymentResult.payment.status === 'BLOCKED'
                    ? 'Payment Blocked by PayGuard Fraud Engine'
                    : 'Payment Flagged for Manual Review'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Payment Reference: {paymentResult.payment.paymentId}
                </p>
              </div>

              {/* Risk Engine Scorecard Card */}
              <div className="p-4 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Calculated Risk Score
                  </span>
                  <div className="text-2xl font-black font-mono text-white light:text-slate-900 mt-0.5">
                    {paymentResult.fraudAnalysis.riskScore}
                    <span className="text-sm text-slate-500 font-normal">/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <RiskBadge
                    level={paymentResult.fraudAnalysis.riskLevel}
                    score={paymentResult.fraudAnalysis.riskScore}
                  />
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Decision: {paymentResult.fraudAnalysis.recommendation}
                  </div>
                </div>
              </div>

              {/* Explainability Section: WHY was this transaction flagged? */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 light:text-slate-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explainable AI Risk Factors:</span>
                </h4>
                <ul className="space-y-1.5 text-xs">
                  {paymentResult.fraudAnalysis.reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-900/60 light:bg-slate-200/60 border border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 flex items-start gap-2"
                    >
                      <span className="text-cyan-400 font-bold shrink-0">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={`/security/investigation/${paymentResult.payment.paymentId}`}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold text-center border border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Inspect in SOC Investigation</span>
                </Link>

                <Link
                  to={`/verify`}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Receipt</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setPaymentResult(null)}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center transition-all"
                >
                  Retry Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
