# Seorchable (سئورچبل) - Operations Runbook

## CI Pipeline Setup

This repository uses GitHub Actions for continuous integration. The pipeline is defined in `.github/workflows/ci.yml` and is triggered on pushes and pull requests to the `main` and `master` branches.

The pipeline performs the following steps:
1. **Checkout & Setup:** Checks out the code and sets up Node.js 20 and pnpm.
2. **Install Dependencies:** Installs required packages via `pnpm install`.
3. **Lint:** Runs the linter (`pnpm run lint`). Note: Currently allowed to fail until baseline issues are resolved.
4. **Database Push:** Pushes the database schema using local, ephemeral PostgreSQL and Redis services defined in the workflow (no production secrets used).
5. **Build:** Builds the Next.js application (`pnpm run build`).
6. **Unit/Integration Tests:** Runs domain tests (e.g., `pnpm run test:acquisition`).
7. **Smoke & Accessibility Tests:** Runs Playwright and axe-core tests (`npx playwright test tests/smoke/app.spec.ts`) against the built server.
8. **Manual Deploy:** A deployment job that acts as a manual gate to production. It does not automatically deploy; it requires approval.

## Local Execution Steps

### Prerequisites
- Docker & Docker Compose (for local DB/Redis)
- Node.js 20+
- pnpm

### Running Local Infrastructure
A `docker-compose.yml` file is provided for local development. It sets up PostgreSQL and Redis.
```bash
docker-compose up -d
```

### Setup Environment
Copy `.env.example` to `.env` (or use `.github/SECRET_TEMPLATE.md` as a guide) and configure your secrets. For local testing without external APIs, you can mock values or rely on development defaults.

### Install Dependencies
```bash
pnpm install
```

### Database Operations
To push the schema to your local database:
```bash
pnpm run db:push
```

### Running the Application
**Development Mode:**
```bash
pnpm run dev
```

**Production Build:**
```bash
pnpm run build
pnpm run start
```

### Running Tests
**Domain Tests:**
```bash
pnpm run test:acquisition
```

**Smoke & Accessibility Tests (Playwright):**
Ensure the application is built (`pnpm run build`) and running (`pnpm run start` or let Playwright start it via `playwright.config.ts`), then run:
```bash
npx playwright install --with-deps chromium
npx playwright test tests/smoke/app.spec.ts
```