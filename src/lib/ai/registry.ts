import { IAiProvider } from "./types";

export class ProviderRegistry {
  private providers = new Map<string, { provider: IAiProvider; priority: number }>();

  /**
   * Register a provider with a priority (higher numbers mean preferred default).
   */
  register(provider: IAiProvider, options?: { priority?: number }): void {
    const priority = options?.priority ?? 0;
    this.providers.set(provider.name.toLowerCase(), { provider, priority });
  }

  /**
   * Returns the requested provider by name (case-insensitive),
   * or the highest-priority available provider if no name is specified.
   * Throws an error if no appropriate provider is available/registered.
   */
  getProvider(name?: string): IAiProvider {
    if (name) {
      const entry = this.providers.get(name.toLowerCase());
      if (!entry) {
        throw new Error(`Provider "${name}" is not registered.`);
      }
      return entry.provider;
    }

    // Find the highest priority available provider
    let bestProvider: IAiProvider | null = null;
    let highestPriority = -Infinity;

    for (const entry of this.providers.values()) {
      if (entry.provider.isAvailable()) {
        if (entry.priority > highestPriority) {
          highestPriority = entry.priority;
          bestProvider = entry.provider;
        }
      }
    }

    if (!bestProvider) {
      throw new Error("No available AI providers found in the registry.");
    }

    return bestProvider;
  }

  /**
   * Checks if there is at least one available provider registered.
   */
  hasAvailableProvider(): boolean {
    for (const entry of this.providers.values()) {
      if (entry.provider.isAvailable()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Resets the registry (useful for testing).
   */
  clear(): void {
    this.providers.clear();
  }
}
