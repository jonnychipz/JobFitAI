/**
 * Azure OpenAI Service for CV Analysis
 * This service integrates with Azure OpenAI to provide intelligent CV analysis
 */

export interface CVAnalysisRequest {
  cvText: string;
  targetRole?: string;
  industry?: string;
}

export interface CVAnalysisResponse {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  atsScore: number;
  recommendations: {
    critical: string[];
    improvements: string[];
    strengths: string[];
    keywordSuggestions: string[];
  };
  aiInsights: {
    careerLevel: string;
    industryFit: string[];
    skillGaps: string[];
    nextSteps: string[];
  };
}

/**
 * Analyzes a CV using Azure OpenAI GPT-4
 * This will call the Azure Functions backend which integrates with Azure OpenAI
 */
export async function analyzeCV(
  request: CVAnalysisRequest
): Promise<CVAnalysisResponse> {
  const response = await fetch("/api/cv/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("CV analysis failed");
  }

  return response.json();
}

/**
 * Azure OpenAI Prompt Template for CV Analysis
 * This is the system prompt that will be used in the backend
 */
export const CV_ANALYSIS_PROMPT = `You are an expert CV analyst and career advisor with deep knowledge of:
- Applicant Tracking Systems (ATS) and how they parse resumes
- Current hiring trends across industries
- Professional CV best practices
- Technical and soft skills assessment
- Career progression patterns

Analyze the provided CV and provide comprehensive feedback in the following areas:

1. ATS COMPATIBILITY (Score 0-100):
   - Evaluate how well the CV will perform with ATS systems
   - Check for proper formatting, keywords, and structure

2. CRITICAL IMPROVEMENTS (3-5 items):
   - Identify MUST-FIX issues that significantly impact the CV's effectiveness
   - Focus on missing quantifiable achievements, weak summaries, or format issues

3. RECOMMENDED IMPROVEMENTS (4-6 items):
   - Suggest enhancements that would make the CV more competitive
   - Include tips on content, structure, and presentation

4. STRENGTHS (3-4 items):
   - Highlight what the candidate is doing well
   - Identify unique selling points

5. MISSING KEYWORDS:
   - List 5-8 relevant industry keywords that should be added
   - Base suggestions on the candidate's experience level and industry

6. CAREER INSIGHTS:
   - Determine career level (Junior/Mid/Senior/Lead/Executive)
   - Suggest best-fit industries
   - Identify skill gaps for next career step
   - Recommend 3-4 specific next steps for career growth

Provide actionable, specific advice that the candidate can implement immediately.
Format your response as JSON with the specified structure.`;

/**
 * Example integration with Azure OpenAI (backend implementation)
 * This would be implemented in the Azure Functions backend
 */
export const BACKEND_INTEGRATION_EXAMPLE = `
// backend/src/services/azureOpenAIService.ts
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4";

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export async function analyzeCVWithAI(cvText: string): Promise<CVAnalysisResponse> {
  const messages = [
    { role: "system", content: CV_ANALYSIS_PROMPT },
    { role: "user", content: \`Please analyze this CV:\\n\\n\${cvText}\` }
  ];

  const result = await client.getChatCompletions(deploymentName, messages, {
    temperature: 0.7,
    maxTokens: 2000,
    responseFormat: { type: "json_object" }
  });

  const response = JSON.parse(result.choices[0].message?.content || "{}");
  return response;
}
`;
