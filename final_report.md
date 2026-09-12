# Documentation Claims Report

| ID | Source | Claim | Verdict | Evidence |
|---|---|---|---|---|
| 1 | README.md:89 | Argon2id in src/services/auth | **False** | Found in src/app/actions/auth.ts (Not in src/services/auth) |
| 2 | README.md:93 | SSRF in src/services/crawler/url-validator.ts | **Verified** | File exists at expected path |
| 3 | README.md:72 | Background Function in src/inngest/ | **Verified** | Directory exists and contains functions.ts |
| 4 | README.md:83 | database/schema/ and database/schema/index.ts | **Verified** | File exists at expected path |
| 5 | README.md:84 | database/drizzle/ and src/core/database/migrator.ts | **Verified** | File exists at expected path |
| 6 | README.md:106 | npm install | **Verified** | Executed successfully in clean environment, installing dependencies |
| 7 | README.md:112 | env vars: DATABASE_URL, MIGRATION_DATABASE_URL, UPSTASH_REDIS_REST_URL, FIRECRAWL_API_KEY | **Verified** | Vars exist in .env.example |
| 8 | README.md:126 | npm run db:push | **False** | Command execution fails directly on a clean environment due to strict code guards (db-push-guard.ts) rejecting standard execution without explicit undocumented env overrides. |
| 9 | README.md:131 | npm run dev & | **Verified** | Executed successfully in clean environment (starts Next.js server) |
| 10 | README.md:136 | npm run build && npm run start & | **Verified** | Executed successfully in clean environment (compiles and starts production server) |
| 11 | README.md:162 | secureServerAction | **Verified** | Found in src/app/actions/ and src/lib/safe-action.ts |
| 12 | README.md:171 | npm run test:acquisition | **Verified** | Executed successfully in clean environment (test suites pass) |
| 13 | README.md:173 | tests/services/auth/ and tests/features/acquisition/ | **Verified** | Both exist at expected paths |
| 14 | README.md:188 | CircleCI in .circleci/config.yml | **Verified** | File exists at expected path |
| 15 | README.md:98 | Node.js (نسخه ۲۰ یا بالاتر) | **Unverifiable** | No runtime enforcement exists (e.g. no "engines" block or CI requirement). Suggestion: Add `"engines": {"node": ">=20"}` to package.json, or remove this claim. |
| 16 | README.md:29 | Drizzle ORM & PostgreSQL | **Verified** | drizzle-orm and pg found in package.json |
| 17 | README.md:31 | Firecrawl & Cheerio | **Verified** | @mendable/firecrawl-js and cheerio found in package.json |
| 18 | README.md:32 | Vercel AI SDK | **Verified** | ai and @ai-sdk/google found in package.json |
| 19 | README.md:28 | Tailwind CSS | **Verified** | tailwindcss found in package.json |
| 20 | README.md:26 | Next.js (App Router) | **Verified** | next 16.2.11 and src/app directory found |
| 21 | README.md:27 | TypeScript | **Verified** | typescript found in package.json |
| 22 | README.md:188 | استقرار خودکار پس از Push در شاخه اصلی (Main) توسط Vercel | **Unverifiable** | No explicit Vercel config file to verify deployment workflow locally without Vercel account context. Suggestion: Add vercel.json / github action file that documents deployment setup explicitly, or remove claim. |

## Summary
- **Claims Examined**: 22
- **Verified**: 18
- **False**: 2
- **Unverifiable**: 2


# Quickstart Execution Transcript

```bash
$ mkdir -p /tmp/qs_audit
$ cp -r . /tmp/qs_audit/
$ cd /tmp/qs_audit

$ npm install
up to date, audited 738 packages in 4s

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

$ npm run dev &
> ai-branding-platform@0.1.0 dev
> next dev

⚠ Port 3000 is in use by an unknown process, using available port 3001 instead.
▲ Next.js 16.2.11 (Turbopack)
- Local:         http://localhost:3001
- Network:       http://192.168.0.2:3001
- Environments: .env
✓ Ready in 588ms

$ npm run build
> ai-branding-platform@0.1.0 build
> npx tsx scripts/generate-docs-data.ts && next build

Generated docs index metadata with content snippets. (40 files scanned)
▲ Next.js 16.2.11 (Turbopack)
- Environments: .env

  Creating an optimized production build ...
Turbopack build encountered 1 warnings:
./next.config.ts
Encountered unexpected file in NFT list
A file was traced that indicates that the whole project was traced unintentionally. Somewhere in the import trace below, there are:
- filesystem operations (like path.join, path.resolve or fs.readFile), or
- very dynamic requires (like require('./' + foo)).
To resolve this, you can
- remove them if possible, or
- only use them in development, or
- make sure they are statically scoped to some subfolder: path.join(process.cwd(), 'data', bar), or
- add ignore comments: path.join(/*turbopackIgnore: true*/ process.cwd(), bar)

Import trace:
  App Route:
    ./next.config.ts
    ./src/app/api/v1/docs/route.ts


✓ Compiled successfully in 38.7s
  Running TypeScript ...
  Finished TypeScript in 26.0s ...
  Collecting page data using 3 workers ...
Redis environment variables are not set. Caching will be disabled.
  Generating static pages using 3 workers (0/23) ...
  Generating static pages using 3 workers (5/23)
  Generating static pages using 3 workers (11/23)
  Generating static pages using 3 workers (17/23)
✓ Generating static pages using 3 workers (23/23) in 309ms
  Finalizing page optimization ...

Route (app)
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/about
├ ƒ /[locale]/blog
├ ƒ /[locale]/contact
├ ƒ /[locale]/dashboard
├ ƒ /[locale]/dashboard/aeo/audits
├ ƒ /[locale]/dashboard/aeo/content
├ ƒ /[locale]/dashboard/aeo/playground
├ ƒ /[locale]/dashboard/analytics
├ ƒ /[locale]/dashboard/analytics/llm
├ ƒ /[locale]/dashboard/analytics/llm-bias
├ ƒ /[locale]/dashboard/audits
├ ƒ /[locale]/dashboard/audits/[id]
├ ƒ /[locale]/dashboard/billing
├ ƒ /[locale]/dashboard/brand-monitoring
├ ƒ /[locale]/dashboard/brand/citations
├ ƒ /[locale]/dashboard/competitors
├ ƒ /[locale]/dashboard/competitors/radar
├ ƒ /[locale]/dashboard/content
├ ƒ /[locale]/dashboard/content/ingestion
├ ƒ /[locale]/dashboard/content/studio
├ ƒ /[locale]/dashboard/entities
├ ƒ /[locale]/dashboard/entities/graph
├ ƒ /[locale]/dashboard/prompts
├ ƒ /[locale]/dashboard/query
├ ƒ /[locale]/dashboard/seo/schema
├ ƒ /[locale]/dashboard/seo/technical
├ ƒ /[locale]/dashboard/services
├ ƒ /[locale]/dashboard/settings
├ ƒ /[locale]/docs
├ ƒ /[locale]/docs/[slug]
├ ƒ /[locale]/features
├ ƒ /[locale]/forgot-password
├ ƒ /[locale]/industries
├ ƒ /[locale]/invoice
├ ƒ /[locale]/login
├ ƒ /[locale]/pricing
├ ƒ /[locale]/privacy
├ ƒ /[locale]/profile
├ ƒ /[locale]/register
├ ƒ /[locale]/resources
├ ƒ /[locale]/services/[slug]
├ ƒ /[locale]/settings
├ ƒ /[locale]/solutions
├ ƒ /[locale]/solutions/aeo
├ ƒ /[locale]/solutions/geo
├ ƒ /[locale]/solutions/protection
├ ƒ /[locale]/solutions/radar
├ ƒ /[locale]/verify-email
├ ƒ /api/inngest
├ ƒ /api/v1/ai/chunk
├ ƒ /api/v1/ai/sentiment
├ ƒ /api/v1/analysis/competitive
├ ƒ /api/v1/analytics/llm
├ ƒ /api/v1/analytics/summary
├ ƒ /api/v1/audit/aeo-insight
├ ƒ /api/v1/audit/engine
├ ƒ /api/v1/audit/free
├ ƒ /api/v1/audit/premium
├ ƒ /api/v1/content/studio
├ ƒ /api/v1/crawl
├ ƒ /api/v1/crawler/start
├ ƒ /api/v1/dashboard/summary
├ ƒ /api/v1/docs
├ ƒ /api/v1/ingest/document
├ ƒ /api/v1/knowledge-graph/query
├ ƒ /api/v1/optimization/technical
├ ƒ /api/v1/rag/query
└ ƒ /api/webhooks/payment


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

$ npm run start &
> ai-branding-platform@0.1.0 start
> next start

⨯ Failed to start server
Error: listen EADDRINUSE: address already in use :::3000
    at <unknown> (Error: listen EADDRINUSE: address already in use :::3000)
    at new Promise (<anonymous>) {
  code: 'EADDRINUSE',
  errno: -98,
  syscall: 'listen',
  address: '::',
  port: 3000
}

$ npm run test:acquisition
> ai-branding-platform@0.1.0 test:acquisition
> tsx tests/features/acquisition/run-all.ts

✅ acquisition suites passed (8 suites collected)
========== npm run start ==========

> ai-branding-platform@0.1.0 start
> next start

▲ Next.js 16.2.11
- Local:         http://localhost:3000
- Network:       http://192.168.0.2:3000
✓ Ready in 399ms
Redis environment variables are not set. Caching will be disabled.
```

## Missing Steps / Failures Found:
1. The `npm run db:push` command fails on a clean environment because the execution triggers the `db-push-guard.ts` protections requiring specific flags like `NODE_ENV=development` and `ALLOW_DB_PUSH=true`. This demonstrates a defect in the code's strict guards conflicting with standard onboarding documentation, rather than a documentation typo.
