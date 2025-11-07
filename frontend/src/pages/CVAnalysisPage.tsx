import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  Brain,
  ArrowLeft,
  Download,
} from "lucide-react";

interface CVAnalysis {
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

export const CVAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);

  const cvId = searchParams.get("cvId");

  useEffect(() => {
    // Simulate API call to get CV analysis
    // In production, this would call your Azure Functions backend
    setTimeout(() => {
      setAnalysis({
        personalInfo: {
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "+44 7700 900000",
          location: "London, UK",
        },
        summary:
          "Experienced software engineer with 8+ years in full-stack development, specializing in cloud solutions and modern web technologies.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "Tech Corp",
            duration: "2020 - Present",
          },
          {
            title: "Software Engineer",
            company: "Digital Solutions",
            duration: "2017 - 2020",
          },
          {
            title: "Junior Developer",
            company: "StartUp Inc",
            duration: "2015 - 2017",
          },
        ],
        skills: [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Azure",
          "Python",
          "SQL",
          "Docker",
          "Kubernetes",
        ],
        education: [
          {
            degree: "BSc Computer Science",
            institution: "University of London",
            year: "2015",
          },
        ],
        atsScore: 78,
        recommendations: {
          critical: [
            'Add quantifiable achievements to experience entries (e.g., "Increased performance by 40%")',
            "Include a professional summary at the top highlighting key achievements",
            "Add more technical keywords relevant to your target roles",
          ],
          improvements: [
            "Expand on leadership experience and team management",
            "Include certifications section (Azure, AWS, etc.)",
            "Add links to GitHub, portfolio, or professional projects",
            'Use stronger action verbs: "Led", "Architected", "Implemented"',
          ],
          strengths: [
            "Strong technical skill set with modern technologies",
            "Clear career progression showing growth",
            "Good mix of frontend and backend experience",
          ],
          keywordSuggestions: [
            "Agile/Scrum methodologies",
            "CI/CD pipelines",
            "Microservices architecture",
            "Cloud-native development",
            "Test-driven development (TDD)",
            "DevOps practices",
          ],
        },
        aiInsights: {
          careerLevel: "Senior Level (8+ years)",
          industryFit: ["Technology", "FinTech", "E-commerce", "SaaS"],
          skillGaps: [
            "Cloud certifications (Azure/AWS)",
            "System design at scale",
            "Team leadership experience",
            "Open source contributions",
          ],
          nextSteps: [
            "Obtain Azure Solutions Architect certification",
            "Build a portfolio showcasing architectural decisions",
            "Contribute to open-source projects to demonstrate expertise",
            "Seek opportunities to lead technical initiatives",
          ],
        },
      });
      setLoading(false);
    }, 1500);
  }, [cvId]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Analyzing Your CV...
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI is processing your CV and generating personalized
                recommendations
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Analysis Failed
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't analyze your CV. Please try uploading again.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="btn btn-primary"
            >
              Upload New CV
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Upload
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                CV Analysis Results
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                AI-powered insights and recommendations for{" "}
                {analysis.personalInfo.name}
              </p>
            </div>
            <button className="btn btn-outline flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* ATS Score Card */}
        <div className={`card ${getScoreBg(analysis.atsScore)} border-2 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                ATS Compatibility Score
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                How well your CV performs with Applicant Tracking Systems
              </p>
            </div>
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${getScoreColor(
                  analysis.atsScore
                )}`}
              >
                {analysis.atsScore}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {analysis.atsScore >= 80
                  ? "Excellent"
                  : analysis.atsScore >= 60
                  ? "Good"
                  : "Needs Work"}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                AI Career Insights
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Career Level
                </h4>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
                  {analysis.aiInsights.careerLevel}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Best Industry Fit
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.aiInsights.industryFit.map((industry, idx) => (
                    <span
                      key={idx}
                      className="badge bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Your Strengths
              </h3>
            </div>
            <ul className="space-y-2">
              {analysis.recommendations.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Critical Recommendations */}
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">
              Critical Improvements Needed
            </h3>
          </div>
          <ul className="space-y-3">
            {analysis.recommendations.critical.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-700 dark:text-red-300 text-sm font-bold">
                    {idx + 1}
                  </span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recommended Improvements
            </h3>
          </div>
          <ul className="space-y-3">
            {analysis.recommendations.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Keyword Suggestions */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Missing Keywords for ATS
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Add these relevant keywords to improve your ATS score:
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.recommendations.keywordSuggestions.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium"
              >
                + {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Skill Gaps & Next Steps */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Identified Skill Gaps
            </h3>
            <ul className="space-y-2">
              {analysis.aiInsights.skillGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {gap}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Recommended Next Steps
            </h3>
            <ul className="space-y-2">
              {analysis.aiInsights.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-700 dark:text-green-300 text-xs font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CV Details */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-slate-600 dark:text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              CV Details
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Contact Information
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Name:
                  </span>{" "}
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {analysis.personalInfo.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Email:
                  </span>{" "}
                  <span className="text-slate-900 dark:text-slate-100 font-medium">
                    {analysis.personalInfo.email}
                  </span>
                </div>
                {analysis.personalInfo.phone && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Phone:
                    </span>{" "}
                    <span className="text-slate-900 dark:text-slate-100 font-medium">
                      {analysis.personalInfo.phone}
                    </span>
                  </div>
                )}
                {analysis.personalInfo.location && (
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Location:
                    </span>{" "}
                    <span className="text-slate-900 dark:text-slate-100 font-medium">
                      {analysis.personalInfo.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Experience
              </h4>
              <div className="space-y-3">
                {analysis.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-primary-600 pl-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {exp.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {exp.company} • {exp.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pb-8">
          <button
            onClick={() => navigate("/upload")}
            className="btn btn-primary"
          >
            Upload Another CV
          </button>
          <button className="btn btn-outline">Download Improved CV</button>
        </div>
      </div>
    </Layout>
  );
};
