import { CrawlerWorker } from '../pipeline/worker';
import { FixtureSource, CertStreamSource, CrtShSource } from '../sources';
import { CRAWLER_SOURCE } from '../config';

async function main() {
  console.log('[RunWorker] Starting Crawler Worker...');
  console.log(`[RunWorker] Configured Source: ${CRAWLER_SOURCE}`);

  let source;
  switch (CRAWLER_SOURCE.toLowerCase()) {
    case 'certstream':
      source = new CertStreamSource();
      break;
    case 'crtsh':
      source = new CrtShSource();
      break;
    case 'fixture':
    default:
      source = new FixtureSource();
      break;
  }

  const worker = new CrawlerWorker(source);

  process.on('SIGINT', () => {
    console.log('[RunWorker] Gracefully shutting down...');
    worker.stop();
    if ((source as any).stop) (source as any).stop();
    setTimeout(() => process.exit(0), 3000); 
  });

  await worker.start();
}

main().catch(console.error);
