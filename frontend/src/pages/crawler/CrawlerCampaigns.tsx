import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Campaign {
  id: string;
  name: string;
  status: string;
  riskLevel: string;
  candidateIds: string[];
  entityIds: string[];
  lastUpdated: string;
}

export const CrawlerCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/crawler/campaigns');
      setCampaigns(res.data.data);
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
          <Link to="/admin/crawler/detections" className="text-blue-400 hover:underline mb-4 inline-block">
            &larr; Back to Detections
          </Link>
          <h1 className="text-3xl font-bold text-slate-100">
            Threat Campaigns
          </h1>
          <p className="text-slate-400 mt-2">Detections grouped by shared entities (DOM footprint, Exfiltration endpoints).</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-200">{camp.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(camp.riskLevel)}`}>
                  {camp.riskLevel}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Linked Domains:</span>
                  <span className="text-slate-200 font-medium">{camp.candidateIds.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shared Entities:</span>
                  <span className="text-slate-200 font-medium">{camp.entityIds.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-slate-200 font-medium">{camp.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last Active:</span>
                  <span className="text-slate-200">{new Date(camp.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              {/* Note: We could link to a campaign details page, but for now we just show the card */}
              <button disabled className="w-full py-2 bg-slate-800 text-slate-400 rounded-lg text-sm cursor-not-allowed">
                View Graph (Coming Soon)
              </button>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No clustered campaigns detected.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
