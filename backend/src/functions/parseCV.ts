import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { openAIService } from '../services/openaiService';
import { ApiResponse, ParsedCVData } from '../types';

export async function parseCVHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Parse CV endpoint called');

  try {
    const cvId = request.params.cvId;

    if (!cvId) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'CV ID is required',
          },
        } as ApiResponse,
      };
    }

    // TODO: Retrieve CV from storage
    // For demo, using placeholder text
    const cvText = `John Doe
Email: john.doe@email.com | Phone: (555) 123-4567
Location: New York, NY | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.

SKILLS
- Languages: JavaScript, TypeScript, Python, Java
- Frontend: React, Angular, Vue.js, HTML5, CSS3
- Backend: Node.js, Express, NestJS, Django
- Cloud: Azure, AWS, Docker, Kubernetes
- Databases: PostgreSQL, MongoDB, Redis

EXPERIENCE
Senior Software Engineer | Tech Corp | Jan 2020 - Present
- Led development of microservices architecture serving 1M+ users
- Improved application performance by 40% through optimization
- Mentored 5 junior developers in best practices

Software Engineer | StartupXYZ | Jun 2018 - Dec 2019
- Built responsive web applications using React and Node.js
- Implemented CI/CD pipelines reducing deployment time by 60%
- Collaborated with cross-functional teams on product features

EDUCATION
Bachelor of Science in Computer Science
State University | 2014 - 2018
GPA: 3.8/4.0`;

    // Parse CV using OpenAI
    const parsedData = await openAIService.parseCV(cvText);

    return {
      status: 200,
      jsonBody: {
        success: true,
        data: parsedData,
      } as ApiResponse<ParsedCVData>,
    };
  } catch (error) {
    context.error('Error parsing CV:', error);
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse CV',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      } as ApiResponse,
    };
  }
}
