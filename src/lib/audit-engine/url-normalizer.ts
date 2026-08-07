/**
 * URL Normalizer & Validator for the Audit Engine.
 * Normalizes input URL strings, trims spaces, converts schemas/hostnames to lowercase,
 * and ensures it's a valid absolute HTTP or HTTPS URL.
 */
export function normalizeAndValidateUrl(inputUrl: string): string | null {
  if (!inputUrl) return null;

  let trimmed = inputUrl.trim();

  // Default to https if no protocol is defined
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = "https://" + trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    // Ensure protocol is http or https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    // Ensure hostname is present and not empty
    if (!parsed.hostname || parsed.hostname.trim() === "") {
      return null;
    }

    // Return the normalized string representation
    return parsed.toString();
  } catch (_) {
    return null;
  }
}
