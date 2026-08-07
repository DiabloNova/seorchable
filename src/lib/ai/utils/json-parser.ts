import { AiJsonParseError } from "../errors";

export function cleanAndParseJson<T>(rawText: string): T {
  if (!rawText) {
    throw new AiJsonParseError("Empty text cannot be parsed as JSON", rawText);
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  const codeFenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const match = cleaned.match(codeFenceRegex);
  if (match) {
    cleaned = match[1].trim();
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (error: any) {
    // If a simple parse fails, try to extract first outer '{' ... '}' or '[' ... ']' block
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");

    let startIdx = -1;
    let endIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
      endIdx = cleaned.lastIndexOf("}");
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
      endIdx = cleaned.lastIndexOf("]");
    }

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const extracted = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch (innerError: any) {
        throw new AiJsonParseError(
          `Failed to parse extracted JSON block: ${innerError.message}`,
          rawText,
          innerError
        );
      }
    }

    throw new AiJsonParseError(
      `Failed to parse JSON: ${error.message}`,
      rawText,
      error
    );
  }
}
