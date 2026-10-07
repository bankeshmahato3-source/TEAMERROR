import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Candidate {
  id: string;
  normalizedUrl: string;
  status: string;
  riskLevel: string;
  finalScore: number;
  lastUpdated: string;
  sourceRefs: any[];
}

export const CrawlerDetections: React.FC = () => {
  const [detections, setDetections] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    try {
      const res = await api.get('/crawler/detections');
      setDetections(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Threat Detections
          </h1>
          <p className="text-slate-400 mt-2">Active pages flagged by the Threat Discovery Crawler.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/crawler/campaigns" className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            View Campaigns
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="p-4 font-medium text-slate-300">URL</th>
                <th className="p-4 font-medium text-slate-300">Risk</th>
                <th className="p-4 font-medium text-slate-300">Score</th>
                <th className="p-4 font-medium text-slate-300">Status</th>
                <th className="p-4 font-medium text-slate-300">Sources</th>
                <th className="p-4 font-medium text-slate-300">Last Updated</th>
                <th className="p-4 font-medium text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {detections.map(det => (
                <tr key={det.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-slate-300 font-mono text-sm max-w-[200px] truncate" title={det.normalizedUrl}>
                    {det.normalizedUrl}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(det.riskLevel || 'LOW')}`}>
                      {det.riskLevel || 'LOW'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${det.finalScore || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400">{det.finalScore || 0}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300 text-sm">{det.status}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {det.sourceRefs.map(s => s.sourceId).join(', ')}
                  </td>
                  <td className="p-4 text-sm text-slate-400">
                    {new Date(det.lastUpdated).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/admin/crawler/detections/${det.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                      Investigate &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {detections.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No detections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
