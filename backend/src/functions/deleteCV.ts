import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ApiResponse } from '../types';

export async function deleteCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Delete CV endpoint called');
  
  // TODO: Implement delete CV
  return {
    status: 501,
    jsonBody: {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Delete CV not yet implemented',
      },
    } as ApiResponse,
  };
}
