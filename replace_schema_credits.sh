#!/bin/bash
awk '
/export const tenantQuotas = pgTable/ {
  print $0
  inQuotas = 1
  next
}
inQuotas == 1 && /usedCrawlJobsToday:/ {
  print $0
  print "  creditsBalance: integer(\"credits_balance\").notNull().default(0),"
  next
}
inQuotas == 1 && /\], \(table/ {
  inQuotas = 0
}
{ print $0 }
' database/schema/index.ts > database/schema/index.ts.tmp

mv database/schema/index.ts.tmp database/schema/index.ts
