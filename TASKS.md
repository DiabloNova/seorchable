# Prioritized Follow-up Tasks

Based on the initial hardening and baselining process, the following tasks are recommended for future iterations:

## High Priority
1. **Fix Linting Errors:** The CI pipeline currently allows linting (`pnpm run lint`) to fail. There are over 600 issues (mostly `Unexpected any` and `assigned a value but never used` warnings) that need to be resolved to enforce strict TypeScript checks.
2. **Resolve Accessibility (a11y) Violations:** The Playwright axe-core smoke tests identified several elements (e.g., in the pricing or features section) that are not contained within proper ARIA landmarks.
3. **Database Seeding for Tests:** Implement a robust seeding mechanism to populate the ephemeral PostgreSQL database with test data for more comprehensive integration testing in CI.

## Medium Priority
4. **Expand Test Coverage:** The current test suite focuses mainly on the `acquisition` domain and basic smoke tests. Coverage should be expanded to include other domains like `auth`, `audit`, and `analytics`.
5. **Optimize Docker Images:** The `docker-compose.yml` is useful for local development and CI services, but creating a dedicated `Dockerfile` for the Next.js application would streamline deployments.
6. **Performance Tuning (Lighthouse):** Review the generated `lighthouse-report.html` and address any performance bottlenecks, such as optimizing images, reducing unused CSS/JS, or improving server response times.

## Low Priority
7. **Migrate CircleCI to GitHub Actions:** The repository currently has a `.circleci/config.yml`. The new GitHub Actions pipeline (`.github/workflows/ci.yml`) should be evaluated as a potential replacement to consolidate CI/CD tooling.
8. **Automate Dependency Updates:** Set up Dependabot or Renovate to keep npm dependencies, including `@playwright/test` and `Next.js`, up to date.