import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ApiResponse } from '../types';

export async function matchJobHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Match job endpoint called');
  
  // TODO: Implement job matching
  return {
    status: 501,
    jsonBody: {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Job matching not yet implemented',
      },
    } as ApiResponse,
  };
}
