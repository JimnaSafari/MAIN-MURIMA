import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, buildQueryParams } from "@/services/api";

export interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  category: string;
  condition: string;
  description?: string;
  location: string;
  image: string;
  created_by: number;
  created_at: string;
}

export const useMarketplaceItems = (filters?: {
  category?: string;
  location?: string;
  condition?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}) => {
  return useQuery({
    queryKey: ["marketplace_items", filters],
    queryFn: async () => {
      const params = buildQueryParams({
        category: filters?.category,
        location: filters?.location,
        condition: filters?.condition,
        search: filters?.search,
        min_price: filters?.min_price,
        max_price: filters?.max_price,
      });

      const data = await apiClient.getMarketplaceItems(params);
      // Handle paginated response
      if (data && data.results) {
        return data.results as MarketplaceItem[];
      }
      return data as MarketplaceItem[];
    },
  });
};

export const useCreateMarketplaceItem = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<MarketplaceItem, 'id' | 'created_by' | 'created_at'>) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createMarketplaceItem(item, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace_items'] });
    },
  });
};
