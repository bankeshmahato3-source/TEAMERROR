import React from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UpiSecurity: React.FC = () => {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NPCI Architectural Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Safe UPI Protocol & Security Standards
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          An engineering breakdown of how Unified Payments Interface (UPI) guarantees safety, why PIN security is paramount, and how defensive protocols prevent unauthorized access.
        </p>
      </div>

      {/* The Golden Rule Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/40 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
            THE NON-NEGOTIABLE LAW OF UPI
          </span>
          <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
            UPI PIN is ONLY required to SEND money. NEVER to RECEIVE money.
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            If anyone asks you to enter your PIN to claim a lottery, accept a refund, or verify a cashback, it is 100% a fraudulent collect request!
          </p>
        </div>
        <Link
          to="/upi-check"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
        >
          Verify a UPI ID Now
        </Link>
      </div>

      {/* UPI Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            Hardware SIM Binding
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
            UPI applications bind cryptographically to the registered SIM card inside the phone. If a bad actor clones your app or logs in on another phone without the physical SIM, authentication fails automatically.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            Encrypted MPIN Keyboard
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
            The UPI MPIN entry screen is rendered by a secure system sandbox container provided directly by the bank switch. Third-party apps cannot record or screenshot the PIN keyboard.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            End-to-End Signed Intent
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
            Dynamic payment QR codes contain digital signatures that link the merchant ID and amount securely. PayGuard’s scanner audits these intent parameters to detect tampering.
          </p>
        </div>
      </div>

      {/* Safety Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 light:border-slate-200">
        <h3 className="text-base font-bold text-white light:text-slate-900 mb-4">
          Consumer Best Practices Checklist:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            'Always inspect the payee name on your banking screen before authorizing',
            'Never approve a UPI collect notification that you did not initiate',
            'Keep your UPI transaction limit set to what you typically spend per day',
            'Never share your screen over AnyDesk or TeamViewer with customer support',
            'Avoid linking your primary savings account holding large balances to UPI',
            'Use biometric app locks on all payment apps (FaceID or Fingerprint)',
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 light:bg-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300 light:text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
