# Relational Database Migration Strategy

This specification details the migration, execution, and zero-downtime deployment strategy for the AI Visibility Intelligence relational schema.

---

## 1. Migration Tech Stack

We utilize **Drizzle ORM** paired with **Drizzle Kit** to handle schema modeling, SQL generation, and schema diffing.

```
 [TypeScript Schemas] (database/schema/*.ts)
         │
         ▼  (npx drizzle-kit generate:pg)
 [SQL Migration Files] (database/migrations/*.sql)
         │
         ▼  (npx drizzle-kit migrate:pg)
 [Target PostgreSQL Cluster]
```

- **ORM Client**: Drizzle ORM
- **Migration Engine**: Drizzle Kit CLI
- **Target database**: PostgreSQL (v16+)

---

## 2. Directory Hierarchy

All migrations are persisted within the repository root to ensure version control auditability:

```
database/
  schema/
    types.ts             # Metadata TS definitions
    organization.ts      # Tenants schema definition
    brand.ts             # Monitored brands schema definition
    entity.ts            # Knowledge Graph entities schema definition
    prompt.ts            # Query prompts & AI engines schemas
    observation.ts       # LLM observations & mentions schemas
    citation.ts          # Extracted URL reference links schema
    visibility.ts        # Historical metrics schema
    recommendation.ts    # Suggested recovery tasks schema
  migrations/
    meta/                # Drizzle metadata records
    0000_init_schemas.sql# Auto-generated incremental SQL scripts
```

---

## 3. Migration Operations Routine

### Step 3.1: Schema Drift diffing
When modifying a TypeScript schema file, run Drizzle Kit to analyze modifications against the current baseline and generate incremental SQL scripts:
```bash
npx drizzle-kit generate:pg --schema=./database/schema/index.ts --out=./database/migrations/
```

### Step 3.2: Local Sandbox Execution
Run migrations locally against docker postgres using the connection string:
```bash
npx drizzle-kit push:pg
```

### Step 3.3: Production Deployment
During CI/CD pipelines, execute the migration script programmatically prior to compiling and launching Next.js:
```typescript
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../src/lib/db";

async function main() {
  console.log("Applying database migrations...");
  await migrate(db, { migrationsFolder: "./database/migrations" });
  console.log("Database up to date.");
}
```

---

## 4. Zero-Downtime Migration Pattern (Expand/Contract)

To execute schema schema migrations without any SaaS service degradation (0 downtime), we implement the **Expand and Contract** pattern:

1. **Phase 1: Expand (Non-breaking)**
   - Add new columns as nullable.
   - Deploy new columns or tables.
   - Existing codebase remains completely healthy, ignoring the new fields.
2. **Phase 2: Migrate (Sync)**
   - Deploy background workers to copy/translate data from deprecated columns to new structures (if modifying structures).
   - Write dual-writing logic in services if necessary.
3. **Phase 3: Contract (Cleanup)**
   - Deploy code that strictly uses the new columns.
   - Run a final cleanup SQL script to drop old, unused columns or tables.
