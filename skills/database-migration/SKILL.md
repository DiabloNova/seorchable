---
name: database-migration
description: Design, implement, review, or verify database schema changes, Drizzle migrations, authentication tables, constraints, indexes, and migration safety in Seorchable.
---

# Database Migration

A schema change is incomplete until schema definitions, migration artifacts, application code, and verification agree.

## Procedure

1. Inspect the current schema definitions, existing migrations, migration runner, database configuration, repository/data-access layer, and affected tests.
2. Identify the canonical primary/foreign keys and tenant ownership model. Prefer existing user/workspace relations over parallel identity columns.
3. Define the exact schema delta: columns, types, nullability, defaults, uniqueness, foreign keys, indexes, expiry/lifecycle constraints, and deletion behavior.
4. Generate the repository-standard migration. Do not substitute `db:push` for a committed migration unless the task explicitly requires it.
5. Inspect the generated SQL/migration for destructive operations, missing constraints, incorrect ordering, unsafe defaults, and environment-specific assumptions.
6. Update application code and tests in the same coherent change.
7. Run migration/generation checks using the scripts defined by `package.json`; run the build and relevant tests when the change affects runtime behavior.
8. If a live database is available, verify the migration against it. If it is not, state exactly what could not be verified.

## Safety rules

- Never silently drop production data or weaken constraints to make a migration apply.
- Do not create duplicate user identity models when the existing canonical user relation can be used.
- Security/authentication tokens must have explicit expiry and lifecycle semantics.
- Add indexes required by actual lookup paths, but do not invent speculative indexes.
- Keep schema source, generated migration, and runtime queries synchronized.
- Review rollback implications for destructive or irreversible changes.

## Done when

- The schema delta is explicit.
- Migration SQL is inspected, not merely generated.
- Referential integrity and uniqueness/ownership constraints are correct.
- Runtime code and tests match the new schema.
- Required generation/migration/test/build checks were actually executed or explicitly marked unexecuted.
