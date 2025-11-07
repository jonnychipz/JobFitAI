export const config = {
  azure: {
    openai: {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
    },
    storage: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || "",
      containerName: "cvfiles",
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
};
