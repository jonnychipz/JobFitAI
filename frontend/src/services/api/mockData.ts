// Mock data for testing
import type { CVData, ParsedCVData, OptimizedCVData, JobMatchResult, CareerInsight } from '../../types';

export const mockCVs: CVData[] = [
  {
    id: '1',
    userId: 'user1',
    fileName: 'john_doe_cv.pdf',
    uploadDate: new Date('2024-11-01').toISOString(),
    originalText: 'CV content here...',
    parsedData: {} as ParsedCVData,
    status: 'completed',
  },
  {
    id: '2',
    userId: 'user1',
    fileName: 'senior_developer_resume.docx',
    uploadDate: new Date('2024-10-28').toISOString(),
    originalText: 'CV content here...',
    parsedData: {} as ParsedCVData,
    status: 'processing',
  },
];

export const mockParsedCV: ParsedCVData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+44 7700 900000',
    location: 'London, UK',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
  },
  summary: 'Experienced Full Stack Developer with 8+ years of expertise in building scalable web applications using React, Node.js, and Azure. Passionate about clean code, testing, and modern development practices.',
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Ltd',
      position: 'Senior Full Stack Developer',
      startDate: '2020-03-01',
      endDate: undefined,
      current: true,
      description: 'Led development of microservices architecture serving 500K+ users',
      achievements: [
        'Led development of microservices architecture serving 500K+ users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored team of 5 junior developers',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'Azure', 'Docker'],
    },
    {
      id: 'exp2',
      company: 'Digital Innovations',
      position: 'Full Stack Developer',
      startDate: '2018-01-01',
      endDate: '2020-02-28',
      current: false,
      description: 'Built RESTful APIs handling 1M+ daily requests',
      achievements: [
        'Built RESTful APIs handling 1M+ daily requests',
        'Developed responsive React applications',
        'Implemented OAuth2 authentication system',
      ],
      technologies: ['React', 'Express', 'MongoDB', 'AWS'],
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of Manchester',
      degree: 'BSc',
      field: 'Computer Science',
      startDate: '2013-09-01',
      endDate: '2016-06-30',
      gpa: 'First Class Honours',
    },
  ],
  skills: [
    { name: 'JavaScript', category: 'technical', proficiency: 'expert', yearsOfExperience: 8 },
    { name: 'TypeScript', category: 'technical', proficiency: 'expert', yearsOfExperience: 5 },
    { name: 'React', category: 'technical', proficiency: 'expert', yearsOfExperience: 6 },
    { name: 'Node.js', category: 'technical', proficiency: 'expert', yearsOfExperience: 7 },
    { name: 'Azure', category: 'technical', proficiency: 'advanced', yearsOfExperience: 4 },
    { name: 'Docker', category: 'technical', proficiency: 'advanced', yearsOfExperience: 3 },
  ],
};

export const mockOptimizedCV: OptimizedCVData = {
  atsScore: 85,
  optimizedText: 'Optimized CV text here...',
  suggestions: [
    {
      id: 'sug1',
      type: 'formatting',
      severity: 'medium',
      message: 'Use consistent date formatting',
      original: 'March 2020',
      suggested: '2020-03',
      reason: 'Mix of date formats detected. Use YYYY-MM format consistently for better ATS parsing.',
    },
    {
      id: 'sug2',
      type: 'content',
      severity: 'high',
      message: 'Add more relevant technical keywords',
      original: 'Worked with React',
      suggested: 'Developed applications using React 18, TypeScript, and modern hooks',
      reason: 'Include specific technology versions and tools mentioned in job descriptions.',
    },
  ],
  improvementAreas: [
    {
      category: 'Keywords',
      score: 75,
      recommendations: [
        'Add "Microservices", "Serverless", "Azure DevOps"',
        'Include specific framework versions',
      ],
    },
    {
      category: 'Formatting',
      score: 90,
      recommendations: ['Use consistent date format throughout'],
    },
  ],
  keywordMatches: [
    { keyword: 'React', found: true, importance: 'high' },
    { keyword: 'TypeScript', found: true, importance: 'high' },
    { keyword: 'Microservices', found: false, importance: 'medium', suggestion: 'Add to skills or experience' },
    { keyword: 'Kubernetes', found: true, importance: 'medium' },
  ],
};

export const mockJobMatch: JobMatchResult = {
  jobId: 'job1',
  matchScore: 88,
  matchedSkills: [
    'React',
    'Node.js',
    'TypeScript',
    'Azure',
    'CI/CD',
  ],
  missingSkills: [
    'Financial services experience',
    'Kubernetes (mentioned but not emphasized)',
    'Test-driven development',
  ],
  tailoredCV: 'Your CV has been tailored to emphasize relevant experience with React, TypeScript, Azure, and microservices architecture. Consider adding specific examples of financial data handling if applicable.',
  recommendations: [
    'Emphasize your microservices architecture experience in the summary',
    'Add specific examples of CI/CD pipeline implementations',
    'Mention any financial or regulated industry experience if applicable',
    'Highlight Kubernetes experience from your current role',
  ],
};

export const mockCareerInsights: CareerInsight = {
  skillDemand: [
    { skill: 'TypeScript', demand: 'high', trend: 'rising', relevantJobs: ['Frontend Developer', 'Full Stack Developer'] },
    { skill: 'React', demand: 'high', trend: 'stable', relevantJobs: ['Frontend Developer', 'Full Stack Developer'] },
    { skill: 'Kubernetes', demand: 'high', trend: 'rising', relevantJobs: ['DevOps Engineer', 'Cloud Architect'] },
    { skill: 'Azure', demand: 'high', trend: 'rising', relevantJobs: ['Cloud Engineer', 'Solutions Architect'] },
  ],
  salaryRange: {
    min: 60000,
    max: 85000,
    median: 72500,
    currency: 'GBP',
  },
  careerPath: [
    {
      role: 'Technical Lead / Engineering Manager',
      yearsExperience: '8-10',
      requiredSkills: ['Leadership', 'Architecture Design', 'Team Management'],
      salaryRange: {
        min: 80000,
        max: 110000,
        median: 95000,
        currency: 'GBP',
      },
    },
    {
      role: 'Cloud Solutions Architect',
      yearsExperience: '6-8',
      requiredSkills: ['Azure Architecture', 'Security', 'Cost Optimization'],
      salaryRange: {
        min: 75000,
        max: 100000,
        median: 87500,
        currency: 'GBP',
      },
    },
  ],
  recommendations: [
    'Consider learning Kubernetes to complement your Docker experience',
    'Python is increasingly valuable for backend development',
    'Your experience positions you well for technical leadership roles',
  ],
};

// Mock API delays for realistic behavior
export const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));
