import { dbStore } from '../../models/store';
import { CrawlerCandidate, CrawlerEvidence, CrawlerCampaign, CrawlerEntity } from '../types';

type Task = () => void | Promise<void>;

class CrawlerStoreQueue {
  private queue: Task[] = [];
  private processing = false;

  public enqueue(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await task();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
        } catch (err) {
          console.error('[CrawlerStoreQueue] Task error:', err);
        }
      }
    }

    this.processing = false;
  }
}

export const crawlerStoreQueue = new CrawlerStoreQueue();

export const crawlerStore = {
  get candidates() { return dbStore.crawlerCandidates; },
  get evidence() { return dbStore.crawlerEvidence; },
  get campaigns() { return dbStore.crawlerCampaigns; },
  get entities() { return dbStore.crawlerEntities; },

  async saveCandidate(candidate: CrawlerCandidate) {
    await crawlerStoreQueue.enqueue(() => {
      const existing = dbStore.crawlerCandidates;
      const idx = existing.findIndex(c => c.id === candidate.id);
      if (idx >= 0) {
        const copy = [...existing];
        copy[idx] = candidate;
        dbStore.crawlerCandidates = copy;
      } else {
        dbStore.crawlerCandidates = [candidate, ...existing];
      }
    });
  },

  async saveEvidence(evidence: CrawlerEvidence) {
    await crawlerStoreQueue.enqueue(() => {
      const existing = dbStore.crawlerEvidence;
      const idx = existing.findIndex(e => e.id === evidence.id);
      if (idx >= 0) {
        const copy = [...existing];
        copy[idx] = evidence;
        dbStore.crawlerEvidence = copy;
      } else {
        dbStore.crawlerEvidence = [evidence, ...existing];
      }
    });
  },

  async saveCampaign(campaign: CrawlerCampaign) {
    await crawlerStoreQueue.enqueue(() => {
      const existing = dbStore.crawlerCampaigns;
      const idx = existing.findIndex(c => c.id === campaign.id);
      if (idx >= 0) {
        const copy = [...existing];
        copy[idx] = campaign;
        dbStore.crawlerCampaigns = copy;
      } else {
        dbStore.crawlerCampaigns = [campaign, ...existing];
      }
    });
  },

  async saveEntity(entity: CrawlerEntity) {
    await crawlerStoreQueue.enqueue(() => {
      const existing = dbStore.crawlerEntities;
      const idx = existing.findIndex(e => e.id === entity.id);
      if (idx >= 0) {
        const copy = [...existing];
        copy[idx] = entity;
        dbStore.crawlerEntities = copy;
      } else {
        dbStore.crawlerEntities = [entity, ...existing];
      }
    });
  }
};
