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
import { TenantContextManager } from "../../../src/core/database/tenant-context";
import { ingestDocumentAction } from "../../../src/app/actions/ingestion";
import { queryKnowledgeGraphAction } from "../../../src/app/actions/query";
import { requireWorkspaceMembership, requireRole } from "../../../src/services/auth/authorization";

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

// Track intercepted Tenant Context values to verify protected actions resolve session context correctly
let lastInterceptedTenantId = "";
let lastInterceptedUserId = "";

// Mock TenantContextManager.runWithTenantContext to avoid hitting database / vector store / AI providers during security boundary testing
const originalRunWithTenantContext = TenantContextManager.runWithTenantContext;
TenantContextManager.runWithTenantContext = async function (tenantId, userId, requestId, work, options) {
  lastInterceptedTenantId = tenantId;
  lastInterceptedUserId = userId;
  return { mockResult: "success" } as any;
};

export async function runAuthTests() {
  console.log("▶ Running Server-Side Authentication Foundation & Boundary Hardening Tests...");

  const mockUser: User = {
    id: "usr-test-123",
    name: "Test Engineer",
    email: "test@seorchable.ir",
    role: "workspace_admin",
    workspaceId: "ws-test-99"
  };

  // ----------------------------------------------------
  // Scenario 1: Cryptographic signature validation
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Scenario 2: Session Creation & Cookie Attributes
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Scenario 3: Session Validation (Success Path)
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Scenario 4: requireSession Success & Failure Paths (Fail-Closed)
  // ----------------------------------------------------
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
  mockCookieStore.set("seorchable_session", {
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

  // ----------------------------------------------------
  // Scenario 5: Tenant Cookie Tampering Test
  // ----------------------------------------------------
  console.log("  * Testing Tenant Cookie Tampering (Spoofing) Resilience...");
  // Re-establish a valid signed session
  await createSession(mockUser);

  // Set standard plain cookie to some attacker-controlled forged value
  mockCookieStore.store.set("tenant_id", {
    value: "ws-hacker-forged-tenant",
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });

  // Verify that requireSession() returns the actual secure tenant and completely ignores the fake plain cookie
  const activeSessionUnderTenantSpoof = await requireSession();
  if (activeSessionUnderTenantSpoof.user?.workspaceId !== mockUser.workspaceId) {
    throw new Error(`Security Boundary Violation: Tampered tenant_id cookie altered the resolved workspace. Expected ${mockUser.workspaceId}, got ${activeSessionUnderTenantSpoof.user?.workspaceId}`);
  }
  console.log("    ✅ Success: Tampered tenant cookie was ignored.");

  // ----------------------------------------------------
  // Scenario 6: User Cookie Tampering Test
  // ----------------------------------------------------
  console.log("  * Testing User Cookie Tampering (Spoofing) Resilience...");
  await createSession(mockUser);

  // Set standard plain cookie to some attacker-controlled forged value
  mockCookieStore.store.set("user_id", {
    value: "usr-hacker-forged-id",
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });

  // Verify that getAuthenticatedUser() returns the actual secure user and completely ignores the fake plain cookie
  const activeUserUnderUserSpoof = await getAuthenticatedUser();
  if (!activeUserUnderUserSpoof || activeUserUnderUserSpoof.id !== mockUser.id) {
    throw new Error(`Security Boundary Violation: Tampered user_id cookie altered the resolved user. Expected ${mockUser.id}, got ${activeUserUnderUserSpoof?.id}`);
  }
  console.log("    ✅ Success: Tampered user cookie was ignored.");

  // ----------------------------------------------------
  // Scenario 7: Combined Identity Tampering Test
  // ----------------------------------------------------
  console.log("  * Testing Combined User + Tenant Cookies Tampering Resilience...");
  await createSession(mockUser);

  // Set both plain compatibility cookies to hacker values
  mockCookieStore.store.set("user_id", {
    value: "usr-hacker-forged-id",
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });
  mockCookieStore.store.set("tenant_id", {
    value: "ws-hacker-forged-tenant",
    httpOnly: true,
    sameSite: "strict",
    path: "/"
  });

  const combinedSession = await requireSession();
  if (combinedSession.user?.id !== mockUser.id || combinedSession.user?.workspaceId !== mockUser.workspaceId) {
    throw new Error(`Security Boundary Violation: Combined tampering influenced the resolved identity. Resolved: ${combinedSession.user?.id} / ${combinedSession.user?.workspaceId}`);
  }
  console.log("    ✅ Success: Combined user + tenant cookie tampering was fully ignored.");

  // ----------------------------------------------------
  // Scenario 8: Protected Server Actions Forgery & Resolution Tests
  // ----------------------------------------------------
  console.log("  * Testing Protected Server Action Identity Resolution under attack...");
  // Set valid signed session (ws-test-99, usr-test-123) and spoof cookies simultaneously
  await createSession(mockUser);
  mockCookieStore.store.set("user_id", { value: "usr-forged-b", httpOnly: true });
  mockCookieStore.store.set("tenant_id", { value: "ws-forged-b", httpOnly: true });

  // Reset trackers
  lastInterceptedTenantId = "";
  lastInterceptedUserId = "";

  // Trigger Ingestion Action
  const ingestRes = await ingestDocumentAction({ text: "Protected data test." });
  if (!ingestRes.success) {
    throw new Error(`Protected Action Failed: ingestDocumentAction rejected request with valid session: ${JSON.stringify(ingestRes)}`);
  }
  // Verify that identity passed to tenant context was resolved from the session, NOT the forged cookies!
  if (lastInterceptedTenantId !== mockUser.workspaceId || lastInterceptedUserId !== mockUser.id) {
    throw new Error(`Security Boundary Violation: Ingest action trusted client-controlled identity cookies! Tenant: ${lastInterceptedTenantId}, User: ${lastInterceptedUserId}`);
  }

  // Reset trackers
  lastInterceptedTenantId = "";
  lastInterceptedUserId = "";

  // Trigger Query Action
  const queryRes = await queryKnowledgeGraphAction({ question: "Is this secure?" });
  if (!queryRes.success) {
    throw new Error(`Protected Action Failed: queryKnowledgeGraphAction rejected request with valid session: ${JSON.stringify(queryRes)}`);
  }
  // Verify again
  if (lastInterceptedTenantId !== mockUser.workspaceId || lastInterceptedUserId !== mockUser.id) {
    throw new Error(`Security Boundary Violation: Query action trusted client-controlled identity cookies! Tenant: ${lastInterceptedTenantId}, User: ${lastInterceptedUserId}`);
  }
  console.log("    ✅ Success: Protected Server Actions safely executed using server-derived identity and ignored hacker cookies.");

  // ----------------------------------------------------
  // Scenario 9: Protected Server Actions Fail Closed when Unauthenticated
  // ----------------------------------------------------
  console.log("  * Testing Protected Server Actions Fail-Closed design when unauthenticated...");
  // Clear the active session, but leave hacker cookies set
  mockCookieStore.delete("seorchable_session");

  const ingestUnauthRes = await ingestDocumentAction({ text: "Should fail." });
  if (ingestUnauthRes.success || !ingestUnauthRes.error?.includes("Unauthorized")) {
    throw new Error(`Fail-Closed Violation: ingestDocumentAction succeeded or did not return unauthorized error when session is missing: ${JSON.stringify(ingestUnauthRes)}`);
  }

  const queryUnauthRes = await queryKnowledgeGraphAction({ question: "Should fail." });
  if (queryUnauthRes.success || !queryUnauthRes.error?.includes("Unauthorized")) {
    throw new Error(`Fail-Closed Violation: queryKnowledgeGraphAction succeeded or did not return unauthorized error when session is missing: ${JSON.stringify(queryUnauthRes)}`);
  }
  console.log("    ✅ Success: Protected Server Actions failed closed safely when unauthenticated.");

  // ----------------------------------------------------
  // Scenario 10: Logout & Session Invalidation
  // ----------------------------------------------------
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

  // Attempt to requireSession() after logout -> must throw Unauthorized
  try {
    await requireSession();
    throw new Error("Logout Failure: requireSession did not fail closed on logged out session");
  } catch (err: any) {
    if (err.message && err.message.includes("Unauthorized")) {
      // Correct!
    } else {
      throw err;
    }
  }

  // ----------------------------------------------------
  // Scenario 11: Workspace Membership & Tenant Isolation Tests
  // ----------------------------------------------------
  console.log("  * Testing Workspace Membership Enforcements...");
  // User is member of ws-test-99
  await createSession(mockUser);

  // 11.1 Accessing own workspace -> ALLOW
  try {
    await requireWorkspaceMembership(mockUser.id, "ws-test-99");
    console.log("    ✅ Success: Member access to own workspace allowed.");
  } catch (err) {
    throw new Error(`Workspace Membership Failed: Member was blocked from own workspace: ${err}`);
  }

  // 11.2 Accessing another workspace -> DENY
  try {
    await requireWorkspaceMembership(mockUser.id, "ws-other-hacker-tenant");
    throw new Error("Workspace Membership Violation: Non-member was allowed access to another workspace!");
  } catch (err: any) {
    if (err.message && err.message.includes("is not a member")) {
      console.log("    ✅ Success: Non-member access to another workspace correctly denied.");
    } else {
      throw err;
    }
  }

  // 11.3 Super Admin accessing any workspace -> ALLOW
  const superAdminUser: User = { ...mockUser, role: "super_admin", workspaceId: "ws-admin-home" };
  await createSession(superAdminUser);
  try {
    await requireWorkspaceMembership(superAdminUser.id, "ws-some-customer-workspace");
    console.log("    ✅ Success: Super Admin allowed access to any workspace.");
  } catch (err) {
    throw new Error(`Workspace Membership Failed: Super admin was blocked from customer workspace: ${err}`);
  }

  // ----------------------------------------------------
  // Scenario 12: Role-Based Access Control (RBAC) Hierarchy Tests
  // ----------------------------------------------------
  console.log("  * Testing Role-Based Access Control (RBAC) Hierarchies...");
  // 12.1 Viewer role trying to run admin-only operation -> DENY
  const viewerUser: User = { ...mockUser, role: "viewer" };
  await createSession(viewerUser);
  try {
    await requireRole("workspace_admin");
    throw new Error("RBAC Security Violation: Viewer was allowed to perform workspace_admin actions!");
  } catch (err: any) {
    if (err.message && err.message.includes("Insufficient privileges")) {
      console.log("    ✅ Success: Viewer role correctly blocked from workspace_admin actions.");
    } else {
      throw err;
    }
  }

  // 12.2 Admin role executing admin-only operation -> ALLOW
  await createSession(mockUser); // role: workspace_admin
  try {
    await requireRole("workspace_admin");
    console.log("    ✅ Success: Admin allowed to perform workspace_admin actions.");
  } catch (err) {
    throw new Error(`RBAC Failed: Admin was blocked from admin operation: ${err}`);
  }

  // 12.3 Admin role executing viewer operation -> ALLOW
  try {
    await requireRole("viewer");
    console.log("    ✅ Success: Admin allowed to perform viewer actions.");
  } catch (err) {
    throw new Error(`RBAC Failed: Admin was blocked from viewer operation: ${err}`);
  }

  // 12.4 Super Admin executing any operation -> ALLOW
  await createSession(superAdminUser); // role: super_admin
  try {
    await requireRole("workspace_admin");
    await requireRole("super_admin");
    console.log("    ✅ Success: Super Admin allowed to perform all actions.");
  } catch (err) {
    throw new Error(`RBAC Failed: Super Admin was blocked: ${err}`);
  }

  console.log("✅ All Server-Side Authentication Foundation & Hardening Tests Passed Successfully!");
}

// Execute tests if run directly
if (require.main === module) {
  runAuthTests().catch((err) => {
    console.error("❌ Test Suite Failed with Error:", err);
    process.exit(1);
  });
}
