import dns from 'dns';
import { promisify } from 'util';
import ipaddr from 'ipaddr.js';

const lookupAsync = promisify(dns.lookup);

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SSRFError';
  }
}

export async function resolveAndCheckSSRF(hostname: string): Promise<string> {
  let address: string;
  try {
    const res = await lookupAsync(hostname);
    address = res.address;
  } catch (err: any) {
    throw new SSRFError(`Failed to resolve hostname: ${hostname} - ${err.message}`);
  }

  return checkIP(address);
}

export function checkIP(address: string): string {
  let parsed: ipaddr.IPv4 | ipaddr.IPv6;
  try {
    parsed = ipaddr.parse(address);
  } catch (err) {
    throw new SSRFError(`Invalid IP address format: ${address}`);
  }

  const range = parsed.range();
  
  const unsafeRanges = [
    'private',
    'loopback',
    'linkLocal',
    'uniqueLocal',
    'ipv4Mapped',
    'rfc6052',
    'rfc6145',
    'unspecified',
    'multicast',
    'broadcast',
    'carrierGradeNat'
  ];

  if (unsafeRanges.includes(range)) {
    throw new SSRFError(`SSRF blocked: IP ${address} is in unsafe range '${range}'`);
  }

  if (address === '169.254.169.254') {
     throw new SSRFError(`SSRF blocked: Cloud metadata IP detected`);
  }

  return address;
}
