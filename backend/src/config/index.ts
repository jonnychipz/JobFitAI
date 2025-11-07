// Debug: Log environment variables at module load time
console.log("Config module loaded:", {
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING
    ? "SET"
    : "NOT SET",
  WEBSITE_INSTANCE_ID: process.env.WEBSITE_INSTANCE_ID ? "SET" : "NOT SET",
  NODE_ENV: process.env.NODE_ENV,
});

// Use a function to get config dynamically to ensure env vars are read at runtime
export const getConfig = () => ({
  azure: {
    openai: {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
      deployment:
        process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
        process.env.AZURE_OPENAI_DEPLOYMENT ||
        "gpt-4o",
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
      // API key retrieved from Key Vault in production, env var in dev
      apiKeySecretName: "AzureOpenAIApiKey",
    },
    storage: {
      // Use managed identity authentication in production
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
      containerName: "cvfiles",
      // Only used for local development
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    },
    keyVault: {
      url: process.env.AZURE_KEYVAULT_URL || "",
    },
    appInsights: {
      connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || "",
    },
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || "*").split(","),
  },
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10),
    allowedExtensions: [".pdf", ".docx", ".txt"],
  },
  // Environment detection - WEBSITE_INSTANCE_ID is set when running in Azure
  isDevelopment: !process.env.WEBSITE_INSTANCE_ID,
});

// Export both the function and a static instance for backwards compatibility
export const config = getConfig();
