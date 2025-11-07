import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { openAIService } from "../services/openaiService";
import { ApiResponse, OptimizedCVData } from "../types";

export async function optimizeCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Optimize CV endpoint called");

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

    // Retrieve CV from storage
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

    if (!cvData.originalText) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: "INVALID_STATE",
            message: "CV text not available for optimization",
          },
        } as ApiResponse,
      };
    }

    // Optimize CV using OpenAI
    const optimizedData = await openAIService.optimizeCV(
      cvData.originalText,
      cvData.parsedData || {}
    );

    // Update CV with optimized data
    cvData.optimizedData = optimizedData as OptimizedCVData;
    cvData.status = "completed";
    await storageService.uploadCVMetadata(cvData);

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: optimizedData,
      } as ApiResponse<OptimizedCVData>,
    };
  } catch (error) {
    context.error("Error optimizing CV:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "OPTIMIZATION_ERROR",
          message: "Failed to optimize CV",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
