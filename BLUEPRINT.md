# BLUEPRINT.md

# Seorchable — Controlled Engineering Blueprint

This document defines the mandatory workflow for AI-assisted engineering work in this repository.

It is designed for autonomous coding agents, including Google Jules.

This document defines **how work is to be performed**.

It does not define the complete technical specification of the application and it does not authorize arbitrary changes.

The repository, the active task, `AGENTS.md`, `SPEC.md`, and `PLAN.md` must be treated as separate sources of control with distinct purposes.

---

## 1. Purpose

Seorchable is treated as a potentially inconsistent brownfield repository.

The agent must therefore operate as an investigator before operating as an implementer.

The required operating model is:

    INSPECT
      ↓
    ESTABLISH FACTS
      ↓
    IDENTIFY CONFLICTS
      ↓
    DEFINE SCOPE
      ↓
    ALIGN ON TARGET STATE
      ↓
    PLAN
      ↓
    HUMAN APPROVAL
      ↓
    IMPLEMENT
      ↓
    VERIFY
      ↓
    REVIEW
      ↓
    REPORT

The agent MUST NOT skip an earlier stage merely because the requested change appears simple.

---

# 2. Governing Principles

The following principles govern every phase.

### 2.1 Reality Before Intention

Determine what the repository currently contains before deciding how it should be changed.

### 2.2 Evidence Before Conclusion

Every material conclusion must be supported by direct evidence.

### 2.3 Scope Before Implementation

The agent must know what it is authorized to change before modifying files.

### 2.4 Specification Before Design

The desired behavior must be understood before implementation decisions are made.

### 2.5 Diagnosis Before Repair

An error must be understood before attempting to fix it.

### 2.6 Verification Before Completion

A change is not complete until its relevant acceptance criteria have been verified.

### 2.7 Stop Before Guessing

When material uncertainty cannot be resolved safely from available evidence, stop.

---

# 3. Controlled Document Model

The repository uses these documents as separate layers of control:

| Document | Purpose |
|---|---|
| `AGENTS.md` | Mandatory agent operating rules |
| `BLUEPRINT.md` | Engineering workflow and phase protocol |
| `SPEC.md` | Desired technical behavior and invariants |
| `PLAN.md` | Current authorized implementation plan |
| `SKILL.md` | Detailed operational procedures |

Their responsibilities MUST NOT be merged.

### `AGENTS.md`

Defines mandatory behavioral constraints.

### `BLUEPRINT.md`

Defines the lifecycle through which work is performed.

### `SPEC.md`

Defines what the system is intended to do.

### `PLAN.md`

Defines what work is currently authorized.

### `SKILL.md`

Defines how specific technical operations should be performed.

A document at a lower level MUST NOT be used to bypass a rule established at a higher level.

---

# 4. Standard Task Lifecycle

Every substantial task MUST follow this lifecycle.

## Phase 0 — Task Intake

Determine:

- What the user explicitly requested.
- What outcome is expected.
- What is explicitly not requested.
- Whether the request is implementation, investigation, audit, repair, refactoring, or planning.
- Whether the task affects security, database state, migrations, authentication, authorization, payments, infrastructure, or other high-risk areas.
- Whether additional information is required.

The agent MUST NOT silently transform a request into a broader objective.

---

## Phase 1 — Repository Reconnaissance

This phase is read-only.

No implementation changes are permitted.

The agent MUST inspect the repository sufficiently to establish the current state relevant to the task.

Depending on scope, this includes:

- Git branch.
- Git commit.
- Git status.
- Existing working-tree changes.
- Repository structure.
- Relevant source files.
- Relevant configuration.
- `package.json`.
- Package manager.
- Available scripts.
- Relevant tests.
- Database configuration.
- Schema definitions.
- Migration files.
- Migration journal.
- Migration metadata and snapshots.
- Relevant documentation.
- Existing agent instructions.
- Relevant callers and consumers.

The agent MUST inspect actual file contents where conclusions depend on them.

A filename, search result, snapshot, or previous report is not sufficient evidence of implementation behavior.

### Phase 1 Exit Criteria

The agent must be able to state:

    CURRENT REPOSITORY STATE
    RELEVANT FILES
    RELEVANT CONFIGURATION
    RELEVANT DEPENDENCIES
    RELEVANT TESTS
    KNOWN CONFLICTS
    KNOWN UNKNOWNS
    PRE-EXISTING CHANGES

If these cannot be established, Phase 1 is incomplete.

---

# 5. Evidence Discipline

The agent must maintain an evidence chain throughout the task.

For each material finding, record:

    CLAIM
    SOURCE
    OBSERVATION
    INTERPRETATION
    CONFIDENCE / STATUS

The source must identify the actual repository artifact or command output from which the finding was established.

The agent must distinguish:

    FACT
    OBSERVATION
    INFERENCE
    ASSUMPTION
    CONFLICT
    UNRESOLVED

An assumption must never silently become a fact.

---

# 6. Repository Truth Protocol

When establishing repository state, use the following procedure.

### Step 1 — Locate

Find the relevant files and configuration.

### Step 2 — Inspect

Read the actual relevant content.

### Step 3 — Cross-check

Compare related sources where consistency matters.

### Step 4 — Trace

Follow important definitions to their callers, consumers, migrations, tests, or runtime boundaries.

### Step 5 — Record

Record the verified result.

### Step 6 — Identify Gaps

Explicitly record anything that remains unverified.

The agent MUST NOT stop at discovery when the task requires understanding behavior.

---

# 7. Contradiction Resolution

When contradictory evidence is discovered, the agent MUST enter a contradiction state.

A contradiction state requires:

    CONFLICT DETECTED

    SOURCE A:
    <path / artifact>

    SOURCE B:
    <path / artifact>

    EXACT DIFFERENCE:
    <observed difference>

    POSSIBLE IMPACT:
    <impact>

    CURRENT STATUS:
    <resolved / unresolved>

    AUTHORIZED RESOLUTION:
    <yes / no>

The agent must then determine whether the contradiction can be resolved through further read-only inspection.

If repository evidence resolves the contradiction, document the resolution.

If it cannot be resolved safely, STOP.

The agent MUST NOT resolve an ambiguous contradiction by choosing the option that makes the current command succeed.

---

# 8. Database Investigation Protocol

Database work requires cross-layer inspection.

When a task touches the database, the agent must distinguish:

    CURRENT SCHEMA
    MIGRATION HISTORY
    MIGRATION JOURNAL
    SNAPSHOTS / METADATA
    DATABASE CONFIGURATION
    ACTUAL DATABASE STATE
    APPLICATION CONSUMERS
    DATABASE TESTS

The agent must not assume these layers are synchronized.

For migration-related work, the minimum investigation is:

1. Inspect the schema definition.
2. Inspect the relevant historical migrations.
3. Inspect the migration journal.
4. Inspect the relevant snapshots.
5. Inspect migration configuration.
6. Compare the representations.
7. Identify conflicts.
8. Determine whether the intended transition is unambiguous.
9. Only then consider migration generation or modification.

If migration tooling presents an unexpected rename, column mapping, table mapping, foreign-key change, index change, or snapshot conflict, the agent MUST stop the migration operation until the meaning of the change is established.

---

# 9. Audit Protocol

A task described as an audit MUST be treated differently from a normal implementation task.

The agent must first define the audit surface.

An audit surface may include:

    Architecture
    Application code
    Database
    Authentication
    Authorization
    Security
    APIs
    Background jobs
    Integrations
    Tests
    Configuration
    Dependencies
    Build system
    Deployment
    Documentation
    Observability

The agent MUST NOT claim a complete audit if material areas were not inspected.

An audit report must include:

    SCOPE INSPECTED
    FILES / SYSTEMS INSPECTED
    VERIFIED FINDINGS
    POTENTIAL FINDINGS
    CONTRADICTIONS
    UNRESOLVED AREAS
    TEST / VERIFICATION STATUS
    AREAS NOT INSPECTED

"360° audit" means comprehensive inspection of the declared surface, not a small sample of representative files.

---

# 10. Anti-Lazy Inspection Protocol

The agent MUST NOT substitute breadth of search results for depth of inspection.

The following pattern is prohibited:

    Search → find one relevant file → infer the architecture → implement.

The required pattern is:

    Search
      ↓
    Locate
      ↓
    Read actual file
      ↓
    Inspect surrounding implementation
      ↓
    Trace dependencies
      ↓
    Cross-check related sources
      ↓
    Establish fact
      ↓
    Act

For high-risk areas, the agent MUST inspect both the definition and the relevant consumers.

Examples:

- Database schema → migrations → consumers.
- Authentication function → session handling → callers.
- API route → validation → authorization → persistence.
- Payment webhook → signature verification → idempotency → transaction.
- Configuration → actual consuming code → runtime behavior.

---

# 11. Alignment Gate

After reconnaissance and before implementation, the agent must establish an explicit alignment record.

The alignment record must answer:

    OBJECTIVE:
    <what is being accomplished>

    CURRENT STATE:
    <verified state>

    TARGET STATE:
    <desired state>

    IN SCOPE:
    <authorized files / behavior>

    OUT OF SCOPE:
    <protected areas>

    DEPENDENCIES:
    <prerequisites>

    RISKS:
    <known risks>

    ACCEPTANCE CRITERIA:
    <measurable requirements>

    VERIFICATION:
    <how success will be established>

    STOP CONDITIONS:
    <conditions requiring halt>

If the target state is not established by the specification or explicit user instruction, the agent MUST NOT invent one.

---

# 12. Planning Gate

Before implementation, the agent must produce or follow an explicit plan.

A plan must decompose the work into independently verifiable phases.

Each phase must specify:

    PHASE OBJECTIVE
    PRECONDITIONS
    ALLOWED FILES
    ALLOWED OPERATIONS
    FORBIDDEN OPERATIONS
    EXPECTED RESULT
    VERIFICATION
    STOP CONDITIONS
    EVIDENCE

The plan must be specific enough that a reviewer can determine whether an individual action belongs to the authorized work.

---

# 13. Human Approval Gate

For substantial or high-risk changes, implementation must not begin until the applicable plan has been explicitly approved.

Approval must be understood as approval of the defined scope and intended operation.

Approval of a plan does not authorize unrelated changes discovered later.

If implementation reveals a materially different repository state from the one on which the plan was based, the agent must stop and re-align rather than silently modifying the plan.

---

# 14. Phase Execution Protocol

During implementation, the agent must operate one phase at a time.

For each phase:

### Before

Verify the preconditions.

### During

Perform only authorized operations.

### After

Inspect the resulting state.

### Then

Run the required verification.

### Finally

Record evidence before moving forward.

The agent MUST NOT combine implementation, unrelated cleanup, and speculative repair into one phase.

---

# 15. Modification Boundary

Before every modification, the agent must know:

    WHY THIS FILE IS BEING CHANGED
    WHAT EXACT CHANGE IS REQUIRED
    WHETHER THE FILE IS IN SCOPE
    WHAT PRE-EXISTING CHANGES EXIST
    WHAT VERIFICATION WILL FOLLOW

If any answer is materially unknown, the agent should not modify the file.

---

# 16. Minimal-Change Principle

The preferred implementation is the smallest change that satisfies the complete requirement.

The agent should minimize:

- Files changed.
- Lines changed.
- New dependencies.
- New abstractions.
- Behavioral changes.
- Database changes.
- Migration changes.
- Risk.

Minimality does not justify incomplete implementation.

A required change must not be omitted merely to keep the diff small.

---

# 17. Error and Failure Protocol

When a command fails, the agent MUST NOT immediately begin speculative recovery.

The required sequence is:

    FAILURE
      ↓
    CAPTURE OUTPUT
      ↓
    DIAGNOSE
      ↓
    IDENTIFY SCOPE OF FAILURE
      ↓
    DETERMINE SAFE RECOVERY
      ↓
    CHECK AUTHORIZATION
      ↓
    RECOVER OR STOP
      ↓
    VERIFY

The original failure must remain visible in the final report.

A later successful command does not erase an earlier failure.

---

# 18. Safe Recovery

Recovery is permitted only when:

- The cause is understood sufficiently.
- The recovery is within scope.
- The operation is safe.
- The operation does not destroy user work or historical state.
- The recovery does not silently redefine the objective.

If recovery would require:

- destructive operations;
- migration-history changes;
- broad refactoring;
- scope expansion;
- Git history manipulation;
- ambiguous database repair;

the agent MUST STOP unless explicitly authorized.

---

# 19. Verification Gate

Every implementation phase must end with verification.

Verification must test the actual acceptance criteria.

The agent must select verification proportional to the risk.

Examples:

| Change | Relevant verification |
|---|---|
| Source logic | Unit / integration tests |
| API behavior | Route-level / integration tests |
| Database schema | Schema inspection + migration verification |
| Migration | Migration generation/inspection + metadata verification |
| Authentication | Security-focused lifecycle tests |
| Authorization | Role / tenancy tests |
| Configuration | Runtime/config validation |
| Build-related change | Build/type/lint checks |
| Repository-wide change | Diff/status + relevant test suite |

A check that was not executed must be reported as:

    NOT RUN

A result that could not be independently established must be reported as:

    NOT VERIFIED

---

# 20. Verification Must Not Be Gamed

The agent must not obtain a passing result by weakening the verification itself.

Prohibited examples include:

- Removing a failing assertion.
- Narrowing a test to exclude the failure.
- Deleting a failing test.
- Replacing a real integration with an irrelevant mock.
- Changing expected behavior merely to match the implementation.
- Skipping required checks without disclosure.
- Suppressing errors.
- Ignoring a migration warning because generation otherwise succeeds.

If a legitimate check fails, diagnose the failure.

If it cannot be safely resolved within scope, STOP and report it.

---

# 21. Review Gate

Before declaring a phase or task complete, the agent must review the resulting change against:

1. The original objective.
2. The active specification.
3. The active plan.
4. The allowed file set.
5. The forbidden file set.
6. Security requirements.
7. Database invariants where applicable.
8. Verification results.
9. Git diff.
10. Git status.

The agent must specifically check for unintended changes.

---

# 22. Diff Review

The final diff is a required source of evidence.

The agent must inspect:

- Every modified file.
- Every created file.
- Every deleted file.
- Unexpected formatting changes.
- Unexpected generated files.
- Unexpected migration changes.
- Unexpected dependency changes.
- Changes outside the authorized scope.

A clean test result does not eliminate the requirement to inspect the diff.

---

# 23. Git State Review

Before and after implementation, Git state must be compared.

The agent must identify:

    PRE-EXISTING CHANGES
    AGENT CHANGES
    UNEXPECTED CHANGES

The agent must preserve pre-existing changes.

Unexpected changes must be investigated before completion.

---

# 24. Security Review Gate

For security-sensitive work, the agent must perform an explicit security review before completion.

The review should consider, where applicable:

    Authentication
    Authorization
    Session lifecycle
    Cookie security
    Password handling
    Token handling
    Cryptography
    Rate limiting
    Tenant isolation
    RBAC
    Secrets
    Webhook verification
    Idempotency
    Database access control
    Information disclosure

The agent must verify that the implementation did not weaken an existing security property.

---

# 25. Database Review Gate

For database work, completion requires reviewing the complete relevant transition:

    SOURCE SCHEMA
        ↓
    GENERATED / AUTHORIZED MIGRATION
        ↓
    MIGRATION METADATA
        ↓
    JOURNAL
        ↓
    EXPECTED DATABASE STATE
        ↓
    APPLICATION COMPATIBILITY

If any material link in this chain remains ambiguous, the database phase is not complete.

---

# 26. Scope Review Gate

Before completion, compare the actual diff against the authorized scope.

The agent must answer:

    Did every changed file belong to the task?
    Did every change serve the objective?
    Was any unrelated behavior changed?
    Were any dependencies changed?
    Were any migrations changed unexpectedly?
    Were any generated artifacts changed unexpectedly?
    Was any user work overwritten?
    Was any historical state modified?

If an unauthorized change exists, the task is not complete until it is resolved safely.

---

# 27. Stop Protocol

The agent must stop immediately when continuing would require guessing or unauthorized action.

Use:

    STATUS: BLOCKED

    PHASE:
    <current phase>

    EXPECTED:
    <expected state>

    OBSERVED:
    <actual state>

    EVIDENCE:
    <relevant evidence>

    IMPACT:
    <why continuation is unsafe>

    REQUIRED DECISION:
    <what must be resolved>

    NO FURTHER MODIFICATION PERFORMED.

Stopping is a valid successful behavior when the repository cannot be safely changed with the available evidence.

---

# 28. Re-Planning Protocol

Re-planning is required when:

- The repository differs materially from the assumed baseline.
- A new dependency is discovered.
- A required file is missing.
- A migration conflict changes the implementation strategy.
- The target behavior is ambiguous.
- The scope must change.
- The implementation requires a different architectural approach.
- Verification reveals an unexpected side effect.

The agent must not silently alter the plan.

The revised plan must identify:

    ORIGINAL PLAN
    NEW EVIDENCE
    REASON FOR CHANGE
    PROPOSED NEW PLAN
    NEW RISKS
    NEW VERIFICATION

Implementation must pause until the revised scope is authorized when authorization is required.

---

# 29. No Phase Skipping

The agent must not skip:

- Reconnaissance because the change is small.
- Alignment because the implementation seems obvious.
- Planning because the task is familiar.
- Verification because tests are expected to pass.
- Diff review because the patch is small.
- Stop conditions because a tool suggests a convenient workaround.

The only exception is when the active plan explicitly defines a phase as unnecessary for the specific task.

---

# 30. No Silent Plan Mutation

The agent must not alter the meaning of the active plan through implementation.

Examples:

- Changing a migration strategy without reporting it.
- Adding unrelated files because they are convenient.
- Expanding a database task into application changes.
- Turning an audit into an implementation task.
- Turning a repair into a migration-history rewrite.
- Adding dependencies without authorization.

If the plan is no longer adequate, use the re-planning protocol.

---

# 31. Completion Criteria

A task may be reported as complete only when all of the following are true:

- The authorized objective was addressed.
- The implementation stayed within scope.
- Required acceptance criteria were satisfied.
- Required verification was performed.
- The resulting diff was reviewed.
- Git state was checked.
- No material unresolved conflict remains.
- No required security or database verification remains pending.
- No unauthorized destructive action occurred.
- The final report accurately describes what happened.

Otherwise use:

    STATUS: INCOMPLETE

or:

    STATUS: BLOCKED

or:

    STATUS: FAILED

as appropriate.

---

# 32. Mandatory Final Report

Every substantial task must end with a factual report containing:

    STATUS

    OBJECTIVE

    CURRENT STATE BEFORE CHANGES

    CHANGES MADE

    FILES CREATED

    FILES MODIFIED

    FILES DELETED

    VERIFICATION PERFORMED

    VERIFICATION RESULTS

    GIT STATUS

    DIFF REVIEW

    CONFLICTS

    OUT-OF-SCOPE FINDINGS

    UNRESOLVED ITEMS

    NEXT AUTHORIZED ACTION

The report must distinguish observed facts from interpretation.

Do not use vague completion language.

---

# 33. Evidence-First Reporting

The final report must not merely repeat the plan.

For each important result, provide evidence sufficient for another engineer to reproduce or inspect the conclusion.

Weak:

    "The migration is correct."

Strong:

    "The schema definition was inspected, the generated migration was inspected,
    the migration metadata was checked, and the resulting Git diff contains only
    the files authorized by the phase. No unresolved migration conflict remains."

The second form is acceptable only when those checks were actually performed.

---

# 34. Agent Self-Check

Before declaring completion, the agent must perform this internal checklist:

    [ ] I inspected the actual relevant source files.
    [ ] I established the current Git state.
    [ ] I preserved pre-existing user changes.
    [ ] I followed the active scope.
    [ ] I did not silently expand the task.
    [ ] I investigated material contradictions.
    [ ] I did not use generated artifacts as a substitute for source inspection.
    [ ] I did not guess where evidence was required.
    [ ] I performed the required verification.
    [ ] I reviewed the final diff.
    [ ] I reviewed the final Git status.
    [ ] I checked relevant security implications.
    [ ] I checked relevant database implications.
    [ ] I reported failures and unresolved issues.
    [ ] Every completion claim is supported by evidence.

If any required item is unchecked, the agent must not report the task as complete.

---

# 35. Operating Model Summary

The required model is:

    1. UNDERSTAND THE REQUEST
    2. INSPECT THE LIVE REPOSITORY
    3. ESTABLISH VERIFIED FACTS
    4. IDENTIFY CONTRADICTIONS
    5. DEFINE THE SCOPE
    6. ALIGN CURRENT STATE WITH TARGET STATE
    7. CREATE / FOLLOW AN APPROVED PLAN
    8. EXECUTE ONE PHASE AT A TIME
    9. VERIFY EACH PHASE
    10. REVIEW THE DIFF
    11. REVIEW THE REPOSITORY STATE
    12. REPORT FACTS, EVIDENCE, AND UNRESOLVED ITEMS

The agent must never invert this order by implementing first and investigating afterward.

---

# 36. Final Rule

The purpose of this blueprint is not to force the agent to perform more work for its own sake.

The purpose is to prevent unsupported decisions in a repository whose current state may be inconsistent.

Therefore:

    NEVER IMPLEMENT FROM A GUESS.

    NEVER CALL A PARTIAL INSPECTION A COMPLETE AUDIT.

    NEVER CALL A GENERATED REPRESENTATION THE SOURCE OF TRUTH WITHOUT VERIFICATION.

    NEVER SILENTLY RESOLVE A MATERIAL CONTRADICTION.

    NEVER EXPAND SCOPE BECAUSE AN UNRELATED PROBLEM WAS DISCOVERED.

    NEVER DECLARE SUCCESS WITHOUT RELEVANT EVIDENCE.

    WHEN THE NEXT SAFE ACTION IS NOT ESTABLISHED:

    STOP.
```0
