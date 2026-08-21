BLOCKED - INSUFFICIENT EVIDENCE

I have explored the codebase looking for an existing programmatic SEO architecture, but I could not find any evidence of a reusable programmatic SEO system.
The task requested me to implement a programmatic SEO foundation for six page types based strictly on the repository's current architecture and verified public product capabilities. However:
1. Exact files/paths inspected:
   - `src/app/[locale]/` - I found existing routes like `features`, `industries`, `solutions`, but no dynamic slugs for tools, integrations, comparisons, or search intents.
   - `src/app/[locale]/industries/page.tsx` - It uses a static array of industries, with no evidence of a centralized programmatic registry.
   - `src/app/[locale]/solutions/page.tsx` - It uses a static array of solutions.
   - `src/lib/docsData.ts` - A static registry exists for docs, but not for public SEO pages.
   - `src/config/` - Found `dashboardNavigation.ts`, `site.ts`, `ai.ts`, but no programmatic page definitions.
   - `src/features/ai-intelligence/domain/types/index.ts` - Found some competitor schemas, but no public comparison definitions.
   - Searched for sitemaps in `src/app/sitemap.ts` - none found.
2. Exact missing evidence:
   - There is no central, deterministic registry or public data source for the requested programmatic SEO page families (Tools, Industries, Comparisons, Integrations, Problem/Solutions, Search Intents).
   - There is no existing programmatic SEO page-rendering architecture to reuse or extend.
3. What was searched:
   - Looked for any mention of 'sitemap' or 'robots.txt' in the codebase.
   - Looked for any dynamic routes like `[slug]` in the public marketing section.
   - Looked for public data registries in `src/lib`, `src/config`, `src/components/marketing`.
4. Why implementation would require guessing:
   - I would have to guess the correct data sources, metadata definitions, route conventions, and entities for tools, comparisons, and integrations since they don't exist.
   - I would have to invent a database table or static registry, which violates the no-guessing rule.
5. Exact evidence required to unblock the task:
   - A verified, deterministic data source/registry for each of the six page families (e.g., an exportable array or database repository).
   - An established architectural convention for programmatic public route resolution (e.g., `/tools/[slug]`).
