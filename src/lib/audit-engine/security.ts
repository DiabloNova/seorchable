/**
 * SSRF and Security Verification Layer for the Audit Engine.
 * Detects and blocks local, loopback, private IP ranges, and unsafe hosts.
 */
export function verifyUrlSafety(normalizedUrl: string): { safe: boolean; reason?: string } {
  try {
    const parsed = new URL(normalizedUrl);
    const host = parsed.hostname.toLowerCase();

    // 1. Block explicit local and reserved domain patterns
    const blockedPatterns = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "[::1]",
      "169.254.169.254", // AWS/GCP Metadata endpoint
      "metadata.google.internal",
      ".local",
      ".test",
      "host.docker.internal"
    ];

    if (blockedPatterns.some(pat => host.includes(rec(pat)))) {
      return { safe: false, reason: "Forbidden URL: Host resolves to a private or loopback interface (SSRF Prevention)." };
    }

    // 2. Block private IP ranges (CIDR approximations)
    // Matches 10.x.x.x, 192.168.x.x, 172.16.x.x to 172.31.x.x
    const privateIpRegex = /^(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+)$/;
    if (privateIpRegex.test(host)) {
      return { safe: false, reason: "Forbidden URL: Target IP falls within a protected private network range." };
    }

    return { safe: true };
  } catch (_) {
    return { safe: false, reason: "Malformed URL validation failure." };
  }
}

// Utility helper to safely sanitize strings
function rec(input: string): string {
  return input.trim().toLowerCase();
}
