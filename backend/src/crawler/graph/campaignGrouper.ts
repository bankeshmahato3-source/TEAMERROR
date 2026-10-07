import crypto from 'crypto';
import { crawlerStore } from '../store/crawlerStore';
import { CrawlerCampaign } from '../types';

export async function groupCampaigns() {
  const candidates = crawlerStore.candidates;
  const entities = crawlerStore.entities;
  
  const strongTypes = new Set(['DOM_FINGERPRINT', 'FORM_POST', 'TELEGRAM_BOT', 'PHONE', 'UPI']);
  const adj = new Map<string, Set<string>>(); 
  
  for (const c of candidates) {
    if (!adj.has(c.id)) adj.set(c.id, new Set());
  }

  for (const entity of entities) {
    if (strongTypes.has(entity.type) && entity.candidateIds.length > 1) {
      const ids = entity.candidateIds;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          adj.get(ids[i])?.add(ids[j]);
          adj.get(ids[j])?.add(ids[i]);
        }
      }
    }
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const candidateId of adj.keys()) {
    if (!visited.has(candidateId)) {
      const comp: string[] = [];
      const queue = [candidateId];
      visited.add(candidateId);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        comp.push(curr);
        const neighbors = adj.get(curr) || new Set();
        for (const n of neighbors) {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
      
      if (comp.length > 1) {
        components.push(comp);
      }
    }
  }

  for (const comp of components) {
    const sorted = [...comp].sort();
    const hash = crypto.createHash('md5').update(sorted.join(',')).digest('hex').substring(0, 12);
    const campaignId = `crl_cmp_${hash}`;

    let maxScore = 0;
    for (const cid of comp) {
      const cand = candidates.find(c => c.id === cid);
      if (cand) {
        maxScore = Math.max(maxScore, cand.finalScore || 0);
        cand.campaignId = campaignId;
        await crawlerStore.saveCandidate(cand);
      }
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (maxScore >= 80) riskLevel = 'CRITICAL';
    else if (maxScore >= 60) riskLevel = 'HIGH';
    else if (maxScore >= 30) riskLevel = 'MEDIUM';

    const compEntities = entities.filter(e => e.candidateIds.some(cid => comp.includes(cid)));
    
    for (const e of compEntities) {
      if (!e.campaignIds.includes(campaignId)) {
        e.campaignIds.push(campaignId);
        await crawlerStore.saveEntity(e);
      }
    }

    const existingCamp = crawlerStore.campaigns.find(c => c.id === campaignId);
    if (!existingCamp) {
      const campaign: CrawlerCampaign = {
        id: campaignId,
        name: `Threat Campaign ${hash.substring(0, 6)}`,
        status: 'ACTIVE',
        riskLevel,
        firstSeen: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        candidateIds: comp,
        entityIds: compEntities.map(e => e.id)
      };
      await crawlerStore.saveCampaign(campaign);
    } else {
      existingCamp.lastUpdated = new Date().toISOString();
      existingCamp.candidateIds = comp;
      existingCamp.entityIds = compEntities.map(e => e.id);
      existingCamp.riskLevel = riskLevel;
      await crawlerStore.saveCampaign(existingCamp);
    }
  }
}
