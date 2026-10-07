import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Layers,
} from 'lucide-react';

interface AttackFlowProps {
  currentStage?: number; // 0 to 6
  isSimulating?: boolean;
  score?: number;
  decision?: 'ALLOW' | 'REVIEW' | 'BLOCK';
}

export const AttackFlowVisualization: React.FC<AttackFlowProps> = ({
  currentStage = 6,
  isSimulating = false,
  score = 88,
  decision = 'BLOCK',
}) => {
  const stages = [
    { label: 'Normal Payment', sub: 'Client Checkout', color: 'blue' },
    { label: 'Suspicious Behavior', sub: 'Anomaly Detected', color: 'amber' },
    { label: 'Risk Signals', sub: 'IP/Geo/Velocity', color: 'orange' },
    { label: 'Fraud Engine', sub: 'Rule Heuristics', color: 'purple' },
    { label: `Risk Score: ${score}/100`, sub: 'Score Clamped', color: 'rose' },
    {
      label: `Decision: ${decision}`,
      sub: decision === 'BLOCK' ? 'Gate Closed' : decision === 'REVIEW' ? 'Manual Flag' : 'Authorized',
      color: decision === 'BLOCK' ? 'rose' : decision === 'REVIEW' ? 'amber' : 'emerald',
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isSimulating ? 'text-rose-400 animate-spin' : 'text-blue-400'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 light:text-slate-800">
            Fraud Attack Evaluation Pipeline
          </span>
        </div>
        {isSimulating && (
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
            Simulating Threat Vector...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {stages.map((st, idx) => {
          const isActive = isSimulating ? (currentStage >= idx) : true;
          return (
            <div
              key={st.label}
              className={`p-3 rounded-xl border text-center transition-all ${
                isActive
                  ? idx === 5 && decision === 'BLOCK'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 glow-red'
                    : idx === 5 && decision === 'ALLOW'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 glow-green'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200'
                  : 'bg-slate-900/30 border-slate-800/40 text-slate-600 opacity-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 mb-1">Step 0{idx + 1}</div>
              <div className="text-xs font-bold leading-tight">{st.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{st.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
