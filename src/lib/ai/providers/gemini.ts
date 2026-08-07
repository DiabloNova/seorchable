import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText as aiGenerateText } from "ai";
import { IAiProvider, AiCompletionOptions, AiCompletionResponse, AiProviderHealth } from "../types";
import { cleanAndParseJson } from "../utils/json-parser";
import { AI_CONFIG } from "@/config/ai";

export class GeminiProvider implements IAiProvider {
  readonly name = "gemini";

  isAvailable(): boolean {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    return !!apiKey;
  }

  async healthCheck(): Promise<AiProviderHealth> {
    if (!this.isAvailable()) {
      return {
        status: "unhealthy",
        details: "API key is missing. Set GEMINI_API_KEY or GOOGLE_AI_API_KEY in your environment."
      };
    }
    return { status: "ok" };
  }

  async generateText(prompt: string, options?: AiCompletionOptions): Promise<AiCompletionResponse> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY or GOOGLE_AI_API_KEY.");
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const modelId = options?.modelId || AI_CONFIG.defaultModel || "gemini-1.5-flash";
    const model = google(modelId);

    const temperature = options?.temperature ?? AI_CONFIG.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? AI_CONFIG.maxTokens ?? 2048;
    const system = options?.systemInstruction;

    const vercelOptions: any = {
      model,
      prompt,
      temperature,
      maxOutputTokens: maxTokens,
    };

    if (system) {
      vercelOptions.system = system;
    }

    if (options?.jsonMode) {
      vercelOptions.responseFormat = { type: "json" };
      if (options.responseSchema) {
        vercelOptions.schema = options.responseSchema;
      }
    }

    const result = await aiGenerateText(vercelOptions);

    const usage = result.usage as any;
    const promptTokens = usage?.promptTokens ?? usage?.inputTokens;
    const candidateTokens = usage?.completionTokens ?? usage?.outputTokens;

    return {
      text: result.text,
      raw: result,
      provider: {
        name: "gemini",
        version: "v1"
      },
      model: {
        id: modelId,
        capabilities: ["text", "json"]
      },
      usage: (promptTokens !== undefined && candidateTokens !== undefined) ? {
        promptTokens,
        candidateTokens
      } : undefined
    };
  }

  async generateJson<T>(prompt: string, options?: AiCompletionOptions): Promise<T> {
    const updatedOptions = { ...options, jsonMode: true };
    const response = await this.generateText(prompt, updatedOptions);
    return cleanAndParseJson<T>(response.text);
  }
}
