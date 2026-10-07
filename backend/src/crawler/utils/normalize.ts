import { URL } from 'url';

/**
 * Re-fang URLs that have been defanged (e.g., hxxp://example[.]com)
 */
export function refang(urlStr: string): string {
  let fanged = urlStr;
  
  // Replace hxxp / hxxps with http / https
  fanged = fanged.replace(/hxxps?:\/\//gi, (match) => {
    return match.toLowerCase().replace('hxxp', 'http');
  });

  // Remove brackets around dots, e.g. [.] or (.)
  fanged = fanged.replace(/\[\.\]|\(\.\)|\{\.\}/g, '.');

  return fanged;
}

/**
 * Normalizes a URL:
 * - lowercase host (done by URL parser automatically)
 * - strip fragments
 * - strip tracking parameters (utm_*, etc.)
 * - removes trailing slash
 */
export function normalizeUrl(rawUrl: string): string | null {
  try {
    const fanged = refang(rawUrl.trim());
    
    // Auto-prepend http if missing to parse as URL
    const urlStr = (!fanged.startsWith('http://') && !fanged.startsWith('https://')) 
      ? `http://${fanged}` 
      : fanged;
      
    const parsed = new URL(urlStr);
    
    // Strip hash
    parsed.hash = '';
    
    // Strip common tracking parameters
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }
    
    let result = parsed.toString();
    
    // Remove trailing slash
    if (result.endsWith('/')) {
      result = result.slice(0, -1);
    }
    
    return result;
  } catch (err) {
    return null;
  }
}
