import apiClient from './client';
import { CVData, ParsedCVData, OptimizedCVData, JobMatchResult, CareerInsight, ApiResponse } from '@/types';

export const cvService = {
  // Upload CV file
  uploadCV: async (file: File): Promise<ApiResponse<CVData>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ApiResponse<CVData>>('/cv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Upload CV text
  uploadCVText: async (text: string): Promise<ApiResponse<CVData>> => {
    const response = await apiClient.post<ApiResponse<CVData>>('/cv/upload-text', {
      text,
    });
    
    return response.data;
  },

  // Get CV by ID
  getCVById: async (cvId: string): Promise<ApiResponse<CVData>> => {
    const response = await apiClient.get<ApiResponse<CVData>>(`/cv/${cvId}`);
    return response.data;
  },

  // Get all CVs for user
  getUserCVs: async (): Promise<ApiResponse<CVData[]>> => {
    const response = await apiClient.get<ApiResponse<CVData[]>>('/cv');
    return response.data;
  },

  // Parse CV
  parseCV: async (cvId: string): Promise<ApiResponse<ParsedCVData>> => {
    const response = await apiClient.post<ApiResponse<ParsedCVData>>(`/cv/${cvId}/parse`);
    return response.data;
  },

  // Optimize CV
  optimizeCV: async (cvId: string): Promise<ApiResponse<OptimizedCVData>> => {
    const response = await apiClient.post<ApiResponse<OptimizedCVData>>(`/cv/${cvId}/optimize`);
    return response.data;
  },

  // Match CV with job
  matchJob: async (cvId: string, jobDescription: string): Promise<ApiResponse<JobMatchResult>> => {
    const response = await apiClient.post<ApiResponse<JobMatchResult>>(`/cv/${cvId}/match`, {
      jobDescription,
    });
    return response.data;
  },

  // Get career insights
  getCareerInsights: async (cvId: string): Promise<ApiResponse<CareerInsight>> => {
    const response = await apiClient.get<ApiResponse<CareerInsight>>(`/cv/${cvId}/insights`);
    return response.data;
  },

  // Download optimized CV
  downloadCV: async (cvId: string): Promise<Blob> => {
    const response = await apiClient.get(`/cv/${cvId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete CV
  deleteCV: async (cvId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/cv/${cvId}`);
    return response.data;
  },
};
