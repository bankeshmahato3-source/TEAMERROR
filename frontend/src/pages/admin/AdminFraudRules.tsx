import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Sliders, CheckCircle2, ShieldAlert, RotateCw, Save } from 'lucide-react';
import { IFraudRule } from '../../types';

export const AdminFraudRules: React.FC = () => {
  const [rules, setRules] = useState<IFraudRule[]>([]);
  const [thresholds, setThresholds] = useState({ low: 29, medium: 59, high: 79, critical: 80 });
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/fraud-rules');
      if (res.data.success) {
        setRules(res.data.rules);
        if (res.data.thresholds) setThresholds(res.data.thresholds);
      }
    } catch (err) {
      console.error('Failed to load rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggleRule = async (id: string, currentEnabled: boolean) => {
    try {
      const res = await api.patch(`/admin/fraud-rules/${id}`, { enabled: !currentEnabled });
      if (res.data.success) {
        fetchRules();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update rule');
    }
  };

  const handleWeightChange = async (id: string, weight: number) => {
    try {
      await api.patch(`/admin/fraud-rules/${id}`, { weight });
      fetchRules();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch('/admin/thresholds', thresholds);
      if (res.data.success) {
        setSavedMsg('Risk scoring thresholds updated globally!');
        setTimeout(() => setSavedMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update thresholds');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="ADMIN" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Fraud Heuristic Rules Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Toggle rules ON/OFF, adjust dynamic risk weights, and configure decision thresholds.
          </p>
        </div>

        {/* Threshold Configuration Card */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white light:text-slate-900">
            Risk Tier Threshold Ceilings (0-100 Scale)
          </h3>

          <form onSubmit={handleSaveThresholds} className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-emerald-400 font-semibold mb-1">
                LOW (ALLOW) Max:
              </label>
              <input
                type="number"
                value={thresholds.low}
                onChange={(e) => setThresholds({ ...thresholds, low: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-amber-400 font-semibold mb-1">
                MEDIUM (MONITOR) Max:
              </label>
              <input
                type="number"
                value={thresholds.medium}
                onChange={(e) => setThresholds({ ...thresholds, medium: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-orange-400 font-semibold mb-1">
                HIGH (REVIEW) Max:
              </label>
              <input
                type="number"
                value={thresholds.high}
                onChange={(e) => setThresholds({ ...thresholds, high: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-rose-400 font-semibold mb-1">
                CRITICAL (BLOCK) Min:
              </label>
              <input
                type="number"
                value={thresholds.critical}
                onChange={(e) => setThresholds({ ...thresholds, critical: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-white"
              />
            </div>

            <div className="sm:col-span-4 flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
              >
                Save Thresholds
              </button>
              {savedMsg && <span className="text-xs text-emerald-400 font-semibold">{savedMsg}</span>}
            </div>
          </form>
        </div>

        {/* Rules Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Rule Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Weight (Points)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white light:text-slate-900">{r.name}</div>
                    <div className="text-[10px] text-slate-400">{r.description}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{r.category}</td>
                  <td className="py-2.5 px-3 font-mono">
                    <select
                      value={r.weight}
                      onChange={(e) => handleWeightChange(r.id, Number(e.target.value))}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-rose-400 font-bold"
                    >
                      <option value={10}>+10 pts</option>
                      <option value={15}>+15 pts</option>
                      <option value={20}>+20 pts</option>
                      <option value={25}>+25 pts</option>
                      <option value={30}>+30 pts</option>
                      <option value={40}>+40 pts</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        r.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {r.enabled ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleToggleRule(r.id, r.enabled)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        r.enabled
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {r.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
