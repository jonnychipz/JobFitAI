import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { ApiResponse, CVData } from "../types";

export async function getUserCVsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Get user CVs endpoint called");

  try {
    // TODO: Get user ID from authentication token
    // For now, using demo user
    const userId = request.query.get("userId") || "demo-user";

    // Retrieve all CVs for the user from storage
    const cvs = await storageService.listUserCVs(userId);

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: cvs,
      } as ApiResponse<CVData[]>,
    };
  } catch (error) {
    context.error("Error getting user CVs:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve CVs",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
