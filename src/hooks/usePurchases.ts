import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Purchase {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  purchase_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  delivery_address?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  item?: {
    title: string;
    image: string;
    category: string;
  };
}

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (purchase: {
      item_id: string;
      seller_id: string;
      purchase_price: number;
      buyer_name: string;
      buyer_email: string;
      buyer_phone: string;
      delivery_address?: string;
    }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("purchases")
        .insert({
          ...purchase,
          buyer_id: user.id,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["user_purchases"] });
    },
  });
};

export const useUserPurchases = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_purchases", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          marketplace_items(title, image, category)
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    },
    enabled: !!user,
  });
};

export const useUserSales = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user_sales", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User must be authenticated");

      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          marketplace_items(title, image, category)
        `)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    },
    enabled: !!user,
  });
};