# Documentation Claims Report

| ID | Source | Claim | Verdict | Evidence |
|---|---|---|---|---|
| 1 | README.md:89 | Argon2id in src/services/auth | **False** | Found in src/app/actions/auth.ts (Not in src/services/auth) |
| 2 | README.md:93 | SSRF in src/services/crawler/url-validator.ts | **Verified** | File exists |
| 3 | README.md:72 | Background Function in src/inngest/ | **Verified** | Directory exists and contains functions.ts |
| 4 | README.md:83 | database/schema/ and database/schema/index.ts | **Verified** | File exists |
| 5 | README.md:84 | database/drizzle/ and src/core/database/migrator.ts | **Verified** | File exists |
| 6 | README.md:106 | npm install | **Verified** | Will run in quickstart |
| 7 | README.md:112 | env vars: DATABASE_URL, MIGRATION_DATABASE_URL, UPSTASH_REDIS_REST_URL, FIRECRAWL_API_KEY | **Verified** | Vars exist in .env.example |
| 8 | README.md:126 | npm run db:push | **False** | Command fails due to missing env vars |
| 9 | README.md:131 | npm run dev & | **Verified** | Script exists |
| 10 | README.md:136 | npm run build && npm run start & | **Verified** | Scripts exist |
| 11 | README.md:162 | secureServerAction | **Verified** | Found in src/app/actions/ and src/lib/safe-action.ts |
| 12 | README.md:171 | npm run test:acquisition | **Verified** | Script exists |
| 13 | README.md:173 | tests/services/auth/ and tests/features/acquisition/ | **Verified** | Both exist |
| 14 | README.md:188 | CircleCI in .circleci/config.yml | **Verified** | File exists |
| 15 | README.md:98 | Node.js (نسخه ۲۰ یا بالاتر) | **Verified** | package.json @types/node is ^20 |
| 16 | README.md:29 | Drizzle ORM & PostgreSQL | **Verified** | drizzle-orm and pg found |
| 17 | README.md:31 | Firecrawl & Cheerio | **Verified** | @mendable/firecrawl-js and cheerio found |
| 18 | README.md:32 | Vercel AI SDK | **Verified** | ai and @ai-sdk/google found |
| 19 | README.md:28 | Tailwind CSS | **Verified** | tailwindcss found |
| 20 | README.md:26 | Next.js (App Router) | **Verified** | next 16.2.11 and src/app directory found |
| 21 | README.md:27 | TypeScript | **Verified** | typescript found |
| 22 | README.md:188 | استقرار خودکار پس از Push در شاخه اصلی (Main) توسط Vercel | **Unverifiable** | No explicit Vercel config file to verify deployment workflow locally without Vercel account context, though it's standard Next.js behavior. Suggestion: Remove this claim or add vercel.json / github action file that does deployment. |

## Summary
- **Claims Examined**: 22
- **Verified**: 19
- **False**: 2
- **Unverifiable**: 1


# Quickstart Execution Transcript

```bash
$ mkdir -p /tmp/qs_test
$ cp -r . /tmp/qs_test/
$ cd /tmp/qs_test
$ npm install
199 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (4 moderate, 2 high, 1 critical)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

$ cp .env.example .env
$ npm run db:push

> ai-branding-platform@0.1.0 db:push
> tsx scripts/database/db-push-guard.ts && drizzle-kit push

db:push blocked: NODE_ENV must be explicitly set to 'development' or 'test'. Current: 'undefined'.
```

## Missing Steps / Failures Found:
1. `npm run db:push` command fails because `scripts/database/db-push-guard.ts` enforces strict conditions (`NODE_ENV=development`, `ALLOW_DB_PUSH=true`, `DISPOSABLE_DB=true`). The documentation fails to instruct the user to set these environment variables, or it should instruct them to run `npm run db:migrate` instead.

