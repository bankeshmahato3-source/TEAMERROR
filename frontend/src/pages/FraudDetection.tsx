import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Laptop,
  Globe,
  Sliders,
  DollarSign,
  Activity,
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const FraudDetection: React.FC = () => {
  // Configurable dynamic sandbox test state
  const [amount, setAmount] = useState<number>(32000);
  const [velocity, setVelocity] = useState<number>(4);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(true);
  const [isSuspiciousIp, setIsSuspiciousIp] = useState<boolean>(true);
  const [isImpossibleTravel, setIsImpossibleTravel] = useState<boolean>(false);
  const [isSuspiciousMerchant, setIsSuspiciousMerchant] = useState<boolean>(false);
  const [isSuspiciousUrl, setIsSuspiciousUrl] = useState<boolean>(false);

  // Dynamic points calculation
  let totalPoints = 0;
  const triggered: Array<{ name: string; pts: number; reason: string }> = [];

  if (amount >= 25000) {
    totalPoints += 20;
    triggered.push({
      name: 'High Amount Anomaly',
      pts: 20,
      reason: `Amount ₹${amount.toLocaleString()} is 4.1× higher than customer average baseline`,
    });
  }

  if (velocity >= 3) {
    totalPoints += 25;
    triggered.push({
      name: 'Rapid Velocity Spike',
      pts: 25,
      reason: `${velocity} checkout attempts detected within 5-minute rolling window`,
    });
  }

  if (isNewDevice) {
    totalPoints += 10;
    triggered.push({
      name: 'New Device Fingerprint',
      pts: 10,
      reason: 'Browser/device telemetry signature not present in account historical footprint',
    });
  }

  if (isSuspiciousIp) {
    totalPoints += 20;
    triggered.push({
      name: 'Suspicious IP / Anonymizing Proxy',
      pts: 20,
      reason: 'IP address correlates with known Tor exit nodes or commercial proxy subnets',
    });
  }

  if (isImpossibleTravel) {
    totalPoints += 20;
    triggered.push({
      name: 'Impossible Physical Travel',
      pts: 20,
      reason: 'Geographic coordinate change defies realistic commercial transit speed (>800 km/h)',
    });
  }

  if (isSuspiciousMerchant) {
    totalPoints += 30;
    triggered.push({
      name: 'Suspicious / Flagged Merchant',
      pts: 30,
      reason: 'Destination merchant account flagged for excessive chargeback dispute ratios',
    });
  }

  if (isSuspiciousUrl) {
    totalPoints += 30;
    triggered.push({
      name: 'Deceptive URL / Spoofed VPA',
      pts: 30,
      reason: 'URL contains high-urgency keywords or matches known phishing heuristics',
    });
  }

  const clampedScore = Math.min(100, totalPoints);
  const riskLevel =
    clampedScore >= 80 ? 'CRITICAL' : clampedScore >= 60 ? 'HIGH' : clampedScore >= 30 ? 'MEDIUM' : 'LOW';
  const recommendation =
    clampedScore >= 80 ? 'BLOCK' : clampedScore >= 60 ? 'REVIEW' : clampedScore >= 30 ? 'MONITOR' : 'ALLOW';

  const rulesCatalog = [
    {
      id: 'RULE_HIGH_AMOUNT',
      name: 'High Amount Anomaly',
      weight: '+20 pts',
      category: 'Transaction Feature',
      icon: DollarSign,
      desc: 'Detects purchases that diverge significantly from a customer’s moving average or exceed safety thresholds (₹25,000+).',
    },
    {
      id: 'RULE_VELOCITY',
      name: 'Rapid Attempt Velocity',
      weight: '+25 pts',
      category: 'Behavioral Feature',
      icon: Activity,
      desc: 'Monitors checkout attempts in rolling 5-minute intervals. Detects automated credential stuffing and bot card-testing attacks.',
    },
    {
      id: 'RULE_NEW_DEVICE',
      name: 'New Device Fingerprint',
      weight: '+10 pts',
      category: 'Device Telemetry',
      icon: Laptop,
      desc: 'Cross-checks canvas hash, screen resolution, and user agent against authenticated history.',
    },
    {
      id: 'RULE_SUSPICIOUS_IP',
      name: 'Threat Intelligence IP Feed',
      weight: '+20 pts',
      category: 'Network Reputation',
      icon: Globe,
      desc: 'Verifies ingress IP against simulated Tor node directories, data center VPN subnets, and bulletproof proxy providers.',
    },
    {
      id: 'RULE_IMPOSSIBLE_TRAVEL',
      name: 'Impossible Physical Travel',
      weight: '+20 pts',
      category: 'Geographic Telemetry',
      icon: MapPin,
      desc: 'Calculates the distance between consecutive transactions divided by elapsed time. Flags impossible velocity (e.g. Mumbai to London in 5 minutes).',
    },
    {
      id: 'RULE_SUSPICIOUS_MERCHANT',
      name: 'Flagged Merchant Reputation',
      weight: '+30 pts',
      category: 'Entity Risk',
      icon: ShieldAlert,
      desc: 'Evaluates merchant trust scores, historical dispute frequencies, and regulatory sanctions.',
    },
    {
      id: 'RULE_SUSPICIOUS_URL',
      name: 'Phishing Pattern / Deceptive URL',
      weight: '+30 pts',
      category: 'Heuristic NLP',
      icon: Flame,
      desc: 'Scans referrer URLs and UPI identifiers for typosquatting, disposable TLDs (.xyz, .top), and panic triggers.',
    },
  ];

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Explainable AI & Heuristic Rules Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight">
          How PayGuard’s Fraud Engine Works
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-2 leading-relaxed">
          Unlike opaque "black box" models, PayGuard pairs multi-layered behavioral heuristics with fully transparent explainability. Every transaction receives an itemized risk breakdown explaining precisely why a decision was reached.
        </p>
      </div>

      {/* Threshold Matrix Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-emerald-400">0 – 29 PTS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              LOW RISK
            </span>
          </div>
          <div className="text-base font-extrabold text-white light:text-slate-900">ALLOW</div>
          <p className="text-xs text-slate-400 mt-1">
            Normal behavioral baseline. Telemetry passes all risk filters. Instant authorization without friction.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-amber-400">30 – 59 PTS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
              MEDIUM RISK
            </span>
          </div>
          <div className="text-base font-extrabold text-white light:text-slate-900">MONITOR</div>
          <p className="text-xs text-slate-400 mt-1">
            Minor anomalies detected (e.g., new device). Transaction permitted but flagged for passive SOC monitoring.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-orange-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-orange-400">60 – 79 PTS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300">
              HIGH RISK
            </span>
          </div>
          <div className="text-base font-extrabold text-white light:text-slate-900">REVIEW</div>
          <p className="text-xs text-slate-400 mt-1">
            Multiple concurring risk signals. Routed to Security Analyst review queue before final settlement.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-rose-400">80 – 100 PTS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
              CRITICAL THREAT
            </span>
          </div>
          <div className="text-base font-extrabold text-white light:text-slate-900">BLOCK</div>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed fraud pattern or blacklisted entity. Hard gate automatically denies transaction.
          </p>
        </div>
      </div>

      {/* Interactive Rules Sandbox Simulator */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-blue-500/30 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white light:text-slate-900">
            Interactive Scoring Laboratory
          </h3>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-1">
            Toggle rules and values to watch the engine compute cumulative points and explainability reasons in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-200 light:text-slate-800">
                  Transaction Amount: ₹{amount.toLocaleString()}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {amount >= 25000 ? '+20 pts triggered' : '0 pts (below ceiling)'}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="80000"
                step="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-slate-200 light:text-slate-800">
                  Attempts in 5 mins (Velocity): {velocity}
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {velocity >= 3 ? '+25 pts triggered' : '0 pts'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Checkbox rules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Unrecognized New Device (+10 pts)', checked: isNewDevice, set: setIsNewDevice },
                { label: 'Suspicious IP / Tor Node (+20 pts)', checked: isSuspiciousIp, set: setIsSuspiciousIp },
                { label: 'Impossible Physical Travel (+20 pts)', checked: isImpossibleTravel, set: setIsImpossibleTravel },
                { label: 'Suspicious / Flagged Merchant (+30 pts)', checked: isSuspiciousMerchant, set: setIsSuspiciousMerchant },
                { label: 'Phishing URL Pattern Detected (+30 pts)', checked: isSuspiciousUrl, set: setIsSuspiciousUrl },
              ].map((rule, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 light:bg-slate-100 border border-slate-800 light:border-slate-300 cursor-pointer"
                >
                  <span className="text-slate-300 light:text-slate-700 font-medium">
                    {rule.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={rule.checked}
                    onChange={(e) => rule.set(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Engine Output Gauge */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#070A12] light:from-white light:to-slate-100 border border-slate-800 light:border-slate-300 flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Calculated Risk Score
              </span>
              <div
                className={`text-5xl font-black font-mono my-2 ${
                  clampedScore >= 80
                    ? 'text-rose-400'
                    : clampedScore >= 60
                    ? 'text-orange-400'
                    : clampedScore >= 30
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {clampedScore}
                <span className="text-base text-slate-500 font-normal">/100</span>
              </div>
              <RiskBadge level={riskLevel} />
            </div>

            <div className="my-4 py-3 border-y border-slate-800 light:border-slate-200">
              <div className="text-xs text-slate-400">Final Gatekeeper Action:</div>
              <div
                className={`text-lg font-black font-mono mt-0.5 ${
                  recommendation === 'BLOCK'
                    ? 'text-rose-400'
                    : recommendation === 'REVIEW'
                    ? 'text-orange-400'
                    : 'text-emerald-400'
                }`}
              >
                {recommendation}
              </div>
            </div>

            <div className="text-left">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">
                Active Triggers ({triggered.length}):
              </span>
              <div className="space-y-1 text-[11px] max-h-32 overflow-y-auto">
                {triggered.map((t, idx) => (
                  <div key={idx} className="text-slate-300 light:text-slate-700 flex justify-between">
                    <span className="truncate">• {t.name}</span>
                    <span className="font-mono text-cyan-400 shrink-0">+{t.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Catalog Section */}
      <div>
        <h2 className="text-2xl font-bold text-white light:text-slate-900 mb-4">
          Core Configurable Heuristic Rule Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rulesCatalog.map((rc) => {
            const Icon = rc.icon;
            return (
              <div
                key={rc.id}
                className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-600/10 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                    {rc.weight}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white light:text-slate-900">{rc.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{rc.category}</span>
                </div>
                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed pt-1">
                  {rc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
