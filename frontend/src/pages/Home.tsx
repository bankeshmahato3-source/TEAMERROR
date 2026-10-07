import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
  Cpu,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Flame,
  Globe,
  Terminal,
  Store,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { ArchitectureDiagram } from '../components/common/ArchitectureDiagram';
import { RiskBadge } from '../components/common/RiskBadge';

export const Home: React.FC = () => {
  // Mini interactive calculator on homepage
  const [calcAmount, setCalcAmount] = useState<number>(35000);
  const [calcVelocity, setCalcVelocity] = useState<number>(4);
  const [calcIsTor, setCalcIsTor] = useState<boolean>(true);
  const [calcNewDevice, setCalcNewDevice] = useState<boolean>(true);

  // Compute live simulated score
  let previewScore = 10;
  if (calcAmount >= 25000) previewScore += 20;
  if (calcVelocity >= 3) previewScore += 25;
  if (calcIsTor) previewScore += 20;
  if (calcNewDevice) previewScore += 10;
  previewScore = Math.min(100, previewScore);

  const previewLevel =
    previewScore >= 80 ? 'CRITICAL' : previewScore >= 60 ? 'HIGH' : previewScore >= 30 ? 'MEDIUM' : 'LOW';
  const previewAction =
    previewScore >= 80 ? 'BLOCK' : previewScore >= 60 ? 'REVIEW' : previewScore >= 30 ? 'MONITOR' : 'ALLOW';

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>PayGuard Sandbox & Defensive AI Core v2.4</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white light:text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-none">
          Payments protected by{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            intelligent fraud detection.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
          PayGuard combines sandbox payments with real-time risk analysis to demonstrate how modern payment security works. An educational cybersecurity platform built to detect deceptive links, impossible travel, and automated velocity attacks.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/security"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Explore Security SOC</span>
          </Link>

          <Link
            to="/checkout/order_PF100001"
            className="px-6 py-3 rounded-xl bg-slate-800/80 light:bg-slate-200 hover:bg-slate-700 light:hover:bg-slate-300 text-slate-100 light:text-slate-800 font-semibold text-sm border border-slate-700 light:border-slate-300 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Checkout Demo</span>
          </Link>

          <Link
            to="/upi-check"
            className="px-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-sm border border-cyan-500/30 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>UPI Scam Scanner</span>
          </Link>
        </div>

        {/* Real-time stats strip */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl glass-card text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 font-mono">
              56+
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Sandbox Payments</div>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
              18
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Fraud Attacks Blocked</div>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              &lt; 50ms
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Risk Scoring Latency</div>
          </div>
          <div className="p-4 rounded-2xl glass-card text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Explainable Decisions</div>
          </div>
        </div>
      </section>

      {/* Live Interactive Risk Engine Simulator Preview */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/20 relative overflow-hidden">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/20 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Interactive Rule Benchmark Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white light:text-slate-900">
              Test how PayGuard calculates risk in real time
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-600 mt-1">
              Toggle threat parameters below to observe instant score updates, rule triggering, and explainable decision mapping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Input Controls */}
            <div className="lg:col-span-2 space-y-4">
              {/* Amount slider */}
              <div className="p-4 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 light:text-slate-700 font-semibold">
                    Transaction Amount:
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">
                    ₹{calcAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="75000"
                  step="500"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹500 (Standard)</span>
                  <span>₹25,000 (Trigger Ceiling)</span>
                  <span>₹75,000 (Extreme Spike)</span>
                </div>
              </div>

              {/* Velocity slider */}
              <div className="p-4 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 light:text-slate-700 font-semibold">
                    Attempts in last 5 minutes (Velocity):
                  </span>
                  <span className="font-mono text-cyan-400 font-bold">{calcVelocity} attempts</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={calcVelocity}
                  onChange={(e) => setCalcVelocity(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 cursor-pointer">
                  <span className="text-xs text-slate-300 light:text-slate-700 font-medium">
                    Suspicious / Tor Exit Node IP
                  </span>
                  <input
                    type="checkbox"
                    checked={calcIsTor}
                    onChange={(e) => setCalcIsTor(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 cursor-pointer">
                  <span className="text-xs text-slate-300 light:text-slate-700 font-medium">
                    Unrecognized New Device
                  </span>
                  <input
                    type="checkbox"
                    checked={calcNewDevice}
                    onChange={(e) => setCalcNewDevice(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Live Score Output Gauge Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#070A12] light:from-white light:to-slate-100 border border-slate-800 light:border-slate-300 text-center flex flex-col items-center justify-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Risk Engine Calculation
              </div>

              <div
                className={`text-5xl font-black font-mono my-2 ${
                  previewScore >= 80
                    ? 'text-rose-400'
                    : previewScore >= 60
                    ? 'text-orange-400'
                    : previewScore >= 30
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {previewScore}
                <span className="text-lg text-slate-500">/100</span>
              </div>

              <div className="my-2">
                <RiskBadge level={previewLevel} />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 light:border-slate-200 w-full text-xs">
                <div className="text-slate-400">Recommended Action:</div>
                <div
                  className={`font-mono font-bold text-sm uppercase mt-0.5 ${
                    previewAction === 'BLOCK'
                      ? 'text-rose-400'
                      : previewAction === 'REVIEW'
                      ? 'text-orange-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {previewAction}
                </div>
              </div>

              <Link
                to="/fraud-detection"
                className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                Inspect All 7 Rules →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox Test Scenarios Guide */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900">
            Sandbox Test Identities
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
            Use these pre-configured simulated UPI identities on the checkout screen to trigger specific payment outcomes without real banking data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-emerald-400">success@payguard</span>
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-sm font-bold text-white light:text-slate-900">Authorized Payment</div>
            <p className="text-xs text-slate-400 mt-1">
              Simulates a clean transaction with zero threat signals. Results in immediate ALLOW decision.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-rose-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-rose-400">fraud@payguard</span>
              <span className="p-1 rounded-full bg-rose-500/20 text-rose-400">
                <ShieldAlert className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-sm font-bold text-white light:text-slate-900">Blacklisted Threat</div>
            <p className="text-xs text-slate-400 mt-1">
              Triggers maximum risk score (95/100). Triggers critical fraud alert and hard BLOCK gate.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-amber-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-amber-400">pending@payguard</span>
              <span className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-sm font-bold text-white light:text-slate-900">Review Required</div>
            <p className="text-xs text-slate-400 mt-1">
              Simulates ambiguous risk parameters. Marked for manual security analyst inspection.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-400">failed@payguard</span>
              <span className="p-1 rounded-full bg-slate-800 text-slate-400">
                <XCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-sm font-bold text-white light:text-slate-900">Bank Decline</div>
            <p className="text-xs text-slate-400 mt-1">
              Simulates a conventional bank issuer decline (e.g., insufficient sandbox balance).
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArchitectureDiagram />
      </section>

      {/* Feature Teasers Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/upi-check"
            className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 hover:border-cyan-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900 flex items-center justify-between">
              <span>Fake UPI Link Scanner</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
              Scan suspicious payment links, QR codes, and UPI handles for brand impersonation, deceptive TLDs, and fake support phone lures.
            </p>
          </Link>

          <Link
            to="/scam-demo"
            className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 hover:border-rose-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900 flex items-center justify-between">
              <span>Fake Payment Page Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
              Safe educational laboratory demonstrating how scammers construct fake checkout portals with artificial urgency, countdowns, and spoofed logos.
            </p>
          </Link>

          <Link
            to="/scam-awareness"
            className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200 hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900 flex items-center justify-between">
              <span>Scam Awareness Center</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </h3>
            <p className="text-xs text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
              Explore exhaustive defenses for 10 prevalent UPI attacks including collect-request traps, QR code swaps, and remote-desk screen mirroring lures.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};
