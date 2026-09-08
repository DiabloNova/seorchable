/**
 * Pattern Matcher for Supervisor Scope Gates.
 *
 * Supports exactly four pattern forms:
 * 1. Exact file path (e.g. "package.json", "src/index.ts")
 * 2. Single segment wildcard (e.g. "dev_server*.log", "*.patch", "src/* /index.ts")
 * 3. Recursive wildcard across directory levels (e.g. "src/**", "** /*.ts")
 * 4. Directory-prefix matching (e.g. "src/", "scripts/supervisor/")
 */

export function matchPathPattern(filepath: string, pattern: string): boolean {
  const normFile = normalizePath(filepath);
  const normPattern = normalizePath(pattern);

  if (!normFile || !normPattern) {
    return false;
  }

  // 1. Directory-prefix matching (explicit trailing slash or directory prefix)
  if (pattern.endsWith('/') || pattern.endsWith('\\')) {
    const dirPrefix = normPattern.endsWith('/') ? normPattern.slice(0, -1) : normPattern;
    return normFile === dirPrefix || normFile.startsWith(dirPrefix + '/');
  }

  // 2. Exact file path match
  if (normFile === normPattern) {
    return true;
  }

  // 3. Directory matching (if pattern is a directory name without trailing slash, e.g. "scripts/supervisor")
  if (normFile.startsWith(normPattern + '/')) {
    return true;
  }

  // 4. Glob matching with "*" and "**"
  const regex = globToRegex(normPattern);
  return regex.test(normFile);
}

function normalizePath(p: string): string {
  let res = p.replace(/\\/g, '/').trim();
  if (res.startsWith('./')) {
    res = res.slice(2);
  }
  return res;
}

const SPECIAL_REGEX_CHARS = new Set(['.', '/', '+', '?', '^', '$', '(', ')', '{', '}', '[', ']', '|', '\\']);

function globToRegex(pattern: string): RegExp {
  const hasSlash = pattern.includes('/');
  let regexStr = '';
  let i = 0;

  while (i < pattern.length) {
    const char = pattern[i];

    if (char === '*') {
      if (pattern[i + 1] === '*') {
        // "**" recursive wildcard
        i += 2;
        if (pattern[i] === '/') {
          i++;
          regexStr += '(?:^|.*/)';
        } else {
          regexStr += '.*';
        }
      } else {
        // "*" single segment wildcard
        i++;
        regexStr += '[^/]*';
      }
    } else if (SPECIAL_REGEX_CHARS.has(char)) {
      regexStr += '\\' + char;
      i++;
    } else {
      regexStr += char;
      i++;
    }
  }

  if (!hasSlash) {
    return new RegExp(`^(?:.*/)?${regexStr}$`);
  }

  return new RegExp(`^${regexStr}$`);
}
