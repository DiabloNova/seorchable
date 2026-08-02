---
title: "REST API Reference Guide"
description: "Complete REST API reference and standard HTTP responses schema specification."
category: "api"
lastUpdated: "2026-08-02"
author: "API Platform Architects"
keywords: "rest api, integration, headers, JSON, auth tokens"
---

# Seorchable REST API Reference

Integrate your enterprise workflows directly with Seorchable's NLP & AEO optimization engine.

## Authentication

All API requests must include your secure workspace bearer token inside the HTTP Headers:

```http
Authorization: Bearer <your_api_token_here>
```

## Endpoints Summary

### 1. Start Web Crawling
- **POST** `/api/v1/crawler/start`
- Starts crawling a given URL to feed Seorchable's knowledge extraction parser.

### 2. Query Knowledge Graph
- **POST** `/api/v1/knowledge-graph/query`
- Retrieves active entity clusters and relational link weights.

### 3. Generate Free Brand Audit
- **POST** `/api/v1/audit/free`
- Instantly analyzes basic visibility metrics on Gemini/GPT mock adapters.
