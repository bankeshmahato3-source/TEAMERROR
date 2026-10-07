import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Key, Plus, Trash2, Copy, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { IApiKey } from '../../types';

export const MerchantApiKeys: React.FC = () => {
  const [keys, setKeys] = useState<IApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('Backend Checkout Secret');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api-keys');
      if (res.data.success) {
        setKeys(res.data.keys);
      }
    } catch (err) {
      console.error('Failed to load keys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api-keys', { name: newKeyName });
      if (res.data.success) {
        setCreatedSecret(res.data.apiKey.rawSecret);
        fetchKeys();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Key creation failed');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key?')) return;
    try {
      const res = await api.delete(`/api-keys/${id}`);
      if (res.data.success) {
        fetchKeys();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Revoke failed');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Sandbox API Keys
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate your backend servers when creating orders and listening for webhooks.
          </p>
        </div>

        {/* Generate Card */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Generate New Sandbox Secret Key</span>
          </h3>

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g. Node.js Production Key"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 text-xs text-white light:text-slate-900"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
            >
              Generate Key
            </button>
          </form>

          {createdSecret && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Save this secret key immediately! It will not be shown again.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-cyan-400 text-xs flex items-center justify-between">
                <span>{createdSecret}</span>
                <button
                  onClick={() => copyToClipboard(createdSecret)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Keys Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Token Prefix</th>
                <th className="py-2.5 px-3">Masked Key</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-white light:text-slate-900">
                    {k.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400">{k.keyPrefix}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{k.maskedKey}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        k.revoked
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {k.revoked ? 'REVOKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {!k.revoked && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
