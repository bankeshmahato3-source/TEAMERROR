import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export const CrawlerDetectionDetails: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/crawler/detections/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load detection details');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: 'CONFIRMED' | 'REJECTED') => {
    try {
      await api.post(`/crawler/detections/${id}/decision`, {
        decision,
        reason: `Manual analyst review: ${decision}`
      });
      alert(`Detection marked as ${decision}`);
      fetchDetails();
    } catch (err) {
      alert('Failed to update decision');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">Not found</div>;

  const { evidence, entities } = data;
  const latestEv = evidence?.[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <Link to="/admin/crawler/detections" className="text-blue-400 hover:underline mb-4 inline-block">
            &larr; Back to Detections
          </Link>
          <h1 className="text-3xl font-bold text-slate-100">{data.normalizedUrl}</h1>
          <div className="flex items-center gap-4 mt-4">
            <span className="px-3 py-1 bg-slate-800 rounded-full text-sm">Status: {data.status}</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-sm">Risk: {data.riskLevel}</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-sm">Score: {data.finalScore}/100</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleDecision('REJECTED')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Mark False Positive
          </button>
          <button 
            onClick={() => handleDecision('CONFIRMED')}
            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
          >
            Confirm Threat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Scoring Reasons</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              {data.scoreReasons?.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Extracted Entities</h3>
            <div className="flex flex-wrap gap-2">
              {entities?.map((ent: any) => (
                <div key={ent.id} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex items-center gap-2">
                  <span className="text-xs text-blue-400 font-mono">{ent.type}</span>
                  <span className="text-sm text-slate-200 truncate max-w-[200px]" title={ent.value}>{ent.value}</span>
                </div>
              ))}
              {entities?.length === 0 && <span className="text-slate-500">No entities extracted.</span>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Evidence</h3>
            {latestEv ? (
              <div className="space-y-4">
                <div className="aspect-[9/16] bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-700">
                  <div className="text-slate-500 flex flex-col items-center">
                    <span className="material-icons mb-2 text-4xl">image</span>
                    <span className="text-sm">Screenshot Captured</span>
                    <span className="text-xs mt-1 font-mono">{latestEv.screenshotHash?.substring(0, 8)}...</span>
                  </div>
                </div>
                <div className="text-sm text-slate-400 space-y-2">
                  <p><strong>DOM Hash:</strong> <span className="font-mono">{latestEv.domHash?.substring(0, 16)}...</span></p>
                  <p><strong>Network Requests:</strong> {latestEv.networkRequestsCount}</p>
                  <p><strong>TLS Issuer:</strong> {latestEv.tlsIssuer || 'N/A'}</p>
                  {latestEv.fetchError && (
                    <p className="text-red-400"><strong>Error:</strong> {latestEv.fetchError}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-8">No evidence collected yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
