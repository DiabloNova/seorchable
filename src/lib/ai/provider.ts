import { ProviderRegistry } from "./registry";
import { GeminiProvider } from "./providers/gemini";
import { IAiProvider } from "./types";

export const aiRegistry = new ProviderRegistry();

// Automatically register the default GeminiProvider
const geminiProvider = new GeminiProvider();
aiRegistry.register(geminiProvider, { priority: 100 });

/**
 * Global helper to resolve the default or specific named provider.
 */
export function getAiProvider(name?: string): IAiProvider {
  return aiRegistry.getProvider(name);
}
