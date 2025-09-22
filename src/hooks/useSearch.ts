import { useQuery } from "@tanstack/react-query";
import { apiClient, buildQueryParams } from "@/services/api";

export interface SearchFilters {
  location?: string;
  type?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export const useSearchProperties = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ["search_properties", filters],
    queryFn: async () => {
      const params = buildQueryParams({
        location: filters.location,
        type: filters.type,
        min_price: filters.priceMin,
        max_price: filters.priceMax,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
      });

      const data = await apiClient.getProperties(params);

      // Handle paginated response
      if (data && data.results) {
        return data.results;
      }
      return data;
    },
    enabled: Object.keys(filters).length > 0,
  });
};

export const useSearchMarketplace = (query: string, category?: string) => {
  return useQuery({
    queryKey: ["search_marketplace", query, category],
    queryFn: async () => {
      const params = buildQueryParams({
        search: query,
        category: category,
      });

      const data = await apiClient.getMarketplaceItems(params);

      // Handle paginated response
      if (data && data.results) {
        return data.results;
      }
      return data;
    },
    enabled: !!query || !!category,
  });
};