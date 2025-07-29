import { client } from "@epcc-sdk/sdks-shopper";

/**
 * Configures the Elastic Path Commerce Cloud SDK client for client-side usage
 *
 * This function sets up:
 * 1. Base URL for API requests
 * 2. Multi-location inventory header for advanced inventory features
 *
 * Note: Authentication is handled by the StorefrontProvider interceptor
 */
export function configureClient(): void {
  // Configure the base URL for all API requests
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_EPCC_ENDPOINT_URL!,
  });

  /**
   * Multi-Location Inventory Interceptor
   *
   * Enables Elastic Path's Multi-Location Inventory (MLI) feature by adding
   * the required header to all requests.
   */
  client.interceptors.request.use(async (request, _options) => {
    request.headers.set("EP-Inventories-Multi-Location", "true");
    return request;
  });
}
