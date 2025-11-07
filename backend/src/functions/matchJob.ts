import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { storageService } from "../services/storageService";
import { openAIService } from "../services/openaiService";
import { ApiResponse, JobMatchResult } from "../types";

export async function matchJobHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Match job endpoint called");

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

    // Get job description from request body
    const body = (await request.json()) as { jobDescription: string };
    if (!body.jobDescription) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Job description is required",
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
            message: "CV text not available for job matching",
          },
        } as ApiResponse,
      };
    }

    // Match CV with job description using OpenAI
    const matchResult = await openAIService.matchJob(
      cvData.originalText,
      body.jobDescription
    );

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: matchResult,
      } as ApiResponse<JobMatchResult>,
    };
  } catch (error) {
    context.error("Error matching job:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "MATCH_ERROR",
          message: "Failed to match job",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
