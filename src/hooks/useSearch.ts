import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      let query = supabase
        .from("properties")
        .select("*");

      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.priceMin) {
        query = query.gte("price", filters.priceMin);
      }

      if (filters.priceMax) {
        query = query.lte("price", filters.priceMax);
      }

      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }

      if (filters.bathrooms) {
        query = query.gte("bathrooms", filters.bathrooms);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: Object.keys(filters).length > 0,
  });
};

export const useSearchMarketplace = (query: string, category?: string) => {
  return useQuery({
    queryKey: ["search_marketplace", query, category],
    queryFn: async () => {
      let dbQuery = supabase
        .from("marketplace_items")
        .select("*");

      if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
      }

      if (category) {
        dbQuery = dbQuery.eq("category", category);
      }

      const { data, error } = await dbQuery.order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!query || !!category,
  });
};