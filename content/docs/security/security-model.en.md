---
title: "AI Security & Core Isolation"
description: "Technical reference documentation for AI Security & Core Isolation in Seorchable system."
category: "security"
lastUpdated: "2026-08-02"
author: "Seorchable Engineering Team"
keywords: "seorchable, security-model, technical, architecture"
---

# Security Architecture Model

This document outlines the security, tenant authorization, Role-Based Access Control (RBAC), and compliance guidelines implemented for the AI Intelligence Engine.

---

## 1. Zero-Trust Tenant Isolation

The platform enforces zero-trust tenant isolation through multiple decoupled security shields:

1. **Repository Guard Rails**: Finders require explicit `organizationId` parameter filtering.
2. **Domain Layer Assertions**: Tenant contexts are verified inside domain constructors.
3. **TenantSecurityGuard**: Authorizes matching organization contexts and blocks any cross-tenant data leakages.

---

## 2. Role-Based Access Control (RBAC)

We define three native enterprise user roles:

1. **SuperAdmin**: Full, unrestricted platform access. Bypasses tenant guards for system-wide auditing and optimization.
2. **WorkspaceAdmin**: Administrative access inside a designated organization tenant context. Can write, configure prompts, claims entities, and ingest search metrics.
3. **Viewer**: Read-only access inside a designated organization tenant context. Feeds dashboards and reports.

---

## 3. Sensitive Data & PII Protection

To remain compliant with GDPR, CCPA, and data privacy policies, we implement a **`SensitiveDataProtector`** utility:
- Automatically redacts high-risk secrets (Bearer tokens, AWS credentials, custom API keys) scraped or captured within LLM response logs.
- Masks sensitive consumer data prior to logging observations.
