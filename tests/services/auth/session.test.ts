import {
  createSession,
  getSession,
  requireSession,
  getAuthenticatedUser,
  invalidateSession,
  signPayload,
  verifyPayload,
  setCookiesMock
} from "../../../src/services/auth/session";
import { User } from "../../../src/types/auth";

// Mock implementation of the cookie store
const mockCookieStore = {
  store: new Map<string, any>(),
  get(name: string) {
    return this.store.get(name);
  },
  set(name: string, value: any, options: any) {
    this.store.set(name, { value, name, ...options });
  },
  delete(name: string) {
    this.store.delete(name);
  },
  clear() {
    this.store.clear();
  }
};

// Register our mock cookie function
setCookiesMock(() => Promise.resolve(mockCookieStore));

export async function runAuthTests() {
  console.log("▶ Running Server-Side Authentication Foundation Tests...");

  const mockUser: User = {
    id: "usr-test-123",
    name: "Test Engineer",
    email: "test@seorchable.ir",
    role: "workspace_admin",
    workspaceId: "ws-test-99"
  };

  // Scenario 1: Cryptographic signature validation
  console.log("  * Testing Cryptographic Integrity Verification...");
  const samplePayload = "my-test-payload-data";
  const signature = signPayload(samplePayload);
  if (!verifyPayload(samplePayload, signature)) {
    throw new Error("Integrity Test Failed: Signature verification failed on valid payload");
  }
  if (verifyPayload(samplePayload, signature + "tampered")) {
    throw new Error("Integrity Test Failed: Accepted tampered signature");
  }
  if (verifyPayload(samplePayload + "tampered", signature)) {
    throw new Error("Integrity Test Failed: Accepted tampered payload");
  }

  // Scenario 2: Session Creation & Cookie Attributes
  console.log("  * Testing Session Creation...");
  mockCookieStore.clear();
  await createSession(mockUser);

  const sessionCookie = mockCookieStore.store.get("seorchable_session");
  if (!sessionCookie) {
    throw new Error("Session Creation Failed: seorchable_session cookie not found");
  }

  // Verify cookie security attributes
  if (sessionCookie.httpOnly !== true) {
    throw new Error("Session Cookie Security Failed: httpOnly attribute is not set to true");
  }
  if (sessionCookie.sameSite !== "strict") {
    throw new Error("Session Cookie Security Failed: sameSite attribute is not set to strict");
  }
  if (sessionCookie.path !== "/") {
    throw new Error("Session Cookie Security Failed: path attribute is not set to '/'");
  }
  if (!sessionCookie.expires) {
    throw new Error("Session Cookie Expiration Failed: expires attribute is missing");
  }

  // Verify plain compatibility cookies are set
  const tenantCookie = mockCookieStore.store.get("tenant_id");
  const userCookie = mockCookieStore.store.get("user_id");
  if (!tenantCookie || tenantCookie.value !== mockUser.workspaceId) {
    throw new Error("Session Creation Failed: tenant_id cookie was not set or mismatched");
  }
  if (!userCookie || userCookie.value !== mockUser.id) {
    throw new Error("Session Creation Failed: user_id cookie was not set or mismatched");
  }

  // Scenario 3: Session Validation (Success Path)
  console.log("  * Testing Session Validation & Identity Resolution (Success path)...");
  const parsedSession = await getSession();
  if (!parsedSession) {
    throw new Error("Session Validation Failed: Expected valid session, got null");
  }
  if (parsedSession.status !== "authenticated") {
    throw new Error(`Session Validation Failed: Expected status "authenticated", got "${parsedSession.status}"`);
  }
  if (!parsedSession.user || parsedSession.user.id !== mockUser.id) {
    throw new Error("Session Identity Resolution Failed: Parsed user ID does not match");
  }

  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser || authenticatedUser.id !== mockUser.id) {
    throw new Error("Identity Resolution Failed: getAuthenticatedUser returned incorrect user");
  }

  // Scenario 4: requireSession Success & Failure Paths (Fail-Closed)
  console.log("  * Testing Fail-Closed Requirements...");
  const validSession = await requireSession();
  if (!validSession || validSession.user?.id !== mockUser.id) {
    throw new Error("requireSession Failed: valid session was rejected");
  }

  // Missing session -> rejected
  mockCookieStore.clear();
  try {
    await requireSession();
    throw new Error("Fail-Closed Security Mismatch: requireSession did not fail closed on missing session");
  } catch (err: any) {
    if (err.message && err.message.includes("Unauthorized")) {
      // Correct!
    } else {
      throw err;
    }
  }

  const missingSessionResult = await getSession();
  if (missingSessionResult !== null) {
    throw new Error("Fail-Closed Security Mismatch: getSession did not return null on missing session");
  }

  // Invalid/Tampered Signature -> rejected
  await createSession(mockUser);
  const originalCookieValue = mockCookieStore.store.get("seorchable_session").value;
  // Tamper signature
  mockCookieStore.store.set("seorchable_session", {
    value: originalCookieValue + "abc",
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });
  const tamperedSigResult = await getSession();
  if (tamperedSigResult !== null) {
    throw new Error("Fail-Closed Security Mismatch: Tampered signature was accepted!");
  }

  // Tamper Payload -> rejected
  const [payloadBase64, originalSig] = originalCookieValue.split(".");
  const tamperedPayloadStr = Buffer.from(
    JSON.stringify({
      user: { ...mockUser, role: "super_admin" }, // Hack to privilege escalate
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  ).toString("base64url");
  mockCookieStore.store.set("seorchable_session", {
    value: `${tamperedPayloadStr}.${originalSig}`, // Payload changed, signature kept original
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });
  const tamperedPayloadResult = await getSession();
  if (tamperedPayloadResult !== null) {
    throw new Error("Fail-Closed Security Mismatch: Privilege escalation payload was accepted with old signature!");
  }

  // Expired Session -> rejected
  const expiredPayloadStr = Buffer.from(
    JSON.stringify({
      user: mockUser,
      expiresAt: new Date(Date.now() - 5000).toISOString() // Expired 5 seconds ago
    })
  ).toString("base64url");
  const expiredSignature = signPayload(expiredPayloadStr);
  mockCookieStore.store.set("seorchable_session", {
    value: `${expiredPayloadStr}.${expiredSignature}`,
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });
  const expiredResult = await getSession();
  if (expiredResult !== null) {
    throw new Error("Fail-Closed Security Mismatch: Expired session was accepted!");
  }

  // Scenario 5: Logout & Session Invalidation
  console.log("  * Testing Logout & Invalidation...");
  await createSession(mockUser);
  if (!(await getSession())) {
    throw new Error("Setup Failed: Active session not created before testing logout");
  }

  await invalidateSession();

  // Subsequent protected requests must fail authentication
  const sessionAfterLogout = await getSession();
  if (sessionAfterLogout !== null) {
    throw new Error("Logout Failed: Session is still valid after invalidation");
  }

  const cookieAfterLogout = mockCookieStore.store.get("seorchable_session");
  if (cookieAfterLogout) {
    throw new Error("Logout Failed: seorchable_session cookie was not deleted/cleared");
  }

  console.log("✅ All Server-Side Authentication Foundation Tests Passed Successfully!");
}

// Execute tests if run directly
if (require.main === module) {
  runAuthTests().catch((err) => {
    console.error("❌ Test Suite Failed with Error:", err);
    process.exit(1);
  });
}
