import React from "react";
import { Layout } from "@/components/Layout";
import { CVUpload } from "@/components/CVUpload";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [showTextInput, setShowTextInput] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [cvText, setCvText] = React.useState("");

  const handleUploadSuccess = (cvId: string) => {
    setUploadSuccess(true);
    // Navigate to analysis page after 1 second
    setTimeout(() => {
      navigate(`/analysis?cvId=${cvId}`);
    }, 1000);
  };

  const handleTextAnalysis = () => {
    if (!cvText.trim()) {
      alert("Please paste your CV text first");
      return;
    }
    // Simulate upload and navigate to analysis
    const mockCvId = `cv_${Date.now()}`;
    handleUploadSuccess(mockCvId);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Upload Your CV
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Upload your CV file or paste your CV text to get started with
            AI-powered analysis.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowTextInput(false)}
            className={`btn ${
              !showTextInput ? "btn-primary" : "btn-secondary"
            }`}
          >
            <FileText className="w-5 h-5 mr-2 inline" />
            Upload File
          </button>
          <button
            onClick={() => setShowTextInput(true)}
            className={`btn ${showTextInput ? "btn-primary" : "btn-secondary"}`}
          >
            Paste Text
          </button>
        </div>

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              CV uploaded and analyzed successfully!
            </p>
          </div>
        )}

        <div className="mb-6">
          <PrivacyNotice />
        </div>

        {!showTextInput ? (
          <CVUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="card">
            <label className="label">Paste your CV text below:</label>
            <textarea
              className="input min-h-[400px] font-mono text-sm"
              placeholder="Paste your CV content here..."
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
            <button
              onClick={handleTextAnalysis}
              className="btn btn-primary w-full mt-4"
            >
              Analyze CV Text
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
