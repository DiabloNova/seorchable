import { test, expect, describe, vi, beforeAll, afterAll } from "vitest";
import { registerAction, loginAction, verifyEmailAction } from "../../../src/app/actions/auth";
import { TenantContextManager } from "../../../src/core/database/tenant-context";

// Mock Next.js headers since they are used in auth
vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key) => {
      if (key === "x-forwarded-for") return "127.0.0.1";
      return null;
    }),
  })),
}));

// Mock cookies for createSession
const mockCookieStore = {
  store: new Map<string, any>(),
  get: vi.fn((name) => mockCookieStore.store.get(name)),
  set: vi.fn((name, value, options) => mockCookieStore.store.set(name, { value, name, ...options })),
  delete: vi.fn((name) => mockCookieStore.store.delete(name)),
};

vi.mock("next/headers", async (importOriginal) => {
  const mod = await importOriginal<typeof import("next/headers")>();
  return {
    ...mod,
    cookies: vi.fn(() => mockCookieStore),
    headers: vi.fn(() => ({
      get: vi.fn((key) => {
        if (key === "x-forwarded-for") return "127.0.0.1";
        return null;
      }),
    })),
  };
});

describe("Authentication Flow E2E (Mock DB)", () => {
  let mockDb: any = {};

  beforeAll(() => {
    // Mock the db client
    const originalRun = TenantContextManager.runWithSystemContext;
    vi.spyOn(TenantContextManager, "runWithSystemContext").mockImplementation(async (userId, reason, work) => {
      const mockClient = {
        query: vi.fn(async (sql, params) => {
          if (sql.includes("INSERT INTO users")) {
             const id = params[0];
             const email = params[2];
             const is_active = params[4];
             const email_verified = params[5];
             const email_verified_at = params[6];
             const password_hash = params[3];
             mockDb.user = { id, email, is_active, email_verified, email_verified_at, password_hash, failed_login_attempts: 0 };
             return { rows: [] };
          }
          if (sql.includes("INSERT INTO organizations")) {
             return { rows: [] };
          }
          if (sql.includes("INSERT INTO organization_members")) {
             mockDb.member = { user_id: params[1], organization_id: params[0], role: params[2] };
             return { rows: [] };
          }
          if (sql.includes("SELECT * FROM users WHERE email")) {
             if (mockDb.user && mockDb.user.email === params[0]) return { rows: [mockDb.user] };
             return { rows: [] };
          }
          if (sql.includes("UPDATE users SET failed_login_attempts = failed_login_attempts + 1")) {
             if (mockDb.user) mockDb.user.failed_login_attempts++;
             return { rows: [{ failed_login_attempts: mockDb.user?.failed_login_attempts }] };
          }
          if (sql.includes("UPDATE users SET failed_login_attempts = 0")) {
             if (mockDb.user) mockDb.user.failed_login_attempts = 0;
             return { rows: [] };
          }
          if (sql.includes("SELECT m.organization_id")) {
             if (mockDb.member && mockDb.member.user_id === params[0]) return { rows: [{ workspaceId: mockDb.member.organization_id, role: mockDb.member.role, workspaceName: "Test" }] };
             return { rows: [] };
          }
          if (sql.includes("UPDATE users SET email_verified = true")) {
             if (mockDb.user) {
                mockDb.user.email_verified = true;
                mockDb.user.email_verified_at = params[0];
                return { rowCount: 1 };
             }
             return { rowCount: 0 };
          }
          return { rows: [] };
        }),
      };

      const prevGet = TenantContextManager.getDbClient;
      TenantContextManager.getDbClient = () => mockClient as any;
      try {
        return await work();
      } finally {
        TenantContextManager.getDbClient = prevGet;
      }
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("Register creates a user with email_verified = false", async () => {
    const user = await registerAction("Test User", "test@test.com", "password123");
    expect(user.email).toBe("test@test.com");
    expect(mockDb.user.email_verified).toBe(false);
  });

  test("Login fails if email is not verified", async () => {
    await expect(loginAction("test@test.com", "password123")).rejects.toThrow("Invalid credentials or user not found.");
  });

  test("verifyEmailAction updates email verification state", async () => {
    const success = await verifyEmailAction("test@test.com", "123456");
    expect(success).toBe(true);
    expect(mockDb.user.email_verified).toBe(true);
    expect(mockDb.user.email_verified_at).not.toBeNull();
  });

  test("Login succeeds after email verification", async () => {
    const user = await loginAction("test@test.com", "password123");
    expect(user.email).toBe("test@test.com");
    expect(user.role).toBe("viewer");
  });

  test("Login fails with invalid password", async () => {
    await expect(loginAction("test@test.com", "wrongpass")).rejects.toThrow("Invalid credentials or user not found.");
    expect(mockDb.user.failed_login_attempts).toBe(1);
  });
});
