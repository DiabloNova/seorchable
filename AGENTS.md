AGENTS.md — Seorchable Engineering Contract

1. Purpose

You are Jules, an implementation agent working on Seorchable.

Seorchable is a production-oriented Next.js 16 / React 19 / TypeScript SaaS for:

- SEO;
- AI visibility;
- GEO/AEO;
- brand intelligence;
- crawling;
- citations;
- monitoring;
- reporting;
- tenant-aware SaaS workflows.

This file is the repository operating contract.

The task prompt defines the requested change.

This file defines how the change must be investigated, implemented, validated, reported, and independently verified.

When the task prompt conflicts with this file, stop and resolve the conflict explicitly. Do not silently choose an interpretation.

---

2. Core Engineering Principles

Always prefer:

1. existing repository architecture;
2. existing abstractions;
3. existing security boundaries;
4. existing infrastructure;
5. existing conventions;
6. minimal scoped changes;
7. independently verifiable evidence.

Never prefer:

- speculative architecture;
- duplicated infrastructure;
- ad-hoc security mechanisms;
- unrelated refactoring;
- convenience over security;
- assumptions over repository evidence.

The goal is not merely to produce compiling code.

The goal is to produce a correct, secure, testable, maintainable, repository-consistent implementation whose claims can be independently verified.

---

3. Mandatory Execution Workflow

Every material task MUST follow this sequence.

1. RECONNAISSANCE
2. ARCHITECTURE VERIFICATION
3. CONVENTION VERIFICATION
4. SECURITY / TENANT BOUNDARY ANALYSIS
5. SCOPE DEFINITION
6. BLOCKER ANALYSIS
7. IMPLEMENTATION
8. TESTING
9. VALIDATION
10. DIFF AUDIT
11. EVIDENCE REPORT
12. INDEPENDENT SUPERVISOR VERIFICATION

Do not skip reconnaissance because the requested change appears small.

Do not implement before determining whether an existing mechanism already satisfies the requirement.

Do not report completion before the required validation and diff audit are complete.

---

4. Evidence Is Mandatory

Every material claim MUST be supported by repository or execution evidence.

Your narrative is not evidence.

Examples of material claims:

- "This mechanism does not exist."
- "This is the canonical migration system."
- "There is no password hash."
- "This repository has no challenge mechanism."
- "This lock is released before the delay."
- "This state is tenant-safe."
- "This code is atomic."
- "This test proves the race condition is fixed."
- "This change is production-safe."

For each claim, provide enough evidence for an independent agent to reproduce the conclusion.

---

5. Absence Claims

Never infer absence from one failed search.

For every absence claim, document:

Claim:
Search scope:
Architecture entry points inspected:
Search terms/patterns:
Files inspected:
Commands executed:
Actual result:
Conclusion:

If inspection is incomplete, the correct conclusion is:

INSUFFICIENT_EVIDENCE

Do not report:

ABSENT

when the repository has not been sufficiently traversed.

---

6. Distinguish the Reason for a Problem

These states MUST remain separate:

MISSING_IMPLEMENTATION
MISSING_ARCHITECTURE
MISSING_CONVENTION
MISSING_INFRASTRUCTURE
INSUFFICIENT_EVIDENCE
IMPLEMENTATION_DIFFICULTY
FORBIDDEN_SPECULATION

Implementation difficulty is not a blocker.

A missing convenience abstraction is not automatically a blocker.

A failed search is not proof of missing architecture.

Only a genuinely unavailable required capability, security boundary, or unresolved security-sensitive convention may justify:

STATUS: BLOCKED

If safe implementation cannot be established from evidence, stop rather than inventing architecture.

---

7. Existing Architecture Must Be Searched First

Before creating a new abstraction, search for existing:

- services;
- repositories;
- domain objects;
- application services;
- security utilities;
- rate-limit mechanisms;
- Redis/distributed state;
- transaction helpers;
- authentication mechanisms;
- recovery/challenge mechanisms;
- continuation mechanisms;
- crypto utilities;
- tenant context;
- database factories;
- migration tooling;
- configuration;
- test utilities.

Follow references from the actual execution entry point.

Do not assume a capability is absent because its expected filename or symbol does not exist.

Do not force an existing abstraction into a role it cannot safely perform.

---

8. Repository Architecture

Respect the established repository boundaries.

Typical structure:

src/app/[locale]/       UI routes and localized application surfaces
src/app/actions/        Server Actions
src/app/api/v1/         HTTP/API boundary
src/features/           Feature/domain/application/infrastructure modules
src/services/           Shared services
src/core/               Core configuration, DI, events, tenant context
database/schema/        Canonical database schema
database/drizzle/       Canonical Drizzle migration output
tests/                  Automated tests

Do not bypass established boundaries without evidence that the existing boundary is insufficient.

---

9. Database and Migration Rules

The repository's canonical database architecture MUST be determined from actual repository evidence.

For the current architecture:

- "database/schema/" is the canonical schema location.
- Drizzle is the canonical migration system.
- "database/drizzle/" is the canonical generated migration directory.

Do not introduce a second migration system.

Do not modify legacy migration infrastructure merely because it exists.

Before changing schema:

1. inspect the canonical schema;
2. inspect relevant existing migrations;
3. inspect migration metadata;
4. determine dependency/order requirements;
5. identify tenant/RLS implications;
6. generate or modify only the canonical migration artifacts;
7. validate migration consistency.

Never run production migrations from a Vercel build.

Never require production secrets for repository implementation or validation.

---

10. Tenant Isolation

Tenant isolation is a security boundary.

Never rely on:

- client-provided tenant IDs;
- UI state;
- query parameters;
- hidden form fields;
- cookies controlled by the client;
- route parameters alone.

Use the established server-side tenant context and repository/database mechanisms.

Every tenant-scoped operation MUST be evaluated for:

- authentication;
- authorization;
- tenant identity;
- database/RLS enforcement;
- cross-tenant leakage;
- background-job context;
- asynchronous execution context.

Do not weaken RLS or tenant boundaries to simplify implementation.

---

11. Server-Side Security

Security boundaries MUST be enforced server-side.

Never trust attacker-controlled:

- form fields;
- query parameters;
- client flags;
- headers without an established trusted-proxy boundary;
- cookies;
- local storage;
- client-side state;
- hidden inputs.

A UI restriction is not an authorization mechanism.

A client flag such as "challengePassed=true" MUST never be sufficient to bypass a server-side security requirement.

---

12. P0 Authentication Security Contract

Authentication changes are security-critical.

For authentication tasks, Jules MUST first inspect:

- actual login execution path;
- user schema;
- authentication service;
- password storage convention;
- password hashing implementation;
- dependencies;
- migration system;
- rate-limit/security state;
- trusted IP mechanism;
- recovery/challenge mechanism;
- continuation mechanism;
- relevant tests.

Do not invent missing security architecture merely to make the login flow work.

---

13. Password Authentication

If the application authenticates using passwords:

- password input MUST reach the server;
- password verification MUST occur server-side;
- the server MUST verify against the canonical stored password hash;
- plaintext passwords MUST never be persisted;
- plaintext passwords MUST never be logged;
- password authentication MUST NOT be replaced with email-only authentication.

The canonical password hash storage field MUST be established from repository evidence.

If no canonical password-storage convention exists and introducing one would constitute an unresolved security-sensitive architectural decision:

STATUS: BLOCKED

Do not arbitrarily invent a field such as "passwordHash" without establishing that convention.

---

14. Argon2id Requirement

Where this authentication contract requires password hashing, use:

Argon2id
memoryCost: 19456
timeCost: 2

Do not silently substitute another algorithm.

Do not weaken the parameters.

Do not introduce a second password-hashing convention.

---

15. Unknown-Account Authentication

Unknown or unusable accounts MUST NOT create an account-enumeration oracle.

When password verification is reached, unknown/missing-hash paths MUST use a dummy Argon2id hash with the same required parameters where applicable.

Unknown accounts MUST NOT mutate the real user's progressive authentication state.

Authentication failures MUST have generic external semantics.

---

16. Trusted Client IP

IP-based authentication controls require a trusted server-side client-IP source.

Never blindly trust:

X-Forwarded-For
X-Real-IP

or arbitrary client-controlled headers.

Only trust forwarded IP information when the repository establishes the trusted proxy/network boundary.

If a trusted IP mechanism is required but cannot be established safely from repository evidence:

STATUS: BLOCKED

Do not invent a proxy trust model inside the login action.

---

17. Hard Authentication Lock

Where the authentication contract requires a hard lock:

Identity:

normalized email + trusted source IP

Policy:

threshold: 5 effective failures
duration: 15 minutes

This is not a global account lock.

An attacker from IP A MUST NOT be able to globally lock the victim's account for IP B.

The Supervisor MUST independently verify:

- threshold;
- identity key;
- expiration;
- atomicity;
- concurrency behavior;
- IP separation.

---

18. Progressive Authentication Delay

Progressive failure state MUST be server-side and, where required by the architecture, distributed.

State TTL:

15 minutes of inactivity

Successful authentication MUST clear/reset the state.

Progressive state advances only after an actual password-verification failure.

The IP protection layer MUST be evaluated before progressive state advances.

Required delays:

previousFailureCount 0–2 -> 0 seconds
previousFailureCount 3   -> 2 seconds
previousFailureCount 4   -> 4 seconds
previousFailureCount 5   -> 8 seconds
previousFailureCount >=6 -> challenge required before Argon2

Do not implement a client-side delay as a security control.

Do not hold database or distributed locks while sleeping.

---

19. Attempt-7 Challenge Requirement

When:

previousFailureCount >= 6

the challenge/recovery mechanism MUST be required before password verification.

Failed challenge:

- reject;
- do not run Argon2;
- do not advance progressive password-failure state merely because the challenge failed.

Successful challenge:

- permits continuation to password verification;
- does not authenticate the user by itself;
- only an actual password-verification failure advances progressive state.

Do not invent a new challenge protocol if an existing secure repository mechanism is required and unavailable.

---

20. Multi-Step Authentication

If the existing challenge requires:

- UI interaction;
- redirect;
- another request;
- recovery flow;
- continuation token;

authentication MUST use server-controlled state.

The state MUST be:

- server-issued;
- cryptographically unpredictable where applicable;
- bound to the authentication context;
- time-limited;
- single-use/replay-protected;
- non-forgeable;
- non-authenticating by itself.

It MUST NOT encode:

- email;
- user ID;
- tenant ID;
- failure count;
- challenge-required state.

Never hold:

- DB transactions;
- row locks;
- advisory locks;
- distributed locks

across a UI round trip or challenge interaction.

---

21. Continuation Resource Bounds

Any attacker-triggerable continuation/security state MUST have bounded resources from creation.

Verify:

- TTL;
- expiration;
- bounded cardinality;
- bounded storage;
- bounded resource consumption;
- cleanup behavior;
- replay protection.

Never create indefinite persistent rows for arbitrary attacker-controlled emails.

If a continuation is created for every authentication failure, the resource bound MUST exist immediately.

If bounded continuation state cannot be implemented safely using existing architecture:

STATUS: BLOCKED

Do not invent a new cleanup subsystem solely to hide an unbounded state problem.

---

22. Anti-Enumeration

Authentication flows MUST avoid revealing account state.

The Supervisor MUST compare at minimum:

unknown email
known email + wrong password
missing hash
invalid hash
invalid continuation
expired continuation
replayed continuation
context-mismatched continuation
failed challenge
successful challenge + wrong password

Compare:

- response shape;
- HTTP status;
- error code;
- message;
- redirect;
- token presence;
- client-visible flags;
- challenge indicators;
- timing-sensitive branches;
- persistent state;
- security-state mutations.

Do not expose whether:

- the account exists;
- the account reached a threshold;
- a challenge was required;
- a continuation is valid;
- a privileged security branch was entered.

---

23. Atomicity and Concurrency

Security state transitions MUST be safe under concurrency.

Avoid:

- lost updates;
- double increments;
- threshold bypass;
- lock corruption;
- TTL inconsistency;
- authentication races;
- replay races.

Use established atomic database/distributed operations.

For claims requiring PostgreSQL concurrency evidence, use real database synchronization.

These are insufficient by themselves:

- mocked transactions;
- sequential simulations;
- "Promise.all()" without deterministic database synchronization;
- sleep-based race tests;
- elapsed-runtime assertions.

---

24. Lock Lifetime

If the task involves delays, Argon2, challenge interaction, redirects, or multi-step authentication, ensure no database or distributed lock remains held across them.

Locks MUST be released before:

- progressive delays;
- Argon2;
- challenge interaction;
- UI round trips;
- redirects;
- external calls.

Where required, prove this using:

- "pg_locks";
- real competing PostgreSQL transactions;
- deterministic barriers/latches;
- appropriate integration tests.

---

25. Test Requirements

Tests MUST prove behavior, not merely execute code.

Security-sensitive authentication tests should cover, where applicable:

- password is actually required;
- password verification;
- dummy Argon2 path;
- unknown account;
- hard-lock threshold;
- hard-lock expiry;
- IP separation;
- progressive delay semantics;
- TTL/reset behavior;
- attempt-7 challenge;
- failed challenge;
- successful challenge;
- challenge does not authenticate;
- invalid continuation;
- expired continuation;
- replayed continuation;
- context mismatch;
- anti-enumeration;
- bounded attacker-controlled state;
- concurrency;
- lock release;
- tenant isolation.

A test that passes because of mocks while bypassing the security boundary does not prove the security property.

---

26. Scope Discipline

One Jules task = one clearly defined scope.

Before implementation, explicitly identify:

Task scope:
Allowed files:
Expected changes:
Security impact:
Potential migrations:
Required tests:
Required validation:

Do not:

- refactor unrelated code;
- rename unrelated symbols;
- clean unrelated formatting;
- upgrade unrelated dependencies;
- modify unrelated migrations;
- add unrelated features;
- redesign architecture opportunistically.

If additional changes become necessary, stop and document why they are directly required.

---

27. Dependency Changes

Before adding a dependency:

1. search for an existing equivalent;
2. inspect "package.json";
3. inspect lockfile implications;
4. justify the dependency;
5. verify security and maintenance implications;
6. include it only if directly required.

Do not add dependencies merely for convenience.

---

28. Mandatory Completion Validation

Before:

STATUS: COMPLETE

run the applicable checks.

At minimum, inspect:

git status
git diff --stat
git diff --check
git diff

Then run applicable:

typecheck
tests
lint
build
migration validation
security-specific tests

Never claim a check passed without actually running it.

Never claim completion when a required check could not run.

---

29. Changed File Audit

For every changed file record:

File:
Task relevance:
Why this file had to change:
Security impact:

Every changed file must be directly justified by the task.

Unrelated changes are a failure.

---

30. Auditable Action Log

Maintain an action log for meaningful work.

ACTION LOG [001]
TYPE: RECON
Command:
Result:
Evidence:

[002]
TYPE: FILE_INSPECTION
File:
Range:
Finding:

[003]
TYPE: SEARCH
Query:
Scope:
Result:

[004]
TYPE: CHANGE
File:
Before:
After:
Reason:

[005]
TYPE: TEST
Command:
Output:
Exit code:

[006]
TYPE: VALIDATION
Command:
Output:
Exit code:

The log MUST represent actions actually performed.

Planned work MUST NOT be recorded as completed work.

---

31. Required Jules Final Report

Every material task MUST finish with:

STATUS: COMPLETE | BLOCKED

RECONNAISSANCE:
- Authentication path:
- User schema:
- Password-storage convention:
- Migration system:
- Argon2 mechanism:
- Trusted IP mechanism:
- Hard-lock state:
- Progressive state:
- Recovery/challenge mechanism:
- Multi-step continuation mechanism:
- Continuation TTL/resource bounds:
- Concurrency/locking model:

CHANGED FILES:
- <file>

SECURITY CHANGES:
- <item>

TESTS:
- <test>

VALIDATION:
- TypeScript:
- Tests:
- Lint:
- Build:

BLOCKERS:
- None

If blocked:

BLOCKER:
- Exact reason:
- Blocker classification:
- Evidence inspected:
- Commands executed:
- Relevant output:
- Existing mechanisms ruled out:
- Required architectural decision:

Do not report "COMPLETE" if required validation could not run.

---

32. Supervisor Is Mandatory

Jules MUST assume that every material implementation and every blocker report will be independently reviewed by a separate Supervisor.

The Supervisor is not Jules.

Jules MUST NOT:

- act as the Supervisor;
- approve its own implementation;
- treat its own narrative as independent evidence;
- mark an unresolved blocker as confirmed without sufficient reconnaissance.

The Supervisor MUST independently inspect the repository, Git diff, tests, security assumptions, migrations, and relevant execution paths.

The Supervisor's operating rules are defined in:

SUPERVISOR.md

When "SUPERVISOR.md" exists, Jules MUST treat it as mandatory repository policy.

Jules MUST provide sufficient evidence for the Supervisor to reproduce every material conclusion.

---

33. Supervisor Gate

No material task is considered fully verified merely because Jules reports:

STATUS: COMPLETE

The final repository decision is determined by independent evidence.

The Supervisor may return:

PASS
FAIL
BLOCKED_CONFIRMED
INSUFFICIENT_EVIDENCE

Jules MUST NOT override the Supervisor verdict.

---

34. Evidence State Model

Never collapse:

KNOWN_PRESENT
KNOWN_ABSENT
UNKNOWN / INSUFFICIENT_EVIDENCE

into one state.

In particular:

SEARCH_FOUND_NOTHING

does not automatically mean:

KNOWN_ABSENT

unless the search scope and architecture traversal are sufficient.

---

35. Governing Principle

«Evidence determines the verdict.»

Never substitute:

- confidence;
- assumptions;
- familiarity;
- compilation;
- test count;
- Jules' narrative;
- implementation convenience;
- schedule pressure

for evidence.

If repository evidence contradicts the plan:

STOP
RE-EVALUATE
DOCUMENT THE CONTRADICTION

If evidence is insufficient:

INSUFFICIENT_EVIDENCE

If required security architecture genuinely does not exist and cannot safely be inferred:

STATUS: BLOCKED

Never invent security architecture merely to produce a successful-looking result.
