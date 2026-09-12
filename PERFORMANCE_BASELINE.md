## Lighthouse Baseline

This document captures the initial baseline metrics for the application.

**Date:** 2026-09-12T07:19:44.031Z
**Environment:** Local CI (Production Build)
**Target URL:** http://localhost:3000

### Category Scores (Lighthouse)

| Category | Score |
| :--- | :--- |
| **Performance** | 78 |
| **Accessibility** | 94 |
| **Best Practices** | 96 |
| **SEO** | 91 |

### Note on Accessibility

The initial baseline reveals a solid foundation but identifies several areas for improvement, primarily concerning ARIA landmarks in the main landing and pricing sections. These have been documented as high-priority tasks in `TASKS.md`. The complete list of violations is logged during the Playwright smoke test.
