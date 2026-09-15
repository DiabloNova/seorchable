---
name: security-review
description: Perform a focused security review or hardening pass for authentication, authorization, multi-tenancy, SSRF, secrets, cookies, APIs, external services, and other trust boundaries in Seorchable.
---

# Security Review

Review the actual attack surface, not just the changed lines.

## Procedure

1. Identify the assets, actors, trust boundaries, privileged operations, and attacker-controlled inputs affected by the task.
2. Trace input from entry point through validation, authorization, persistence, external calls, and output.
3. Verify authentication and authorization server-side. Never treat client redirects, hidden UI, client-provided roles, or tenant IDs as authorization.
4. For user-controlled URLs, inspect protocol validation, private/loopback/link-local/metadata blocking, redirect handling, DNS/IP edge cases, and the repository's approved SSRF defense.
5. Inspect secret handling, logs, responses, URLs, cookies, client bundles, error messages, and environment-variable behavior.
6. Check replay, expiry, CSRF, enumeration, rate limiting, session invalidation, and tenant isolation where applicable.
7. Review tests for both positive and negative security cases. Add a regression test for every concrete vulnerability fixed.
8. Run the smallest relevant security and functional checks, then broaden validation for high-risk changes.

## Fail-closed rules

- Missing required security configuration must not silently enable a weak mode in production.
- Authorization failure must not fall back to a client-supplied identity or tenant.
- Provider failure must not become fabricated product data.
- Never log secrets, credentials, session material, reset tokens, or sensitive personal data.
- Never weaken an existing security control solely to make a test or local flow pass.

## Review output

Classify findings as critical, high, medium, low, or informational only when evidence supports the classification. For every material finding include the affected boundary, exploit precondition, consequence, evidence, minimal remediation, and verification status.

## Done when

- Relevant trust boundaries were explicitly reviewed.
- Negative/security cases are covered or their absence is stated.
- No security claim is based solely on client behavior.
- The final diff was reviewed for accidental weakening or secret exposure.
