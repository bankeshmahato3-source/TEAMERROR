import crypto from 'crypto';
import { Source, CrawlerCandidate, CrawlerEvidence } from '../types';
import { normalizeUrl } from '../utils/normalize';
import { scoreDomain } from '../analysis/lexicalFilter';
import { fetchCandidate, closeFetcher } from '../fetch/fetcher';
import { extractEntities } from '../analysis/entityExtractor';
import { calculateCloneScore } from '../analysis/cloneScorer';
import { groupCampaigns } from '../graph/campaignGrouper';
import { crawlerStore } from '../store/crawlerStore';
import { CONCURRENCY } from '../config';
import { dbStore } from '../../models/store';
import { IFraudAlert } from '../../types';
import { logSecurityEvent } from '../../utils/auditLogger';

export class CrawlerWorker {
  private source: Source;
  private isRunning = false;
  private activeFetches = 0;

  constructor(source: Source) {
    this.source = source;
  }

  public async start() {
    this.isRunning = true;
    console.log(`[CrawlerWorker] Starting with source: ${this.source.name}`);

    try {
      for await (const raw of this.source.stream()) {
        if (!this.isRunning) break;

        if (!raw.url) continue;

        const normalizedUrl = normalizeUrl(raw.url);
        if (!normalizedUrl) continue;

        // Deduplication
        const existing = crawlerStore.candidates.find(c => c.normalizedUrl === normalizedUrl);
        if (existing) {
          existing.lastUpdated = new Date().toISOString();
          if (!existing.sourceRefs.some(s => s.sourceId === raw.sourceId)) {
            existing.sourceRefs.push({ sourceId: raw.sourceId, timestamp: raw.firstSeen, note: raw.note });
          }
          await crawlerStore.saveCandidate(existing);
          continue;
        }

        const candidateId = `crl_det_${crypto.randomBytes(6).toString('hex')}`;
        const candidate: CrawlerCandidate = {
          id: candidateId,
          normalizedUrl,
          originalUrl: raw.url,
          sourceRefs: [{ sourceId: raw.sourceId, timestamp: raw.firstSeen, note: raw.note }],
          status: 'PENDING',
          firstSeen: new Date(raw.firstSeen).toISOString(),
          lastUpdated: new Date().toISOString()
        };

        const lexical = scoreDomain(new URL(normalizedUrl).hostname);
        candidate.lexicalScore = lexical.score;
        candidate.scoreReasons = lexical.reasons;

        await crawlerStore.saveCandidate(candidate);

        // Fetch if lexical score > 0.3 or explicitly reported by user (we can check sourceId)
        if (lexical.score >= 0.3 || raw.sourceId === 'report' || raw.sourceId === 'message') {
          this.queueFetch(candidate, lexical);
        }
      }
    } catch (err) {
      console.error('[CrawlerWorker] Stream error:', err);
    }
  }

  public stop() {
    this.isRunning = false;
  }

  private async queueFetch(candidate: CrawlerCandidate, lexical: ReturnType<typeof scoreDomain>) {
    // Wait for concurrency slot
    while (this.activeFetches >= CONCURRENCY) {
      await new Promise(r => setTimeout(r, 1000));
    }

    this.activeFetches++;
    try {
      console.log(`[CrawlerWorker] Fetching ${candidate.normalizedUrl}`);
      const fetchRes = await fetchCandidate(candidate.normalizedUrl!, candidate.id);
      
      const evidence: CrawlerEvidence = {
        id: `evd_${crypto.randomBytes(6).toString('hex')}`,
        candidateId: candidate.id,
        timestamp: new Date().toISOString(),
        screenshotHash: fetchRes.screenshotHash,
        screenshotPath: fetchRes.screenshotPath,
        domHash: fetchRes.domHash,
        domPath: fetchRes.domPath,
        redirectChain: fetchRes.redirectChain,
        finalUrl: fetchRes.finalUrl,
        networkRequestsCount: fetchRes.networkRequests.length,
        fetchError: fetchRes.error,
        tlsIssuer: fetchRes.tlsIssuer
      };
      await crawlerStore.saveEvidence(evidence);

      // Extract entities
      const entities = extractEntities(candidate.id, fetchRes);
      for (const e of entities) {
        await crawlerStore.saveEntity(e);
      }

      // Clone score
      const cloneScore = calculateCloneScore(lexical, fetchRes);
      candidate.status = 'FETCHED';
      candidate.cloneScore = cloneScore.score;
      candidate.finalScore = cloneScore.score;
      candidate.riskLevel = cloneScore.riskLevel;
      candidate.scoreReasons = cloneScore.reasons;
      candidate.lastUpdated = new Date().toISOString();

      await crawlerStore.saveCandidate(candidate);

      // Group campaigns
      await groupCampaigns();

      // SOC Alert
      if (candidate.riskLevel === 'HIGH' || candidate.riskLevel === 'CRITICAL') {
        const alert: IFraudAlert = {
          id: `alert_crl_${crypto.randomBytes(4).toString('hex')}`,
          alertId: `alt_${Date.now()}`,
          paymentId: candidate.id, // Using paymentId to link to candidate
          merchantId: 'CRAWLER',
          merchantName: 'Threat Crawler',
          amount: 0,
          riskScore: candidate.finalScore,
          severity: candidate.riskLevel,
          status: 'OPEN',
          message: `Crawler detected suspicious site: ${candidate.normalizedUrl}`,
          createdAt: new Date().toISOString()
        };
        dbStore.fraudAlerts = [alert, ...dbStore.fraudAlerts];
        
        logSecurityEvent(
          'THREAT_DETECTED',
          'system-crawler@payguard.io',
          'SYSTEM',
          `Crawler detected ${candidate.riskLevel} threat at ${candidate.normalizedUrl} (Score: ${candidate.finalScore})`
        );
      }

    } catch (err) {
      console.error(`[CrawlerWorker] Fetch failed for ${candidate.normalizedUrl}`, err);
      candidate.status = 'FAILED';
      await crawlerStore.saveCandidate(candidate);
    } finally {
      this.activeFetches--;
      if (!this.isRunning && this.activeFetches === 0) {
        await closeFetcher();
      }
    }
  }
}
