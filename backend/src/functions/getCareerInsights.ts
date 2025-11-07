import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { openAIService } from "../services/openaiService";
import { ApiResponse, CareerInsight } from "../types";

export async function getCareerInsightsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Get career insights endpoint called");

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

    if (!cvData.parsedData) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: "INVALID_STATE",
            message: "CV must be parsed before generating career insights",
          },
        } as ApiResponse,
      };
    }

    // Generate career insights using OpenAI
    const insights = await openAIService.getCareerInsights(cvData.parsedData);

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: insights,
      } as ApiResponse<CareerInsight>,
    };
  } catch (error) {
    context.error("Error getting career insights:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "INSIGHTS_ERROR",
          message: "Failed to generate career insights",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
