import React, { useState } from 'react';
import api from '../services/api';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Link2,
  QrCode,
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const UpiCheck: React.FC = () => {
  const [target, setTarget] = useState('https://paytm-refund-claim-bonus.xyz/claim?urgent=1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (queryTarget?: string) => {
    const toScan = queryTarget || target;
    if (!toScan.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/upi/check', { target: toScan.trim() });
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Scan evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  const sampleTargets = [
    { label: 'Phishing: Paytm Spoof Link', val: 'https://paytm-refund-claim-bonus.xyz/claim?urgent=1' },
    { label: 'Scam: Fake Customer Care VPA', val: 'customer-care-help@payguard' },
    { label: 'Threat: Raw IP Payment Host', val: 'http://185.220.101.5/sbi-kyc-verify' },
    { label: 'Clean: Verified UPI Merchant', val: 'success@payguard' },
    { label: 'Clean: Genuine Store Gateway', val: 'https://novatech-electronics.demo/checkout' },
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>Defensive Link & VPA Inspection Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Fake UPI & Payment Link Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Verify suspicious payment URLs, QR payload links, or Virtual Payment Addresses (VPAs) before sending funds or sharing credentials.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
              Enter Sandbox Payment URL or UPI ID to Inspect:
            </label>
            <div className="relative">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. https://fake-pay.xyz/collect or helpdesk@fraudupi"
                className="w-full pl-4 pr-28 py-3.5 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-700 light:border-slate-300 text-white light:text-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Scan Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">
              Test Presets (Click to analyze):
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleTargets.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTarget(s.val);
                    handleScan(s.val);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 light:bg-slate-200 border border-slate-700 light:border-slate-300 text-[11px] text-slate-300 light:text-slate-800 hover:border-cyan-500 transition-all font-mono"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/30 shadow-2xl space-y-6">
          {/* Top Headline & Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 light:border-slate-200">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Security Analysis Report
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white light:text-slate-900 mt-1">
                {result.recommendation}
              </h2>
              <p className="text-xs text-slate-300 light:text-slate-700 mt-1 max-w-xl">
                {result.summary}
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div
                className={`text-4xl sm:text-5xl font-black font-mono ${
                  result.riskScore >= 80
                    ? 'text-rose-400'
                    : result.riskScore >= 60
                    ? 'text-orange-400'
                    : result.riskScore >= 30
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.riskScore}
                <span className="text-lg text-slate-500">/100</span>
              </div>
              <div className="mt-1">
                <RiskBadge level={result.riskLevel} />
              </div>
            </div>
          </div>

          {/* Scam Category & Impersonation Alert Banner */}
          {(result.brandImpersonationDetected || result.scamCategory) && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <Flame className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <div className="text-xs space-y-1">
                <div className="font-bold uppercase tracking-wider">
                  Critical Threat Signature Detected:
                </div>
                {result.brandImpersonationDetected && (
                  <div>
                    • Impersonating Official Brand:{' '}
                    <strong className="underline">{result.brandImpersonationDetected}</strong>
                  </div>
                )}
                {result.scamCategory && (
                  <div>• Identified Threat Vector: <strong>{result.scamCategory}</strong></div>
                )}
              </div>
            </div>
          )}

          {/* Itemized Security Indicators Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 light:text-slate-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspection Indicators & Rule Audits:</span>
            </h3>

            <div className="space-y-2.5">
              {result.indicators.map((ind: any, idx: number) => {
                const isPass = ind.status === 'PASS';
                const isFail = ind.status === 'FAIL';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                      isPass
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300 light:text-slate-700'
                        : isFail
                        ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
                        : 'bg-amber-500/10 border-amber-500/25 text-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isFail ? (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white light:text-slate-900">{ind.name}</div>
                        <div className="text-[11px] opacity-80 mt-0.5">{ind.detail}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                        isPass
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isFail
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ind.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Defensive Recommendation Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs">
            <h4 className="font-bold text-slate-200 light:text-slate-800 mb-1">
              Safety Advice & Verification Protocol:
            </h4>
            <p className="text-slate-400 light:text-slate-600 leading-relaxed">
              Remember: Legitimate banks and e-commerce companies never require you to enter your UPI PIN to claim cashbacks, refunds, or lottery prizes. If a link urges immediate action with an expiry countdown, do not interact or scan the QR.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
