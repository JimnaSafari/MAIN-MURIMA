import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: string;
  location: string;
  image: string;
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useMarketplaceItems = (filters?: {
  category?: string;
  location?: string;
  condition?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["marketplace_items", filters],
    queryFn: async () => {
      let query = supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.condition) {
        query = query.eq("condition", filters.condition);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MarketplaceItem[];
    },
  });
};