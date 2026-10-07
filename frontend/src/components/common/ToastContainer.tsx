import React from 'react';
import { useAlert } from '../../context/AlertContext';
import { ShieldAlert, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ToastContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isCritical
                ? 'bg-rose-950/90 border-rose-500/40 text-slate-100 glow-red'
                : 'bg-slate-900/90 border-blue-500/40 text-slate-100 glow-blue'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg ${
                    isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {isCritical ? <ShieldAlert className="w-5 h-5 animate-pulse" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isCritical ? 'bg-rose-500/30 text-rose-300' : 'bg-blue-500/30 text-blue-300'
                      }`}
                    >
                      {alert.severity} FRAUD ALERT
                    </span>
                    <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  {alert.paymentId && (
                    <div className="text-xs font-mono font-semibold text-slate-200 mt-1">
                      Payment ID: {alert.paymentId}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeAlert(alert.id)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-2 line-clamp-2">{alert.message}</p>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                {alert.amount && (
                  <span className="font-semibold text-white">₹{alert.amount.toLocaleString()}</span>
                )}
                {alert.riskScore !== undefined && (
                  <span
                    className={`font-mono font-bold ${
                      alert.riskScore >= 80 ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    Risk: {alert.riskScore}/100
                  </span>
                )}
              </div>

              {alert.paymentId && (
                <Link
                  to={`/security/investigation/${alert.paymentId}`}
                  onClick={() => removeAlert(alert.id)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1"
                >
                  Investigate →
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
