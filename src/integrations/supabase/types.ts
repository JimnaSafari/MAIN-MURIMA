export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          property_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          property_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          property_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bookings_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_items: {
        Row: {
          category: string
          condition: string
          created_at: string | null
          created_by: string | null
          id: string
          image: string
          location: string
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          condition: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image: string
          location: string
          price: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image?: string
          location?: string
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mover_quotes: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          delivery_location: string
          id: string
          inventory: string | null
          moving_date: string
          pickup_location: string
          quote_amount: number | null
          service_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          delivery_location: string
          id?: string
          inventory?: string | null
          moving_date: string
          pickup_location: string
          quote_amount?: number | null
          service_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          delivery_location?: string
          id?: string
          inventory?: string | null
          moving_date?: string
          pickup_location?: string
          quote_amount?: number | null
          service_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotes_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "moving_services"
            referencedColumns: ["id"]
          },
        ]
      }
      moving_services: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          image: string
          location: string
          name: string
          price_range: string
          rating: number | null
          reviews: number | null
          services: Json
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image: string
          location: string
          name: string
          price_range: string
          rating?: number | null
          reviews?: number | null
          services?: Json
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image?: string
          location?: string
          name?: string
          price_range?: string
          rating?: number | null
          reviews?: number | null
          services?: Json
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          agency_name: string | null
          agency_verified: boolean | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          created_by: string | null
          featured: boolean | null
          id: string
          image: string
          images: Json | null
          landlord_name: string | null
          landlord_verified: boolean | null
          location: string
          managed_by: string | null
          price: number
          price_type: string
          rating: number | null
          reviews: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          agency_name?: string | null
          agency_verified?: boolean | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          created_by?: string | null
          featured?: boolean | null
          id?: string
          image: string
          images?: Json | null
          landlord_name?: string | null
          landlord_verified?: boolean | null
          location: string
          managed_by?: string | null
          price: number
          price_type: string
          rating?: number | null
          reviews?: number | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          agency_name?: string | null
          agency_verified?: boolean | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          created_by?: string | null
          featured?: boolean | null
          id?: string
          image?: string
          images?: Json | null
          landlord_name?: string | null
          landlord_verified?: boolean | null
          location?: string
          managed_by?: string | null
          price?: number
          price_type?: string
          rating?: number | null
          reviews?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          buyer_email: string
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at: string
          delivery_address: string | null
          id: string
          item_id: string
          purchase_price: number
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          buyer_email: string
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at?: string
          delivery_address?: string | null
          id?: string
          item_id: string
          purchase_price: number
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          buyer_email?: string
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          delivery_address?: string | null
          id?: string
          item_id?: string
          purchase_price?: number
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_purchases_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "marketplace_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
