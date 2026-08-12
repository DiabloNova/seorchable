# AGENTS.md

## Project Engineering Constitution

This file defines the mandatory engineering, architecture, implementation,
testing, verification, security, and execution rules for AI coding agents
working in this repository.

These rules apply to EVERY task, phase, feature, bug fix, refactor, migration,
and architectural change unless a more specific repository-level contract
explicitly overrides them.

Task specifications define WHAT must be implemented.

This file defines HOW implementation must be performed safely and correctly.

---

# 1. Core Principle

The objective is not merely to make the requested feature appear to work.

The objective is to produce a production-grade implementation that:

- respects the existing architecture
- preserves existing contracts
- preserves historical correctness
- preserves tenant isolation
- uses the canonical persistence architecture
- uses real application/domain behavior
- contains no production mocks or fake data
- is testable
- is observable
- is secure
- is migration-safe
- is backward-compatible where required
- is verifiable

A green build alone does NOT constitute completion.

---

# 2. Mandatory Pre-Implementation Inspection

Before modifying code, the agent MUST inspect the existing repository and
understand the relevant architecture.

At minimum inspect, where applicable:

- AGENTS.md
- package.json
- database/schema
- migrations
- domain models
- repositories
- application services/use cases
- command/query handlers
- API contracts
- provider interfaces
- adapter implementations
- analyzer interfaces
- scoring contracts
- authentication/authorization
- tenant isolation
- organization/brand/entity relationships
- scheduler infrastructure
- background workers
- existing tests
- existing documentation
- relevant Phase/task implementations

Do not begin implementation based solely on the task description.

---

# 3. Mandatory Compatibility Assessment

Before changing production code, produce a concise compatibility assessment.

The assessment MUST identify:

- canonical entities
- canonical tables
- canonical interfaces
- canonical repositories
- canonical application services
- canonical provider abstractions
- canonical analyzer abstractions
- canonical tenant enforcement mechanism
- canonical scheduler integration point
- canonical migration mechanism
- existing reusable components
- relevant existing tests
- detected architectural gaps
- proposed files to modify
- proposed new files, if any
- possible regressions

Use the following format:

```
COMPONENT:
<name>

EXISTING IMPLEMENTATION:
<description>

REUSE:
yes / no / partial

REASON:
<reason>

REQUIRED CHANGE:
<change or none>

RISK:
<risk>
```

The assessment must be completed BEFORE substantial implementation begins.


---

# 4. Canonical Architecture Rule

The existing architecture is authoritative unless it is demonstrably incorrect, incomplete, or incompatible with the task.

Agents MUST:

- reuse existing domain models

- reuse existing repositories

- reuse existing provider abstractions

- reuse existing analyzer abstractions

- reuse existing persistence patterns

- reuse existing authentication/authorization

- reuse existing tenant isolation

- reuse existing scheduler infrastructure

- reuse existing CQRS/application patterns

- reuse existing migration conventions


Do NOT create parallel implementations of an existing capability.

Examples of prohibited duplication:

second AI response model

second provider abstraction

second tenant mechanism

second scheduler

second repository pattern

second scoring engine

second audit lifecycle

second authentication system

second database abstraction


If an existing abstraction is insufficient, extend it carefully.

Do not replace it without evidence.


---

# 5. Architectural Blocker Rule

If the canonical architecture is:

missing

inconsistent

incomplete

contradictory

technically incapable of supporting the required feature


the agent MUST NOT silently create a replacement architecture.

Instead:

1. identify the problem


2. explain why the existing contract is insufficient


3. identify the smallest safe extension


4. inspect dependencies and affected components


5. implement the extension only if it remains within task scope


6. otherwise report the blocker



Never hide an architectural incompatibility behind a local workaround.


---

# 6. Scope Discipline

Implement ONLY the capability requested by the current task.

Do NOT:

implement future roadmap features

create speculative abstractions

create placeholder tables

create unused interfaces

create fake adapters

create mock production providers

create "temporary" in-memory persistence

implement unrelated refactors

redesign unrelated modules

rewrite working infrastructure without necessity


If a future task requires an extension point, create the smallest real extension required by the current task.

Do not build the future feature itself.


---

# 7. No Mock Production Implementations

Production code MUST NOT depend on:

hard-coded results

random values

static arrays

process-local Maps

fake providers

fake AI responses

fake scoring

fake recommendations

fake model comparisons

fake position extraction

fabricated confidence

placeholder success responses


Mocks/stubs/fakes are permitted ONLY inside appropriately scoped tests.

A test mock MUST NOT accidentally become a production implementation.


---

# 8. No Shortcut Contracts

Do not weaken domain contracts merely to make TypeScript, tests, or builds pass.

The following are prohibited as shortcuts:

```any

unsafe TypeScript assertions

non-null assertions used to conceal missing domain guarantees

silently defaulting required fields

swallowing errors

converting unknown into success

converting unavailable into zero

converting failed into empty success

disabling strict validation

weakening database constraints

weakening tenant checks
```


If the domain object is incomplete, implement the missing contract correctly.


---

# 9. Domain-First Implementation

Domain semantics must be established before UI implementation.

Implementation order should normally be:

1. existing architecture inspection


2. domain contracts


3. persistence


4. repositories


5. application use cases


6. provider/adapter integration


7. background processing


8. API contracts


9. UI


10. end-to-end verification



Do not build a convincing UI around fake or incomplete backend behavior.


---

10. Contract Integrity

Every important domain concept must have an explicit contract.

Avoid ambiguous requirements such as:

"important parameters"

"appropriate status"

"handle failures"

"support retries"

"model configuration"

"version"

"position"

"confidence"


When a concept affects persistence, reproducibility, historical analysis, security, or business logic, its semantics MUST be explicitly defined.


---

11. State Machines

Whenever a task introduces a lifecycle/stateful entity, explicitly define:

allowed states

valid transitions

invalid transitions

terminal states

retry behavior

cancellation behavior

timeout behavior

recovery behavior


Example:

queued → running → succeeded
queued → running → failed
queued → running → timed_out
queued → cancelled
running → cancelled

Do not invent additional states without documenting them.

A failed state MUST NOT silently become successful.


---

12. Logical Execution vs Attempt

Whenever retries are supported, distinguish:

Logical Operation / Execution
        |
        +-- Attempt 1
        +-- Attempt 2
        +-- Attempt 3

A retry MUST NOT silently create a new unrelated logical operation.

The system must preserve:

logical identity

attempt identity

attempt number

attempt status

timestamps

failure information


This rule applies to jobs, scheduled executions, provider calls, background tasks, and similar operations.


---

13. Idempotency

Operations that may be repeated because of:

retries

duplicate HTTP requests

worker crashes

queue redelivery

scheduler duplication

network failures


MUST define idempotency semantics.

Do not rely on frontend behavior to prevent duplicate operations.

Where appropriate, enforce idempotency at the database/application boundary.


---

14. Concurrency

Use the repository's canonical concurrency mechanism.

Where optimistic locking exists:

use it

do not bypass it

do not silently overwrite stale state


Where a uniqueness invariant is required, enforce it at the database level whenever practical.

Never rely solely on application-level checks for critical uniqueness.


---

15. Database as Source of Truth

Production persistence MUST use the canonical database architecture.

Do NOT use:

global Maps

static arrays

local process state

JSON files

temporary memory stores

mock databases


as the production source of truth.

Database constraints must enforce critical invariants wherever practical.


---

16. Migration Discipline

All schema changes MUST use the project's canonical migration system.

Every migration must:

be explicit

be deterministic

preserve existing data

include required constraints

include indexes where required

preserve foreign-key integrity

respect tenant isolation

follow naming conventions

have a documented rollback strategy where supported


Do not modify production schema manually outside the migration system.

Do not create migrations that merely prepare speculative future features.


---

17. Migration Safety

Before applying a migration, inspect:

existing schema

existing migrations

dependent tables

foreign keys

indexes

existing data

RLS policies

application assumptions


For destructive migrations, explicitly identify:

data loss

affected records

rollback limitations

migration ordering


Never claim a migration is safely reversible if it is inherently destructive.


---

18. Tenant Isolation

Tenant isolation is a security invariant.

Every tenant-scoped entity MUST be protected at the appropriate layers.

Use the canonical combination of:

application authorization

repository scoping

database constraints

PostgreSQL RLS where applicable


Never trust tenant IDs supplied directly by clients.

Cross-tenant access MUST be explicitly tested.

A tenant must never be able to:

read another tenant's data

modify another tenant's data

delete another tenant's data

infer protected tenant metadata

bypass tenant ownership through foreign-key relationships



---

19. Authorization

Authentication is not authorization.

Every sensitive operation must verify:

authenticated identity

organization/tenant membership

resource ownership

required role/permission


Do not implement authorization solely in the UI.

Server-side authorization is mandatory.


---

20. Secret Handling

Secrets MUST remain outside ordinary domain entities and API responses.

Never expose:

API keys

provider credentials

database credentials

private tokens

signing secrets

internal authentication secrets


through:

domain models

client responses

logs

browser state

database records intended for ordinary business entities


Use the canonical secret/configuration boundary.

A reference to configuration may be stored where appropriate.

The secret itself must not be embedded in ordinary domain data.


---

21. External Provider Boundary

External providers MUST be accessed through canonical adapter/provider interfaces.

Domain logic must not depend directly on:

provider SDKs

provider-specific HTTP clients

provider-specific model strings

provider-specific credential formats


Provider-specific behavior belongs behind adapters.

If a provider does not support a capability, represent that explicitly.

Do not fabricate support.


---

22. Local Model Compatibility

Where local model execution is part of the project roadmap:

domain logic must remain provider-independent

local models must be representable

provider configuration must remain infrastructure-level

model identity must not be scattered as strings throughout the codebase


Do not introduce an external LLM service merely to satisfy a task if the architecture already supports local execution.


---

23. Raw External Data Policy

When external responses are persisted, define:

raw vs normalized representation

maximum size

encryption requirements

retention

redaction

sensitive-data handling

authorization

access boundaries


Do not expose raw provider payloads indiscriminately.

Do not log raw external responses unless explicitly allowed by the security policy.


---

24. Historical Immutability

Any data used to establish historical analytics, audits, executions, measurements, or evidence MUST NOT be silently overwritten.

If a new interpretation is required, create a new version/result where appropriate.

Examples:

Prompt Version 1
Prompt Version 2

and:

Execution
  ├── Analysis Version 1
  └── Analysis Version 2

Historical records must remain reproducible.


---

25. Versioning

When versioning is introduced, explicitly distinguish:

aggregate version

immutable snapshot

database revision

content-addressed version


Do not use the word "version" ambiguously.

If a historical artifact has been executed/analyzed, changing its semantic content must not mutate the historical artifact.


---

26. Analyzer Versioning

Analyzer upgrades MUST NOT silently change historical results.

Unless a task explicitly defines another strategy:

Original Execution
       ↓
Analysis v1

Re-analysis using newer analyzer
       ↓
New Analysis v2

Both results must retain:

analyzer version

timestamp

source execution/response

evidence where applicable


Never overwrite historical analysis merely because analyzer code changed.


---

27. Evidence-Based Intelligence

AI-generated or algorithmically inferred metrics must be evidence-backed.

The system MUST distinguish:

detected

not detected

unknown

unavailable

failed


Do not collapse these states.

Do not fabricate:

confidence

rankings

positions

citations

sources

scores

recommendations


If evidence is insufficient, use an explicit unknown/undetermined state.


---

28. Position Extraction

When extracting semantic positions from AI answers:

numeric positions require structural evidence

prose mention is not automatically a rank

character offset is not semantic position

list order must be supported by actual structure

ambiguous position must remain unknown


Every position observation should retain sufficient evidence to explain it.

Do not infer precision that the source response does not support.


---

29. Confidence

Confidence values MUST be derived from an actual defined methodology.

Never use:

random confidence

fixed confidence merely to populate a field

confidence fabricated because an API requires a number


If confidence cannot be established, use the canonical unknown/unavailable representation.


---

30. Scheduler Integration

If a scheduler already exists:

reuse it.

Do not create a second scheduler merely to satisfy a task.

The scheduler integration must account for:

transactional claiming

worker ownership

duplicate workers

retries

timeout

cancellation

missed schedules

timezone

DST transitions

overlapping executions

schedule version changes

clock skew


Unsupported scheduling capabilities must be reported explicitly.

Do not silently approximate unsupported schedule semantics.


---

31. Scheduled Execution Identity

Scheduled operations must have a deterministic logical identity.

A suitable identity may include:

scheduled resource ID
+
schedule version
+
scheduled-for timestamp

The exact contract must follow the existing scheduler architecture.

Where required, enforce uniqueness at the database level.


---

32. Worker Safety

Background workers must be resilient to:

crashes

duplicate delivery

retries

stale leases

partial execution

process restarts


Worker claiming must be transactional where required.

A worker crash must not silently create duplicate historical results.


---

33. Error Handling

Errors must be explicit and typed where practical.

Distinguish:

validation failure

authorization failure

not found

conflict

provider unavailable

timeout

rate limit

malformed response

persistence failure

analysis failure

infrastructure failure


Do not catch broad errors and return success.

Do not silently substitute empty data for failed operations.


---

34. API Contract Discipline

APIs must expose domain/application contracts rather than persistence internals.

Do not expose:

database implementation details

secrets

internal credentials

private provider configuration

unrestricted internal metadata


API responses must represent explicit states.

Avoid ambiguous responses such as:

{
  "success": true,
  "data": null
}

when the operation actually failed.


---

35. UI Contract Discipline

The UI must consume real application/API contracts.

Do NOT:

hard-code production-looking data

invent metrics

fabricate execution states

display placeholder AI responses as real

bypass server authorization

call repositories directly


Loading, empty, unavailable, failed, and successful states must be distinguishable.


---

36. Internationalization

User-facing functionality must respect the project's localization architecture.

Where bilingual support is required:

English

Persian

RTL/LTR


must be supported consistently.

Do not hard-code user-facing strings into components when the project uses a localization system.

Do not automatically translate user-provided content unless explicitly required.


---

37. Testing Philosophy

Tests must verify actual behavior, not implementation appearance.

A test is successful only when it genuinely exercises the required behavior.

Do not:

weaken assertions

delete failing tests

convert failures into skips

mock away the behavior under test

test only that a function exists

test only that a page renders



---

38. Test Classification

Clearly distinguish:

Unit Tests

No external infrastructure required.

Integration Tests

Require real infrastructure such as PostgreSQL.

Provider Tests

Require real provider credentials/configuration.

End-to-End Tests

Exercise the complete application path.

Each category must report its environmental requirements.


---

39. Skipped Tests Are Not Passed Tests

A test skipped because:

PostgreSQL is unavailable

provider credentials are missing

a model is unavailable

external infrastructure is unavailable


is NOT a passing test.

Report it as:

BLOCKED / SKIPPED

with:

exact test

dependency

reason

command attempted

environmental vs implementation cause


Never claim complete verification when required tests were unavailable.


---

40. Provider Credential Policy for Tests

Tests requiring provider credentials must:

clearly declare the requirement

fail explicitly when required credentials are missing, unless the test framework has an intentional environment-gated classification

never replace a missing credential with fake production behavior


Do not mark a provider integration test as successful merely because it was skipped.


---

41. Canonical Verification Commands

First inspect the repository's canonical scripts.

Where applicable, run:

pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm run build

If the repository defines separate integration/e2e commands, run them as required.

Do not invent alternate commands merely to avoid failures.


---

42. Production Build Requirement

Before declaring a task complete:

pnpm run build

must succeed unless an explicitly documented infrastructure blocker prevents it.

A failed production build means the task is NOT complete.


---

43. TypeScript Integrity

Do not use TypeScript to conceal incomplete implementation.

Prohibited shortcuts include:

any

or unsafe assertions used solely to silence errors.

When a type error identifies an incomplete domain contract, fix the domain contract.

Do not remove fields from interfaces merely to make an implementation compile.


---

44. Lint Integrity

Do not disable lint rules merely to make a task pass.

If an exception is genuinely necessary:

document why

minimize its scope

follow repository conventions



---

45. Regression Protection

Every task must preserve existing functionality unless the task explicitly changes the contract.

At minimum verify:

existing tests

affected feature tests

relevant database tests

typecheck

lint

production build


Do not modify unrelated tests solely to achieve a green result.


---

46. Files Changed

At completion, report every changed file.

For each file:

FILE:
<path>

CHANGE:
<summary>

REASON:
<why this file changed>

Unexpected modifications must be investigated.


---

47. Documentation

If a task introduces or changes:

domain contracts

APIs

persistence

migrations

provider integrations

scheduler behavior

security behavior

operational behavior


update the relevant documentation.

Documentation must describe actual implementation, not aspirational architecture.


---

48. No Silent Architectural Compromises

If the implementation cannot fully satisfy a requirement because of:

unavailable infrastructure

missing provider capability

incompatible existing architecture

migration limitations

unresolved dependency


do not silently implement an approximation.

Report:

Requirement:
<requirement>

Limitation:
<limitation>

Current behavior:
<actual behavior>

Impact:
<impact>

Recommended next step:
<next step>


---

49. Scope-Creep Protection

Do not use a current task as an excuse to implement unrelated future capabilities.

If future architecture is required for the current task:

create only the required boundary

keep it minimal

document the extension point


Do not implement future business logic.


---

50. Security Review Before Completion

Before declaring completion, verify:

tenant isolation

authorization

secret handling

API exposure

raw data exposure

logging exposure

injection risks

unsafe dynamic execution

database constraints

migration safety


Security issues are completion blockers unless explicitly documented as accepted external limitations.


---

51. Operational Verification

For tasks involving asynchronous/background/provider execution, verify where applicable:

idempotency

retries

timeout

cancellation

duplicate worker handling

failure persistence

structured logging

execution state transitions

historical persistence


Do not verify only the happy path.


---

52. Real End-to-End Verification

Where the environment supports it, perform at least one real end-to-end execution through the actual configured application path.

Do not replace the end-to-end path with:

mocked provider

hard-coded response

static fixture presented as production behavior


If required infrastructure is unavailable, explicitly report the blocker.


---

53. Final Verification Report

Every completed task MUST provide:

TypeScript:
<pass/fail/blocked>

Lint:
<pass/fail/blocked>

Unit Tests:
<pass/fail/blocked>

Integration Tests:
<pass/fail/blocked>

Provider Tests:
<pass/fail/blocked/not applicable>

E2E:
<pass/fail/blocked/not applicable>

Production Build:
<pass/fail/blocked>

Database/Migrations:
<pass/fail/blocked>

Tenant Isolation:
<pass/fail/blocked/not applicable>

Security Review:
<pass/fail/blocked>

Known Limitations:
<list>

Never claim a verification succeeded unless it was actually executed.


---

54. Mandatory Execution Log

Every task MUST end with a chronological execution log.

For every meaningful step record:

[Step]
<action performed>

[Files]
<files created/modified>

[Verification]
<command/check performed>

[Result]
<pass/fail/blocked + relevant output>

[Decision]
<important architectural decision>

[Correction]
<problem discovered and how it was fixed>

The log must reflect the actual work performed.

Do not reconstruct a fictional log after implementation.


---

55. Git Verification

At the end of every task report:

Git status:
<exact git status>

Branch:
<current branch>

Commit:
<commit hash and message>

Working tree:
clean / dirty

Uncommitted changes:
<list>

If no commit was created, explicitly explain why.

Do not claim the repository is clean without checking it.


---

56. Completion Rule

A task is complete ONLY when:

1. requested functionality is implemented


2. canonical architecture is respected


3. domain contracts are complete


4. persistence is correct


5. tenant isolation is verified


6. security requirements are satisfied


7. tests are executed and honestly reported


8. typecheck passes


9. lint passes


10. production build passes


11. documentation is updated where required


12. no prohibited mock/placeholder production behavior remains


13. execution log is complete


14. git status is verified


15. known limitations are explicitly reported



"Looks correct" is not sufficient.

"Build passes" is not sufficient.

"Tests pass" is not sufficient.

The implementation must be demonstrably correct within the verified environment.


---

57. Agent Behavior When Requirements Are Ambiguous

When a requirement is ambiguous and the ambiguity affects:

data integrity

historical correctness

security

tenant isolation

API compatibility

provider behavior

scheduling semantics

retry semantics

versioning

domain meaning


DO NOT guess.

First inspect:

1. existing architecture


2. existing contracts


3. existing documentation


4. existing tests


5. related task specifications



If the ambiguity can be resolved from existing canonical contracts, follow them.

If it cannot be resolved safely, stop and report the ambiguity.

Do not create arbitrary semantics merely to complete the task.


---

58. Agent Behavior When Existing Code Is Incomplete

Incomplete existing code does not automatically justify replacement.

The agent must determine whether the code is:

intentionally partial

a known extension point

legacy code

a canonical implementation

a test-only implementation

genuinely broken


Prefer the smallest safe correction.

Do not perform broad refactors without necessity.


---

59. Agent Behavior When Tests Fail

When a test fails:

1. determine whether the failure is caused by the current change


2. inspect the underlying contract


3. fix the implementation if appropriate


4. rerun the affected test


5. rerun relevant regression tests



Do NOT:

delete the test

weaken the assertion

skip the test

change expected behavior without justification

hide the error


If the test reveals a pre-existing unrelated defect, report it explicitly.


---

60. Agent Behavior When Build Fails

A production build failure is a blocking issue.

The agent must:

1. capture the exact error


2. identify the responsible contract/code


3. fix it if within scope


4. rerun typecheck/build


5. report the result



Do not declare task completion while the production build remains broken.


---

61. Agent Behavior With Existing CI/Vercel Failures

If local tests pass but CI/Vercel fails:

reproduce the failure where possible

inspect the exact CI error

do not assume local success means deployment success

fix production/build configuration issues within scope

report environment-specific limitations


Deployment verification is part of production readiness when the task affects the deployment build.


---

62. Principle of Least Change

Prefer:

smallest correct architectural change

over:

largest possible redesign

The goal is not to rewrite the codebase.

The goal is to extend the existing system safely.


---

63. Final Rule

The agent must optimize for:

Correctness
> Architectural integrity
> Historical integrity
> Security
> Tenant isolation
> Reproducibility
> Testability
> Observability
> Maintainability
> Feature completeness
> Implementation speed

Never sacrifice architectural correctness merely to finish a task faster.
