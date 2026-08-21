#!/bin/bash

# Insert users, organization_members, and organization_invitations between organizations and roles.
awk '
/^\/\/ ==========================================/ {
  if (found == 1 && printed == 0) {
    print "// =========================================="
    print "// 1.1 USERS & MEMBERSHIPS (WORKSPACE MODEL)"
    print "// =========================================="
    print "export const users = pgTable(\"users\", {"
    print "  id: text(\"id\").primaryKey(), // using text to match the existing usr-xxx pattern if needed"
    print "  name: text(\"name\").notNull(),"
    print "  email: text(\"email\").notNull().unique(),"
    print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "  updatedAt: timestamp(\"updated_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "  deletedAt: timestamp(\"deleted_at\", { withTimezone: true }),"
    print "});"
    print ""
    print "export const organizationMembers = pgTable(\"organization_members\", {"
    print "  id: uuid(\"id\").primaryKey().default(defaultUuid),"
    print "  organizationId: uuid(\"organization_id\").notNull().references(() => organizations.id, { onDelete: \"cascade\" }),"
    print "  userId: text(\"user_id\").notNull().references(() => users.id, { onDelete: \"cascade\" }),"
    print "  role: text(\"role\").notNull(), // super_admin, workspace_admin, viewer"
    print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "  updatedAt: timestamp(\"updated_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "}, (table) => ["
    print "  uniqueIndex(\"idx_org_members_user_org\").on(table.organizationId, table.userId),"
    print "  index(\"idx_org_members_user_id\").on(table.userId),"
    print "  ...tenantPolicy(\"organization_id\")"
    print "]);"
    print ""
    print "export const organizationInvitations = pgTable(\"organization_invitations\", {"
    print "  id: uuid(\"id\").primaryKey().default(defaultUuid),"
    print "  organizationId: uuid(\"organization_id\").notNull().references(() => organizations.id, { onDelete: \"cascade\" }),"
    print "  email: text(\"email\").notNull(),"
    print "  role: text(\"role\").notNull(),"
    print "  tokenHash: text(\"token_hash\").notNull(),"
    print "  expiresAt: timestamp(\"expires_at\", { withTimezone: true }).notNull(),"
    print "  status: text(\"status\").notNull().default(\"pending\"), // pending, accepted, expired, revoked"
    print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "  updatedAt: timestamp(\"updated_at\", { withTimezone: true }).notNull().default(defaultNow),"
    print "}, (table) => ["
    print "  index(\"idx_org_invitations_email\").on(table.email),"
    print "  index(\"idx_org_invitations_token\").on(table.tokenHash),"
    print "  ...tenantPolicy(\"organization_id\")"
    print "]);"
    print ""
    printed = 1
  }
}
/^\/\/ 2. ADMIN & SYSTEM GOVERNANCE/ { found = 1 }
{ print }
' database/schema/index.ts > database/schema/index.ts.tmp
mv database/schema/index.ts.tmp database/schema/index.ts
