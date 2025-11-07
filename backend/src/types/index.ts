// CV Data Types
export interface CVData {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  originalText: string;
  parsedData?: ParsedCVData;
  optimizedData?: OptimizedCVData;
  status: 'processing' | 'completed' | 'failed';
  blobUrl?: string;
}

export interface ParsedCVData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  summary?: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}

export interface OptimizedCVData {
  suggestions: Suggestion[];
  atsScore: number;
  optimizedText: string;
  improvementAreas: ImprovementArea[];
  keywordMatches: KeywordMatch[];
}

export interface Suggestion {
  id: string;
  type: 'skill' | 'experience' | 'education' | 'formatting' | 'content';
  severity: 'low' | 'medium' | 'high';
  message: string;
  original: string;
  suggested: string;
  reason: string;
}

export interface ImprovementArea {
  category: string;
  score: number;
  recommendations: string[];
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: 'high' | 'medium' | 'low';
  suggestion?: string;
}

export interface JobMatchResult {
  jobId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  tailoredCV: string;
  recommendations: string[];
}

export interface CareerInsight {
  skillDemand: SkillDemand[];
  salaryRange: SalaryRange;
  careerPath: CareerPath[];
  recommendations: string[];
}

export interface SkillDemand {
  skill: string;
  demand: 'high' | 'medium' | 'low';
  trend: 'rising' | 'stable' | 'declining';
  relevantJobs: string[];
}

export interface SalaryRange {
  min: number;
  max: number;
  median: number;
  currency: string;
}

export interface CareerPath {
  role: string;
  yearsExperience: string;
  requiredSkills: string[];
  salaryRange: SalaryRange;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
