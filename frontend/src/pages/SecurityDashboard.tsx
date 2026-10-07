import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Play,
  RotateCw,
  TrendingUp,
  Cpu,
  Layers,
  Search,
  Filter,
  ExternalLink,
  Flame,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { IPayment, IFraudAlert } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { AttackFlowVisualization } from '../components/common/AttackFlowVisualization';
import { useAlert } from '../context/AlertContext';

export const SecurityDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [alerts, setAlerts] = useState<IFraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState(6);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { triggerAlert } = useAlert();

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes, paymentsRes, alertsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/analytics'),
        api.get('/payments?limit=25'),
        api.get('/fraud/alerts'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.payments);
      if (alertsRes.data.success) setAlerts(alertsRes.data.alerts);
    } catch (err) {
      console.error('Failed to load SOC dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunSimulation = async () => {
    setSimulating(true);
    setActiveSimulationStep(0);

    // Step through the visual animation
    const interval = setInterval(() => {
      setActiveSimulationStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          return 6;
        }
        return prev + 1;
      });
    }, 400);

    try {
      const res = await api.post('/fraud/simulate');
      if (res.data.success && res.data.scenarios) {
        // Trigger alert toasts for any critical attacks
        res.data.scenarios.forEach((sc: any) => {
          if (sc.alert) {
            triggerAlert({
              paymentId: sc.payment.paymentId,
              amount: sc.payment.amount,
              riskScore: sc.payment.riskScore,
              severity: sc.alert.severity,
              message: sc.alert.message,
              action: sc.payment.status,
            });
          }
        });

        // Refresh stats & tables
        await loadData();
      }
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setTimeout(() => {
        setSimulating(false);
      }, 2500);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      !searchFilter ||
      p.paymentId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.merchantName.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Simulation Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono font-semibold border border-rose-500/20 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cybersecurity SOC Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Security Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 light:text-slate-600 mt-1">
            Real-time fraud surveillance, explainable AI heuristics, and attack vector telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800/80 light:bg-slate-200 text-slate-300 light:text-slate-700 hover:text-white border border-slate-700 light:border-slate-300 transition-colors"
            title="Refresh Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {simulating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simulating Live Attacks...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Fraud Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fraud Attack Visualization Bar */}
      <AttackFlowVisualization
        currentStage={activeSimulationStep}
        isSimulating={simulating}
        score={88}
        decision="BLOCK"
      />

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Transactions</span>
          <div className="text-xl font-bold font-mono text-white light:text-slate-900 mt-1">
            {stats?.totalTransactions ?? '...'}
          </div>
          <span className="text-[10px] text-slate-500">100% telemetry captured</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400">Analyzed by AI</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {stats?.transactionsAnalyzed ?? '...'}
          </div>
          <span className="text-[10px] text-cyan-500/80">&lt; 50ms engine latency</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/20">
          <span className="text-[10px] font-mono uppercase text-rose-400">Fraud Detected</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {stats?.fraudDetected ?? '...'}
          </div>
          <span className="text-[10px] text-rose-500/80">High & Critical risks</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/20">
          <span className="text-[10px] font-mono uppercase text-rose-400">Blocked Payments</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {stats?.blockedCount ?? '...'}
          </div>
          <span className="text-[10px] text-slate-500">Hard gate triggers</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/20">
          <span className="text-[10px] font-mono uppercase text-amber-400">Under Review</span>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {stats?.reviewCount ?? '...'}
          </div>
          <span className="text-[10px] text-amber-500/80">Analyst review queue</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-400">Fraud Rate</span>
          <div className="text-xl font-bold font-mono text-orange-400 mt-1">
            {stats?.fraudRate ?? '0'}%
          </div>
          <span className="text-[10px] text-slate-500">Benchmark tolerance: &lt; 5%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Transaction Volume & Fraud Rate */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white light:text-slate-900">
                Transaction Volume & Fraud Defense Trend
              </h3>
              <p className="text-[11px] text-slate-400">Daily throughput vs blocked attack spikes</p>
            </div>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.volumeTimeline || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="successful"
                  name="Authorized (Clean)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="blocked"
                  name="Blocked Attacks"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Risk Distribution */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white light:text-slate-900">
                Risk Tier Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Segmentation across 0-100 score threshold brackets</p>
            </div>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.riskDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(analytics?.riskDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Fraud by Payment Method */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white light:text-slate-900">
                Fraud & Clean Distribution by Payment Method
              </h3>
              <p className="text-[11px] text-slate-400">Comparing attack vectors across UPI, Cards, Net Banking, and Wallets</p>
            </div>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.methodBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis dataKey="method" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="clean" name="Clean Payments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fraud" name="Flagged / Blocked" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Alerts Audit Table */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white light:text-slate-900">
              Transactions & Risk Surveillance Feed
            </h3>
            <p className="text-xs text-slate-400">Click on any transaction to open the forensic timeline view.</p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ID, customer, merchant..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-white light:text-slate-900 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 light:bg-white border border-slate-700 light:border-slate-300 text-xs text-slate-200 light:text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="SUCCESS">Successful</option>
              <option value="BLOCKED">Fraud Blocked</option>
              <option value="REVIEW">Under Review</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-3 px-3">Payment ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Merchant</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {filteredPayments.map((p) => (
                <tr
                  key={p.paymentId}
                  className="hover:bg-slate-800/30 light:hover:bg-slate-100/60 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-medium text-slate-200 light:text-slate-800">
                    {p.paymentId}
                  </td>
                  <td className="py-3 px-3 text-slate-300 light:text-slate-700">
                    <div className="font-medium">{p.customerName}</div>
                    <div className="text-[10px] text-slate-500">{p.customerEmail}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 light:text-slate-700 font-medium">
                    {p.merchantName}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white light:text-slate-900">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono">
                    {p.method}
                  </td>
                  <td className="py-3 px-3">
                    <RiskBadge level={p.riskLevel} score={p.riskScore} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/security/investigation/${p.paymentId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-400 hover:bg-blue-500/20 font-medium transition-colors text-[11px]"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
