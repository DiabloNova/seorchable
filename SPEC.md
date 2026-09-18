# SPEC.md

# Seorchable — System Specification

This document defines the intended technical behavior, architectural invariants, security properties, and product-level system contracts of Seorchable.

It defines **what the system must be**, not the current condition of the repository.

The current repository may violate one or more requirements in this specification. Such a violation is a finding to be investigated and, where authorized by `PLAN.md`, repaired. It must not be silently treated as the intended design.

---

## 1. Specification Status

This document is the repository's high-level technical contract.

It is intentionally different from:

- `AGENTS.md` — how an AI agent must behave.
- `BLUEPRINT.md` — how engineering work must be performed.
- `PLAN.md` — what work is currently authorized.
- `SKILL.md` — how specific technical operations are performed.

This specification does not itself authorize implementation.

A requirement in this document describes the target system. An agent must not assume that the current implementation already satisfies it.

---

# 2. Product Identity

Seorchable is a multi-tenant SaaS platform for brand intelligence, SEO intelligence, AI visibility, AEO/GEO analysis, competitive intelligence, content intelligence, and related AI-assisted workflows.

The system is intended to help users understand and improve how their brands, websites, entities, content, and competitive positions are represented across search engines and AI-powered answer systems.

The platform is designed for:

- SEO professionals.
- Marketing teams.
- Brand teams.
- Content teams.
- Technical teams.
- Organizations managing one or more brands or websites.

The product must provide useful intelligence while preserving strict tenant isolation, controlled access, deterministic processing where required, and auditable security boundaries.

---

# 3. Product Capability Model

The platform is composed of cooperating intelligence domains.

The architecture must preserve clear boundaries between these domains.

Relevant product capabilities include:

- AI Visibility Intelligence.
- AEO/GEO Intelligence.
- Brand Intelligence.
- Competitive Intelligence.
- Citation Intelligence.
- Knowledge Graph / Entity Intelligence.
- Content Intelligence.
- Keyword Intelligence.
- Technical SEO Intelligence.
- Site Architecture Intelligence.
- Document Intelligence.
- RAG-based intelligence.
- AI Prompt Intelligence.
- Content Studio.
- Content Gap Intelligence.
- Competitive Radar.
- Credit and usage management.

A capability described as implemented in product documentation is not automatically proof that its implementation is complete or correct. Runtime behavior and source code remain subject to verification.

---

# 4. Architectural Principles

The system must follow these architectural principles.

## 4.1 Multi-Tenancy

The platform is fundamentally multi-tenant.

Tenant/workspace data must be isolated so that one tenant cannot access another tenant's protected data.

Tenant isolation must be enforced at the server and database boundaries, not merely through UI conventions.

Where PostgreSQL Row-Level Security is used, RLS is a security boundary and must not be treated as optional presentation logic.

---

## 4.2 Server-Side Authorization

Authorization must be enforced on trusted server-side boundaries.

Client-side checks may improve user experience but must never be considered sufficient authorization.

A request must not gain access to protected resources merely because a client supplies:

- a tenant ID;
- workspace ID;
- user ID;
- role;
- resource ID;
- or another authorization-related identifier.

The server must derive or validate authorization context from trusted authenticated state and database relationships.

---

## 4.3 Domain Boundaries

Business logic should remain separated into coherent domain or service boundaries.

Application routes, server actions, UI components, database access, background processing, and external integrations must not become a single undifferentiated layer.

Where a service boundary exists, callers should depend on the service contract rather than duplicating its internal implementation.

---

## 4.4 Deterministic Processing

Components explicitly defined as deterministic must produce results from their declared inputs without hidden dependence on nondeterministic external behavior.

Examples include:

- scoring;
- classification;
- normalization;
- chunking;
- gap detection;
- structural analysis;
- content analysis;
- URL normalization;
- deterministic SEO analyzers.

A deterministic engine must not silently introduce an external LLM or network call merely because it is convenient.

---

## 4.5 AI-Assisted Processing

AI-powered functionality must distinguish between:

- deterministic computation;
- retrieved evidence;
- model-generated output;
- persisted canonical data;
- user-authored content.

AI output must not silently be represented as verified factual data when the system does not possess corresponding evidence.

Where a workflow requires grounded generation, insufficient evidence must be representable and must not be replaced by fabricated certainty.

---

# 5. Request Processing Model

The preferred protected request flow is:

    User
      ↓
    Next.js Server Action / Route Handler
      ↓
    Authentication
      ↓
    Authorization
      ↓
    Tenant / Workspace Context
      ↓
    Domain Service
      ↓
    Database / External Service
      ↓
    Response

Each layer has a distinct responsibility.

### Authentication

Determines whether the requester has a valid authenticated identity.

### Authorization

Determines whether that identity may perform the requested operation.

### Tenant Context

Determines which tenant/workspace boundary applies.

### Domain Service

Executes business rules.

### Persistence / Integration

Performs database or external-system operations under the already-established security context.

A lower layer must not blindly trust identifiers supplied by an untrusted client.

---

# 6. Identity Model

The system must maintain a clear distinction between:

- User identity.
- Organization / workspace / tenant identity.
- Organization membership.
- Role.
- Session.
- Authentication token.
- Invitation token.
- Domain resource ownership.

A user and a workspace are not interchangeable concepts.

Membership determines a user's relationship with a workspace.

A session identifies an authenticated user and must not by itself grant unrestricted access to every tenant.

---

# 7. Registration Contract

Registration must establish the initial account and workspace relationship atomically where the data model requires those records to be created together.

The registration lifecycle must support:

1. Validating user-provided registration fields.
2. Normalizing the email address.
3. Creating the user in an unverified state.
4. Creating the requested workspace/organization.
5. Creating the initial owner membership.
6. Creating the email-verification token state.
7. Committing the required database transaction.
8. Sending the verification message only after the relevant database transaction has committed.
9. Requiring email verification before authenticated access where specified by the authentication model.

Registration must not create an authenticated session for an unverified account.

The submitted workspace name must be respected when workspace creation is part of registration.

The system must not silently replace the submitted workspace name with an unrelated generated name.

---

# 8. Authentication Contract

Authentication must be server-controlled.

Password authentication must use a password hashing mechanism appropriate for password storage, with Argon2id as the intended password hashing algorithm for password-based authentication.

Authentication must not rely on:

- plaintext passwords;
- client-provided authentication state;
- plaintext authentication tokens stored as durable database credentials;
- tenant identifiers supplied by the client as proof of authorization.

Login failures must not expose unnecessary information about account existence.

Where the authentication contract requires a generic failure response, differences between:

- nonexistent user;
- incorrect password;
- inactive user;
- unverified user;

must not create an account-enumeration side channel through public error behavior.

---

# 9. Email Verification

Email verification must use a cryptographically strong, single-use token.

The raw verification token must not be stored as durable plaintext in the database.

The intended token properties are:

- high entropy;
- unpredictable;
- single-purpose;
- time-limited;
- single-use;
- invalidated after successful use;
- replaced when a new verification token is issued.

The database should store a cryptographic representation such as a secure token hash rather than the raw token.

The verification operation must be atomic with respect to token consumption.

An already-used, expired, invalid, or otherwise invalidated token must not successfully verify an account.

---

# 10. Password Reset

Password-reset tokens must follow the same core security model as verification tokens.

They must be:

- cryptographically unpredictable;
- high entropy;
- time-limited;
- single-use;
- stored in hashed form rather than raw form;
- invalidated after successful use.

A successful password reset must invalidate previously issued authenticated sessions according to the session invalidation model.

A password-reset flow must not disclose whether an arbitrary email address belongs to an account through its public response.

---

# 11. Unified Authentication Token Model

Where email verification and password reset tokens share the same lifecycle model, they should use a unified token representation with an explicit purpose.

The conceptual model is:

    auth token
      ├── user
      ├── token hash
      ├── purpose
      ├── expiration
      ├── used timestamp
      └── creation timestamp

The token purpose must be explicit.

At minimum, the model must distinguish:

    email_verification
    password_reset

A token created for one purpose must not be accepted for another purpose.

---

# 12. Session Security

Authenticated sessions must be server-controlled and cryptographically protected.

The session model must support:

- authenticated user identity;
- session integrity;
- expiration;
- invalidation;
- logout;
- protection against stale sessions after security-sensitive account changes.

Session validity must not depend solely on an untrusted client-controlled identifier.

Where session versioning is used, the version stored in the authenticated session must be checked against the authoritative user state when required by the security model.

Incrementing the authoritative session version must invalidate previously issued sessions.

---

# 13. Session Secret

Cryptographic session signing/encryption must use an explicitly configured server secret.

The application must fail closed when the required session secret is missing.

It must not silently generate a random fallback secret at runtime for production authentication.

A missing required authentication secret is a configuration failure, not an invitation to create an ephemeral secret.

---

# 14. Cookie Security

Authentication cookies must contain only the minimum information required by the session design.

Sensitive authorization state must not be trusted merely because it appears in a cookie.

Plaintext durable cookies containing:

- tenant IDs;
- user IDs;
- roles;
- authorization state;

must not be treated as authenticated proof of identity or authorization.

Cookie properties must follow the application's security requirements for:

- `HttpOnly`;
- `Secure`;
- `SameSite`;
- appropriate path;
- controlled expiration.

---

# 15. Logout

Logout must invalidate the authenticated session according to the session model.

Logout must also clear the relevant authentication cookies.

Legacy authentication cookies must not remain as an alternative authentication mechanism after the migration to the authoritative session model.

Logout must not merely redirect the browser while leaving a valid server-side session active.

---

# 16. Authorization and RBAC

Authorization must be based on server-verified membership and role state.

The workspace role model includes:

    super_admin
    workspace_admin
    viewer

Role names and their permissions must be treated as explicit contracts rather than inferred from UI visibility.

A user interface hiding a control is not an authorization mechanism.

Every protected mutation and protected data access must perform the required server-side authorization.

---

# 17. Tenant Isolation

Tenant isolation is a critical security invariant.

A tenant-scoped operation must operate within the authenticated and authorized tenant context.

The application must not trust an arbitrary client-provided tenant ID as proof that the requester belongs to that tenant.

Where PostgreSQL RLS is part of the architecture:

    authenticated request
        ↓
    verified tenant context
        ↓
    database transaction
        ↓
    RLS enforcement

The tenant context must be established safely and must not be left behind on a reused database connection.

---

# 18. Database Context Safety

Tenant context must not leak between requests, transactions, users, or workspaces.

Database connection reuse must not permit one request to inherit another request's tenant context.

Tenant context should be established within the appropriate transaction or connection scope and cleared or isolated according to the database access design.

A missing tenant context for a tenant-scoped operation must fail safely rather than implicitly becoming unrestricted access.

---

# 19. Database Schema Contract

PostgreSQL is the primary relational database.

Drizzle ORM is the intended ORM/schema management layer.

Canonical schema definitions belong under:

    database/schema/

The schema aggregator must expose the intended schema definitions consistently.

Database structure must be represented consistently across:

- schema definitions;
- migrations;
- migration metadata;
- migration journal;
- runtime database state.

These representations must not be treated as interchangeable.

---

# 20. Migration Integrity

Migration history is part of the database system and must be treated as historical state.

Historical migrations must not be rewritten merely to make the current schema or migration generator convenient.

A migration must represent an intentional transition from one database state to another.

Generated migration output must be inspected before being accepted.

Unexpected:

- table renames;
- column renames;
- dropped columns;
- dropped tables;
- recreated constraints;
- index changes;
- foreign-key changes;

must be investigated rather than automatically accepted.

---

# 21. Migration and Schema Alignment

The intended relationship is:

    Canonical Schema
          ↓
    Migration Generation
          ↓
    Migration File
          ↓
    Migration Metadata / Snapshot
          ↓
    Migration Journal
          ↓
    Database State

A contradiction between these layers is a repository integrity issue.

It must be investigated before additional migrations are generated on top of an uncertain baseline.

A migration generator must not be used as a substitute for understanding the existing migration history.

---

# 22. Data Integrity

Database operations must preserve:

- referential integrity;
- uniqueness constraints;
- appropriate nullability;
- correct data types;
- ownership relationships;
- tenant boundaries;
- transactional invariants.

Operations that modify multiple logically dependent records must use appropriate transactional semantics.

Partial creation of an account/workspace/membership security boundary must not be accepted where atomicity is required by the domain contract.

---

# 23. Credits and Financially Relevant State

Credit balances and credit transactions must be treated as integrity-sensitive state.

Credit mutations must be:

- attributable;
- tenant-scoped;
- transactionally consistent;
- protected against duplicate application where an external event can be retried.

Payment/webhook processing must not trust client-supplied tenant identifiers when the server can derive ownership from authoritative payment state.

External provider event identifiers should support idempotent processing.

---

# 24. Webhook Security

Webhook handlers must verify authenticity before applying state changes.

Where HMAC signatures are used:

- verification must use the raw request body;
- the signed timestamp must be included in the authenticated material when required;
- stale requests must be rejected;
- malformed signatures must be rejected;
- comparison must use timing-safe comparison where applicable.

Webhook processing must be idempotent.

A duplicate valid provider event must not apply its financial effect more than once.

---

# 25. External Network Access

Outbound network requests must be treated as security-sensitive.

User-controlled URLs must not automatically be fetched from the server.

Where outbound fetching is permitted, URL validation must protect against SSRF and unsafe network targets.

The crawler/integration layer must maintain an explicit trust boundary between:

- user-controlled input;
- URL validation;
- external network access;
- returned content;
- persistence.

---

# 26. Crawling and Website Intelligence

Website crawling is an important product capability.

Crawler operations must:

- operate within the authorized tenant/workspace;
- validate outbound URLs;
- respect applicable security constraints;
- persist results under the correct tenant;
- avoid cross-tenant data contamination;
- provide enough state to distinguish crawl status and freshness.

Crawled data must remain attributable to the website, workspace, and relevant analysis context.

---

# 27. AI and External Provider Boundaries

External AI providers are integration boundaries.

Provider calls must not bypass:

- authorization;
- tenant boundaries;
- rate limits;
- credit controls;
- data-access rules;
- logging/security requirements.

Provider configuration and credentials must remain server-side.

Sensitive provider credentials must not be exposed to browser clients.

---

# 28. AI Output Integrity

AI-generated results must be distinguishable from deterministic calculations and retrieved evidence.

Where an AI workflow is grounded in retrieved documents or canonical data:

- the retrieved evidence must remain identifiable;
- insufficient evidence must be representable;
- the system must not fabricate supporting evidence;
- generated claims must not automatically become canonical facts without an explicit persistence rule.

AI output should not silently overwrite authoritative data without the appropriate domain operation.

---

# 29. Document Intelligence

Document processing must preserve tenant ownership and document identity.

Where content hashing is part of the design:

- SHA-256 content hashing should provide stable content identity;
- normalization must be deterministic where specified;
- chunking must be deterministic where specified;
- vector dimensionality must match the configured model/storage contract.

Document retrieval must remain tenant-safe.

---

# 30. Knowledge and Entity Model

Canonical entities and relationships form a shared intelligence foundation.

Entity relationships must preserve:

- tenant ownership;
- source and target entity identity;
- relationship semantics;
- referential integrity.

Deterministic scoring systems must document their inputs and calculation rules.

A score must not be represented as an objective fact when it is actually a model-derived metric.

---

# 31. Content Intelligence

Content-related functionality must distinguish:

- source content;
- canonical intelligence;
- deterministic analysis;
- AI-generated suggestions;
- user edits;
- persisted final content.

A content brief engine defined as deterministic must not silently generate article prose.

Content recommendations must not be presented as verified facts unless supported by the relevant evidence model.

---

# 32. Localization

The application supports localization, including Persian and right-to-left interfaces.

Locale-aware routing must preserve the active locale where appropriate.

Server actions and generated links must not hardcode a single locale when the caller has already established a different valid locale.

Localization behavior must not compromise authentication, authorization, or redirect security.

---

# 33. Background Processing

Background processing must preserve the same domain invariants as synchronous requests.

Inngest/background jobs must:

- identify the relevant tenant/workspace context safely;
- avoid relying on stale client state;
- remain idempotent where retries are possible;
- protect external integrations;
- preserve database consistency;
- avoid cross-tenant processing.

A background job must not assume that a previously valid authorization state remains valid forever without checking the required persisted state.

---

# 34. Caching

Caches must not become an unintended authorization boundary.

Tenant-scoped cached data must include sufficient isolation in its cache identity.

A cache hit must never return another tenant's protected data.

Sensitive authentication state must not be cached in a way that bypasses the authoritative session/security model.

---

# 35. Rate Limiting and Abuse Controls

Security-sensitive operations must be protected against abuse.

Relevant operations include:

- Login.
- Registration.
- Email verification.
- Verification resend.
- Password reset.
- Password-reset resend.
- Sensitive API operations.
- Expensive AI operations.
- Expensive crawling operations.

Rate limiting must not create an account-enumeration side channel.

Failure handling should preserve the same public security contract regardless of whether an account exists where appropriate.

---

# 36. Error Handling

Errors must not expose unnecessary sensitive information.

Public authentication errors should not disclose:

- password correctness;
- account existence;
- internal database details;
- session secrets;
- token values;
- provider credentials.

Internal diagnostics may contain more detail only where appropriate and must still protect sensitive information.

---

# 37. Logging and Observability

Logs must support debugging without becoming a secret-exfiltration mechanism.

Do not log:

- raw authentication tokens;
- raw password-reset tokens;
- raw verification tokens;
- passwords;
- session secrets;
- API credentials;
- sensitive authorization cookies.

When an external email provider is unavailable and a development fallback is used, logs must remain redacted and must not expose raw authentication links or token values.

---

# 38. API Contract

API routes and server actions must:

1. Validate input.
2. Authenticate where required.
3. Authorize the requested operation.
4. Establish the correct tenant context.
5. Execute the domain operation.
6. Return an appropriate response.

Client-provided identifiers must not bypass authorization.

An API endpoint must not assume that reaching the endpoint implies permission to perform the operation.

---

# 39. Validation

Untrusted input must be validated at the server boundary.

Validation must cover:

- type;
- required fields;
- acceptable ranges;
- string constraints;
- identifiers;
- URLs;
- enum-like values;
- security-sensitive parameters.

Validation must not replace authorization.

A valid UUID belonging to another tenant is still unauthorized.

---

# 40. Transactional Integrity

Transactions must be used where multiple operations form one logical invariant.

Examples include:

- account/workspace creation;
- membership creation;
- token creation tied to account state;
- password-reset state changes;
- credit application;
- payment event processing;
- security-sensitive state transitions.

A transaction must not be considered correct merely because it exists; the complete set of reads and writes must be evaluated for race conditions and rollback behavior.

---

# 41. Concurrency and Idempotency

Operations exposed to retries, duplicate requests, background retries, or external provider events must define their idempotency behavior.

Where uniqueness is the database-level invariant, application code must not rely exclusively on a preceding existence check.

Database constraints should protect critical uniqueness invariants.

Race-prone security operations must use appropriate transactional or locking semantics.

---

# 42. Data Ownership

Every tenant-owned resource must have an unambiguous ownership relationship.

Ownership must be enforceable through the data model and server authorization.

A resource must not become accessible merely because a caller knows its identifier.

Direct-object access must still verify:

    authenticated user
        +
    authorized membership
        +
    authorized tenant
        +
    resource ownership

where applicable.

---

# 43. Administrative Access

System-level administrative capabilities must remain distinct from ordinary workspace access.

Administrative roles must not be accidentally granted through workspace membership.

Administrative operations must have explicit authorization rules.

Sensitive administrative actions should be auditable.

---

# 44. Auditability

Security-sensitive and materially consequential operations should be auditable where the application defines an audit trail.

Audit records should identify, as appropriate:

- actor;
- action;
- resource;
- timestamp;
- outcome;
- relevant contextual information.

Audit data must itself respect privacy and tenant/security boundaries.

---

# 45. Dependency and Configuration Integrity

Dependencies must be used according to the project's established package-management configuration.

An agent must not add a dependency merely to avoid understanding or repairing an existing implementation.

Required environment variables must fail safely when absent.

Secrets must remain outside source control.

Configuration changes must be treated as behavioral changes and verified accordingly.

---

# 46. Build and Runtime Integrity

A successful build establishes only that the build succeeded.

It does not independently prove:

- database correctness;
- authentication correctness;
- authorization correctness;
- tenant isolation;
- runtime external integrations;
- migration correctness.

Each of these requires appropriate verification.

---

# 47. Testing Contract

Tests should verify behavior and invariants rather than merely implementation details.

Critical areas require focused coverage, including:

- Authentication.
- Registration.
- Email verification.
- Password reset.
- Session invalidation.
- Authorization.
- Tenant isolation.
- RBAC.
- Rate limiting.
- Database constraints.
- Migration behavior.
- Payment idempotency.
- Webhook authenticity.
- SSRF protection.
- Deterministic engines.

Security tests should include negative cases, not only successful flows.

---

# 48. Security Invariants

The following are non-negotiable system invariants:

1. An unauthenticated requester cannot access protected user/workspace data.
2. An authenticated user cannot access another tenant's protected data merely by changing an identifier.
3. Client-controlled tenant identifiers do not establish authorization.
4. Client-side authorization checks are never the sole security boundary.
5. Raw authentication tokens are not stored as durable database secrets.
6. Authentication secrets are not silently generated as production fallbacks.
7. Passwords are never stored in plaintext.
8. Security-sensitive token use is single-purpose and single-use.
9. Expired security tokens cannot be consumed successfully.
10. Password reset invalidates previously valid sessions according to the session model.
11. Logout invalidates the relevant session.
12. Duplicate external financial events cannot apply their effect more than once.
13. Webhook authenticity is verified before applying trusted state changes.
14. Tenant context cannot leak between requests.
15. Protected data cannot cross tenant boundaries through caching.
16. Security-sensitive operations do not unnecessarily disclose account existence.
17. Secrets and raw authentication material are not exposed through logs.
18. Server-side authorization is performed before protected mutations.
19. Database constraints protect critical uniqueness and referential invariants.
20. Material database inconsistencies are resolved before building further migration state on top of them.

---

# 49. Product-to-Architecture Alignment

The product exists to transform website, brand, content, entity, search, citation, and AI-observation data into actionable intelligence.

The architecture must therefore preserve this chain:

    Data Collection
        ↓
    Normalization
        ↓
    Canonical Persistence
        ↓
    Deterministic / AI Analysis
        ↓
    Intelligence
        ↓
    User-Facing Results
        ↓
    Actions / Recommendations

Security boundaries must apply across the entire chain.

Tenant isolation must not disappear when data moves from synchronous requests to:

- caches;
- background jobs;
- AI providers;
- crawler services;
- documents;
- vector retrieval;
- reports;
- analytics;
- persisted intelligence.

---

# 50. Specification Versus Current Repository

The agent MUST distinguish between:

    SPECIFICATION
    CURRENT IMPLEMENTATION
    VERIFIED CONFORMANCE
    VERIFIED NON-CONFORMANCE
    UNKNOWN

The existence of a requirement in this document does not prove that the current code satisfies it.

When an implementation differs from this specification:

1. Verify the implementation.
2. Record the discrepancy.
3. Determine whether it is intentional or defective.
4. Check the active plan.
5. Modify it only when authorized.

Do not rewrite the specification merely to make the current implementation appear compliant.

---

# 51. Change Impact

Any change to a core invariant must be evaluated for downstream impact.

In particular, changes involving:

- users;
- organizations;
- memberships;
- sessions;
- authentication tokens;
- database migrations;
- tenant context;
- RLS;
- credits;
- payment events;
- external integrations;

may affect multiple application layers.

A local code change must not be assumed to have local consequences.

---

# 52. Canonicality Rules

When a concept has a canonical representation, duplicate competing representations should not be introduced without an explicit architectural reason.

Examples include:

- canonical tenant identity;
- canonical user identity;
- canonical token representation;
- canonical database schema;
- canonical migration history;
- canonical entity records;
- canonical document identity.

Compatibility layers must have an explicit purpose and must not become accidental parallel systems.

---

# 53. Evolution and Migration

The system is expected to evolve.

Evolution must preserve:

- existing data integrity;
- tenant isolation;
- authentication security;
- authorization boundaries;
- migration traceability;
- backward compatibility where required;
- explicit deprecation behavior.

A migration must be an intentional state transition, not a tool-generated attempt to reconcile unknown repository state.

---

# 54. Definition of Correctness

A feature is technically correct only when:

1. It satisfies the applicable specification.
2. It integrates correctly with existing architecture.
3. It preserves security invariants.
4. It preserves tenant boundaries.
5. It preserves database integrity.
6. It handles relevant failure modes.
7. It has appropriate test coverage or documented verification.
8. Its implementation is within the authorized scope.
9. Its resulting repository state has been verified.

"Compiles" is not equivalent to "correct."

"Tests pass" is not equivalent to "secure."

"Migration generated" is not equivalent to "database state is correct."

---

# 55. Final System Principle

Seorchable must remain a secure, multi-tenant intelligence platform in which:

    USERS
      ↓
    AUTHENTICATED IDENTITY
      ↓
    AUTHORIZED WORKSPACE CONTEXT
      ↓
    TRUSTED DOMAIN OPERATIONS
      ↓
    ISOLATED DATA
      ↓
    DETERMINISTIC / GROUNDED INTELLIGENCE
      ↓
    AUDITABLE RESULTS
      ↓
    USER ACTION

Every layer must preserve the invariants established by the layers before it.

Convenience must not override security.

Generated artifacts must not override architectural intent.

Current implementation must not redefine desired behavior merely because it already exists.

And repository repair must never be performed by hiding contradictions; contradictions must be exposed, understood, and resolved deliberately.
```0
