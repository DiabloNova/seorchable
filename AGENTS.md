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

```text
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
