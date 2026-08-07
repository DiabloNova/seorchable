/**
 * URL Normalizer & Validator for the Audit Engine.
 * Normalizes input URL strings, trims spaces, converts schemas/hostnames to lowercase,
 * and ensures it's a valid absolute HTTP or HTTPS URL.
 */
export function normalizeAndValidateUrl(inputUrl: string): string | null {
  if (!inputUrl) return null;

  let trimmed = inputUrl.trim();

  // Prepend https:// only if there is no protocol at all
  if (!/^[a-zA-Z]+:\/\//i.test(trimmed)) {
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

    // Ensure it contains a dot (unless it's localhost) to represent a valid domain
    if (parsed.hostname !== "localhost" && !parsed.hostname.includes(".")) {
      return null;
    }

    // Return the normalized string representation
    return parsed.toString();
  } catch (_) {
    return null;
  }
}
