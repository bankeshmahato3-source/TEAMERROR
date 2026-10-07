import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

interface CrawledUrl {
  url: string;
  status: number | 'Pending' | 'Failed';
}

interface CrawlerStatus {
  id: string;
  startUrl: string;
  maxPages: number;
  isRunning: boolean;
  pagesCrawled: number;
  urlsDiscovered: number;
  failedCount: number;
  results: CrawledUrl[];
}

interface RiskReport {
  domain: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  recommendation: string;
}

export const ManualCrawler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initUrl = searchParams.get('url') || '';
  
  const [url, setUrl] = useState(initUrl);
  const [maxPages, setMaxPages] = useState(50);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<CrawlerStatus | null>(null);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const pollInterval = useRef<any>(null);

  useEffect(() => {
    if (initUrl) {
      analyzeUrl(initUrl);
    }
  }, [initUrl]);

  useEffect(() => {
    if (jobId) {
      pollInterval.current = setInterval(fetchStatus, 1000);
    }
    return () => clearInterval(pollInterval.current);
  }, [jobId]);

  const analyzeUrl = async (targetUrl: string) => {
    if (!targetUrl) return;
    setAnalyzing(true);
    try {
      const res = await api.post('/crawler/manual/analyze', { url: targetUrl });
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchStatus = async () => {
    if (!jobId) return;
    try {
      const res = await api.get(`/crawler/manual/status/${jobId}`);
      if (res.data.success) {
        setStatus(res.data.data);
        if (!res.data.data.isRunning) {
          clearInterval(pollInterval.current);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async () => {
    if (!url) return;
    setStatus(null);
    try {
      const res = await api.post('/crawler/manual/start', { url, maxPages });
      if (res.data.success) {
        setJobId(res.data.jobId);
      }
    } catch (err) {
      alert('Failed to start crawler');
    }
  };

  const handleStop = async () => {
    if (!jobId) return;
    try {
      await api.post(`/crawler/manual/stop/${jobId}`);
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Simple Web Crawler
        </h1>
        <p className="text-slate-400 mt-2">Crawl a specific domain to discover URLs and check statuses.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="block text-sm font-medium text-slate-400 mb-1">Start URL</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-1">Maximum pages</label>
            <input
              type="number"
              value={maxPages}
              onChange={e => setMaxPages(parseInt(e.target.value))}
              min={1}
              max={1000}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={() => {
                handleStart();
                analyzeUrl(url);
              }}
              disabled={!url || status?.isRunning}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
            >
              Start Crawl
            </button>
            <button
              onClick={handleStop}
              disabled={!status?.isRunning}
              className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600/40 disabled:opacity-50 rounded-lg transition-colors font-medium"
            >
              Stop
            </button>
          </div>
        </div>

        {analyzing && <p className="mt-6 text-blue-400 text-sm animate-pulse">Analyzing risk profile for domain...</p>}
        
        {report && !analyzing && (
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pre-Crawl Risk Report</h3>
                <p className="text-sm text-slate-400">Target: {report.domain}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg border font-bold ${
                report.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                report.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                report.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                'bg-green-500/20 text-green-400 border-green-500/50'
              }`}>
                {report.riskLevel} SCORE: {report.riskScore}/100
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <strong className="text-slate-300 text-sm">Lexical Analysis Flags:</strong>
                <ul className="mt-2 space-y-1">
                  {report.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <strong className="text-slate-300 text-sm">Action Recommendation:</strong>
                <p className="mt-1 text-sm text-slate-400">{report.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {status && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase">Status</span>
                <span className={`text-lg font-bold ${status.isRunning ? 'text-blue-400' : 'text-slate-300'}`}>
                  {status.isRunning ? 'Running' : 'Stopped/Finished'}
                </span>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase">Pages Crawled</span>
                <span className="text-lg font-bold text-slate-200">{status.pagesCrawled}</span>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase">URLs Discovered</span>
                <span className="text-lg font-bold text-slate-200">{status.urlsDiscovered}</span>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg">
                <span className="block text-xs text-slate-400 uppercase">Failed</span>
                <span className="text-lg font-bold text-rose-400">{status.failedCount}</span>
              </div>
            </div>

            <div className="border border-slate-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 sticky top-0">
                  <tr>
                    <th className="p-3 font-medium text-slate-300 text-sm">URL</th>
                    <th className="p-3 font-medium text-slate-300 text-sm w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {status.results.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/20">
                      <td className="p-3 text-sm font-mono text-slate-300 truncate max-w-md" title={r.url}>
                        {r.url}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          r.status === 'Pending' ? 'bg-slate-700/50 text-slate-400 border-slate-600' :
                          r.status === 200 ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                          'bg-red-500/20 text-red-400 border-red-500/50'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
