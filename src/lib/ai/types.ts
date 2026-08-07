export interface AiModelInfo {
  id: string;
  capabilities?: string[];
}

export interface AiProviderInfo {
  name: string;
  version?: string;
}

export interface AiCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  jsonMode?: boolean;
  responseSchema?: any;
  modelId?: string;
}

export interface AiCompletionResponse {
  text: string;
  raw: any;
  provider: AiProviderInfo;
  model: AiModelInfo;
  usage?: {
    promptTokens: number;
    candidateTokens: number;
  };
}

export interface AiProviderHealth {
  status: "ok" | "degraded" | "unhealthy";
  details?: string;
}

export interface IAiProvider {
  readonly name: string;
  isAvailable(): boolean;
  healthCheck?(): Promise<AiProviderHealth>;
  generateText(prompt: string, options?: AiCompletionOptions): Promise<AiCompletionResponse>;
  generateJson<T>(prompt: string, options?: AiCompletionOptions): Promise<T>;
}
