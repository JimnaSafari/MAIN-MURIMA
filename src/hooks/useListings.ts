import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PropertyListing {
  id?: string;
  title: string;
  location: string;
  price: number;
  price_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: string;
  featured?: boolean;
  landlord_name?: string;
  agency_name?: string;
  managed_by?: string;
  landlord_verified?: boolean;
  agency_verified?: boolean;
  reviews?: number;
  rating?: number;
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (property: PropertyListing) => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("properties")
        .insert({
          ...property,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["user_properties"] });
    },
  });
};

export const useUserProperties = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_properties", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateMarketplaceItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      price: number;
      condition: string;
      location: string;
      image: string;
      category: string;
    }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("marketplace_items")
        .insert({
          ...item,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace_items"] });
      queryClient.invalidateQueries({ queryKey: ["user_marketplace_items"] });
    },
  });
};