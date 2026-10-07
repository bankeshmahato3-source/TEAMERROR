import React from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Webhook,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MerchantSecurity: React.FC = () => {
  const breakdown = [
    { title: 'Payment Security', score: 94, max: 100, desc: 'TLS encryption & sandbox tokenization active' },
    { title: 'Account Security', score: 88, max: 100, desc: 'Role-based access & salted bcrypt hashing' },
    { title: 'Fraud Rate Control', score: 82, max: 100, desc: 'Heuristic thresholds blocking velocity attacks' },
    { title: 'API Security', score: 90, max: 100, desc: 'Restricted secret prefixes & rate limiting enabled' },
    { title: 'Webhook Security', score: 85, max: 100, desc: 'HMAC payload signing verified' },
  ];

  const recommendations = [
    {
      title: 'Enable Webhook HMAC Signature Verification',
      desc: 'Verify the x-payguard-signature header on incoming callbacks to prevent spoofing.',
      action: 'Configure Webhooks',
      to: '/merchant/webhooks',
    },
    {
      title: 'Rotate Stale Sandbox API Keys',
      desc: 'Keys older than 90 days should be rotated to maintain credential hygiene.',
      action: 'Manage Keys',
      to: '/merchant/api-keys',
    },
    {
      title: 'Review Flagged Under-Review Payments in SOC',
      desc: '3 payments currently await security analyst clearance before settlement.',
      action: 'Open Security SOC',
      to: '/security',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Merchant Security & Compliance Scorecard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous health audit analyzing payment posture, API safety, and fraud resistance.
          </p>
        </div>

        {/* Big Scorecard Banner */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PAYGUARD SECURITY RATING
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900">
              Grade: <span className="text-emerald-400">A (EXCELLENT)</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-600 max-w-md">
              Your merchant profile exhibits robust defense against automated bot attacks, low dispute ratios, and secure API key controls.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400">Security Score</span>
            <div className="text-5xl font-black font-mono text-cyan-400 mt-1">
              87<span className="text-lg text-slate-500">/100</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">✓ Sandbox Verified</div>
          </div>
        </div>

        {/* Pillar Breakdown Bars */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 light:border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            Security Dimension Breakdown
          </h3>

          <div className="space-y-4">
            {breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 light:text-slate-800">
                    {item.title}
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{item.score}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Recommendations List */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 light:border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Recommended Hardening Actions</span>
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 light:bg-slate-100 border border-slate-800 light:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white light:text-slate-900">{rec.title}</h4>
                  <p className="text-[11px] text-slate-400 light:text-slate-600 mt-0.5">{rec.desc}</p>
                </div>
                <Link
                  to={rec.to}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-400 border border-blue-500/30 font-semibold shrink-0 transition-colors"
                >
                  {rec.action} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
