import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowLeft,
  Clock,
  MapPin,
  Laptop,
  Globe,
  DollarSign,
  AlertOctagon,
  User,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { IPayment, IFraudAnalysis, IFraudAlert } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const InvestigationPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [data, setData] = useState<{
    payment: IPayment;
    fraudAnalysis: IFraudAnalysis;
    relatedAlerts: IFraudAlert[];
    order: any;
    merchant: any;
    customerHistory: IPayment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [analystNote, setAnalystNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestigation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/fraud/${paymentId}`);
        if (res.data.success) {
          setData(res.data.investigation);
        }
      } catch (err) {
        console.error('Failed to load investigation record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestigation();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white light:text-slate-900">
          Investigation Record Not Found
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          No telemetry records found for transaction {paymentId}.
        </p>
        <Link
          to="/security"
          className="mt-4 inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Return to SOC Overview
        </Link>
      </div>
    );
  }

  const { payment, fraudAnalysis, relatedAlerts, merchant, customerHistory } = data;

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/security"
            className="p-2 rounded-xl bg-slate-800 light:bg-slate-200 text-slate-300 light:text-slate-700 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                Forensic Case #{payment.paymentId}
              </span>
              <RiskBadge level={payment.riskLevel} score={payment.riskScore} size="sm" />
            </div>
            <h1 className="text-2xl font-extrabold text-white light:text-slate-900 mt-0.5">
              Transaction Investigation Dossier
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={payment.status} />
          <span className="text-xs text-slate-400 font-mono">
            {new Date(payment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Telemetry & Rules Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Forensic Timeline */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>End-to-End Execution & Decision Timeline</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(fraudAnalysis?.timeline || []).map((step, idx) => (
                <div key={idx} className="relative pl-8 flex flex-col">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-cyan-400" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white light:text-slate-900">
                      {step.stage}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability Breakdown: Why was this transaction flagged? */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Why was this transaction flagged? (Explainable Signals)</span>
            </h3>

            <div className="space-y-2 mb-4">
              {(fraudAnalysis?.reasons || payment.reasons || []).map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs text-slate-200 light:text-slate-800 flex items-start gap-2.5"
                >
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* Triggered Rules Matrix */}
            <div className="pt-3 border-t border-slate-800 light:border-slate-200">
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
                Triggered Rule Weight Breakdown:
              </h4>

              <div className="space-y-2">
                {(fraudAnalysis?.triggeredRules || []).length > 0 ? (
                  fraudAnalysis.triggeredRules.map((tr, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-rose-300">{tr.ruleName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tr.description}</div>
                      </div>
                      <span className="font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/20 shrink-0">
                        +{tr.pointsAdded} pts
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>No negative fraud rules triggered. Behavioral baseline normal.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer History Context */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
            <h3 className="text-sm font-bold text-white light:text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Customer Historical Baseline Context</span>
            </h3>

            {customerHistory.length > 0 ? (
              <div className="space-y-2">
                {customerHistory.map((ch) => (
                  <div
                    key={ch.paymentId}
                    className="p-2.5 rounded-xl bg-slate-900/60 light:bg-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-slate-300 light:text-slate-700">
                        {ch.paymentId}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        {new Date(ch.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white light:text-slate-900">
                        ₹{ch.amount.toLocaleString()}
                      </span>
                      <StatusBadge status={ch.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                First recorded transaction footprint for this customer identity.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry Cards & Analyst Gating */}
        <div className="space-y-6">
          {/* Identity & Device Telemetry */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Client Network & Telemetry</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Client IP Address</span>
                <div className="font-mono font-bold text-cyan-400 mt-0.5">{payment.clientIp}</div>
              </div>

              <div>
                <span className="text-slate-400">Approximate Location</span>
                <div className="font-medium text-slate-200 light:text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{payment.location}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Device Fingerprint</span>
                <div className="font-medium text-slate-200 light:text-slate-800 mt-0.5">
                  {payment.device}
                </div>
              </div>

              <div>
                <span className="text-slate-400">Payment Rail / Method</span>
                <div className="font-mono font-medium text-slate-200 light:text-slate-800 mt-0.5">
                  {payment.method} {payment.upiId ? `(${payment.upiId})` : ''}
                </div>
              </div>

              <div>
                <span className="text-slate-400">Destination Merchant</span>
                <div className="font-medium text-slate-200 light:text-slate-800 mt-0.5">
                  {payment.merchantName} (Trust: {merchant?.trustScore || 85}/100)
                </div>
              </div>
            </div>
          </div>

          {/* Analyst Decision Box */}
          <div className="p-5 rounded-2xl glass-card border border-blue-500/20 space-y-4">
            <h3 className="text-sm font-bold text-white light:text-slate-900">
              Security Analyst Resolution
            </h3>

            <textarea
              placeholder="Record forensic audit notes or disposition justification..."
              value={analystNote}
              onChange={(e) => setAnalystNote(e.target.value)}
              className="w-full h-24 p-3 rounded-xl bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500"
            />

            {statusMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                {statusMessage}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setStatusMessage('Alert resolved: Transaction marked as Whitelisted Clean.')}
                className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Verified / Whitelist</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusMessage('Threat confirmed: IP address added to global perimeter blocklist.')}
                className="w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Fraud / Add to Blocklist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
