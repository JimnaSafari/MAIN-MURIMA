import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";

export interface Quote {
  id: number;
  service: {
    id: number;
    name: string;
    location: string;
    price_range: string;
    services: string[];
    image: string;
    rating?: number;
    reviews?: number;
    verified: boolean;
    created_at: string;
  };
  user: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  pickup_location: string;
  delivery_location: string;
  moving_date: string;
  inventory?: string;
  quote_amount?: number;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (quote: {
      service: number;
      client_name: string;
      client_email: string;
      client_phone: string;
      pickup_location: string;
      delivery_location: string;
      moving_date: string;
      inventory?: string;
    }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createQuote(quote, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["user_quotes"] });
    },
  });
};

export const useUserQuotes = () => {
  const { tokens } = useAuth();

  return useQuery({
    queryKey: ["user_quotes"],
    queryFn: async () => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      const data = await apiClient.getQuotes(tokens.access);
      // Handle paginated response
      if (data && data.results) {
        return data.results as Quote[];
      }
      return data as Quote[];
    },
    enabled: !!tokens?.access,
  });
};
