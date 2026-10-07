import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Cpu,
  Store,
  Activity,
  Search,
  Webhook,
  ArrowRight,
  Lock,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const Features: React.FC = () => {
  const pillars = [
    {
      title: 'Sandbox Payment Gateway',
      tag: 'FINTECH CORE',
      icon: CreditCard,
      color: 'blue',
      desc: 'A full-featured sandbox payment gateway inspired by industry leaders like Razorpay. Supports simulated multi-rail checkouts including UPI, Credit/Debit cards, Net Banking, and digital wallets without handling real monetary assets.',
      bullets: [
        'Simulated UPI VPA identities (success@payguard, fraud@payguard, etc.)',
        'Test card credentials with automated validation formatting',
        'Simulated net banking switches and wallet clearing rails',
        'Zero real banking API dependencies — safe for academic and research labs',
      ],
      link: '/checkout/order_PF100001',
      linkText: 'Test Sandbox Checkout',
    },
    {
      id: 'fraud',
      title: 'Intelligent Fraud Risk Scoring Engine',
      tag: 'CYBER DEFENSE',
      icon: Cpu,
      color: 'rose',
      desc: 'High-speed behavioral analysis executing in sub-50 milliseconds before transaction clearing. Analyzes client telemetry, historical purchase velocity, and IP threat directories to calculate an explainable 0-100 risk score.',
      bullets: [
        '7 Configurable heuristics (Amount Anomaly, Velocity, Device, IP, Geo, Merchant, URL)',
        'Explainable AI reporting: Detailed bullet points on why a transaction was flagged',
        'Configurable risk tier thresholds: Low (Allow), Medium (Monitor), High (Review), Critical (Block)',
        'Full administrative weight customization via Admin Panel',
      ],
      link: '/fraud-detection',
      linkText: 'Explore Fraud Engine Heuristics',
    },
    {
      title: 'Merchant Business Operations Portal',
      tag: 'COMMERCE SUITE',
      icon: Store,
      color: 'cyan',
      desc: 'Complete dashboard for digital merchants to create sandbox orders, monitor transaction inflows, manage full and partial refunds, inspect revenue velocity, and monitor their security health rating.',
      bullets: [
        'Order management with dynamic sandbox checkout URLs',
        'Transaction surveillance table with status filters and search',
        'Full and partial refund processing with instant ledger updates',
        'Fintech Merchant Security Score (87/100) with remediation guidance',
      ],
      link: '/merchant',
      linkText: 'Launch Merchant Dashboard',
    },
    {
      title: 'Security Operations Center (SOC)',
      tag: 'DEFENSIVE SOC',
      icon: Activity,
      color: 'purple',
      desc: 'Specialized command center tailored for security analysts and incident response engineers. Features real-time alert feeds, multi-vector attack simulation wave generation, and deep forensic transaction timelines.',
      bullets: [
        'Interactive "Run Fraud Simulation" live attack demonstrator',
        'Forensic Transaction Timeline tracking every hop from client telemetry to gate decision',
        'Recharts analytical graphs for risk distribution and payment method vulnerabilities',
        'Direct analyst actions: Whitelist Clean vs Escalate to Global Blocklist',
      ],
      link: '/security',
      linkText: 'Open Security SOC',
    },
    {
      title: 'Fake UPI & Deceptive Link Scanner',
      tag: 'THREAT INTELLIGENCE',
      icon: Search,
      color: 'amber',
      desc: 'Specialized defensive utility that audits suspicious payment links, QR targets, and UPI VPAs for typosquatting, brand impersonation, high-abuse TLDs, and psychological urgency lures.',
      bullets: [
        'Detects brand spoofing (SBI, Paytm, PhonePe, Google Pay, Razorpay)',
        'Flags disposable top-level domains (.xyz, .top, .buzz, .online)',
        'Heuristic regex scanning for fake customer care and refund VPAs',
        'Itemized pass/warning/fail diagnostic report with safety recommendations',
      ],
      link: '/upi-check',
      linkText: 'Scan a Payment Link',
    },
    {
      title: 'Webhooks & Developer Integration APIs',
      tag: 'EXTENSIBILITY',
      icon: Webhook,
      color: 'emerald',
      desc: 'Modern developer suite allowing automated system-to-system integrations. Generate test API keys (pf_test_...), configure webhook URLs, and receive real-time events for payment outcomes and fraud detections.',
      bullets: [
        'Cryptographic test API keys (pf_test_...) with secure one-time generation',
        '7 Webhook event topics (payment.success, fraud.detected, order.paid, etc.)',
        'Interactive webhook delivery test dispatcher and log inspector',
        'Exhaustive documentation with code snippets in cURL, JavaScript, and Python',
      ],
      link: '/developers',
      linkText: 'View Developer Hub',
    },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-mono font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Full-Stack Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight">
          Engineered for Enterprise Defense & Educational Demonstration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2">
          Discover how PayGuard synchronizes sandbox transaction clearing with defense-in-depth security analytics.
        </p>
      </div>

      {/* Grid of 6 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card border border-slate-800 light:border-slate-200 flex flex-col justify-between hover:border-blue-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-900 light:bg-slate-100 text-cyan-400 border border-slate-700 light:border-slate-300 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 light:bg-slate-200">
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white light:text-slate-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed mb-4">
                  {p.desc}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-300 light:text-slate-700 mb-6">
                  {p.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={p.link}
                className="pt-4 border-t border-slate-800 light:border-slate-200 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center justify-between"
              >
                <span>{p.linkText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
