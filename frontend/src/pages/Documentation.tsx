import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Copy,
  Check,
  BookOpen,
  Key,
  Webhook,
  ShieldCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Documentation: React.FC = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/orders',
      title: 'Create Sandbox Order',
      desc: 'Creates a new order payload to initialize a customer checkout experience.',
      curl: `curl -X POST http://localhost:5000/api/orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <JWT_OR_API_KEY>" \\
  -d '{
    "amount": 2499,
    "currency": "INR",
    "customerName": "Aarav Sharma",
    "customerEmail": "aarav.s@example.com",
    "description": "Premium Pro Developer Plan"
  }'`,
      response: `{
  "success": true,
  "order": {
    "orderId": "order_PF928174",
    "amount": 2499,
    "currency": "INR",
    "status": "created"
  }
}`,
    },
    {
      method: 'POST',
      path: '/api/payments',
      title: 'Process Payment & Execute Fraud Engine',
      desc: 'Submits a payment attempt through real-time fraud heuristic rules. Automatically produces 0-100 score and ALLOW/BLOCK decision.',
      curl: `curl -X POST http://localhost:5000/api/payments \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "order_PF928174",
    "method": "UPI",
    "upiId": "success@payguard",
    "clientIp": "157.34.120.45",
    "device": "MacBook Pro 16\\" (Chrome)"
  }'`,
      response: `{
  "success": true,
  "payment": {
    "paymentId": "pay_PF89124",
    "status": "SUCCESS",
    "riskScore": 14,
    "riskLevel": "LOW",
    "recommendation": "ALLOW"
  },
  "fraudAnalysis": {
    "reasons": ["Standard consumer profile within baseline limits"]
  }
}`,
    },
    {
      method: 'POST',
      path: '/api/upi/check',
      title: 'Scan Suspicious Payment Link or VPA',
      desc: 'Inspects a target payment link or UPI handle for phishing indicators, deceptive TLDs, and fake support patterns.',
      curl: `curl -X POST http://localhost:5000/api/upi/check \\
  -H "Content-Type: application/json" \\
  -d '{
    "target": "https://paytm-refund-bonus.xyz/claim"
  }'`,
      response: `{
  "success": true,
  "result": {
    "riskScore": 95,
    "riskLevel": "CRITICAL",
    "recommendation": "DO NOT PROCEED - SCAM DETECTED",
    "brandImpersonationDetected": "Paytm",
    "indicators": [...]
  }
}`,
    },
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>PayGuard REST API Specification v1.0</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Developer & Integration Documentation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Integrate PayGuard’s sandbox payment gateway and fraud detection engine into your applications.
        </p>
      </div>

      {/* Quick Links Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/merchant/api-keys"
          className="p-5 rounded-2xl glass-card border border-blue-500/30 hover:border-blue-400 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white light:text-slate-900">
                Generate Sandbox API Keys
              </div>
              <div className="text-xs text-slate-400">Manage pf_test_... secret keys</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to="/merchant/webhooks"
          className="p-5 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white light:text-slate-900">
                Webhook Event Subscriptions
              </div>
              <div className="text-xs text-slate-400">Listen for payment.success & fraud.detected</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-500" />
        </Link>
      </div>

      {/* API Endpoints */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white light:text-slate-900">
          Core REST API Reference
        </h2>

        {endpoints.map((ep, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl glass-card border border-slate-800 light:border-slate-200 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs">
                  {ep.method}
                </span>
                <span className="font-mono text-sm text-cyan-400 font-semibold">{ep.path}</span>
              </div>
              <span className="text-xs font-bold text-white light:text-slate-900">{ep.title}</span>
            </div>

            <p className="text-xs text-slate-400 light:text-slate-600">{ep.desc}</p>

            {/* cURL Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>cURL Request Example</span>
                <button
                  onClick={() => copyCode(ep.curl, idx)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {ep.curl}
              </pre>
            </div>

            {/* Response Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 block">HTTP 200 OK Response</span>
              <pre className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                {ep.response}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
