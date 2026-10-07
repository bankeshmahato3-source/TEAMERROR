import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame } from 'lucide-react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: ShieldCheck,
          label: 'LOW RISK',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          icon: ShieldAlert,
          label: 'HIGH RISK',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: Flame,
          label: 'CRITICAL THREAT',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          icon: ShieldCheck,
          label: level,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono ml-0.5">({score}/100)</span>
      )}
    </span>
  );
};
