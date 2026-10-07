import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { Source, RawCandidate } from '../types';

export class FixtureSource implements Source {
  name = 'fixture';

  async *stream(): AsyncIterable<RawCandidate> {
    const fixturePath = path.join(__dirname, '../fixtures/ct_sample.jsonl');
    
    if (!fs.existsSync(fixturePath)) {
      console.warn(`[FixtureSource] Fixture not found at ${fixturePath}`);
      return;
    }

    const fileStream = fs.createReadStream(fixturePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        yield {
          url: parsed.url,
          sourceId: this.name,
          firstSeen: parsed.firstSeen || Date.now(),
          note: parsed.note
        };
        // Artificial delay to simulate real streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (err) {
        console.error(`[FixtureSource] Invalid JSON line: ${line}`);
      }
    }
  }
}
