import { useProfile } from './useProfile';

export const useAdminAccess = () => {
  const { data: profile, isLoading } = useProfile();
  
  return {
    isAdmin: profile?.role === 'admin',
    isModerator: profile?.role === 'moderator',
    isLoading,
    role: profile?.role || 'user',
  };
};