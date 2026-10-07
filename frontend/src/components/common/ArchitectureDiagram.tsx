import React, { useState } from 'react';
import {
  Monitor,
  Server,
  Lock,
  CreditCard,
  Cpu,
  Database,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4);

  const steps = [
    {
      id: 1,
      title: 'Frontend Client',
      sub: 'React + Vite + Tailwind',
      desc: 'Responsive user portal, Razorpay-inspired checkout modal, SOC analytics charts, and UPI scam scanner.',
      icon: Monitor,
      color: 'blue',
    },
    {
      id: 2,
      title: 'REST API Gateway',
      sub: 'Express + Helmet + RateLimit',
      desc: 'Secure ingress endpoints with strict CORS policies, token authentication, and payload normalization.',
      icon: Server,
      color: 'cyan',
    },
    {
      id: 3,
      title: 'Auth & Authorization',
      sub: 'JWT + BCrypt + 4 Roles',
      desc: 'Role-based access gating for Customers, Merchants, Security Analysts, and System Administrators.',
      icon: Lock,
      color: 'purple',
    },
    {
      id: 4,
      title: 'Payment Gateway Core',
      sub: 'State Machine & Webhooks',
      desc: 'Simulated multi-rail processor (UPI, Card, NetBanking, Wallet) managing order transitions and webhook callbacks.',
      icon: CreditCard,
      color: 'emerald',
    },
    {
      id: 5,
      title: 'Fraud Detection Engine',
      sub: 'Explainable Heuristic AI',
      desc: 'Real-time telemetry analysis computing 0-100 risk score, feature weights, explainability reasons, and ALLOW/BLOCK decisions.',
      icon: Cpu,
      color: 'rose',
    },
    {
      id: 6,
      title: 'Database Storage',
      sub: 'MongoDB & In-Memory Store',
      desc: 'Persistent indexed collections for transactions, customer behavior, fraud rules, alerts, and audit logs.',
      icon: Database,
      color: 'amber',
    },
    {
      id: 7,
      title: 'Analytics & SOC Alerts',
      sub: 'Recharts & Real-Time Feed',
      desc: 'Live forensic investigation timelines, risk distribution charts, and instant fraud notifications.',
      icon: BarChart2,
      color: 'indigo',
    },
  ];

  return (
    <div className="p-6 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold border border-blue-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Architecture Pipeline</span>
          </div>
          <h3 className="text-lg font-bold text-white light:text-slate-900 mt-2">
            PayGuard End-to-End System Topology
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
            Click on any pipeline node to inspect security telemetry flow and decision protocols.
          </p>
        </div>
      </div>

      {/* Nodes visual flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 light:bg-blue-50 glow-blue text-white light:text-slate-900'
                  : 'bg-slate-900/60 light:bg-white border-slate-800 light:border-slate-200 text-slate-300 light:text-slate-700 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  0{step.id}
                </span>
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-blue-500/30 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{step.title}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-1">
                  {step.sub}
                </div>
              </div>
              {isSelected && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      {steps.find((s) => s.id === activeStep) && (
        <div className="p-4 rounded-xl bg-slate-900/90 light:bg-slate-100 border border-slate-800 light:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 shrink-0">
              {React.createElement(steps[activeStep - 1].icon, { className: 'w-6 h-6' })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white light:text-slate-900">
                  {steps[activeStep - 1].title}
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                  {steps[activeStep - 1].sub}
                </span>
              </div>
              <p className="text-xs text-slate-300 light:text-slate-700 mt-1 max-w-2xl leading-relaxed">
                {steps[activeStep - 1].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS / Guarded</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
