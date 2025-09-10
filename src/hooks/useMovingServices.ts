import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MovingService {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
  price_range: string;
  verified: boolean;
  image: string;
  created_at: string;
  updated_at: string;
}

export const useMovingServices = (filters?: {
  location?: string;
  verified?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["moving_services", filters],
    queryFn: async () => {
      let query = supabase
        .from("moving_services")
        .select("*")
        .order("rating", { ascending: false });

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.verified !== undefined) {
        query = query.eq("verified", filters.verified);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MovingService[];
    },
  });
};