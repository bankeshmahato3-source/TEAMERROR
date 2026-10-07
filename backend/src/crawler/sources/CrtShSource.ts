import { Source, RawCandidate } from '../types';
import { TARGET_BRANDS } from '../config';

export class CrtShSource implements Source {
  name = 'crtsh';
  private isClosed = false;
  private pollInterval = 60000 * 60; // 1 hour

  public stop() {
    this.isClosed = true;
  }

  async *stream(): AsyncIterable<RawCandidate> {
    while (!this.isClosed) {
      for (const brand of TARGET_BRANDS) {
        if (this.isClosed) break;
        
        try {
          const url = `https://crt.sh/?q=${encodeURIComponent(brand)}&output=json`;
          const response = await fetch(url);
          
          if (response.ok) {
            const data = await response.json();
            
            for (const entry of data) {
              if (this.isClosed) break;
              
              const domains = entry.name_value.split('\n');
              for (const domain of domains) {
                const cleanDomain = domain.startsWith('*.') ? domain.slice(2) : domain;
                yield {
                  url: cleanDomain,
                  sourceId: this.name,
                  firstSeen: new Date(entry.entry_timestamp).getTime() || Date.now(),
                  note: `Keyword: ${brand}`
                };
              }
            }
          }
        } catch (err) {
          console.error(`[CrtShSource] Error polling crt.sh for ${brand}:`, err);
        }
        
        // Wait 5 seconds between brands to be gentle to crt.sh
        if (!this.isClosed) {
            await new Promise(r => setTimeout(r, 5000));
        }
      }
      
      if (!this.isClosed) {
        await new Promise(r => setTimeout(r, this.pollInterval));
      }
    }
  }
}
