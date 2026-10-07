import React from 'react';
import {
  Shield,
  GraduationCap,
  Lock,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Github,
  Award,
} from 'lucide-react';
import { ArchitectureDiagram } from '../components/common/ArchitectureDiagram';

export const About: React.FC = () => {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 text-xs font-mono font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Research & Capstone Demo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight">
          About PayGuard Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
          PayGuard is an educational cybersecurity and fintech engineering project created to demonstrate how real-time behavioral heuristics, explainable risk scoring, and defensive link inspection secure modern payment ecosystems.
        </p>
      </div>

      {/* College Project Context Banner */}
      <div className="p-6 rounded-3xl glass-card border border-blue-500/30 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/25">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">
            B.Tech Computer Science & Engineering Capstone
          </span>
          <h2 className="text-lg font-bold text-white light:text-slate-900 mt-0.5">
            Defensive Cybersecurity & Explainable Fraud AI in Fintech
          </h2>
          <p className="text-xs text-slate-300 light:text-slate-600 mt-1 leading-relaxed">
            Designed for live evaluation and defense demonstrations in computer science academic presentations, viva audits, and technical symposiums.
          </p>
        </div>
      </div>

      {/* Strict Ethical Guardrails */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-amber-200 light:text-amber-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Strict Educational Sandbox Guardrails:</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300 light:text-slate-800">
          <li>• Does NOT connect to live banking networks (NPCI, Visa, Mastercard, RBI switches).</li>
          <li>• Does NOT process real money or monetary settlements.</li>
          <li>• Does NOT solicit or collect real CVVs, ATM PINs, UPI MPINs, or passwords.</li>
          <li>• Phishing and fake payment page simulations are strictly defensive and designed to train users on spotting red flags.</li>
        </ul>
      </div>

      {/* Architecture */}
      <ArchitectureDiagram />
    </div>
  );
};
