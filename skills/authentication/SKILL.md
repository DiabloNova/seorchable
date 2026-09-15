---
name: authentication
description: Audit, implement, or repair authentication, sessions, cookies, sign-up, login, logout, email verification, password reset, OAuth callbacks, and authorization boundaries in Seorchable.
---

# Authentication

Treat authentication as an end-to-end security boundary. Do not repair only the visible login form or one helper.

## Procedure

1. Build the lifecycle map: sign-up -> validation -> user persistence -> credential verification -> session creation -> cookie issuance -> session lookup -> protected request -> logout/revocation -> expiry. Include verification, reset, and OAuth paths when present.
2. Inspect the actual user schema, auth services, route handlers/server actions, middleware, protected pages/API routes, cookie configuration, environment variables, migrations, email/provider integrations, and tests.
3. Trace each auth value from its source to every consumer. Identify whether identity, workspace/tenant, and role are derived server-side or trusted from client-controlled data.
4. Reproduce failures at the real boundary before changing implementation. Add or identify a failing regression test where practical.
5. Repair the minimum coherent set of components. Preserve the existing architecture unless it is demonstrably incapable of satisfying the security requirement.
6. Verify session integrity, expiration, logout/revocation, authorization, cookie attributes, token lifecycle, and failure behavior—not only the happy-path login.

## Session rules

- Never use a random-per-process secret as a production session-secret fallback. A restart must not invalidate all sessions accidentally, and a missing production secret must fail closed.
- Do not store sensitive plaintext credentials or reset/verification tokens.
- Prefer opaque, server-side sessions when the repository architecture supports them; if signed-cookie sessions are retained, verify every security property explicitly and understand that the cookie contains the authoritative identity data.
- Do not treat `user_id`, `tenant_id`, role, or workspace cookies as authoritative unless they are cryptographically bound to a validated session and the server still authorizes the operation.
- Use `HttpOnly`, `Secure` in production, an appropriate `SameSite`, `Path`, and explicit expiry.
- Make verification/reset tokens single-use, purpose-bound, expiring, and stored as hashes where supported by the architecture.
- Authentication errors must fail closed and must not expose secrets or unnecessary account-existence information.

## Verification matrix

At minimum, cover:

- invalid credentials
- valid credentials
- duplicate/invalid sign-up input
- session creation and lookup
- expired/invalid/tampered session
- logout and revocation
- protected endpoint without a session
- authenticated user accessing another user's or tenant's data
- verification/reset token expiry and reuse
- cookie security attributes

Use real route/service boundaries where feasible. Do not claim auth is fixed because TypeScript compiles.

## Done when

- The full lifecycle is traced.
- The original failure is reproduced or its cause is proven from implementation.
- The fix addresses the actual trust boundary.
- Regression coverage exists for the failure mode.
- Relevant tests/build/lint/security checks were actually run and reported.
