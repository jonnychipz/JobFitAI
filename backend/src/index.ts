// Entry point for Azure Functions v4 Node.js runtime
// Import the app to ensure all functions are registered
import "./app";

// Import services to ensure they're loaded (they use lazy initialization)
import "./services/storageService";
import "./services/openaiService";
