import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { ApiResponse, CVData } from "../types";

export async function getCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Get CV endpoint called");

  try {
    const cvId = request.params.cvId;

    if (!cvId) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "CV ID is required",
          },
        } as ApiResponse,
      };
    }

    // Retrieve CV metadata from storage
    const cvData = await storageService.getCVMetadata(cvId);

    if (!cvData) {
      return {
        status: 404,
        jsonBody: {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "CV not found",
          },
        } as ApiResponse,
      };
    }

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: cvData,
      } as ApiResponse<CVData>,
    };
  } catch (error) {
    context.error("Error getting CV:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve CV",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
