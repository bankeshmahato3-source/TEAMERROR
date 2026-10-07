import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';

interface CrawledUrl {
  url: string;
  status: number | 'Pending' | 'Failed';
}

interface CrawlJob {
  id: string;
  startUrl: string;
  maxPages: number;
  isRunning: boolean;
  pagesCrawled: number;
  urlsDiscovered: number;
  failedCount: number;
  results: CrawledUrl[];
  visited: Set<string>;
  queue: string[];
}

const jobs = new Map<string, CrawlJob>();

export const startManualCrawl = async (req: AuthenticatedRequest, res: Response) => {
  let { url, maxPages = 50 } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  try {
    new URL(url); // validate
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid URL' });
  }

  const jobId = Math.random().toString(36).substring(7);
  const job: CrawlJob = {
    id: jobId,
    startUrl: url,
    maxPages,
    isRunning: true,
    pagesCrawled: 0,
    urlsDiscovered: 1,
    failedCount: 0,
    results: [{ url, status: 'Pending' }],
    visited: new Set(),
    queue: [url]
  };

  jobs.set(jobId, job);
  
  // Start crawler asynchronously
  processCrawl(job);

  res.json({ success: true, jobId });
};

export const getManualCrawlStatus = (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  res.json({
    success: true,
    data: {
      id: job.id,
      startUrl: job.startUrl,
      maxPages: job.maxPages,
      isRunning: job.isRunning,
      pagesCrawled: job.pagesCrawled,
      urlsDiscovered: job.urlsDiscovered,
      failedCount: job.failedCount,
      results: job.results
    }
  });
};

export const stopManualCrawl = (req: AuthenticatedRequest, res: Response) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.isRunning = false;
  res.json({ success: true, message: 'Crawler stopped' });
};

import { scoreDomain } from '../analysis/lexicalFilter';

export const analyzeManualUrl = (req: AuthenticatedRequest, res: Response) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname;
    const result = scoreDomain(domain);
    
    // Create a mini report
    const riskScore = Math.min(Math.round(result.score * 100), 100);
    const riskLevel = riskScore >= 70 ? 'CRITICAL' : riskScore >= 40 ? 'HIGH' : riskScore >= 15 ? 'MEDIUM' : 'LOW';
    
    const report = {
      domain,
      riskScore,
      riskLevel,
      reasons: result.reasons.length > 0 ? result.reasons : ['No immediate lexical threats detected.'],
      recommendation: riskScore >= 70 ? 'Block immediately. High probability of phishing.' :
                      riskScore >= 40 ? 'Investigate further. Suspicious patterns detected.' :
                      'Monitor. Domain appears relatively clean but ensure content is safe.'
    };
    
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid URL provided' });
  }
};

async function processCrawl(job: CrawlJob) {
  const baseUrlObj = new URL(job.startUrl);
  const baseDomain = baseUrlObj.hostname;

  while (job.isRunning && job.queue.length > 0 && job.pagesCrawled < job.maxPages) {
    const currentUrl = job.queue.shift()!;
    if (job.visited.has(currentUrl)) continue;
    
    job.visited.add(currentUrl);
    
    const resultItem = job.results.find(r => r.url === currentUrl);
    if (!resultItem) continue;

    try {
      // Basic delay
      await new Promise(r => setTimeout(r, 500));
      
      const response = await fetch(currentUrl, {
        headers: { 'User-Agent': 'PayGuard-SimpleCrawler/1.0' }
      });
      
      resultItem.status = response.status;
      job.pagesCrawled++;

      if (response.ok) {
        const text = await response.text();
        // Regex to find links
        const linkRegex = /<a[^>]+href=["']([^"']+)["']/gi;
        let match;
        while ((match = linkRegex.exec(text)) !== null) {
          const href = match[1];
          try {
            const absoluteUrl = new URL(href, currentUrl).href;
            const parsedObj = new URL(absoluteUrl);
            
            // Only same domain, ignore fragments
            if (parsedObj.hostname === baseDomain) {
              parsedObj.hash = ''; // Remove fragments
              const cleanUrl = parsedObj.href;
              
              if (!job.visited.has(cleanUrl) && !job.queue.includes(cleanUrl)) {
                job.queue.push(cleanUrl);
                job.urlsDiscovered++;
                job.results.push({ url: cleanUrl, status: 'Pending' });
              }
            }
          } catch (e) {
            // Invalid URL format, ignore
          }
        }
      } else {
        job.failedCount++;
      }
    } catch (err) {
      resultItem.status = 'Failed';
      job.pagesCrawled++;
      job.failedCount++;
    }
  }

  job.isRunning = false;
}
