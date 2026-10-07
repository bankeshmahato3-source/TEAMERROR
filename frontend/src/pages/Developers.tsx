import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Key, Webhook, Code, BookOpen, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export const Developers: React.FC = () => {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>PayGuard Developer Platform</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Developer Hub & Sandbox APIs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Integrate simulated checkouts, stream fraud webhooks, and query AI risk scores with our REST API.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/documentation"
          className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-2xl bg-blue-600/20 text-cyan-400 w-fit mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">API Documentation</h3>
            <p className="text-xs text-slate-400 mt-2">
              Explore endpoints for orders, transactions, UPI scanning, and sandbox refunds with cURL snippets.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 mt-6 flex items-center gap-1">
            Browse Specs →
          </span>
        </Link>

        <Link
          to="/merchant/api-keys"
          className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-2xl bg-blue-600/20 text-cyan-400 w-fit mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">Sandbox API Keys</h3>
            <p className="text-xs text-slate-400 mt-2">
              Generate secret tokens prefixed with <code className="text-cyan-400">pf_test_...</code> to authenticate backend orders.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 mt-6 flex items-center gap-1">
            Manage Keys →
          </span>
        </Link>

        <Link
          to="/merchant/webhooks"
          className="p-6 rounded-3xl glass-card border border-blue-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-3 rounded-2xl bg-blue-600/20 text-cyan-400 w-fit mb-4">
              <Webhook className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white light:text-slate-900">Webhooks System</h3>
            <p className="text-xs text-slate-400 mt-2">
              Configure endpoints to receive asynchronous alerts for events like <code className="text-rose-400">fraud.detected</code>.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 mt-6 flex items-center gap-1">
            Configure Webhooks →
          </span>
        </Link>
      </div>
    </div>
  );
};
