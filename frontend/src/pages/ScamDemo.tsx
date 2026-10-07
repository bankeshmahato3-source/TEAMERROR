import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Flame,
  Clock,
  ShieldAlert,
  HelpCircle,
  Eye,
  Info,
  CheckCircle,
  XCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScamDemo: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(285);
  const [activePin, setActivePin] = useState<number | null>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const redFlags = [
    {
      id: 1,
      title: 'Deceptive Spoofed Domain & Unofficial TLD',
      summary: 'The browser URL displays "paytm-kyc-refund.xyz" instead of the verified domain "paytm.com".',
      explanation: 'Scammers register cheap, throwaway domains (.xyz, .top, .buzz) and include legitimate brand names with hyphens to confuse victims who glance quickly.',
    },
    {
      id: 2,
      title: 'Artificial Panic Countdown Timer',
      summary: 'A flashing countdown warns: "Your account will be frozen in 04:45".',
      explanation: 'Psychological urgency prevents the victim from contacting their bank or checking the URL carefully. High pressure forces hasty, uncritical compliance.',
    },
    {
      id: 3,
      title: 'Collect-Request Disguised as a Refund',
      summary: 'The page claims: "Enter your UPI PIN to claim ₹12,500 pending refund".',
      explanation: 'FUNDAMENTAL RULE OF UPI: You NEVER need to enter your UPI PIN to receive or claim money! An entry of your UPI PIN authorizes a debit from your bank account.',
    },
    {
      id: 4,
      title: 'Impersonation of Regulatory & Bank Seals',
      summary: 'Spoofed RBI, NPCI, and bank logos pasted without legitimate cryptographic origin.',
      explanation: 'Bad actors copy high-resolution logos from the web to create an illusion of institutional authority and trustworthiness.',
    },
  ];

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Educational Banner */}
      <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 flex items-start gap-3 glow-red">
        <Flame className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider">
            EDUCATIONAL SIMULATION — DEFENSIVE TRAINING LABORATORY
          </h2>
          <p className="text-xs text-rose-200 mt-0.5 leading-relaxed">
            This page visually deconstructs how social engineering and phishing portals deceive victims. PayGuard collects zero data. Click on the numbered red inspection pins to analyze each deceptive mechanism.
          </p>
        </div>
      </div>

      {/* Interactive Mock Browser Frame */}
      <div className="rounded-3xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
        {/* Browser Top Chrome */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>

          {/* Fake URL Bar with Pin 1 */}
          <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/50 text-xs font-mono text-rose-300">
            <div className="flex items-center gap-2 truncate">
              <span className="text-rose-500 font-bold">⚠️ NOT SECURE</span>
              <span className="truncate">https://paytm-security-kyc-verify.xyz/collect-refund</span>
            </div>
            <button
              onClick={() => setActivePin(1)}
              className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-pulse ml-2"
            >
              Pin #1
            </button>
          </div>
        </div>

        {/* Spoofed Page Body */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative">
          {/* Urgency Countdown Bar with Pin 2 */}
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500 text-rose-200 flex items-center justify-between text-xs mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400 animate-spin" />
              <span className="font-bold">
                URGENT NOTICE: Complete verification within{' '}
                <span className="font-mono text-rose-400 text-sm">{formatTime(secondsLeft)}</span> or your bank account will be frozen!
              </span>
            </div>
            <button
              onClick={() => setActivePin(2)}
              className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] shrink-0"
            >
              Pin #2
            </button>
          </div>

          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-5 text-center">
            {/* Spoofed Logos with Pin 4 */}
            <div className="relative">
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-blue-600 font-black text-white text-xs tracking-wider">
                  PAYTM
                </span>
                <span className="text-xs font-bold text-slate-400">×</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-600 font-black text-white text-xs">
                  NPCI VERIFIED
                </span>
              </div>
              <button
                onClick={() => setActivePin(4)}
                className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] animate-bounce"
              >
                Pin #4
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Pending Cashback Refund: ₹12,500</h3>
              <p className="text-xs text-slate-400 mt-1">
                Approved by NPCI Central Clearing Switch
              </p>
            </div>

            {/* Collect Request Bait with Pin 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 text-left space-y-3 relative">
              <button
                onClick={() => setActivePin(3)}
                className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]"
              >
                Pin #3
              </button>

              <label className="block text-xs font-medium text-slate-300">
                Enter your UPI ID to receive instant credit:
              </label>
              <input
                type="text"
                disabled
                value="your-name@oksbi"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs font-mono"
              />

              <div className="text-[11px] text-rose-400 font-medium">
                ⚠️ Pop-up prompt will ask for 4/6-Digit UPI PIN to approve transfer.
              </div>

              <div className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs text-center cursor-not-allowed opacity-90">
                Approve & Receive ₹12,500 Refund Now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flag Explanatory Inspector Drawer */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30">
        <h3 className="text-base font-bold text-white light:text-slate-900 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Interactive Red Flag Inspector Dossier:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {redFlags.map((flag) => (
            <button
              key={flag.id}
              onClick={() => setActivePin(flag.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activePin === flag.id
                  ? 'bg-rose-500/20 border-rose-500 text-white glow-red font-semibold'
                  : 'bg-slate-900/60 light:bg-white border-slate-800 light:border-slate-300 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-rose-400 font-bold">PIN #{flag.id}</div>
              <div className="text-xs font-bold mt-1 line-clamp-1">{flag.title}</div>
            </button>
          ))}
        </div>

        {activePin && (
          <div className="p-4 rounded-2xl bg-slate-900/90 light:bg-slate-100 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold mb-1">
              <span>ANALYSIS FOR PIN #{activePin}:</span>
              <span>{redFlags[activePin - 1].title}</span>
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
              {redFlags[activePin - 1].explanation}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between text-xs pt-4 border-t border-slate-800 light:border-slate-200">
          <span className="text-slate-400">
            Want to see how to protect yourself against all 10 common scams?
          </span>
          <Link
            to="/scam-awareness"
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <span>Read Scam Awareness Center Guide →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
