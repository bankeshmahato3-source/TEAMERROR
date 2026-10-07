import { Request, Response } from 'express';
import { crawlerStore } from '../store/crawlerStore';
import { logSecurityEvent } from '../../utils/auditLogger';
import { AuthenticatedRequest } from '../../middleware/auth';
import { parseMessage } from '../intake/messageParser';
import crypto from 'crypto';
import { normalizeUrl } from '../utils/normalize';

export const getDetections = (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, minScore, source, brand, page = '1', limit = '20' } = req.query;
    let data = [...crawlerStore.candidates];

    if (status) data = data.filter(c => c.status === status);
    if (minScore) data = data.filter(c => (c.finalScore || 0) >= parseInt(minScore as string, 10));
    if (source) data = data.filter(c => c.sourceRefs.some(s => s.sourceId === source));
    if (brand) data = data.filter(c => c.scoreReasons?.some(r => r.toLowerCase().includes((brand as string).toLowerCase())));

    data.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);
    const total = data.length;
    const paginated = data.slice((p - 1) * l, p * l);

    res.json({ success: true, total, page: p, limit: l, data: paginated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDetectionById = (req: AuthenticatedRequest, res: Response) => {
  try {
    const candidate = crawlerStore.candidates.find(c => c.id === req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: 'Not found' });

    const evidence = crawlerStore.evidence.filter(e => e.candidateId === candidate.id);
    const entities = crawlerStore.entities.filter(e => e.candidateIds.includes(candidate.id));

    res.json({ success: true, data: { ...candidate, evidence, entities } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const setDetectionDecision = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { decision, reason } = req.body;
    if (decision !== 'CONFIRMED' && decision !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Invalid decision' });
    }

    const candidate = crawlerStore.candidates.find(c => c.id === req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: 'Not found' });

    candidate.status = decision;
    candidate.lastUpdated = new Date().toISOString();
    await crawlerStore.saveCandidate(candidate);

    logSecurityEvent(
      `THREAT_${decision}`,
      req.user?.email || 'unknown',
      req.user?.role || 'UNKNOWN',
      `Marked detection ${candidate.normalizedUrl} as ${decision}. Reason: ${reason}`
    );

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCampaigns = (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = [...crawlerStore.campaigns];
    data.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCampaignById = (req: AuthenticatedRequest, res: Response) => {
  try {
    const campaign = crawlerStore.campaigns.find(c => c.id === req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Not found' });

    const candidates = crawlerStore.candidates.filter(c => campaign.candidateIds.includes(c.id));
    const entities = crawlerStore.entities.filter(e => campaign.entityIds.includes(e.id));

    res.json({ success: true, data: { ...campaign, candidates, entities } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const submitReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { text, note } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text required' });

    const extracted = parseMessage(text);
    
    let count = 0;
    for (const u of extracted.urls.concat(extracted.apks)) {
      const norm = normalizeUrl(u);
      if (!norm) continue;

      const existing = crawlerStore.candidates.find(c => c.normalizedUrl === norm);
      if (existing) {
        existing.sourceRefs.push({ sourceId: 'report', timestamp: Date.now(), note });
        await crawlerStore.saveCandidate(existing);
      } else {
        const id = `crl_det_${crypto.randomBytes(6).toString('hex')}`;
        await crawlerStore.saveCandidate({
          id,
          normalizedUrl: norm,
          originalUrl: u,
          sourceRefs: [{ sourceId: 'report', timestamp: Date.now(), note }],
          status: 'PENDING',
          firstSeen: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      }
      count++;
    }

    logSecurityEvent(
      'THREAT_REPORT_SUBMITTED',
      req.user?.email || 'unknown',
      req.user?.role || 'UNKNOWN',
      `Submitted threat report yielding ${count} candidates`
    );

    res.json({ success: true, extracted, message: `Queued ${count} candidates for analysis` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMetrics = (req: AuthenticatedRequest, res: Response) => {
  try {
    const total = crawlerStore.candidates.length;
    const pending = crawlerStore.candidates.filter(c => c.status === 'PENDING').length;
    const critical = crawlerStore.candidates.filter(c => c.riskLevel === 'CRITICAL').length;
    res.json({ success: true, data: { total, pending, critical } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
