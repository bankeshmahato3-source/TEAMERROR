import WebSocket from 'ws';
import { Source, RawCandidate } from '../types';
import { CERTSTREAM_URL } from '../config';

export class CertStreamSource implements Source {
  name = 'certstream';
  private ws: WebSocket | null = null;
  private queue: RawCandidate[] = [];
  private resolveNext: ((value: any) => void) | null = null;
  private isClosed = false;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;

  private connect() {
    if (this.isClosed) return;
    
    this.ws = new WebSocket(CERTSTREAM_URL);

    this.ws.on('open', () => {
      console.log(`[CertStreamSource] Connected to ${CERTSTREAM_URL}`);
      this.reconnectDelay = 1000; 
    });

    this.ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.message_type === 'certificate_update') {
          const leafCert = message.data.leaf_cert;
          const allDomains = leafCert.all_domains || [];
          
          for (const domain of allDomains) {
            const cleanDomain = domain.startsWith('*.') ? domain.slice(2) : domain;
            
            const candidate: RawCandidate = {
              url: cleanDomain,
              sourceId: this.name,
              firstSeen: Date.now(),
              note: `Issuer: ${leafCert.issuer?.O || 'Unknown'}`
            };
            
            this.queue.push(candidate);
            if (this.resolveNext) {
              this.resolveNext(undefined);
              this.resolveNext = null;
            }
          }
        }
      } catch (err) {
        // Ignore parse errors
      }
    });

    this.ws.on('close', () => {
      if (this.isClosed) return;
      console.log(`[CertStreamSource] Disconnected. Reconnecting in ${this.reconnectDelay}ms...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
    });

    this.ws.on('error', (err) => {
      console.error(`[CertStreamSource] WebSocket error: ${err.message}`);
      this.ws?.close();
    });
  }

  public stop() {
    this.isClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.resolveNext) {
      this.resolveNext(undefined);
    }
  }

  async *stream(): AsyncIterable<RawCandidate> {
    this.connect();

    while (!this.isClosed || this.queue.length > 0) {
      if (this.queue.length > 0) {
        yield this.queue.shift()!;
      } else {
        await new Promise((resolve) => {
          this.resolveNext = resolve;
        });
      }
    }
  }
}
