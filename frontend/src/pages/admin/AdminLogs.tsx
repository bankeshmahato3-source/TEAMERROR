import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { FileText, Shield, Clock } from 'lucide-react';
import { ISecurityLog } from '../../types';

export const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<ISecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/logs');
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="ADMIN" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            System & Security Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log recording administrative actions, rule modifications, and fraud events.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Actor Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{l.action}</td>
                  <td className="py-2.5 px-3 text-slate-300 light:text-slate-700">{l.actorEmail}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {l.actorRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{l.ip}</td>
                  <td className="py-2.5 px-3 text-slate-300 light:text-slate-700 max-w-sm truncate">
                    {l.details}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(l.createdAt).toLocaleTimeString()}
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
