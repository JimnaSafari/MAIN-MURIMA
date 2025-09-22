import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  is_verified: boolean;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");

      // Use Django user data from auth context as the profile
      const profile: Profile = {
        id: user.id.toString(),
        username: user.username || user.email?.split('@')[0] || null,
        full_name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
        avatar_url: null, // Could be extended to support avatars in Django
        phone: null, // Could be extended with user profile fields in Django
        bio: null, // Could be extended with user profile fields in Django
        is_verified: false, // Could be extended with verification status in Django
        role: 'user', // Could be extended based on Django user groups/permissions
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return profile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, tokens } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user || !tokens?.access) throw new Error("User must be authenticated");

      // Call Django API to update user profile
      const profileData = {
        first_name: updates.full_name?.split(' ')[0] || user.first_name,
        last_name: updates.full_name?.split(' ').slice(1).join(' ') || user.last_name,
        username: updates.username || user.username,
      };

      const updatedUser: any = await apiClient.updateUserProfile(profileData, tokens.access);

      // Return the updated profile in our expected format
      const updatedProfile: Profile = {
        id: updatedUser.id?.toString() || user.id.toString(),
        username: updatedUser.username || user.username,
        full_name: updatedUser.first_name && updatedUser.last_name
          ? `${updatedUser.first_name} ${updatedUser.last_name}`
          : null,
        avatar_url: updates.avatar_url || null,
        phone: updates.phone || null,
        bio: updates.bio || null,
        is_verified: false,
        role: 'user',
        created_at: updatedUser.date_joined || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });
};
