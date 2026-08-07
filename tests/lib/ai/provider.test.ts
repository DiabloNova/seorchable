import { cleanAndParseJson } from "../../../src/lib/ai/utils/json-parser";
import { AiJsonParseError } from "../../../src/lib/ai/errors";
import { ProviderRegistry } from "../../../src/lib/ai/registry";
import { GeminiProvider } from "../../../src/lib/ai/providers/gemini";
import { IAiProvider, AiProviderHealth, AiCompletionResponse } from "../../../src/lib/ai/types";

// Mock IAiProvider implementation for Registry tests
class MockAiProvider implements IAiProvider {
  readonly name: string;
  private available: boolean;

  constructor(name: string, available: boolean = true) {
    this.name = name;
    this.available = available;
  }

  isAvailable(): boolean {
    return this.available;
  }

  async healthCheck(): Promise<AiProviderHealth> {
    return this.available
      ? { status: "ok" }
      : { status: "unhealthy", details: `${this.name} is offline` };
  }

  async generateText(prompt: string): Promise<AiCompletionResponse> {
    return {
      text: `Mock text response from ${this.name} for: ${prompt}`,
      raw: {},
      provider: { name: this.name },
      model: { id: "mock-model" }
    };
  }

  async generateJson<T>(prompt: string): Promise<T> {
    return { source: this.name, parsed: true } as unknown as T;
  }
}

// Global Fetch Interceptor for Gemini tests
const originalFetch = globalThis.fetch;

function setupFetchMock(responseBody: string) {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlStr = input.toString();

    if (urlStr.includes("googleapis.com")) {
      const payload = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: responseBody
                }
              ],
              role: "model"
            },
            finishReason: "STOP",
            index: 0
          }
        ],
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 20,
          totalTokenCount: 30
        }
      };

      const jsonText = JSON.stringify(payload);

      return {
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "application/json" }),
        text: async () => jsonText,
        json: async () => payload,
        body: {
          getReader() {
            let done = false;
            return {
              async read() {
                if (done) return { done: true, value: undefined };
                done = true;
                return { done: false, value: new TextEncoder().encode(jsonText) };
              },
              releaseLock() {},
              async cancel() {}
            };
          }
        },
        clone() {
          return this;
        }
      } as unknown as Response;
    }

    return originalFetch(input, init);
  };
}

function restoreFetchMock() {
  globalThis.fetch = originalFetch;
}

export async function runAiTestSuite() {
  console.log("▶ Running Enterprise AI Provider Abstraction & Registry Layer Tests...");

  // ----------------------------------------------------
  // 1. JSON Parser Tests
  // ----------------------------------------------------
  console.log("  * Testing cleanAndParseJson utility...");

  // Test Case A: Clean JSON
  const cleanResult = cleanAndParseJson<{ success: boolean }>("{\"success\": true}");
  if (!cleanResult.success) {
    throw new Error("cleanAndParseJson failed to parse standard clean JSON.");
  }

  // Test Case B: Markdown Code Fence Wrapping
  const mdResult = cleanAndParseJson<{ code: string }>("```json\n{\"code\": \"abc\"}\n```");
  if (mdResult.code !== "abc") {
    throw new Error("cleanAndParseJson failed to strip ```json markdown code fences.");
  }

  const rawMdResult = cleanAndParseJson<{ code: string }>("```\n{\"code\": \"def\"}\n```");
  if (rawMdResult.code !== "def") {
    throw new Error("cleanAndParseJson failed to strip raw ``` markdown code fences.");
  }

  // Test Case C: Extra wrapping/noise text extraction
  const noisyResult = cleanAndParseJson<{ data: number }>(
    "Here is your generated response, sire: {\"data\": 42} Hope you like it!"
  );
  if (noisyResult.data !== 42) {
    throw new Error("cleanAndParseJson failed to extract nested object from surrounding noise.");
  }

  const noisyArrayResult = cleanAndParseJson<string[]>(
    "Random garbage text before [\"item1\", \"item2\"] random garbage after"
  );
  if (noisyArrayResult[0] !== "item1" || noisyArrayResult[1] !== "item2") {
    throw new Error("cleanAndParseJson failed to extract nested array from surrounding noise.");
  }

  // Test Case D: Invalid JSON throwing AiJsonParseError
  try {
    cleanAndParseJson("{\"incomplete\": true");
    throw new Error("cleanAndParseJson should have thrown on invalid JSON.");
  } catch (error) {
    if (!(error instanceof AiJsonParseError)) {
      throw new Error(`Expected AiJsonParseError, but got ${typeof error}`);
    }
    if (error.rawText !== "{\"incomplete\": true") {
      throw new Error("AiJsonParseError did not preserve the original raw text.");
    }
    console.log("    ✅ cleanAndParseJson invalid input exception validated.");
  }
  console.log("    ✅ cleanAndParseJson parsed various clean/dirty formats flawlessly.");

  // ----------------------------------------------------
  // 2. Registry Priority & Fallback Tests
  // ----------------------------------------------------
  console.log("  * Testing ProviderRegistry mechanics...");
  const registry = new ProviderRegistry();

  const lowPriorityProv = new MockAiProvider("low-ai", true);
  const highPriorityProv = new MockAiProvider("high-ai", true);
  const unavailableProv = new MockAiProvider("unavailable-ai", false);

  registry.register(lowPriorityProv, { priority: 10 });
  registry.register(highPriorityProv, { priority: 50 });
  registry.register(unavailableProv, { priority: 100 });

  // Test Case A: Retrieves highest-priority available provider
  // High-priority (50) vs Low-priority (10), while priority 100 is unavailable.
  const resolved = registry.getProvider();
  if (resolved.name !== "high-ai") {
    throw new Error(`Registry priority resolution failed. Expected "high-ai", got "${resolved.name}"`);
  }

  // Test Case B: Retrieve specific by name
  const requested = registry.getProvider("low-ai");
  if (requested.name !== "low-ai") {
    throw new Error(`Registry retrieval by name failed. Expected "low-ai", got "${requested.name}"`);
  }

  // Test Case C: Available check
  if (!registry.hasAvailableProvider()) {
    throw new Error("Registry reported no available providers when some exist.");
  }

  // Test Case D: Fallback when highest priority becomes unavailable
  const registryFallback = new ProviderRegistry();
  const mockA = new MockAiProvider("prov-a", true);
  const mockB = new MockAiProvider("prov-b", false); // higher priority but offline

  registryFallback.register(mockA, { priority: 10 });
  registryFallback.register(mockB, { priority: 90 });

  const resolvedFallback = registryFallback.getProvider();
  if (resolvedFallback.name !== "prov-a") {
    throw new Error("Fallback failed. Expected prov-a to resolve.");
  }

  // Test Case E: Missing specific provider throws error
  try {
    registry.getProvider("non-existent");
    throw new Error("Registry did not throw when querying non-existent provider.");
  } catch (err: any) {
    if (!err.message.includes("is not registered")) {
      throw new Error(`Unexpected registry error message: ${err.message}`);
    }
  }

  // Test Case F: No available providers throws error
  const registryEmpty = new ProviderRegistry();
  registryEmpty.register(unavailableProv, { priority: 100 });
  try {
    registryEmpty.getProvider();
    throw new Error("Registry did not throw when no providers are available.");
  } catch (err: any) {
    if (!err.message.includes("No available AI providers found")) {
      throw new Error(`Unexpected registry error message: ${err.message}`);
    }
  }
  console.log("    ✅ ProviderRegistry priority resolution, fallbacks, and validations passed.");

  // ----------------------------------------------------
  // 3. Gemini Provider Mock Tests
  // ----------------------------------------------------
  console.log("  * Testing GeminiProvider implementations with mock API...");

  // Save existing env keys to restore later
  const oldGeminiKey = process.env.GEMINI_API_KEY;
  const oldGoogleKey = process.env.GOOGLE_AI_API_KEY;

  try {
    // Configure environment
    process.env.GEMINI_API_KEY = "mock-secret-gemini-key";
    delete process.env.GOOGLE_AI_API_KEY;

    const gemini = new GeminiProvider();

    if (!gemini.isAvailable()) {
      throw new Error("GeminiProvider should report as available when GEMINI_API_KEY is configured.");
    }

    const health = await gemini.healthCheck();
    if (health.status !== "ok") {
      throw new Error(`Gemini healthCheck failed. Status: ${health.status}, Details: ${health.details}`);
    }

    // A. Test generateText with mock response
    setupFetchMock("Hello from the cognitive Gemini cloud!");
    const textResponse = await gemini.generateText("Analyze brand visibility");

    if (textResponse.text !== "Hello from the cognitive Gemini cloud!") {
      throw new Error(`Gemini generateText content mismatch. Got: "${textResponse.text}"`);
    }
    if (textResponse.provider.name !== "gemini") {
      throw new Error(`Gemini provider metadata incorrect. Got: "${textResponse.provider.name}"`);
    }
    if (textResponse.usage?.promptTokens !== 10) {
      throw new Error(`Gemini usage metadata prompt tokens mismatch. Got: ${textResponse.usage?.promptTokens}`);
    }

    // B. Test generateJson with mock response
    const mockJsonString = "```json\n{\"sentiment\": \"positive\", \"score\": 0.96}\n```";
    setupFetchMock(mockJsonString);
    const jsonResult = await gemini.generateJson<{ sentiment: string; score: number }>("Get sentiment JSON");
    if (jsonResult.sentiment !== "positive" || jsonResult.score !== 0.96) {
      throw new Error(`Gemini generateJson parsing failed. Got: ${JSON.stringify(jsonResult)}`);
    }

    // C. Test fallback/missing key behavior
    delete process.env.GEMINI_API_KEY;
    if (gemini.isAvailable()) {
      throw new Error("GeminiProvider should report as unavailable when keys are missing.");
    }
    const unhealthyCheck = await gemini.healthCheck();
    if (unhealthyCheck.status !== "unhealthy") {
      throw new Error("GeminiProvider healthCheck should be unhealthy when keys are missing.");
    }

    try {
      await gemini.generateText("This should fail");
      throw new Error("GeminiProvider should throw an error when generating text without an API key.");
    } catch (err: any) {
      if (!err.message.includes("Gemini API key is not configured")) {
        throw new Error(`Unexpected error message when API key is missing: ${err.message}`);
      }
    }

    console.log("    ✅ GeminiProvider generateText, generateJson, and error states validated.");
  } finally {
    // Restore original environments
    process.env.GEMINI_API_KEY = oldGeminiKey;
    process.env.GOOGLE_AI_API_KEY = oldGoogleKey;
    restoreFetchMock();
  }

  console.log("✅ All Enterprise AI Provider Abstraction & Registry Layer Tests Passed Successfully!");
}

// Support executing directly
if (require.main === module) {
  runAiTestSuite()
    .then(() => {
      console.log("Test execution finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
