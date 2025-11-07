import React from 'react';
import { FileText, TrendingUp, Target, Award } from 'lucide-react';
import { mockCVs, mockParsedCV, mockOptimizedCV, mockCareerInsights } from '../services/api/mockData';

export const DashboardPage: React.FC = () => {
  const latestCV = mockCVs[0];
  const atsScore = mockOptimizedCV.atsScore;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Your CV analysis and career insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">ATS Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{atsScore}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs improvement'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">CVs Uploaded</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{mockCVs.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Last upload: {new Date(latestCV.uploadDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Skills Tracked</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {mockParsedCV.skills.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Across {mockParsedCV.experience.length} positions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Career Paths</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {mockCareerInsights.careerPath.length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Potential opportunities
          </p>
        </div>
      </div>

      {/* CV Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Current CV: {latestCV.fileName}
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Name:</span>{' '}
                <span className="text-slate-900 dark:text-white">{mockParsedCV.personalInfo.name}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Email:</span>{' '}
                <span className="text-slate-900 dark:text-white">{mockParsedCV.personalInfo.email}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Location:</span>{' '}
                <span className="text-slate-900 dark:text-white">{mockParsedCV.personalInfo.location}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">LinkedIn:</span>{' '}
                <span className="text-slate-900 dark:text-white">{mockParsedCV.personalInfo.linkedin}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Professional Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{mockParsedCV.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Top Skills ({mockParsedCV.skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockParsedCV.skills.slice(0, 10).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Optimization Suggestions
        </h2>
        <div className="space-y-3">
          {mockOptimizedCV.suggestions.slice(0, 3).map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        suggestion.severity === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : suggestion.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {suggestion.severity}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {suggestion.message}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {suggestion.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Career Path Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCareerInsights.careerPath.map((path, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{path.role}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {path.yearsExperience} years experience required
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Salary Range:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  £{path.salaryRange.min.toLocaleString()} - £{path.salaryRange.max.toLocaleString()}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {path.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
