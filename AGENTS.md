# Seorchable Repository Engineering and Verification Contract

## 1. Authority and purpose

This file is the single authoritative repository contract for AI-assisted work on Seorchable. It applies to Google Jules, other implementation agents, and the independent Supervisor/verifier. The task prompt defines the requested change; this contract defines how it must be investigated, implemented, validated, reported, and independently verified. If the task prompt conflicts with this contract, stop and resolve the conflict explicitly.

The current repository implementation is the primary source of truth. Code, configuration, dependencies, routes, schemas, migrations, tests, and runtime behavior take precedence over documentation, comments, plans, roadmaps, audit reports, and agent narratives. Security and tenant-isolation rules in this contract are permanent safeguards. Task-specific requirements apply only when the relevant subsystem or security boundary is in scope. Do not invent architecture or security requirements merely for completeness.

## 2. Roles and independence

### Jules, implementation agent

Jules investigates, plans, implements, tests, validates, audits the diff, and reports evidence. Jules must not approve its own implementation, act as the Supervisor, or present self-verification as independent verification.

Jules may report `STATUS: BLOCKED` as an implementation status. Only the independent Supervisor may classify a blocker as `BLOCKED_CONFIRMED`.

### Supervisor, independent verifier

The Supervisor is a separate verification role, not the implementation agent, and must not implement Jules' task unless explicitly instructed under a separate task. Jules' report is a set of claims to investigate, not evidence.

The Supervisor independently inspects the repository, relevant source, configuration, dependencies, migrations, tests, execution paths, Git diff, security assumptions, tenant isolation, and reported blockers. Where applicable, the Supervisor independently executes validation and reproduces behavior. Jules' validation output cannot substitute for independent verification.

The Supervisor returns exactly one final verdict: `PASS`, `FAIL`, `BLOCKED_CONFIRMED`, or `INSUFFICIENT_EVIDENCE`.

## 3. Engineering principles

Prefer, in order: existing architecture; existing abstractions and execution paths; existing security and tenant boundaries; existing infrastructure and conventions; minimal scoped changes; independently reproducible evidence.

Never prefer speculative architecture, duplicated infrastructure, ad-hoc security controls, unrelated refactoring, convenience over security, or assumptions over repository evidence. Do not invent product architecture, security architecture, migration systems, or cleanup systems merely to make a task appear complete.

## 4. Jules workflow

Every material Jules task must follow this sequence:

1. Reconnaissance.
2. Architecture verification.
3. Convention verification.
4. Security and tenant-boundary analysis.
5. Scope definition.
6. Blocker analysis.
7. Implementation.
8. Testing.
9. Validation.
10. Diff audit.
11. Evidence report.

The independent Supervisor verification occurs after the Jules task report and is governed by Section 14. Jules cannot perform or claim that independent verification step.

Do not skip reconnaissance because a change appears small. Before editing, locate and read relevant files, trace dependencies and consumers, inspect related tests and configuration, identify the actual execution path, and determine whether the requested behavior already partially exists.

Before creating an abstraction, search for existing services, repositories, domain objects, application services, security utilities, rate-limit mechanisms, distributed state, transaction helpers, authentication, recovery/challenge and continuation mechanisms, crypto utilities, tenant context, database factories, migration tooling, configuration, and test utilities. Follow real entry points, not only expected filenames or symbols.

## 5. Scope discipline

Before implementation, record task scope, allowed files, expected changes, security impact, potential migrations, required tests, and required validation.

Do not refactor unrelated code, rename unrelated symbols, clean unrelated formatting, upgrade unrelated dependencies, modify unrelated migrations, add unrelated features, or redesign architecture opportunistically.

If an additional change becomes necessary, it must be explicitly justified as directly required by the task. If it falls outside the declared allowed files, stop before editing and obtain authorization before continuing. Do not silently expand scope.

Every changed file must be directly justified. Any unrelated change is a failure. Record each file's actual change, task relevance, reason it changed, security impact, and verification verdict.

## 6. Evidence and absence claims

Every material claim must be supported by repository or execution evidence. Narrative is not evidence. For every absence claim, record the claim, search scope, architecture entry points, search terms, files inspected, commands, actual output, and conclusion.

Do not infer absence from one failed search or a missing expected filename. If inspection is incomplete, conclude `INSUFFICIENT_EVIDENCE`, not absence.

Maintain three truth states: `KNOWN_PRESENT`, `KNOWN_ABSENT`, and `UNKNOWN / INSUFFICIENT_EVIDENCE`. Never convert `SEARCH_FOUND_NOTHING` into `KNOWN_ABSENT` without sufficient architectural traversal.

Evidence quality, strongest first: direct runtime or database evidence; reproducible automated tests; direct source-code evidence; configuration or dependency evidence; repository search evidence; Jules' narrative. Stronger contradictory evidence prevails.

## 7. Repository and framework boundaries

Respect the established repository boundaries. Before relying on a directory, route, module, script, or tool, inspect the current repository tree and relevant references. This contract is not a permanent snapshot of filenames or layout.

The repository uses Next.js. Before changing Next.js-specific code, inspect the installed version and relevant documentation under `node_modules/next/dist/docs/`. Follow supported APIs and deprecation guidance.

Respect server/client boundaries. Keep server-only functionality on the server. Never expose API keys, database credentials, private tokens, secrets, or privileged operations to client code. Do not add `use client` unless required and its security and data-flow implications are understood.

## 8. Security baseline

Security boundaries must be enforced server-side. Never trust attacker-controlled form fields, query parameters, client flags, headers without an established trusted-proxy boundary, cookies, local storage, client state, hidden inputs, or route parameters as authorization. UI restrictions are not authorization. A flag such as `challengePassed=true` must never bypass server-side security.

Never bypass authentication or authorization for convenience. Preserve the existing authentication/session architecture unless the task explicitly requires changing it. Never expose sensitive authentication information.

### Authentication applicability

The detailed rules in this subsection apply to authentication or security-sensitive tasks. For unrelated tasks, perform and report only the reconnaissance and validation fields applicable to that task.

Before changing authentication, inspect the actual login path, user schema, authentication service, password storage and hashing, dependencies, migration system, rate-limit/security state, trusted-IP mechanism, recovery/challenge mechanism, continuation mechanism, and relevant tests. Do not invent missing security architecture. If no safe password-storage convention exists and introducing one is an unresolved security decision, report `STATUS: BLOCKED` with evidence.

Where password authentication applies, password input must reach the server, verification must occur server-side against the canonical hash, plaintext passwords must never be persisted or logged, and email-only authentication is forbidden. Where this contract requires password hashing, use Argon2id with `memoryCost: 19456` and `timeCost: 2`; do not weaken or duplicate the convention.

Unknown or unusable accounts must not create an enumeration oracle. Where verification is reached, unknown or missing-hash paths must use a dummy Argon2id hash with the required parameters where applicable. Unknown accounts must not mutate a real user's progressive state. External failures must have generic semantics.

### Trusted IP and hard lock

Never blindly trust `X-Forwarded-For`, `X-Real-IP`, or arbitrary client-controlled headers. Trust forwarded information only where the repository establishes the proxy or network boundary. If a required trusted-IP mechanism cannot be established safely, report `STATUS: BLOCKED` only after sufficient evidence proves its absence.

Hard lock and progressive authentication are separate mechanisms. Progressive authentication state must not be interpreted as hard-lock state.

Where a hard lock is required, identity is normalized email plus trusted source IP, threshold is five effective failures, and duration is fifteen minutes. It is not a global account lock: IP A must not lock a victim's account for IP B. Verify threshold, scope, expiration, atomicity, concurrency, and IP separation.

### Progressive authentication and challenge

Progressive state is server-side and distributed where required by the architecture. It has a fifteen-minute inactivity TTL. Only applicable authentication activity defined by the progressive state machine may refresh that TTL. Challenge failures, invalid continuations, and unrelated requests must not advance progressive failure state or refresh it unless the established state machine explicitly defines them as applicable activity. Successful authentication clears or resets the state.

Use **previous failure count** consistently:

- Previous count 0-2: no delay.
- Previous count 3: 20-second delay.
- Previous count 4: 5-minute delay.
- Previous count 5: 60-minute delay.
- Previous count 6: enter the challenge-required state.
- After count 6: remain challenge-required and do not use the ordinary password path without the required challenge.

A previous failure count of 6 means the next authentication attempt enters the challenge-required state before password verification or Argon2. Challenge completion permits password verification but does not authenticate the user. If the post-challenge password is wrong, that actual password-verification failure is the new failure recorded by the state machine. A failed challenge rejects, does not run Argon2, and does not itself advance progressive failure state. Challenge completion must never be convertible into authentication through a client flag.

Do not use a client-side delay as a security control. Do not hold database or distributed locks while delaying.

### Continuation, attacker-controlled state, and anti-enumeration

Multi-step state must be server-controlled, server-issued, unpredictable where applicable, bound to authentication context, time-limited, single-use or replay-protected, non-forgeable, and non-authenticating by itself. It must not encode email, user ID, tenant ID, failure count, or challenge-required state. Verify valid, invalid, expired, replayed, and context-mismatched continuations.

Attacker-triggerable security state must have bounds from creation: TTL, expiration, bounded cardinality and storage, bounded resource consumption, cleanup, replay protection, invalid-state handling, and concurrency behavior. Never create indefinite persistent rows keyed by arbitrary attacker-controlled identities. If safe bounds cannot be implemented with existing architecture, report `STATUS: BLOCKED` rather than inventing a cleanup subsystem.

For authentication changes, compare unknown email, known email with wrong password, missing hash, invalid hash, invalid/expired/replayed/context-mismatched continuation, failed challenge, and successful challenge with wrong password. Compare status, response shape, codes, messages, redirects, tokens, client flags, challenge indicators, timing-sensitive branches, database state, rate-limit state, progressive state, and security-state mutations. Do not reveal account existence, threshold state, challenge requirement, continuation validity, or privileged security branches.

### Concurrency and locks

Security state transitions must avoid lost updates, double increments, threshold bypass, lock corruption, TTL inconsistency, authentication races, and replay races. Use established atomic operations. For PostgreSQL concurrency or lock-lifetime claims, use real database synchronization, deterministic barriers or latches, competing transactions, and `pg_locks` where relevant. Mocks, sequential simulations, unsynchronized `Promise.all()`, `sleep()`, elapsed-runtime assertions, and mocked transactions do not prove these properties.

Release locks before delays, Argon2, challenge interaction, UI round trips, redirects, and external calls.

## 9. Tenant isolation

Tenant isolation is a security boundary. Never rely on client-provided tenant IDs, UI state, query parameters, hidden fields, client-controlled cookies, or route parameters alone. Use established server-side tenant context and repository/database mechanisms.

Evaluate every tenant-scoped operation for authentication, authorization, tenant identity, database/RLS enforcement, cross-tenant leakage, background-job context, and asynchronous execution context. Client-controlled tenant IDs must not override server context. Do not weaken RLS or tenant boundaries. Tenant A must not read or write tenant B's data. Background work must carry the correct tenant context.

## 10. Database and migrations

Determine the canonical database architecture from current repository evidence. Inspect schema files, migration directories, metadata, configuration, and relevant documentation; do not treat this contract as proof that a path or tool exists.

Before a schema change, inspect the canonical schema, relevant migrations, metadata, ordering and dependencies, tenant/RLS implications, and migration validation process. Modify or generate only canonical artifacts. Do not introduce a second migration system or alter legacy infrastructure merely because it exists. Distinguish a missing required migration from a missing migration architecture.

Never run production migrations from a Vercel build. Never require production secrets for implementation or validation. Do not expose environment values.

## 11. Environment, dependencies, integrations, SSRF, and localization

Never commit secrets, hard-code credentials, print secret values, include secrets in reports, paste `.env` contents, or expose server-only environment variables to client code. Inspect variable names and usage without revealing values.

Use the repository's declared package manager and lockfile. Before dependency or validation work, inspect `package.json`, the lockfile, and available scripts. Use only scripts actually defined in `package.json`. Do not hard-code npm, pnpm, yarn, or another package manager unless repository policy and the inspected lockfile establish it.

Before adding a dependency, search for an equivalent, inspect lockfile implications, justify it, assess security and maintenance impact, and include it only if directly required. Do not upgrade dependencies for convenience.

Before changing AI or external integrations, inspect actual implementation, contracts, authentication, validation, error handling, and server/client boundaries. Do not assume providers or models exist because documentation mentions them. Do not introduce external services unless explicitly required.

Server-side fetching of user-provided URLs is security-sensitive. Preserve SSRF protections for localhost, loopback, private networks, metadata endpoints, unsafe protocols, redirects, and DNS-related risks.

Preserve the current localization architecture, including English and Persian routes where present, Persian RTL, English LTR, responsive behavior, themes, accessibility, and design tokens. Verify current routes and translations before changing them.

## 12. Testing, validation, and diff audit

Inspect `package.json` and the lockfile before running commands. Run applicable TypeScript checks, tests, lint, build, migration validation, security validation, and runtime validation. A command not defined in the repository must not be reported as available.

Tests must prove behavior. Where applicable, security-sensitive tests cover password verification, dummy Argon2, unknown accounts, hard-lock threshold/expiry/IP separation, progressive delay and TTL/reset, count-6 challenge, failed and successful challenge, challenge non-authentication, continuation cases, anti-enumeration, bounded state, concurrency, lock release, and tenant isolation. Tests bypassing the boundary with mocks do not prove it.

Never claim a check passed unless it ran. If applicable validation cannot run, state why and do not report `STATUS: COMPLETE`.

Before completion, Jules must inspect `git status`, `git diff --stat`, `git diff --check`, and `git diff`. The diff audit must verify scope, changed files, task relevance, security impact, accidental/generated files, dependencies, migrations, tests, secrets, debug code, and unrelated formatting.

## 13. Action log and Jules report

Maintain an action log for meaningful investigative, implementation, and validation actions. Do not log trivial navigation or repetitive inspection. Record only actions actually performed:

```text
ACTION LOG [001]
TYPE: RECON | FILE_INSPECTION | SEARCH | CHANGE | TEST | VALIDATION
Command:
File / range:
Result / output:
Evidence:
```

Every material task ends with:

```text
STATUS: COMPLETE | BLOCKED
RECONNAISSANCE:
- Applicable execution path:
- Applicable architecture and conventions:
- Applicable security / tenant boundaries:
- Additional fields required by the task:
CHANGED FILES:
- File:
  - Task relevance:
  - Why it changed:
  - Security impact:
SECURITY CHANGES:
- Item:
TESTS:
- Test:
  - Command:
  - Result:
VALIDATION:
- TypeScript:
- Tests:
- Lint:
- Build:
- Migration validation:
- Security validation:
- Runtime validation:
BLOCKERS:
- None
```

For security-sensitive or authentication-related tasks, include the relevant authentication path, user schema, password-storage convention, migration system, hashing, trusted IP, hard-lock, progressive state, challenge, continuation, TTL/resource bounds, and concurrency/locking fields. For unrelated tasks, report only fields applicable to the task. Each applicable validation field must state its result or why it could not run. If blocked, report the exact reason, classification, evidence, commands, output, mechanisms ruled out, and required architectural decision. Jules may report `BLOCKED`; only the Supervisor may issue `BLOCKED_CONFIRMED`.

## 14. Supervisor verification protocol

The Supervisor independently verifies the execution path, architecture, conventions, dependencies, persistence, schema, migrations, tenant isolation, security boundaries, authentication, recovery/challenge, continuation, rate limiting, tests, scope, and blockers before issuing the final verdict.

When Jules reports `BLOCKED`, determine whether the capability is genuinely absent, an existing mechanism satisfies it, Jules overlooked an abstraction, the issue is implementation difficulty, infrastructure is unavailable, a convention is unresolved, forbidden speculation would be required, or reconnaissance is incomplete. Classify it as `MISSING_IMPLEMENTATION`, `MISSING_ARCHITECTURE`, `MISSING_CONVENTION`, `MISSING_INFRASTRUCTURE`, `IMPLEMENTATION_DIFFICULTY`, `FORBIDDEN_SPECULATION`, or `INSUFFICIENT_EVIDENCE`. Only a genuinely unavailable required capability or security boundary, sufficiently proven, may produce `BLOCKED_CONFIRMED`. Implementation difficulty alone never does.

After completion, independently inspect `git status`, `git diff --stat`, `git diff --check`, and `git diff`, then verify every changed file, behavior, tests, typecheck, lint, build, migrations, schema, dependencies, security boundaries, and tenant isolation. A successful build is necessary where applicable but never sufficient.

Assign every material Jules claim exactly one verdict: `SUPPORTED`, `PARTIALLY_SUPPORTED`, `UNSUPPORTED`, `INSUFFICIENT_EVIDENCE`, or `CONTRADICTED`. Actively search for contradictions between the report, source, tests, configuration, migrations, dependencies, diff, and runtime behavior. If evidence contradicts the implementation, stop, document, and re-evaluate.

The final Supervisor report must use:

```text
STATUS: PASS | FAIL | BLOCKED_CONFIRMED | INSUFFICIENT_EVIDENCE
JULES_CLAIMS:
- Claim:
  - Evidence:
  - Independent verification:
  - Verdict:
CONTRADICTIONS:
- None
CHANGED_FILES:
- File:
  - Scope:
  - Justification:
  - Verdict:
SECURITY_INVARIANTS:
- Invariant:
  - Evidence:
  - Verdict:
TEST_VERIFICATION:
- Test:
  - Command:
  - Result:
  - Verdict:
BLOCKERS:
- None
FINAL_VERDICT: PASS | FAIL | BLOCKED_CONFIRMED | INSUFFICIENT_EVIDENCE
```

`PASS` requires independent support for material claims, required tests and validation, security invariants, clean scope, correct migrations, preserved tenant isolation, and no material contradiction. `FAIL` applies to violations of requirements, security, correctness, scope, architecture, tenant isolation, or migration integrity. `BLOCKED_CONFIRMED` is reserved for a genuinely unavailable capability or boundary where safe implementation requires forbidden speculation. `INSUFFICIENT_EVIDENCE` applies when inspection or execution is materially incomplete.

## 15. Governing principle

**Evidence determines the verdict.** Never substitute confidence, assumptions, compilation, test count, Jules' narrative, convenience, schedule pressure, or the desire to merge quickly for evidence. If evidence is insufficient, say so. Never weaken a security boundary or invent architecture merely to obtain a successful-looking result.
