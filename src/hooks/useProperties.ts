import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: string;
  featured: boolean;
  price_type: string;
  landlord_name?: string;
  agency_name?: string;
  managed_by?: string;
  landlord_verified?: boolean;
  agency_verified?: boolean;
  reviews?: number;
}

export const useProperties = (filters?: {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Property[];
    },
  });
};

export const useFeaturedProperties = () => {
  return useProperties({ featured: true });
};

export const useRentalProperties = () => {
  return useProperties({ type: "Rental" });
};

export const useAirbnbProperties = () => {
  return useProperties({ type: "Airbnb" });
};

export const useOfficeProperties = () => {
  return useProperties({ type: "Office" });
};