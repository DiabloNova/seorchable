# Environment Secrets Template

This template outlines the required environment variables to run the application in production or a full development environment.

**Do NOT commit real secrets to the repository.**

Copy this file to `.env` locally or configure these variables in your CI/CD provider's secret manager (e.g., GitHub Secrets).

```env
# Database Configuration
# The main connection string for the application
DATABASE_URL=postgres://user:password@host:5432/dbname
# Used specifically for schema migrations (can be the same as DATABASE_URL in some setups)
MIGRATION_DATABASE_URL=postgres://user:password@host:5432/dbname
# Database for staging environment (if applicable)
STAGING_MIGRATION_DATABASE_URL=postgres://user:password@host:5432/dbname_staging
# Defines the source of data for the application (e.g., 'db')
DATA_SOURCE=db

# Redis Configuration (Upstash or standard Redis)
# URL to connect to the Redis REST API
UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
# Authentication token for Redis
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Third-Party APIs
# API Key for Firecrawl (Web Crawling)
FIRECRAWL_API_KEY=your_firecrawl_api_key
# API Key for Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
# API Key for Resend (Transactional Emails)
RESEND_API_KEY=your_resend_api_key
```

### Notes on Local CI
In the CI pipeline, ephemeral databases (PostgreSQL and Redis) are spun up using Docker. The environment variables for these steps are hardcoded to match the local containers. Mock values are used for external APIs during tests.