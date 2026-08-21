#!/bin/bash
# Move 2. ADMIN & SYSTEM GOVERNANCE to below 1.1 USERS & MEMBERSHIPS

awk '
BEGIN { section2 = 0; buffer = "" }
/^\/\/ ==========================================/ {
  if (section2 == 0 && $0 ~ /\/\/ 2. ADMIN & SYSTEM GOVERNANCE/ == 0) {
     print $0; next;
  }
}

/^\/\/ 2. ADMIN & SYSTEM GOVERNANCE/ {
  section2 = 1
  buffer = buffer "// ==========================================\n" $0 "\n"
  next
}

/^\/\/ 1.1 USERS & MEMBERSHIPS/ {
  print "// =========================================="
  print $0
  section2 = 0
  next
}

{
  if (section2 == 1) {
    buffer = buffer $0 "\n"
  } else {
    print $0
  }
}
' database/schema/index.ts > database/schema/index.ts.tmp2

# The awk script above was too complex and buggy, let's just use perl.
perl -0777 -pe 's/(\/\/ ==========================================\n\/\/ 2. ADMIN & SYSTEM GOVERNANCE\n\/\/ ==========================================)//; s/(\/\/ ==========================================\n\/\/ 1.1 USERS & MEMBERSHIPS \(WORKSPACE MODEL\)\n\/\/ ==========================================)/$1/; s/(\/\/ ==========================================\n\/\/ 1.1 USERS & MEMBERSHIPS \(WORKSPACE MODEL\)\n\/\/ ==========================================)/$1/; s/(\/\/ ==========================================\n\/\/ 1.1 USERS & MEMBERSHIPS \(WORKSPACE MODEL\)\n\/\/ ==========================================\n.*?\n\]\);\n)/$1\n\/\/ ==========================================\n\/\/ 2. ADMIN & SYSTEM GOVERNANCE\n\/\/ ==========================================\n/s' database/schema/index.ts > database/schema/index.ts.tmp
mv database/schema/index.ts.tmp database/schema/index.ts
