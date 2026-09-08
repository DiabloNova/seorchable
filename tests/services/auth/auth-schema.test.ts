import assert from "node:assert/strict";
import { users, organizations, organizationMembers } from "../../../database/schema/organization";
import { getTableConfig } from "drizzle-orm/pg-core";

console.log("Running Authentication Persistence Schema Foundation Tests...");

// 1. Validate UUID Identifiers and Columns
function testUuidIdentifiers() {
  console.log("  [1/4] Testing UUID Primary Key & Foreign Key Definitions...");
  assert.equal(users.id.dataType, "string", "users.id must be UUID string");
  assert.equal(organizations.id.dataType, "string", "organizations.id must be UUID string");
  assert.equal(organizationMembers.id.dataType, "string", "organizationMembers.id must be UUID string");
  assert.equal(organizationMembers.organizationId.dataType, "string", "organizationMembers.organizationId must be UUID string");
  assert.equal(organizationMembers.userId.dataType, "string", "organizationMembers.userId must be UUID string");
  console.log("  ✅ UUID Identifiers validated.");
}

// 2. Validate Persistent Authentication State Columns
function testAuthStateFields() {
  console.log("  [2/4] Testing Persistent Authentication & Email Verification Fields...");
  assert.notEqual(users.emailVerified, undefined, "users.emailVerified column must exist");
  assert.equal(users.emailVerified.dataType, "boolean", "users.emailVerified must be boolean");
  assert.equal(users.emailVerified.default, false, "users.emailVerified must default to false");

  assert.notEqual(users.emailVerifiedAt, undefined, "users.emailVerifiedAt column must exist");
  assert.equal(users.emailVerifiedAt.dataType, "date", "users.emailVerifiedAt must be date/timestamp type");

  assert.notEqual(users.passwordHash, undefined, "users.passwordHash column must exist");
  assert.equal(users.passwordHash.dataType, "string", "users.passwordHash must be string/text type");

  assert.notEqual(users.passwordResetRequired, undefined, "users.passwordResetRequired column must exist");
  assert.equal(users.passwordResetRequired.dataType, "boolean", "users.passwordResetRequired must be boolean");
  assert.equal(users.passwordResetRequired.default, true, "users.passwordResetRequired default must be true");

  console.log("  ✅ Persistent Auth & Email Verification fields validated.");
}

// 3. Validate Membership Relationships and Role Constraints
function testMembershipAndRoleConstraints() {
  console.log("  [3/4] Testing Membership Constraints and Role Validations...");
  const memberConfig = getTableConfig(organizationMembers);

  // Check unique index on (organizationId, userId)
  const uniqueIndexes = memberConfig.indexes.filter((idx) => idx.config.name === "idx_org_members_user_org");
  assert.equal(uniqueIndexes.length, 1, "Must have unique index on organization_id and user_id to prevent double memberships");

  // Check role check constraint
  const roleCheck = memberConfig.checks.find((c) => c.name === "org_members_role_check");
  assert.notEqual(roleCheck, undefined, "Must enforce role check constraint org_members_role_check");

  console.log("  ✅ Membership relationships and role constraints validated.");
}

// 4. Validate Privileged Roles Policy (no default super_admin)
function testNoImplicitPrivilegedRoles() {
  console.log("  [4/4] Testing Role Assignment Defaults...");
  assert.equal(organizationMembers.role.default, undefined, "organizationMembers.role must NOT have an implicit default super_admin or admin role");
  console.log("  ✅ Privileged roles are not implicitly assigned.");
}

function runAll() {
  testUuidIdentifiers();
  testAuthStateFields();
  testMembershipAndRoleConstraints();
  testNoImplicitPrivilegedRoles();
  console.log("ALL AUTH PERSISTENCE SCHEMA TESTS PASSED SUCCESSFULLY! 🎉");
}

runAll();
