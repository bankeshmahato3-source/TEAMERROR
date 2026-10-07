import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getConfig = () => {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'Successful',
        };
      case 'BLOCKED':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: XCircle,
          label: 'Fraud Blocked',
        };
      case 'REVIEW':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: AlertCircle,
          label: 'Under Review',
        };
      case 'FAILED':
        return {
          bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
          icon: XCircle,
          label: 'Declined',
        };
      case 'REFUNDED':
        return {
          bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          icon: RefreshCw,
          label: 'Refunded',
        };
      case 'PENDING':
        return {
          bg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
          icon: Clock,
          label: 'Pending',
        };
      default:
        return {
          bg: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${
        size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
