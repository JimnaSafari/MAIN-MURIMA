import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, buildQueryParams } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export interface Property {
  id: number;
  title: string;
  location: string;
  county?: string;
  town?: string;
  price: number | string;
  price_type: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  rental_type?: string;
  image: string;
  images?: string[];
  rating?: number | string | null;
  reviews?: number;
  featured: boolean;
  managed_by?: string;
  landlord_name?: string;
  agency_name?: string;
  created_at: string;
}

export const useProperties = (filters?: {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  county?: string;
  town?: string;
  property_type?: string;
  rental_type?: string;
  bedrooms?: number;
}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const params = buildQueryParams({
        property_type: filters?.property_type || filters?.type,
        location: filters?.location,
        min_price: filters?.minPrice,
        max_price: filters?.maxPrice,
        featured: filters?.featured,
        county: filters?.county,
        town: filters?.town,
        rental_type: filters?.rental_type,
        bedrooms: filters?.bedrooms,
      });

      const data = await apiClient.getProperties(params);
      // Handle paginated response
      if (data && data.results) {
        return data.results as Property[];
      }
      return data as Property[];
    },
  });
};

export const useFeaturedProperties = () => {
  return useProperties({ featured: true });
};

export const useRentalProperties = () => {
  return useProperties({ property_type: "rental" });
};

export const useAirbnbProperties = () => {
  return useProperties({ property_type: "airbnb" });
};

export const useOfficeProperties = () => {
  return useProperties({ property_type: "office" });
};

export const useCreateProperty = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: Omit<Property, 'id' | 'created_at'>) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createProperty(property, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...property }: Partial<Property> & { id: number }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.updateProperty(id, property, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const { tokens } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.deleteProperty(id, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => apiClient.getProperty(id),
    enabled: !!id,
  });
};
