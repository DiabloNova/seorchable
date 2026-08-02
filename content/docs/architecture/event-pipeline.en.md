---
title: "Event-Driven Asynchronous Pipeline"
description: "Technical reference documentation for Event-Driven Asynchronous Pipeline in Seorchable system."
category: "architecture"
lastUpdated: "2026-08-02"
author: "Seorchable Engineering Team"
keywords: "seorchable, event-pipeline, technical, architecture"
---

# Domain and Audit Event Pipelines

This document details the system design of the asynchronous Event pipeline and immutable Audit trail.

## Dual Event Dispatch

Every administrative action triggers two distinct pipeline streams:

1. **Domain Events**: Dispatched asynchronously to eventual-consistency consumers (e.g., triggering crawler processes or email schedules).
   - `TenantCreatedEvent`
   - `TenantSuspendedEvent`
   - `AdminUserCreatedEvent`
   - `FeatureFlagChangedEvent`
   - `AIProviderConfiguredEvent`
2. **Immutable Audit Events**: Logged directly into the `audit_records` table with detailed network metadata, actor credentials, and state snapshots.

## State Snapshots

Audit logs maintain deep traceability by serializing both:

- `payload_before`: The exact stringified JSON representation of the entity state prior to mutation.
- `payload_after`: The exact stringified JSON representation of the entity state after mutation.
