import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sidebar } from '../../components/common/Sidebar';
import { Webhook, Send, CheckCircle2, Clock, Check, Terminal } from 'lucide-react';
import { IWebhookEvent } from '../../types';

export const MerchantWebhooks: React.FC = () => {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<IWebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const [configRes, eventsRes] = await Promise.all([
        api.get('/webhooks'),
        api.get('/webhooks/events'),
      ]);

      if (configRes.data.success) {
        setUrl(configRes.data.webhookUrl || '');
      }
      if (eventsRes.data.success) {
        setEvents(eventsRes.data.events);
      }
    } catch (err) {
      console.error('Failed to load webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/webhooks', { url });
      if (res.data.success) {
        setStatusMsg('Webhook endpoint URL saved successfully!');
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save URL');
    }
  };

  const handleTestPing = async (eventType: string) => {
    try {
      setTesting(true);
      const res = await api.post('/webhooks/test', { eventType });
      if (res.data.success) {
        setStatusMsg(res.data.message);
        fetchWebhooks();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar type="MERCHANT" />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">
            Webhook Event Subscriptions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Receive real-time push events when payments clear or fraud threats are detected.
          </p>
        </div>

        {/* Configuration Card */}
        <div className="p-6 rounded-3xl glass-card border border-blue-500/20 space-y-4">
          <h3 className="text-sm font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Webhook className="w-4 h-4 text-cyan-400" />
            <span>Webhook Endpoint Destination</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
                HTTPS Payload Delivery URL:
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/webhooks/payguard"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 light:bg-white border border-slate-700 text-xs font-mono text-white light:text-slate-900"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
              >
                Save Endpoint
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={testing}
                  onClick={() => handleTestPing('payment.success')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium"
                >
                  Test "payment.success"
                </button>
                <button
                  type="button"
                  disabled={testing}
                  onClick={() => handleTestPing('fraud.detected')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium"
                >
                  Test "fraud.detected"
                </button>
              </div>
            </div>
          </form>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
              ✓ {statusMsg}
            </div>
          )}
        </div>

        {/* Delivery Journal Table */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 light:border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-bold text-white light:text-slate-900 mb-4">
            Dispatched Webhook Delivery Events ({events.length})
          </h3>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 light:bg-slate-100 text-slate-400 font-mono text-[11px] uppercase border-y border-slate-800 light:border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Event Topic</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Response</th>
                <th className="py-2.5 px-3">Attempts</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 light:divide-slate-200">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-slate-300 light:text-slate-700">
                    {e.eventId}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                    {e.eventType}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {e.deliveryStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">
                    {e.responseCode ? `HTTP ${e.responseCode}` : 'HTTP 200'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{e.attempts}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {new Date(e.createdAt).toLocaleTimeString()}
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
