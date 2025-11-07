import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { getConfig } from "../config";

/**
 * Azure OpenAI Service for CV analysis and optimization
 * Uses Managed Identity for authentication in production
 * Uses Key Vault to retrieve API key securely
 */
export class OpenAIService {
  private client: OpenAIClient | null = null;
  private deployment: string;
  private initialized: boolean = false;

  constructor() {
    // Get deployment name dynamically
    const config = getConfig();
    this.deployment = config.azure.openai.deployment;
  }

  /**
   * Initialize the OpenAI client with proper authentication
   */
  private async initialize(): Promise<void> {
    if (this.initialized && this.client) {
      return;
    }

    try {
      // Get config dynamically to ensure env vars are read at initialization time
      const config = getConfig();
      const endpoint = config.azure.openai.endpoint;

      if (!endpoint) {
        throw new Error("AZURE_OPENAI_ENDPOINT is not configured");
      }

      // In production (Azure Functions), use managed identity or retrieve key from Key Vault
      if (!config.isDevelopment && config.azure.keyVault.url) {
        try {
          // Try managed identity first (Azure OpenAI supports it directly)
          const credential = new DefaultAzureCredential();

          // For Azure OpenAI, we can use either API key or Azure AD token
          // First try to get API key from Key Vault using managed identity
          const keyVaultClient = new SecretClient(
            config.azure.keyVault.url,
            credential
          );
          const secret = await keyVaultClient.getSecret(
            config.azure.openai.apiKeySecretName
          );

          if (secret.value) {
            this.client = new OpenAIClient(
              endpoint,
              new AzureKeyCredential(secret.value)
            );
          } else {
            // Fallback to Azure AD authentication
            this.client = new OpenAIClient(
              endpoint,
              credential as unknown as AzureKeyCredential
            );
          }
        } catch (error) {
          console.warn(
            "Failed to use Key Vault, falling back to Azure AD auth:",
            error
          );
          // Fallback to Azure AD authentication with managed identity
          const credential = new DefaultAzureCredential();
          this.client = new OpenAIClient(
            endpoint,
            credential as unknown as AzureKeyCredential
          );
        }
      } else {
        // Local development: use API key from environment variable
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error(
            "AZURE_OPENAI_API_KEY is required for local development"
          );
        }
        this.client = new OpenAIClient(
          endpoint,
          new AzureKeyCredential(apiKey)
        );
      }

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize OpenAI client:", error);
      throw new Error(
        `OpenAI initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get the OpenAI client (initialize if needed)
   */
  private async getClient(): Promise<OpenAIClient> {
    if (!this.client || !this.initialized) {
      await this.initialize();
    }
    if (!this.client) {
      throw new Error("OpenAI client not initialized");
    }
    return this.client;
  }

  /**
   * Parse CV text and extract structured information
   */
  async parseCV(cvText: string): Promise<unknown> {
    const client = await this.getClient();

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

    const response = await client.getChatCompletions(this.deployment, [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Parse this CV:\n\n${cvText}` },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to parse OpenAI response as JSON");
    }
  }

  /**
   * Optimize CV for ATS and provide suggestions
   */
  async optimizeCV(cvText: string, parsedData: unknown): Promise<unknown> {
    const client = await this.getClient();

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

    const response = await client.getChatCompletions(this.deployment, [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Optimize this CV:\n\nOriginal Text:\n${cvText}\n\nParsed Data:\n${JSON.stringify(
          parsedData,
          null,
          2
        )}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to parse optimization response");
    }
  }

  /**
   * Match CV with job description and provide tailored version
   */
  async matchJob(cvText: string, jobDescription: string): Promise<unknown> {
    const client = await this.getClient();

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

    const response = await client.getChatCompletions(this.deployment, [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `CV:\n${cvText}\n\nJob Description:\n${jobDescription}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to parse job match response");
    }
  }

  /**
   * Generate career insights based on skills and experience
   */
  async getCareerInsights(parsedData: unknown): Promise<unknown> {
    const client = await this.getClient();

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

    const response = await client.getChatCompletions(this.deployment, [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Provide career insights for:\n${JSON.stringify(
          parsedData,
          null,
          2
        )}`,
      },
    ]);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to parse career insights response");
    }
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
