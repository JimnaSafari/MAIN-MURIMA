import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";

export interface Purchase {
  id: number;
  item: {
    id: number;
    title: string;
    price: number;
    category: string;
    condition: string;
    description?: string;
    location: string;
    image: string;
    created_at: string;
  };
  buyer: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  seller: number;
  purchase_price: number;
  delivery_address?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (purchase: {
      item: number;
      seller: number;
      purchase_price: number;
      buyer_name: string;
      buyer_email: string;
      buyer_phone: string;
      delivery_address?: string;
    }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createPurchase(purchase, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["user_purchases"] });
    },
  });
};

export const useUserPurchases = () => {
  const { tokens } = useAuth();

  return useQuery({
    queryKey: ["user_purchases"],
    queryFn: async () => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      const data = await apiClient.getPurchases(tokens.access);
      // Handle paginated response
      if (data && data.results) {
        return data.results as Purchase[];
      }
      return data as Purchase[];
    },
    enabled: !!tokens?.access,
  });
};
