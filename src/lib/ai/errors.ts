export class AiJsonParseError extends Error {
  readonly rawText: string;

  constructor(message: string, rawText: string, cause?: any) {
    super(message);
    this.name = "AiJsonParseError";
    this.rawText = rawText;

    if (cause) {
      this.cause = cause;
    }

    // Explicitly set the prototype so that instanceof checks work correctly when compiled
    Object.setPrototypeOf(this, AiJsonParseError.prototype);
  }
}
