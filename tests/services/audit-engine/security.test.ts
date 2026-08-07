import { verifyUrlSafety } from "../../../src/lib/audit-engine/security";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function testSecuritySSRF() {
  console.log("▶ Running Security SSRF Mitigation Tests...");

  // Safe public targets
  assert(verifyUrlSafety("https://seorchable.ir").safe === true, "Public target should be marked safe");
  assert(verifyUrlSafety("http://mybrand.com/blog").safe === true, "Standard HTTP public blog should be safe");

  // SSRF Loopbacks & local IP targets
  assert(verifyUrlSafety("http://localhost/admin").safe === false, "localhost must be blocked");
  assert(verifyUrlSafety("https://127.0.0.1/dashboard").safe === false, "127.0.0.1 must be blocked");
  assert(verifyUrlSafety("http://169.254.169.254/latest/meta-data/").safe === false, "Cloud metadata IP must be blocked");
  assert(verifyUrlSafety("http://10.0.0.1/").safe === false, "Private IP Class A must be blocked");
  assert(verifyUrlSafety("http://192.168.1.1/router").safe === false, "Private IP Class C must be blocked");

  console.log("✓ Security SSRF Mitigation Tests Passed.");
}

if (require.main === module) {
  testSecuritySSRF().catch(err => {
    console.error("❌ Test Failures:", err);
    process.exit(1);
  });
}
