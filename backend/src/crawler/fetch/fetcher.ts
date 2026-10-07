import { chromium, Browser } from 'playwright';
import { resolveAndCheckSSRF } from './ssrfGuard';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { EVIDENCE_DIR } from '../config';

export interface FetchResult {
  finalUrl: string;
  status: number;
  redirectChain: string[];
  screenshotPath: string;
  screenshotHash: string;
  domPath: string;
  domHash: string;
  networkRequests: Array<{ url: string; method: string; type: string }>;
  tlsIssuer?: string;
  error?: string;
  postTargets: string[];
  scriptSources: string[];
  cssClasses: string[];
  faviconUrl?: string;
}

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-web-security'
      ]
    });
  }
  return browserInstance;
}

export async function fetchCandidate(url: string, candidateId: string, isMobile = false): Promise<FetchResult> {
  let context;
  try {
    const browser = await getBrowser();
    context = await browser.newContext({
      userAgent: isMobile 
        ? 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      viewport: isMobile ? { width: 390, height: 844 } : { width: 1280, height: 720 },
      ignoreHTTPSErrors: true, 
    });

    const page = await context.newPage();
    
    const redirectChain: string[] = [];
    const networkRequests: Array<{ url: string; method: string; type: string }> = [];
    let finalStatus = 0;
    
    page.on('request', (req) => {
      if (req.isNavigationRequest()) {
        redirectChain.push(req.url());
      }
      networkRequests.push({ url: req.url(), method: req.method(), type: req.resourceType() });
    });

    // Pre-check SSRF for the initial URL
    const parsed = new URL(url);
    await resolveAndCheckSSRF(parsed.hostname);

    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    finalStatus = response?.status() || 0;
    
    const finalUrl = page.url();
    const finalParsed = new URL(finalUrl);
    await resolveAndCheckSSRF(finalParsed.hostname);

    const candDir = path.join(EVIDENCE_DIR, candidateId);
    if (!fs.existsSync(candDir)) {
      fs.mkdirSync(candDir, { recursive: true });
    }

    const screenshotPath = path.join(candDir, 'screenshot.png');
    const screenshotBuffer = await page.screenshot({ path: screenshotPath, fullPage: true });
    const screenshotHash = crypto.createHash('sha256').update(screenshotBuffer).digest('hex');

    const domContent = await page.content();
    const domPath = path.join(candDir, 'dom.html');
    fs.writeFileSync(domPath, domContent, 'utf-8');
    const domHash = crypto.createHash('sha256').update(domContent).digest('hex');

    const postTargets = await page.$$eval('form', forms => forms.map(f => f.action).filter(a => a));
    const scriptSources = await page.$$eval('script[src]', scripts => scripts.map(s => (s as HTMLScriptElement).src));
    const cssClasses = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const classes = new Set<string>();
      all.forEach(el => el.classList.forEach(c => classes.add(c)));
      return Array.from(classes).sort();
    });
    const faviconUrl = await page.$eval('link[rel~="icon"]', el => (el as HTMLLinkElement).href).catch(() => undefined);

    await context.close();

    return {
      finalUrl,
      status: finalStatus,
      redirectChain,
      screenshotPath,
      screenshotHash,
      domPath,
      domHash,
      networkRequests,
      postTargets,
      scriptSources,
      cssClasses,
      faviconUrl
    };

  } catch (err: any) {
    if (context) await context.close();
    return createErrorResult(err.message);
  }
}

function createErrorResult(errorMsg: string): FetchResult {
  return {
    finalUrl: '',
    status: 0,
    redirectChain: [],
    screenshotPath: '',
    screenshotHash: '',
    domPath: '',
    domHash: '',
    networkRequests: [],
    error: errorMsg,
    postTargets: [],
    scriptSources: [],
    cssClasses: []
  };
}

export async function closeFetcher() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
