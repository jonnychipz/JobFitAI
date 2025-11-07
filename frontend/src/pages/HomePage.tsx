import React from "react";
import { Layout } from "@/components/Layout";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PrivacyNotice } from "@/components/PrivacyNotice";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description:
        "Leverage OpenAI to extract and analyze your CV data with precision.",
    },
    {
      icon: Target,
      title: "ATS Optimization",
      description:
        "Get tailored suggestions to make your CV stand out to applicant tracking systems.",
    },
    {
      icon: TrendingUp,
      title: "Career Insights",
      description:
        "Receive market trend analysis and personalized career recommendations.",
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Transform Your CV with{" "}
            <span className="text-primary-600">AI Intelligence</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Upload your CV and let our AI analyze, optimize, and tailor it for
            your dream job. Stand out from the competition with data-driven
            insights.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="btn btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-primary-600 rounded-2xl p-12 text-white text-center my-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">CVs Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-primary-100">User Rating</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to optimize your CV?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Join thousands of professionals who have improved their job
            prospects.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="btn btn-primary text-lg px-8 py-3"
          >
            Start Now - It's Free
          </button>
        </div>

        {/* Privacy Section */}
        <div className="pb-16">
          <PrivacyNotice />
        </div>
      </div>
    </Layout>
  );
};
