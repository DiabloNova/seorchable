---
title: "Role-Based Access Control (RBAC) Model"
description: "Technical reference documentation for Role-Based Access Control (RBAC) Model in Seorchable system."
category: "security"
lastUpdated: "2026-08-02"
author: "Seorchable Engineering Team"
keywords: "seorchable, rbac-model, technical, architecture"
---

# Hierarchical RBAC Security Model

This document specifies the administrative privilege levels and authorization structures enforced across the Admin console.

## Roles and Ranks

We enforce a strict linear role hierarchy rank mapped numerically to compare permission levels:

| Role Name | Rank | Primary Accountability |
|---|---|---|
| **Super Admin** | 100 | Complete system override, administrative provisioning, billing bypass |
| **Platform Admin** | 80 | Full tenant lifecycle management, feature flag and config edits |
| **Security Auditor** | 70 | Inspect immutable audit trails, analyze security violation alerts |
| **Operations** | 60 | Configure AI adapter failovers, monitor crawlers, manage prompt versions |
| **Finance** | 50 | Update billing plans, track tenant quota spending limits |
| **Support** | 40 | Troubleshoot active tenants, update customer prompt templates |
| **Read-Only Observer** | 10 | Non-mutating platform overview, uptime and metrics observation |

## Permissions Matrix

- `tenant:create`, `tenant:write`, `tenant:read`, `tenant:suspend`, `tenant:activate`, `tenant:archive`
- `admin:write`, `admin:read`
- `config:write`, `config:read`
- `ai:manage`, `ai:read`
- `audit:read`
- `billing:write`, `billing:read`
- `prompt:manage`
- `crawler:manage`
- `system:monitor`

## SSO Preparedness

The schema and domain entities are pre-configured to link federated external identities (`saml`, `oidc`, `google`, `azure`) directly onto administrative user accounts to support future Enterprise Single Sign-On (SSO) integrations without modifying internal security evaluation blocks.
