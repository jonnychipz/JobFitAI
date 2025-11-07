import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ApiResponse } from '../types';

export async function getCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Get CV endpoint called');
  
  // TODO: Implement get CV by ID
  return {
    status: 501,
    jsonBody: {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Get CV not yet implemented',
      },
    } as ApiResponse,
  };
}
