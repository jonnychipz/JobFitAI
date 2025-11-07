import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { useCVUpload } from '@/hooks/useCV';

interface CVUploadProps {
  onUploadSuccess?: (cvId: string) => void;
}

export const CVUpload: React.FC<CVUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const uploadMutation = useCVUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadMutation.mutateAsync(selectedFile);
      if (response.success && response.data) {
        onUploadSuccess?.(response.data.id);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
            {isDragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            or click to browse (PDF, DOCX, TXT)
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-10 h-10 text-primary-600" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="btn btn-primary w-full mt-4"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload & Analyze CV'}
          </button>
          {uploadMutation.isError && (
            <p className="text-sm text-red-600 mt-2">
              Upload failed. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
