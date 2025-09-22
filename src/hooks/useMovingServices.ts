import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, buildQueryParams } from "@/services/api";

export interface MovingService {
  id: number;
  name: string;
  location: string;
  price_range: string;
  services: string[];
  image: string;
  rating?: number;
  reviews?: number;
  verified: boolean;
  created_by?: number;
  created_at: string;
}

export const useMovingServices = (filters?: {
  location?: string;
  verified?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["moving_services", filters],
    queryFn: async () => {
      const params = buildQueryParams({
        location: filters?.location,
        verified: filters?.verified,
        search: filters?.search,
      });

      const data = await apiClient.getMovingServices(params);
      // Handle paginated response
      if (data && data.results) {
        return data.results as MovingService[];
      }
      return data as MovingService[];
    },
  });
};

export const useCreateMovingService = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<MovingService, 'id' | 'created_by' | 'created_at'>) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createMovingService(service, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moving_services'] });
    },
  });
};
