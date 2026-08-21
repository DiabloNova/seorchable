#!/bin/bash
awk '
/export const tenantSubscriptions = pgTable/ {
  print "export const creditTransactions = pgTable(\"credit_transactions\", {"
  print "  id: uuid(\"id\").primaryKey().default(defaultUuid),"
  print "  tenantId: uuid(\"tenant_id\").notNull(),"
  print "  amount: integer(\"amount\").notNull(),"
  print "  transactionType: text(\"transaction_type\").notNull(), // allocation, consumption, refund"
  print "  description: text(\"description\"),"
  print "  referenceId: text(\"reference_id\"),"
  print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
  print "}, (table) => ["
  print "  index(\"idx_credit_transactions_tenant\").on(table.tenantId),"
  print "  ...tenantPolicy(\"tenant_id\")"
  print "]);"
  print ""
  print $0
  next
}
{ print $0 }
' database/schema/index.ts > database/schema/index.ts.tmp

mv database/schema/index.ts.tmp database/schema/index.ts
