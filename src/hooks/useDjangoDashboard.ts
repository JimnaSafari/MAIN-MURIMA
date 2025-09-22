import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/services/api';

export const useDjangoDashboard = () => {
  const { user, tokens } = useAuth();

  return useQuery({
    queryKey: ['django-dashboard', user?.id],
    queryFn: async () => {
      if (!user || !tokens?.access) {
        throw new Error('User not authenticated');
      }
      return apiClient.getUserDashboard(tokens.access);
    },
    enabled: !!user && !!tokens?.access,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDjangoAdminDashboard = () => {
  const { user, tokens } = useAuth();

  return useQuery({
    queryKey: ['django-admin-dashboard', user?.id],
    queryFn: async () => {
      if (!user || !tokens?.access) {
        throw new Error('User not authenticated');
      }
      return apiClient.getAdminDashboard(tokens.access);
    },
    enabled: !!user && !!tokens?.access,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Helper function to get Django-compatible token
export const getDjangoToken = () => {
  const storedTokens = localStorage.getItem('django_tokens');
  if (storedTokens) {
    try {
      const tokens = JSON.parse(storedTokens);
      return tokens.access;
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      return null;
    }
  }
  return null;
};

// Function to validate Django authentication
export const validateDjangoAuth = async () => {
  try {
    const token = getDjangoToken();
    if (!token) return false;

    await apiClient.getCurrentUser(token);
    return true;
  } catch (error) {
    console.error('Failed to validate Django auth:', error);
    return false;
  }
};
