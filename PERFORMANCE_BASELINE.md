## Lighthouse Baseline

A Lighthouse audit was run against the local production build (http://localhost:3000) using Chrome Headless.
The detailed HTML report is saved as `lighthouse-report.html`.

Overall, the baseline performance, accessibility, best practices, and SEO scores are captured in the report.

### Key Accessibility Violations (from axe-core)

* Some page content is not contained by landmarks. (e.g., Elements like `.border-2 > .space-y-6 > ul > .gap-2:nth-child(1) > span`).

The complete list of violations is logged during the Playwright smoke test.

### Summary

The initial baseline reveals a solid foundation but identifies several areas for improvement, primarily concerning ARIA landmarks in the main landing and pricing sections. These have been documented as high-priority tasks in `TASKS.md`.