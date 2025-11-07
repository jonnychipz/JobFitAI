import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import { uploadCVHandler } from "./functions/uploadCV";
import { parseCVHandler } from "./functions/parseCV";
import { optimizeCVHandler } from "./functions/optimizeCV";
import { matchJobHandler } from "./functions/matchJob";
import { getCareerInsightsHandler } from "./functions/getCareerInsights";
import { getCVHandler } from "./functions/getCV";
import { getUserCVsHandler } from "./functions/getUserCVs";
import { deleteCVHandler } from "./functions/deleteCV";
import { healthCheckHandler } from "./functions/healthCheck";

// Configure CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper function to add CORS headers
function addCorsHeaders(response: HttpResponseInit): HttpResponseInit {
  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  };
}

// Health check endpoint
app.http("healthCheck", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    const response = await healthCheckHandler(request, context);
    return addCorsHeaders(response);
  },
});

// CV Upload endpoint
app.http("uploadCV", {
  methods: ["POST", "OPTIONS"],
  authLevel: "function",
  route: "cv/upload",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await uploadCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// CV Text Upload endpoint
app.http("uploadCVText", {
  methods: ["POST", "OPTIONS"],
  authLevel: "function",
  route: "cv/upload-text",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await uploadCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Get CV by ID
app.http("getCV", {
  methods: ["GET", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await getCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Get all CVs for user
app.http("getUserCVs", {
  methods: ["GET", "OPTIONS"],
  authLevel: "function",
  route: "cv",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await getUserCVsHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Parse CV
app.http("parseCV", {
  methods: ["POST", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}/parse",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await parseCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Optimize CV
app.http("optimizeCV", {
  methods: ["POST", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}/optimize",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await optimizeCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Match job
app.http("matchJob", {
  methods: ["POST", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}/match",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await matchJobHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Get career insights
app.http("getCareerInsights", {
  methods: ["GET", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}/insights",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await getCareerInsightsHandler(request, context);
    return addCorsHeaders(response);
  },
});

// Delete CV
app.http("deleteCV", {
  methods: ["DELETE", "OPTIONS"],
  authLevel: "function",
  route: "cv/{cvId}",
  handler: async (request: HttpRequest, context: InvocationContext) => {
    if (request.method === "OPTIONS") {
      return addCorsHeaders({ status: 200 });
    }
    const response = await deleteCVHandler(request, context);
    return addCorsHeaders(response);
  },
});

// No export needed - Azure Functions v4 runtime discovers registered functions automatically
