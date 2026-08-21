import { IntegrationProvider, IProviderAdapter } from "../domain/types";
import { GoogleSearchConsoleAdapter } from "./google-search-console";
import { GoogleAnalyticsAdapter } from "./google-analytics";
import { WordPressAdapter } from "./wordpress";
import { ShopifyAdapter } from "./shopify";
import { WebflowAdapter } from "./webflow";
import { SlackAdapter } from "./slack";
import { WebhookAdapter } from "./webhook";

export class ProviderAdapterFactory {
  static getAdapter(provider: IntegrationProvider): IProviderAdapter {
    switch (provider) {
      case 'google_search_console': return new GoogleSearchConsoleAdapter();
      case 'google_analytics': return new GoogleAnalyticsAdapter();
      case 'wordpress': return new WordPressAdapter();
      case 'shopify': return new ShopifyAdapter();
      case 'webflow': return new WebflowAdapter();
      case 'slack': return new SlackAdapter();
      case 'webhook': return new WebhookAdapter();
      default: throw new Error(`Unknown integration provider: ${provider}`);
    }
  }
}
