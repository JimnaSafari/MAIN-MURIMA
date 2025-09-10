import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Quote {
  id: string;
  service_id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  pickup_location: string;
  delivery_location: string;
  moving_date: string;
  inventory?: string;
  quote_amount?: number;
  status: 'pending' | 'quoted' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // Joined data
  service?: {
    name: string;
    image: string;
    location: string;
    price_range: string;
  };
}

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (quote: {
      service_id: string;
      client_name: string;
      client_email: string;
      client_phone: string;
      pickup_location: string;
      delivery_location: string;
      moving_date: string;
      inventory?: string;
    }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("mover_quotes")
        .insert({
          ...quote,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
};

export const useUserQuotes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_quotes", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("mover_quotes")
        .select(`
          *,
          moving_services(name, image, location, price_range)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Quote[];
    },
    enabled: !!user,
  });
};