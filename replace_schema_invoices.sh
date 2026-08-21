#!/bin/bash
awk '
/export const tenantSubscriptions = pgTable/ {
  print "export const invoices = pgTable(\"invoices\", {"
  print "  id: uuid(\"id\").primaryKey().default(defaultUuid),"
  print "  tenantId: uuid(\"tenant_id\").notNull(),"
  print "  amount: integer(\"amount\").notNull(),"
  print "  currency: text(\"currency\").notNull().default(\"USD\"),"
  print "  status: text(\"status\").notNull(), // paid, open, void, uncollectible"
  print "  pdfUrl: text(\"pdf_url\"),"
  print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
  print "  paidAt: timestamp(\"paid_at\", { withTimezone: true }),"
  print "}, (table) => ["
  print "  index(\"idx_invoices_tenant\").on(table.tenantId),"
  print "  ...tenantPolicy(\"tenant_id\")"
  print "]);"
  print ""
  print "export const payments = pgTable(\"payments\", {"
  print "  id: uuid(\"id\").primaryKey().default(defaultUuid),"
  print "  tenantId: uuid(\"tenant_id\").notNull(),"
  print "  invoiceId: uuid(\"invoice_id\").references(() => invoices.id),"
  print "  amount: integer(\"amount\").notNull(),"
  print "  currency: text(\"currency\").notNull().default(\"USD\"),"
  print "  status: text(\"status\").notNull(), // succeeded, failed, pending"
  print "  providerId: text(\"provider_id\"), // External stripe/zarinpal reference"
  print "  createdAt: timestamp(\"created_at\", { withTimezone: true }).notNull().default(defaultNow),"
  print "}, (table) => ["
  print "  index(\"idx_payments_tenant\").on(table.tenantId),"
  print "  ...tenantPolicy(\"tenant_id\")"
  print "]);"
  print ""
  print $0
  next
}
{ print $0 }
' database/schema/index.ts > database/schema/index.ts.tmp

mv database/schema/index.ts.tmp database/schema/index.ts
