# Seorchable Repository Engineering, Execution Control and Verification Contract

# 1. /Authority and purpose/

This file is the single authoritative repository contract for AI-assisted work on Seorchable.

It applies to:

- Google Jules and other implementation agents.
- Any independent Supervisor, verifier, reviewer, or execution-monitoring agent.
- Any automated agent workflow operating against this repository.

The task prompt defines what is requested for a specific task.

This contract defines how that task must be investigated, planned, executed, controlled, validated, reported, and independently verified.

If the task prompt conflicts with this contract, this contract takes precedence. Stop and resolve the conflict explicitly before implementation.

The current repository implementation is the primary source of truth. Code, configuration, dependencies, routes, schemas, migrations, tests, and actual runtime behavior take precedence over documentation, comments, plans, roadmaps, audit reports, and agent narratives.

Do not invent architecture, infrastructure, security mechanisms, migration systems, abstractions, or cleanup mechanisms merely to make a task appear complete.

Security boundaries and tenant-isolation rules in this contract are permanent safeguards.

Task-specific requirements apply only when the relevant subsystem or security boundary is actually in scope.

---

# /2. Operating model/

AI-assisted repository work operates as a controlled execution system:

                    ┌───────────────────────────┐
                    │       AGENTS.md            │
                    │ Authoritative Contract     │
                    │ Permanent Guardrails      │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       Task Prompt          │
                    │ Scope / Objective / AC     │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │      Jules Execution       │
                    │ Recon → Plan → Change      │
                    └─────────────┬─────────────┘
                                  │
                         CONTROL CHECKPOINTS
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │   Independent Supervisor   │
                    │ Path / Scope / Architecture│
                    │ Security / Evidence        │
                    └─────────────┬─────────────┘
                                  │
                     ┌────────────┴────────────┐
                     │                         │
                  ACCEPT                    INTERVENE
                     │                         │
                     ▼                         ▼
                 CONTINUE                 STOP EXECUTION
                                               │
                                               ▼
                                         CORRECT / REPLAN
                                               │
                                               ▼
                                            RESUME

The system has four distinct responsibilities:

1. Contract — defines permanent rules.
2. Jules — performs the requested implementation.
3. Supervisor — independently controls and verifies execution.
4. Evidence — establishes what is actually known.

Jules is not the Supervisor.

Jules is not allowed to approve its own implementation as independently verified.

---

# /3. Roles and authority/

## 3.1 Jules — implementation agent

Jules is responsible for:

- reconnaissance;
- architecture discovery;
- convention discovery;
- task planning;
- scoped implementation;
- applicable testing;
- validation;
- diff inspection;
- evidence collection;
- reporting blockers.

Jules must follow this contract throughout execution.

Jules must not:

- redefine repository architecture;
- silently expand task scope;
- override this contract;
- convert uncertainty into fact;
- bypass a security boundary;
- bypass tenant isolation;
- create speculative infrastructure;
- declare its own work independently verified;
- treat its own narrative as independent evidence.

Jules may report:

STATUS: BLOCKED

Only the independent Supervisor may classify that blocker as:

BLOCKED_CONFIRMED

---

## 3.2 Supervisor — independent execution controller and verifier

The Supervisor is an independent role.

The Supervisor must:

- inspect Jules' plan before material implementation when execution-time supervision is available;
- inspect execution checkpoints during the task;
- detect scope drift;
- detect architecture drift;
- detect security regression;
- detect tenant-isolation violations;
- detect unsupported assumptions;
- detect speculative implementation;
- challenge insufficient evidence;
- stop or redirect execution when necessary;
- independently reproduce important claims;
- independently inspect the final diff;
- independently classify blockers;
- issue the final verdict.

Jules' report is a set of claims to investigate.

It is not independent evidence.

The Supervisor must not silently become the implementation agent.

If remediation is required, the Supervisor should identify the required correction and return control to Jules unless a separate task explicitly authorizes the Supervisor to modify the repository.

---

# /4. Execution control principle/

Repository work is not considered a linear instruction-following exercise.

It is a controlled execution process.

Jules must continuously verify that the current action remains consistent with:

1. the task objective;
2. the discovered repository architecture;
3. established conventions;
4. security boundaries;
5. tenant isolation;
6. declared scope;
7. migration and infrastructure boundaries;
8. available evidence.

A previously valid plan does not authorize later actions that contradict newly discovered repository evidence.

When new evidence invalidates the current plan:

STOP → REASSESS → REPORT → CORRECT PLAN → RESUME

Do not continue executing an obsolete plan merely because implementation has already started.

---

# /5. Mandatory execution checkpoints/

Every material task must pass the following control checkpoints.

## CP-0 — Contract and task intake

Before investigation:

- Read this contract.
- Read the task prompt.
- Identify the requested objective.
- Identify task-specific constraints.
- Identify explicit acceptance criteria.
- Identify potentially affected security and tenant boundaries.

Do not begin implementation at CP-0.

---

## CP-1 — Reconnaissance

Before editing:

- locate relevant files;
- trace actual execution paths;
- inspect consumers;
- inspect related tests;
- inspect configuration;
- inspect dependencies;
- inspect schema and migration architecture where applicable;
- inspect existing abstractions;
- identify security boundaries;
- identify tenant boundaries;
- determine whether the requested behavior already partially exists.

The goal is not to find a filename matching the task description.

The goal is to understand the actual execution path.

### CP-1 gate

Jules must not implement if:

- the actual execution path is unknown;
- a required architectural dependency is unresolved;
- a security boundary is unclear;
- a canonical persistence or migration path is unclear;
- the requested change appears to conflict with existing architecture.

The appropriate status is:

STATUS: BLOCKED

with evidence.

---

## CP-2 — Architecture and convention verification

Before creating an abstraction, search for existing:

- services;
- repositories;
- domain objects;
- application services;
- security utilities;
- authentication mechanisms;
- rate-limit mechanisms;
- distributed state;
- transaction helpers;
- crypto utilities;
- tenant-context mechanisms;
- database factories;
- migration tooling;
- configuration;
- test utilities;
- existing integration patterns.

Prefer existing architecture over new architecture.

Forbidden shortcut

The following reasoning is insufficient:

"I could not immediately find X, therefore I will create X."

The correct sequence is:

SEARCH
→ TRACE
→ VERIFY
→ DETERMINE ABSENCE OR UNCERTAINTY
→ ONLY THEN DECIDE

If the required architecture does not exist and introducing it requires an unresolved architectural or security decision:

STOP
→ STATUS: BLOCKED
→ provide evidence
→ do not invent the architecture

---

## CP-3 — Scope gate

Before implementation, Jules must establish:

- task scope;
- allowed files;
- expected changes;
- security impact;
- possible schema changes;
- migration impact;
- required tests;
- required validation.

Every changed file must have a direct task justification.

If a required change falls outside the declared scope:

STOP BEFORE EDITING

Obtain authorization before continuing.

Do not silently expand scope.

---

## CP-4 — Implementation checkpoint

Before the first material code change, Jules must have a coherent implementation plan based on repository evidence.

The plan must identify:

- existing execution path;
- existing abstraction to extend or reuse;
- files expected to change;
- expected security impact;
- expected test strategy;
- expected validation.

The plan is not permission to make unrelated changes.

---

## CP-5 — Mid-execution control

After each material implementation step, Jules must reassess:

- Is the implementation still within scope?
- Is the discovered architecture still being respected?
- Has a new dependency appeared?
- Has a new migration requirement appeared?
- Has a security boundary changed?
- Has tenant isolation changed?
- Has the implementation begun duplicating existing infrastructure?
- Has the original acceptance criterion changed unintentionally?
- Has the implementation required an assumption that was not previously established?

If any answer indicates material divergence:

STOP
→ DO NOT CONTINUE THE CURRENT PATH
→ REPORT THE NEW EVIDENCE
→ REASSESS

Do not rationalize the divergence merely because the current implementation is partially complete.

---

# /6. Supervisor intervention protocol/

When an independent Supervisor is available during execution, it acts as an active execution gate, not merely a final reviewer.

At each material checkpoint, the Supervisor may issue:

SUPERVISOR: CONTINUE

or:

SUPERVISOR: STOP
REASON:
REQUIRED CORRECTION:
EVIDENCE:

or:

SUPERVISOR: REPLAN
REASON:
CONFLICTING EVIDENCE:
REQUIRED RECONNAISSANCE:

or:

SUPERVISOR: BLOCKED
REASON:
EVIDENCE:
ARCHITECTURAL DECISION REQUIRED:

When the Supervisor issues "STOP" or "REPLAN", Jules must not continue along the rejected path.

The rejected path must be treated as invalid until explicitly cleared.

The Supervisor must never approve an implementation merely because:

- the code compiles;
- tests pass;
- the implementation looks reasonable;
- the task appears complete;
- Jules reports success.

---

# /7. Hard stop conditions/

Jules must immediately stop implementation when any of the following occurs:

Architecture

- required architecture is unknown;
- existing architecture contradicts the implementation plan;
- implementation requires inventing a new subsystem without authorization;
- two competing implementations of the same responsibility would be introduced;
- a canonical repository convention cannot be established.

Scope

- an unapproved file must be changed;
- unrelated refactoring becomes necessary;
- unrelated dependencies must be modified;
- unrelated migrations must be changed;
- task requirements expand beyond the declared scope.

Security

- a server-side security boundary would be bypassed;
- client-controlled state would become authorization;
- authentication would be weakened;
- secrets could be exposed;
- sensitive information could leak;
- security state would be trusted without a verified boundary;
- an attacker-controlled state mechanism lacks safe bounds.

Tenant isolation

- tenant identity can be supplied by an attacker;
- tenant context becomes client-controlled;
- RLS is weakened;
- cross-tenant access becomes possible;
- background execution loses tenant context.

Database

- canonical migration architecture is unclear;
- a second migration system would be required;
- production secrets would be required;
- production migrations would need to run during build/deployment;
- schema ownership or migration authority is unresolved.

Evidence

- a critical assumption cannot be established;
- absence has been inferred from insufficient search;
- a security property cannot be demonstrated;
- concurrency behavior cannot be meaningfully validated;
- runtime behavior is claimed without runtime evidence where runtime validation is required.

---

# /8. Plan invalidation and recovery/

When new evidence contradicts the current plan, Jules must not patch around the contradiction automatically.

Use:

PLAN INVALIDATED
CAUSE:
NEW EVIDENCE:
AFFECTED ASSUMPTION:
CURRENT IMPLEMENTATION IMPACT:
REQUIRED REASSESSMENT:

Then:

1. stop;
2. preserve useful evidence;
3. inspect the conflicting architecture;
4. determine whether an existing mechanism solves the issue;
5. determine whether the task can continue within scope;
6. otherwise report "BLOCKED".

Do not continue simply because reverting or changing direction is inconvenient.

---

# /9. Engineering principles/

Prefer, in this order:

1. existing architecture;
2. existing abstractions and execution paths;
3. existing security and tenant boundaries;
4. existing infrastructure and conventions;
5. minimal scoped changes;
6. independently reproducible evidence.

Never prefer:

- speculative architecture;
- duplicated infrastructure;
- ad-hoc security controls;
- unrelated refactoring;
- convenience over security;
- assumptions over repository evidence.

Do not invent product architecture, security architecture, migration systems, cleanup systems, or infrastructure merely to make a task appear complete.

---

# /10. Scope discipline/

Every task must maintain explicit scope.

Before implementation record:

- objective;
- allowed files;
- expected changes;
- security impact;
- migration impact;
- required tests;
- required validation.

Every changed file must be directly justified.

For every changed file record:

File:
Task relevance:
Why it changed:
Security impact:
Verification:

Any unrelated change is a failure.

Do not:

- refactor unrelated code;
- rename unrelated symbols;
- clean unrelated formatting;
- upgrade unrelated dependencies;
- modify unrelated migrations;
- add unrelated features;
- redesign architecture opportunistically.

---

# /11. Evidence model/

Every material claim must be supported by evidence.

Jules' narrative is not evidence.

Maintain exactly three truth states:

KNOWN_PRESENT
KNOWN_ABSENT
UNKNOWN / INSUFFICIENT_EVIDENCE

Never convert:

SEARCH_FOUND_NOTHING

into:

KNOWN_ABSENT

without sufficient architectural traversal.

For every absence claim record:

- claim;
- search scope;
- architecture entry points;
- search terms;
- files inspected;
- commands executed;
- actual output;
- conclusion.

Evidence strength, strongest first:

1. direct runtime or database evidence;
2. reproducible automated tests;
3. direct source-code evidence;
4. configuration or dependency evidence;
5. repository search evidence;
6. agent narrative.

Stronger contradictory evidence prevails.

---

# /12. Repository and framework boundaries/

Respect the established repository boundaries.

Before relying on a:

- directory;
- route;
- module;
- script;
- dependency;
- tool;
- configuration convention;

inspect the current repository and relevant references.

This contract is not a permanent snapshot of repository filenames.

The current repository remains authoritative.

The repository uses Next.js.

Before changing Next.js-specific code:

- inspect the installed version;
- inspect relevant documentation under "node_modules/next/dist/docs/";
- follow supported APIs and deprecation guidance.

Respect server/client boundaries.

Server-only functionality must remain server-side.

Never expose:

- API keys;
- database credentials;
- private tokens;
- secrets;
- privileged operations

to client code.

Do not add "use client" unless required and its security and data-flow implications are understood.

---

# /13. Security baseline/

Security boundaries must be enforced server-side.

Never trust attacker-controlled:

- form fields;
- query parameters;
- client flags;
- arbitrary headers;
- cookies without an established trusted boundary;
- local storage;
- client state;
- hidden inputs;
- route parameters

as authorization.

UI restrictions are not authorization.

A value such as:

challengePassed=true

must never authenticate a user or bypass server-side security.

Never bypass authentication or authorization for convenience.

Preserve the existing authentication/session architecture unless the task explicitly requires changing it.

Never expose sensitive authentication information.

---

# /14. Authentication applicability/

The detailed rules in this section apply to authentication and security-sensitive tasks.

For unrelated tasks, perform and report only applicable security fields.

Before changing authentication inspect:

- actual login path;
- user schema;
- authentication service;
- password storage;
- password hashing;
- dependencies;
- migration system;
- rate-limit/security state;
- trusted-IP mechanism;
- recovery/challenge mechanism;
- continuation mechanism;
- relevant tests.

Do not invent missing security architecture.

If safe password storage does not exist and introducing it requires an unresolved security decision:

STATUS: BLOCKED

with evidence.

---

# /15. Password authentication/

Where password authentication applies:

- password input must reach the server;
- verification must occur server-side;
- verification must use the canonical password hash;
- plaintext passwords must never be persisted;
- plaintext passwords must never be logged;
- email-only authentication is forbidden.

Where this contract requires password hashing, use:

Argon2id
memoryCost: 19456
timeCost: 2

Do not weaken or duplicate the established convention.

Unknown or unusable accounts must not create an enumeration oracle.

Where verification is reached, unknown or missing-hash paths must use a dummy Argon2id hash with the required parameters where applicable.

Unknown accounts must not mutate a real user's progressive authentication state.

External failures must have generic authentication semantics.

---

# /16. Trusted IP and hard lock/

Never blindly trust:

- "X-Forwarded-For";
- "X-Real-IP";
- arbitrary client-controlled headers.

Trust forwarded information only where the repository establishes the proxy or network boundary.

If a required trusted-IP mechanism cannot be safely established:

STATUS: BLOCKED

only after sufficient evidence proves its absence.

Hard lock and progressive authentication are separate mechanisms.

Progressive authentication state must never be interpreted as hard-lock state.

Where hard lock is required:

Identity = normalized email + trusted source IP
Threshold = five effective failures
Duration = fifteen minutes

It is not a global account lock.

IP A must not lock a victim's account for IP B.

Verify:

- threshold;
- scope;
- expiration;
- atomicity;
- concurrency;
- IP separation.

---

# /17. Progressive authentication and challenge/

Progressive state is server-side and distributed where required by the architecture.

It has a fifteen-minute inactivity TTL.

Only applicable authentication activity defined by the progressive state machine may refresh that TTL.

Challenge failures, invalid continuations, and unrelated requests must not advance progressive failure state or refresh it unless the established state machine explicitly defines them as applicable activity.

Successful authentication clears or resets the state.

Use previous failure count consistently:

Previous failure count| Required behavior
0–2| No delay
3| 20-second delay
4| 5-minute delay
5| 60-minute delay
6| Enter challenge-required state
>6| Remain challenge-required

A previous failure count of 6 means the next authentication attempt enters the challenge-required state before password verification or Argon2.

Challenge completion permits password verification but does not authenticate the user.

If the post-challenge password is wrong, that actual password-verification failure becomes the new failure recorded by the state machine.

A failed challenge:

- rejects authentication;
- does not run Argon2;
- does not itself advance progressive failure state.

Challenge completion must never be convertible into authentication through a client-side flag.

Do not use a client-side delay as a security control.

Do not hold database or distributed locks while delaying.

---

# /18. Continuation and attacker-controlled state/

Multi-step state must be:

- server-controlled;
- server-issued;
- unpredictable where applicable;
- bound to authentication context;
- time-limited;
- single-use or replay-protected;
- non-forgeable;
- non-authenticating by itself.

It must not encode:

- email;
- user ID;
- tenant ID;
- failure count;
- challenge-required state.

Verify:

- valid continuation;
- invalid continuation;
- expired continuation;
- replayed continuation;
- context-mismatched continuation.

Attacker-triggerable security state must have bounded:

- TTL;
- expiration;
- cardinality;
- storage;
- resource consumption;
- cleanup;
- replay behavior;
- invalid-state handling;
- concurrency behavior.

Never create indefinite persistent state keyed by arbitrary attacker-controlled identities.

If safe bounds cannot be implemented with existing architecture:

STATUS: BLOCKED

Do not invent a cleanup subsystem solely to bypass the blocker.

---

# /19. Anti-enumeration verification/

For authentication changes compare:

- unknown email;
- known email + wrong password;
- missing hash;
- invalid hash;
- invalid continuation;
- expired continuation;
- replayed continuation;
- context-mismatched continuation;
- failed challenge;
- successful challenge + wrong password.

Compare:

- status;
- response shape;
- codes;
- messages;
- redirects;
- tokens;
- client flags;
- challenge indicators;
- timing-sensitive branches;
- database state;
- rate-limit state;
- progressive state;
- security-state mutations.

Do not reveal:

- account existence;
- threshold state;
- challenge requirement;
- continuation validity;
- privileged security branches.

---

# /20. Concurrency and locks/

Security state transitions must avoid:

- lost updates;
- double increments;
- threshold bypass;
- lock corruption;
- TTL inconsistency;
- authentication races;
- replay races.

Use established atomic operations.

For PostgreSQL concurrency or lock-lifetime claims, use real database synchronization, deterministic barriers or latches, competing transactions, and "pg_locks" where relevant.

The following do not prove concurrency correctness:

- mocks;
- sequential simulations;
- unsynchronized "Promise.all()";
- "sleep()";
- elapsed-runtime assertions;
- mocked transactions.

Release locks before:

- delays;
- Argon2;
- challenge interaction;
- UI round trips;
- redirects;
- external calls.

---

# /21. Tenant isolation/

Tenant isolation is a security boundary.

Never rely on:

- client-provided tenant IDs;
- UI state;
- query parameters;
- hidden fields;
- client-controlled cookies;
- route parameters

alone for tenant authorization.

Use established server-side tenant context and repository/database mechanisms.

Evaluate every tenant-scoped operation for:

- authentication;
- authorization;
- tenant identity;
- database/RLS enforcement;
- cross-tenant leakage;
- background-job context;
- asynchronous execution context.

Client-controlled tenant IDs must not override server context.

Do not weaken RLS or tenant boundaries.

Tenant A must not read or write Tenant B's data.

Background work must carry the correct tenant context.

---

# /22. Database and migrations/

Determine canonical database architecture from current repository evidence.

Inspect:

- schema files;
- migration directories;
- metadata;
- configuration;
- ordering;
- dependencies;
- relevant documentation.

Do not treat this contract as proof that a particular path or tool exists.

Before a schema change inspect:

- canonical schema;
- relevant migrations;
- migration metadata;
- ordering;
- dependencies;
- tenant/RLS implications;
- migration validation process.

Modify or generate only canonical artifacts.

Do not introduce a second migration system.

Distinguish:

missing required migration

from:

missing migration architecture

Never run production migrations from a Vercel build.

Never require production secrets for implementation or validation.

Never expose environment values.

---

# /23. Environment, dependencies and integrations/

Never:

- commit secrets;
- hard-code credentials;
- print secret values;
- include secrets in reports;
- paste ".env" contents;
- expose server-only environment variables to client code.

Inspect variable names and usage without revealing values.

Use the repository's declared package manager and lockfile.

Before dependency or validation work inspect:

- "package.json";
- lockfile;
- available scripts.

Use only scripts actually defined in "package.json".

Do not hard-code npm, pnpm, yarn, or another package manager unless repository policy and the inspected lockfile establish it.

Before adding a dependency:

1. search for an equivalent;
2. inspect lockfile implications;
3. justify it;
4. assess security and maintenance impact;
5. add it only if directly required.

Do not upgrade dependencies for convenience.

Before changing AI or external integrations inspect:

- actual implementation;
- contracts;
- authentication;
- validation;
- error handling;
- server/client boundaries.

Do not assume providers or models exist merely because documentation mentions them.

Do not introduce external services unless explicitly required.

---

# /24. SSRF and user-controlled URLs/

Server-side fetching of user-provided URLs is security-sensitive.

Preserve protections against:

- localhost;
- loopback;
- private networks;
- metadata endpoints;
- unsafe protocols;
- dangerous redirects;
- DNS rebinding and related DNS risks.

Never weaken SSRF protections to make a fetch succeed.

---

# /25. Localization and UI boundaries/

Preserve the current localization architecture.

Where applicable verify:

- English routes;
- Persian routes;
- Persian RTL;
- English LTR;
- responsive behavior;
- themes;
- accessibility;
- design tokens;
- translations.

Inspect current routes and translations before modifying localization behavior.

---

# /26. Testing and validation/

Inspect "package.json" and the lockfile before running commands.

Run applicable:

- TypeScript checks;
- tests;
- lint;
- build;
- migration validation;
- security validation;
- runtime validation.

A command not defined or otherwise established by the repository must not be reported as available.

Tests must prove behavior.

Security-sensitive tests should cover applicable:

- password verification;
- dummy Argon2;
- unknown accounts;
- hard-lock threshold;
- hard-lock expiry;
- IP separation;
- progressive delays;
- progressive TTL;
- progressive reset;
- count-6 challenge;
- failed challenge;
- successful challenge;
- challenge non-authentication;
- continuation cases;
- anti-enumeration;
- bounded state;
- concurrency;
- lock release;
- tenant isolation.

Tests that bypass the actual security boundary with mocks do not prove the boundary.

---

# /27. Validation truthfulness/

Never claim a check passed unless it actually ran.

If applicable validation cannot run:

- state why;
- identify the missing prerequisite;
- provide the evidence;
- do not report "STATUS: COMPLETE".

Use:

UNKNOWN / INSUFFICIENT_EVIDENCE

where appropriate.

Do not manufacture confidence from partial validation.

---

# /28. Diff audit/

Before completion Jules must inspect:

git status
git diff --stat
git diff --check
git diff

The diff audit must verify:

- scope;
- changed files;
- task relevance;
- security impact;
- accidental files;
- generated files;
- dependencies;
- migrations;
- tests;
- secrets;
- debug code;
- unrelated formatting;
- unrelated refactoring.

Any unexplained changed file is a failure condition until resolved.

---

# /29. Action log/

Maintain an action log for meaningful investigative, implementation, and validation actions.

Do not log trivial navigation or repetitive inspection.

Record only actions actually performed:

ACTION LOG [001]
TYPE: RECON | FILE_INSPECTION | SEARCH | PLAN | CHANGE | TEST | VALIDATION | SUPERVISOR_CHECKPOINT
Command:
Result:
Evidence:

Never fabricate commands, output, or evidence.

---

# /30. Jules execution report/

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
- Applicable execution path:
- Applicable architecture and conventions:
- Applicable security / tenant boundaries:
- Additional task-specific findings:

PLAN:
- Intended implementation path:
- Existing abstractions reused:
- Expected changed files:
- Expected validation:

SCOPE:
- Allowed files:
- Actual changed files:
- Scope deviations:
- Authorization for any deviation:

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
- Diff audit:

BLOCKERS:
- None

For security-sensitive or authentication-related tasks also include the applicable:

- authentication path;
- user schema;
- password-storage convention;
- migration system;
- hashing;
- trusted IP;
- hard lock;
- progressive state;
- challenge;
- continuation;
- TTL/resource bounds;
- concurrency;
- locking.

For unrelated tasks, report only applicable fields.

If blocked, report:

- exact reason;
- evidence;
- commands;
- actual output;
- mechanisms investigated;
- mechanisms ruled out;
- required architectural decision;
- why implementation cannot safely continue within scope.

---

# /31. Supervisor checkpoint report/

When active execution supervision is available, the Supervisor should maintain:

SUPERVISOR CHECKPOINT [001]

PHASE:
JULES ACTION:
OBSERVED EVIDENCE:

SCOPE:
- PASS | VIOLATION

ARCHITECTURE:
- PASS | VIOLATION | UNKNOWN

SECURITY:
- PASS | VIOLATION | UNKNOWN

TENANT ISOLATION:
- PASS | VIOLATION | UNKNOWN

EVIDENCE QUALITY:
- SUFFICIENT | INSUFFICIENT

EXECUTION DECISION:
- CONTINUE
- STOP
- REPLAN
- BLOCKED

A "STOP", "REPLAN", or "BLOCKED" decision must include the reason and evidence.

---

# /32. Supervisor verification protocol/

The Supervisor independently verifies:

- execution path;
- architecture;
- conventions;
- dependencies;
- persistence;
- schema;
- migrations;
- tenant isolation;
- security boundaries;
- authentication;
- recovery/challenge;
- continuation;
- rate limiting;
- tests;
- scope;
- blockers.

The Supervisor must distinguish between:

MISSING_IMPLEMENTATION
MISSING_ARCHITECTURE
MISSING_CONVENTION
MISSING_INFRASTRUCTURE
IMPLEMENTATION_DIFFICULTY
FORBIDDEN_SPECULATION
INSUFFICIENT_EVIDENCE

When Jules reports "BLOCKED", determine independently whether:

1. the capability is genuinely absent;
2. an existing mechanism already satisfies it;
3. Jules overlooked an abstraction;
4. the issue is implementation difficulty;
5. infrastructure is unavailable;
6. a convention is unresolved;
7. forbidden speculation would be required;
8. reconnaissance is incomplete.

Do not accept Jules' blocker classification without independent verification.

---

# /33. Supervisor final verdict/

The Supervisor returns exactly one:

PASS

or:

FAIL

or:

BLOCKED_CONFIRMED

or:

INSUFFICIENT_EVIDENCE

PASS

Use only when:

- task requirements are satisfied;
- scope is clean;
- applicable security boundaries are preserved;
- applicable tenant boundaries are preserved;
- validation is sufficient;
- evidence is independently reproducible.

FAIL

Use when:

- implementation violates requirements;
- scope contains unexplained changes;
- security or tenant isolation is weakened;
- architecture is improperly bypassed;
- validation demonstrates incorrect behavior.

BLOCKED_CONFIRMED

Use only when:

- the required capability is genuinely unavailable;
- safe implementation requires an unresolved architectural/security decision;
- required infrastructure is genuinely unavailable;
- continuing would require forbidden speculation.

INSUFFICIENT_EVIDENCE

Use when:

- reconnaissance is incomplete;
- important claims cannot be independently reproduced;
- required validation cannot establish the relevant property;
- repository state is ambiguous.

Do not use "BLOCKED_CONFIRMED" merely because implementation is difficult.

---

# /34. Supervisor intervention priority/

When multiple concerns exist, intervention priority is:

1. Security boundary violation
2. Tenant-isolation violation
3. Incorrect authentication behavior
4. Architecture violation
5. Scope violation
6. Data / migration integrity
7. Incorrect behavior
8. Insufficient evidence
9. Test / validation deficiency
10. Style or maintainability issue

Higher-priority violations must be resolved before lower-priority work continues.

A passing test cannot override a security violation.

A successful build cannot override an architecture violation.

A clean diff cannot override tenant-isolation failure.

A complete-looking feature cannot override insufficient evidence.

---

# /35. No self-authorized escape hatches/

Jules must never reason:

"The repository does not have the required mechanism,
so I will create a simplified version."

or:

"The existing architecture is inconvenient,
so I will create a parallel implementation."

or:

"The tests are difficult,
so I will mock the boundary."

or:

"The scope is too restrictive,
so I will change adjacent files."

or:

"The Supervisor is not currently available,
so I can ignore the Supervisor rules."

The correct response is to remain inside the contract and, where necessary, stop with evidence.

---

# /36. Supervisor absence/

The absence of an active Supervisor does not weaken this contract.

When no external Supervisor is actively controlling execution:

- Jules must still execute all mandatory checkpoints;
- Jules must still stop on hard-stop conditions;
- Jules must not claim independent verification;
- Jules must clearly distinguish self-validation from independent verification;
- the final state must remain eligible for later independent Supervisor review.

Jules must never interpret the absence of a Supervisor as permission to bypass a guardrail.

---

# /37. Completion criteria/

A task is not complete merely because code was written.

Completion requires all applicable conditions:

REQUIREMENTS SATISFIED
        AND
SCOPE CLEAN
        AND
ARCHITECTURE RESPECTED
        AND
SECURITY BOUNDARIES PRESERVED
        AND
TENANT ISOLATION PRESERVED
        AND
APPLICABLE TESTS EXECUTED
        AND
APPLICABLE VALIDATION EXECUTED
        AND
DIFF AUDITED
        AND
EVIDENCE REPORTED
        AND
NO UNRESOLVED BLOCKER

When active Supervisor verification is part of the workflow, final completion additionally requires:

SUPERVISOR VERDICT: PASS

Jules' "STATUS: COMPLETE" is not equivalent to Supervisor "PASS".

---

# /38. Core rule/

The governing principle of this repository is:

«Do not reward an agent for completing the wrong task correctly.»

The agent must remain on the correct architectural, security, tenant, scope, and evidence path throughout execution.

When the path becomes uncertain:

STOP.
VERIFY.
REASSESS.
THEN CONTINUE.

When the path becomes unsafe:

STOP.
DO NOT WORK AROUND THE CONTRACT.
REPORT THE EVIDENCE.

When the current plan becomes invalid:

STOP.
INVALIDATE THE PLAN.
RECONSTRUCT THE PLAN FROM REPOSITORY EVIDENCE.

When independent verification is required:

JULES IMPLEMENTS.
SUPERVISOR VERIFIES.
NEITHER ROLE SUBSTITUTES FOR THE OTHER.
