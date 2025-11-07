import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { DefaultAzureCredential } from '@azure/identity';
import { config } from '../config';

/**
 * Azure OpenAI Service for CV analysis and optimization
 * Uses Managed Identity for authentication in production
 */
export class OpenAIService {
  private client: OpenAIClient;
  private deployment: string;

  constructor() {
    // Use Managed Identity in production, fallback to environment variable for local dev
    const credential = process.env.AZURE_OPENAI_API_KEY
      ? new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
      : new DefaultAzureCredential();

    this.client = new OpenAIClient(
      config.azure.openai.endpoint,
      credential as AzureKeyCredential
    );
    this.deployment = config.azure.openai.deployment;
  }

  /**
   * Parse CV text and extract structured information
   */
  async parseCV(cvText: string): Promise<unknown> {
    const systemPrompt = `You are an expert CV parser. Extract structured information from the CV text including:
    - Personal information (name, email, phone, location, linkedin, portfolio)
    - Skills (categorized as technical, soft, language, or other)
    - Work experience (company, position, dates, description, achievements)
    - Education (institution, degree, field, dates)
    - Professional summary

    Return the data in JSON format with the following structure:
    {
      "personalInfo": {...},
      "skills": [...],
      "experience": [...],
      "education": [...],
      "summary": "..."
    }`;

    const response = await this.client.getChatCompletions(this.deployment, [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Parse this CV:\n\n${cvText}` },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  }

  /**
   * Optimize CV for ATS and provide suggestions
   */
  async optimizeCV(cvText: string, parsedData: unknown): Promise<unknown> {
    const systemPrompt = `You are an expert CV optimization consultant. Analyze the CV and provide:
    1. ATS optimization score (0-100)
    2. Specific suggestions for improvement
    3. Keywords that should be added
    4. Areas needing improvement with recommendations
    5. Optimized version of the CV text

    Focus on:
    - ATS-friendly formatting
    - Action verbs and quantifiable achievements
    - Industry-relevant keywords
    - Clear and concise language
    - Professional presentation

    Return JSON with structure:
    {
      "atsScore": number,
      "suggestions": [{type, severity, message, original, suggested, reason}],
      "improvementAreas": [{category, score, recommendations}],
      "keywordMatches": [{keyword, found, importance, suggestion}],
      "optimizedText": "..."
    }`;

    const response = await this.client.getChatCompletions(this.deployment, [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Optimize this CV:\n\nOriginal Text:\n${cvText}\n\nParsed Data:\n${JSON.stringify(parsedData, null, 2)}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse optimization response');
    }
  }

  /**
   * Match CV with job description and provide tailored version
   */
  async matchJob(cvText: string, jobDescription: string): Promise<unknown> {
    const systemPrompt = `You are a job matching expert. Analyze how well the CV matches the job description and provide:
    1. Match score (0-100)
    2. Matched skills
    3. Missing skills
    4. Tailored CV version optimized for this specific job
    5. Recommendations for improving the match

    Return JSON with structure:
    {
      "matchScore": number,
      "matchedSkills": string[],
      "missingSkills": string[],
      "tailoredCV": "...",
      "recommendations": string[]
    }`;

    const response = await this.client.getChatCompletions(this.deployment, [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `CV:\n${cvText}\n\nJob Description:\n${jobDescription}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse job match response');
    }
  }

  /**
   * Generate career insights based on skills and experience
   */
  async getCareerInsights(parsedData: unknown): Promise<unknown> {
    const systemPrompt = `You are a career counselor and market analyst. Based on the CV data, provide:
    1. Skill demand analysis (high/medium/low demand, trends)
    2. Estimated salary range for current experience level
    3. Potential career paths
    4. Personalized career recommendations

    Return JSON with structure:
    {
      "skillDemand": [{skill, demand, trend, relevantJobs}],
      "salaryRange": {min, max, median, currency},
      "careerPath": [{role, yearsExperience, requiredSkills, salaryRange}],
      "recommendations": string[]
    }`;

    const response = await this.client.getChatCompletions(this.deployment, [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Provide career insights for:\n${JSON.stringify(parsedData, null, 2)}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Failed to parse career insights response');
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
