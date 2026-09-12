## Test Coverage Baseline
Coverage for tests/features/acquisition/run-all.ts using c8:
✅ acquisition suites passed (8 suites collected)
---------------------------------------|---------|----------|---------|---------|-------------------
File                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------------------|---------|----------|---------|---------|-------------------
All files                              |    84.8 |       73 |      95 |    84.8 |
 features/acquisition/application      |   83.89 |    56.66 |     100 |   83.89 |
  provider-router.ts                   |   83.89 |    56.66 |     100 |   83.89 | ...10-111,114-115
 features/acquisition/domain           |   89.08 |    79.64 |   93.33 |   89.08 |
  errors.ts                            |   86.66 |       85 |      80 |   86.66 | 51-52,67-74
  identity.ts                          |     100 |       92 |     100 |     100 | 1,59
  job-state-machine.ts                 |     100 |    84.21 |   91.66 |     100 | 1,25,35
  policy.ts                            |   86.17 |    69.38 |     100 |   86.17 | ...35,340,366-367
 features/acquisition/domain/url       |    87.5 |    79.77 |   94.11 |    87.5 |
  normalizer.ts                        |   86.25 |    79.22 |     100 |   86.25 | ...27-128,137-138
  tracking-params.ts                   |     100 |    83.33 |    87.5 |     100 | 1-13
 ...es/acquisition/infrastructure/http |   77.33 |    68.11 |    92.3 |   77.33 |
  safe-fetcher.ts                      |   77.33 |    68.11 |    92.3 |   77.33 | ...48,254-262,271
 ...quisition/infrastructure/providers |   75.18 |       58 |    87.5 |   75.18 |
  http-crawl-provider.ts               |   75.18 |       58 |    87.5 |   75.18 | ...45-246,249-250
 ...infrastructure/providers/firecrawl |   88.02 |    64.28 |     100 |   88.02 |
  firecrawl-crawl-provider.ts          |   88.02 |    64.28 |     100 |   88.02 | ...22,135-136,155
 ...cquisition/infrastructure/security |   89.91 |    79.16 |     100 |   89.91 |
  ssrf-guard.ts                        |   89.91 |    79.16 |     100 |   89.91 | ...96-205,209-210
 services/jobs                         |     100 |    83.33 |     100 |     100 |
  retry.ts                             |     100 |    83.33 |     100 |     100 | 1,24
---------------------------------------|---------|----------|---------|---------|-------------------
