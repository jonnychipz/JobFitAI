import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ApiResponse } from '../types';

export async function getUserCVsHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Get user CVs endpoint called');
  
  // TODO: Implement get all CVs for user
  return {
    status: 501,
    jsonBody: {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Get user CVs not yet implemented',
      },
    } as ApiResponse,
  };
}
