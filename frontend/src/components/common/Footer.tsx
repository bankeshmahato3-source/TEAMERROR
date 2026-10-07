import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Terminal, BookOpen, AlertOctagon, Heart, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 light:border-slate-200 bg-[#070A12] light:bg-slate-50 transition-colors pt-12 pb-8 text-slate-400 light:text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white light:text-slate-900">PayGuard</span>
            </div>
            <p className="text-slate-400 light:text-slate-600 leading-relaxed text-xs max-w-sm">
              Secure every payment. Detect every threat. An intelligent fintech sandbox combining simulated payment processing with explainable real-time fraud defense.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>B.Tech CSE Cybersecurity Capstone Project</span>
            </div>
          </div>

          {/* Column 1: Core Platform */}
          <div>
            <h4 className="text-white light:text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">
              Core Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-cyan-400 transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link to="/fraud-detection" className="hover:text-cyan-400 transition-colors">
                  Fraud Detection Engine
                </Link>
              </li>
              <li>
                <Link to="/checkout/order_PF100001" className="hover:text-cyan-400 transition-colors">
                  Sandbox Checkout Modal
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-cyan-400 transition-colors">
                  Security Operations (SOC)
                </Link>
              </li>
              <li>
                <Link to="/merchant" className="hover:text-cyan-400 transition-colors">
                  Merchant Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Threat & Scam Defense */}
          <div>
            <h4 className="text-white light:text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">
              Scam & Threat Defense
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/upi-check" className="hover:text-cyan-400 transition-colors">
                  Fake UPI & Link Scanner
                </Link>
              </li>
              <li>
                <Link to="/scam-demo" className="hover:text-cyan-400 transition-colors">
                  Fake Payment Page Demo
                </Link>
              </li>
              <li>
                <Link to="/scam-awareness" className="hover:text-cyan-400 transition-colors">
                  UPI Scam Awareness Guide
                </Link>
              </li>
              <li>
                <Link to="/upi-security" className="hover:text-cyan-400 transition-colors">
                  Safe UPI Standards
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-cyan-400 transition-colors">
                  Public Payment Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers & Docs */}
          <div>
            <h4 className="text-white light:text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider">
              Integration & Docs
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/developers" className="hover:text-cyan-400 transition-colors">
                  Developer Hub
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="hover:text-cyan-400 transition-colors">
                  REST API Documentation
                </Link>
              </li>
              <li>
                <Link to="/merchant/api-keys" className="hover:text-cyan-400 transition-colors">
                  API Key Management
                </Link>
              </li>
              <li>
                <Link to="/merchant/webhooks" className="hover:text-cyan-400 transition-colors">
                  Webhook Event Dispatcher
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">
                  Project Mission & Ethics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Sandbox Disclosure */}
        <div className="pt-6 border-t border-slate-800/80 light:border-slate-200">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 light:text-amber-800 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold uppercase tracking-wider">Strict Sandbox & Defensive Policy: </span>
              PayGuard is strictly an educational cybersecurity simulation tool. It does not process real monetary payments, connect to commercial banking switches, or store real credit card numbers, CVVs, or UPI PINs. Phishing demonstrations use synthetic sandbox indicators for defensive awareness and educational analysis only.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-slate-500 text-[11px]">
            <div>
              © 2026 PayGuard Sandbox. Developed for Academic Research & Demonstration.
            </div>
            <div className="flex items-center gap-4">
              <span>React • Vite • TypeScript • Tailwind • Node.js</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-medium">Defense Engine v2.4 Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
