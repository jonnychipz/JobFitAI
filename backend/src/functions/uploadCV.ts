import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { v4 as uuidv4 } from 'uuid';
import { CVData, ApiResponse } from '../types';

export async function uploadCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('CV upload endpoint called');

  try {
    const contentType = request.headers.get('content-type') || '';

    let cvData: Partial<CVData>;

    // Handle multipart/form-data (file upload)
    if (contentType.includes('multipart/form-data')) {
      // TODO: Implement file parsing (PDF/DOCX)
      // For now, return placeholder
      cvData = {
        id: uuidv4(),
        userId: 'demo-user', // TODO: Get from auth token
        fileName: 'uploaded-cv.pdf',
        uploadDate: new Date().toISOString(),
        originalText: 'File upload processing not yet implemented',
        status: 'processing',
      };
    }
    // Handle text upload
    else if (contentType.includes('application/json')) {
      const body = await request.json() as { text: string };
      
      if (!body.text) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: 'CV text is required',
            },
          } as ApiResponse,
        };
      }

      cvData = {
        id: uuidv4(),
        userId: 'demo-user', // TODO: Get from auth token
        fileName: 'pasted-cv.txt',
        uploadDate: new Date().toISOString(),
        originalText: body.text,
        status: 'processing',
      };
    } else {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: 'INVALID_CONTENT_TYPE',
            message: 'Content-Type must be multipart/form-data or application/json',
          },
        } as ApiResponse,
      };
    }

    // TODO: Store in database/storage
    // For now, return the created CV data

    return {
      status: 201,
      jsonBody: {
        success: true,
        data: cvData,
      } as ApiResponse<CVData>,
    };
  } catch (error) {
    context.error('Error uploading CV:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to upload CV',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } as ApiResponse,
    };
  }
}
