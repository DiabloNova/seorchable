export * from "./domain/types";
export * from "./repositories/api-key-repository";
export * from "./services/api-service";
export * from "./services/api-quota-service";
export * from "./middleware/api-middleware";

function ApiService(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: ApiService is not implemented yet.', args);
  return null;
}

export { ApiService };
function ApiQuotaService(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: ApiQuotaService is not implemented yet.', args);
  return null;
}

export { ApiQuotaService };
function withPublicApi(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: withPublicApi is not implemented yet.', args);
  return null;
}

export { withPublicApi };