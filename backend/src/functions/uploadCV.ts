import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "../services/storageService";
import { documentParserService } from "../services/documentParserService";
import { CVData, ApiResponse } from "../types";

export async function uploadCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("CV upload endpoint called");

  try {
    const contentType = request.headers.get("content-type") || "";

    let cvData: CVData;

    // Handle multipart/form-data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "File is required in form data",
            },
          } as ApiResponse,
        };
      }

      const fileName = file.name;
      const extension = fileName.toLowerCase().split(".").pop();

      // Validate file type
      if (!["pdf", "docx", "txt"].includes(extension || "")) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: {
              code: "INVALID_FILE_TYPE",
              message: "Only PDF, DOCX, and TXT files are supported",
            },
          } as ApiResponse,
        };
      }

      // Read file as buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse document to extract text
      context.log(`Parsing ${fileName} (${extension})`);
      const extractedText = await documentParserService.parseDocument(
        buffer,
        fileName
      );

      if (!extractedText || extractedText.trim().length === 0) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: {
              code: "EMPTY_DOCUMENT",
              message: "No text could be extracted from the document",
            },
          } as ApiResponse,
        };
      }

      const cvId = uuidv4();
      const userId = "demo-user"; // TODO: Get from auth token

      cvData = {
        id: cvId,
        userId: userId,
        fileName: fileName,
        uploadDate: new Date().toISOString(),
        originalText: extractedText,
        status: "processing",
      };

      // Store original file and text
      await storageService.uploadCV(cvId, fileName, buffer);

      // Store metadata with extracted text
      await storageService.uploadCVMetadata(cvData);

      context.log(`CV uploaded and parsed successfully: ${cvId}`);
    }
    // Handle text upload
    else if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        text: string;
        fileName?: string;
      };

      if (!body.text) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: {
              code: "INVALID_INPUT",
              message: "CV text is required",
            },
          } as ApiResponse,
        };
      }

      const cvId = uuidv4();
      const userId = "demo-user"; // TODO: Get from auth token

      cvData = {
        id: cvId,
        userId: userId,
        fileName: body.fileName || "pasted-cv.txt",
        uploadDate: new Date().toISOString(),
        originalText: body.text,
        status: "processing",
      };

      // Store original text as a blob
      await storageService.uploadCV(cvId, cvData.fileName, body.text);

      // Store metadata
      await storageService.uploadCVMetadata(cvData);

      context.log(`CV uploaded successfully: ${cvId}`);
    } else {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: "INVALID_CONTENT_TYPE",
            message:
              "Content-Type must be multipart/form-data or application/json",
          },
        } as ApiResponse,
      };
    }

    return {
      status: 201,
      jsonBody: {
        success: true,
        data: cvData,
      } as ApiResponse<CVData>,
    };
  } catch (error) {
    context.error("Error uploading CV:", error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to upload CV",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      } as ApiResponse,
    };
  }
}
