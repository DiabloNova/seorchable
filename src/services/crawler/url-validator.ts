import { URL } from "node:url";
import dns from "node:dns/promises";

/**
 * Validates a URL to prevent Server-Side Request Forgery (SSRF) and ensure it's safe to crawl.
 * Rejects private IPs, loopback, non-HTTP schemes, etc.
 * Uses DNS resolution to prevent bypass via custom domains or DNS rebinding (basic protection).
 */
export async function isSafeUrlAsync(urlString: string): Promise<boolean> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    return false; // Invalid URL structure
  }

  // 1. Only allow http and https schemes
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return false;
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 2. Reject known local hostnames immediately
  if (hostname === "localhost" || hostname === "ip6-localhost") {
    return false;
  }

  // 3. Resolve DNS to get actual IP addresses
  const addresses: string[] = [];

  // If it's already an IP, we can just check it, but dns.lookup handles IPs natively
  try {
    // lookup returns the first resolved IP or the IP itself if it's already an IP string
    const result = await dns.lookup(hostname);
    addresses.push(result.address);
  } catch (error: any) {
    // If DNS fails to resolve, it's not a safe URL to crawl
    return false;
  }

  // 4. Check all resolved IPs against blocklists
  for (const ip of addresses) {
    if (!isSafeIp(ip)) {
      return false;
    }
  }

  return true;
}

function isSafeIp(ip: string): boolean {
  // IPv4 checks
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Regex);

  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    // Loopback (127.0.0.0/8)
    if (octet1 === 127) return false;
    // Private (10.0.0.0/8)
    if (octet1 === 10) return false;
    // Private (172.16.0.0/12)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
    // Private (192.168.0.0/16)
    if (octet1 === 192 && octet2 === 168) return false;
    // Link-local (169.254.0.0/16) - Cloud metadata
    if (octet1 === 169 && octet2 === 254) return false;
    // Zero (0.0.0.0/8)
    if (octet1 === 0) return false;
  } else {
    // IPv6 checks
    const normalizedIpv6 = ip.toLowerCase();

    // Loopback
    if (normalizedIpv6 === "::1") return false;

    // Expand shorthand if necessary for simple prefix checking
    // But typically node dns returns expanded or standard forms.
    // Check for Unique Local (fc00::/7) and Link-Local (fe80::/10)
    if (normalizedIpv6.startsWith("fc") || normalizedIpv6.startsWith("fd")) return false;
    if (normalizedIpv6.startsWith("fe8") || normalizedIpv6.startsWith("fe9") ||
        normalizedIpv6.startsWith("fea") || normalizedIpv6.startsWith("feb")) return false;
  }
  return true;
}
