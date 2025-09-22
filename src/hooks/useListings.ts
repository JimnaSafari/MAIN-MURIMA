import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const DJANGO_API_BASE = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

export interface PropertyListing {
  title: string;
  location: string;
  county?: string;
  town?: string;
  price: number;
  price_type: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  rental_type?: string;
  image: string;
  images?: string[];
  managed_by?: string;
  landlord_name?: string;
  agency_name?: string;
  featured?: boolean;
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (property: PropertyListing) => {
      if (!tokens?.access) throw new Error("User must be authenticated");

      const response = await fetch(`${DJANGO_API_BASE}/properties/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create property: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUserProperties = () => {
  const { tokens } = useAuth();

  return useQuery({
    queryKey: ["user_properties"],
    queryFn: async () => {
      if (!tokens?.access) throw new Error("User must be authenticated");

      const response = await fetch(`${DJANGO_API_BASE}/properties/?created_by_user=true`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user properties: ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    enabled: !!tokens?.access,
  });
};

export const useCreateMarketplaceItem = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (item: {
      title: string;
      price: number;
      category: string;
      condition: string;
      description?: string;
      location: string;
      image: string;
    }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");

      const response = await fetch(`${DJANGO_API_BASE}/marketplace/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create marketplace item: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace_items"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PropertyListing> }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");

      const response = await fetch(`${DJANGO_API_BASE}/properties/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to update property: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["user_properties"] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!tokens?.access) throw new Error("User must be authenticated");

      const response = await fetch(`${DJANGO_API_BASE}/properties/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to delete property: ${response.status}`);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["user_properties"] });
    },
  });
};
