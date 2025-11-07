import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { ApiResponse } from "../types";

export async function deleteCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Delete CV endpoint called");

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

    // Check if CV exists
    const exists = await storageService.cvExists(cvId);
    if (!exists) {
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

    // TODO: Add authorization check (ensure user owns this CV)

    // Delete CV and all associated files
    await storageService.deleteCV(cvId);

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: { message: "CV deleted successfully" },
      } as ApiResponse,
    };
  } catch (error) {
    context.error("Error deleting CV:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete CV",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
