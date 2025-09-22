import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";

export interface Booking {
  id: number;
  property: number;
  user: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  booking_date: string;
  check_in_date?: string;
  check_out_date?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { tokens } = useAuth();

  return useMutation({
    mutationFn: async (booking: {
      property: number;
      guest_name: string;
      guest_email: string;
      guest_phone: string;
      booking_date: string;
      check_in_date?: string;
      check_out_date?: string;
    }) => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      return apiClient.createBooking(booking, tokens.access);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["user_bookings"] });
    },
  });
};

export const useUserBookings = () => {
  const { tokens } = useAuth();

  return useQuery({
    queryKey: ["user_bookings"],
    queryFn: async () => {
      if (!tokens?.access) throw new Error("User must be authenticated");
      const data = await apiClient.getBookings(tokens.access);
      // Handle paginated response
      if (data && data.results) {
        return data.results as Booking[];
      }
      return data as Booking[];
    },
    enabled: !!tokens?.access,
  });
};
