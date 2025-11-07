import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cvService } from '@/services/api/cvService';
import { CVData } from '@/types';

export const useCVUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => cvService.uploadCV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
};

export const useCVTextUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => cvService.uploadCVText(text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
};

export const useCV = (cvId: string) => {
  return useQuery({
    queryKey: ['cv', cvId],
    queryFn: () => cvService.getCVById(cvId),
    enabled: !!cvId,
  });
};

export const useUserCVs = () => {
  return useQuery({
    queryKey: ['cvs'],
    queryFn: () => cvService.getUserCVs(),
  });
};

export const useCVParse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvId: string) => cvService.parseCV(cvId),
    onSuccess: (_data: unknown, cvId: string) => {
      queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
    },
  });
};

export const useCVOptimize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvId: string) => cvService.optimizeCV(cvId),
    onSuccess: (_data: unknown, cvId: string) => {
      queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
    },
  });
};

export const useJobMatch = () => {
  return useMutation({
    mutationFn: ({ cvId, jobDescription }: { cvId: string; jobDescription: string }) =>
      cvService.matchJob(cvId, jobDescription),
  });
};

export const useCareerInsights = (cvId: string) => {
  return useQuery({
    queryKey: ['insights', cvId],
    queryFn: () => cvService.getCareerInsights(cvId),
    enabled: !!cvId,
  });
};

export const useCVDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvId: string) => cvService.deleteCV(cvId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
};
