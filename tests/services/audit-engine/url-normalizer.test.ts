import { normalizeAndValidateUrl } from "../../../src/lib/audit-engine/url-normalizer";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testUrlNormalizer() {
  console.log("▶ Running URL Normalizer Tests...");

  // Valid inputs
  assert(normalizeAndValidateUrl("seorchable.ir") === "https://seorchable.ir/", "Should default to HTTPS");
  assert(normalizeAndValidateUrl("  http://example.com/page/  ") === "http://example.com/page/", "Should trim spaces and preserve HTTP protocol");
  assert(normalizeAndValidateUrl("HTTPS://MYBRAND.COM") === "https://mybrand.com/", "Should normalize protocol and host to lowercase");

  // Invalid inputs
  assert(normalizeAndValidateUrl("") === null, "Empty input should return null");
  assert(normalizeAndValidateUrl("ftp://files.com") === null, "Non-HTTP/HTTPS protocol should return null");
  assert(normalizeAndValidateUrl("invalid-domain-with-spaces ") === null, "Spaces without proper domain parts should return null");

  console.log("✓ URL Normalizer Tests Passed.");
}

if (require.main === module) {
  testUrlNormalizer().catch(err => {
    console.error("❌ Test Failures:", err);
    process.exit(1);
  });
}
