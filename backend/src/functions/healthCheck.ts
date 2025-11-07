import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

export async function healthCheckHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Health check endpoint called');

  return {
    status: 200,
    jsonBody: {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    },
  };
}
