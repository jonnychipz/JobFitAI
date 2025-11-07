import React from 'react';
import { Layout } from '@/components/Layout';
import { CVUpload } from '@/components/CVUpload';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [showTextInput, setShowTextInput] = React.useState(false);

  const handleUploadSuccess = (cvId: string) => {
    navigate(`/dashboard?cvId=${cvId}`);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Upload Your CV
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Upload your CV file or paste your CV text to get started with AI-powered analysis.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowTextInput(false)}
            className={`btn ${!showTextInput ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText className="w-5 h-5 mr-2 inline" />
            Upload File
          </button>
          <button
            onClick={() => setShowTextInput(true)}
            className={`btn ${showTextInput ? 'btn-primary' : 'btn-secondary'}`}
          >
            Paste Text
          </button>
        </div>

        {!showTextInput ? (
          <CVUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="card">
            <label className="label">Paste your CV text below:</label>
            <textarea
              className="input min-h-[400px] font-mono text-sm"
              placeholder="Paste your CV content here..."
            />
            <button className="btn btn-primary w-full mt-4">
              Analyze CV Text
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
