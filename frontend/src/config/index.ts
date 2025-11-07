// Environment variables
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api',
  },
  msal: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID || '',
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  features: {
    enableAuth: import.meta.env.VITE_ENABLE_AUTH === 'true',
    enableDarkMode: true,
  },
};
