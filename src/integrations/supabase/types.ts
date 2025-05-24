export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          additional_comments: string | null
          approved_at: string | null
          approved_by_email: string | null
          calendar_url: string | null
          cancelled_at: string | null
          cancelled_by_email: string | null
          created_at: string | null
          created_by_email: string
          created_by_name: string | null
          description: string | null
          end_time: string
          estimated_attendees: number | null
          id: string
          is_public_event: boolean | null
          luma_event_url: string | null
          organizer: string | null
          public_uri: string | null
          room_capacity: string
          room_id: string
          room_name: string
          start_time: string
          status: string | null
          title: string
        }
        Insert: {
          additional_comments?: string | null
          approved_at?: string | null
          approved_by_email?: string | null
          calendar_url?: string | null
          cancelled_at?: string | null
          cancelled_by_email?: string | null
          created_at?: string | null
          created_by_email: string
          created_by_name?: string | null
          description?: string | null
          end_time: string
          estimated_attendees?: number | null
          id?: string
          is_public_event?: boolean | null
          luma_event_url?: string | null
          organizer?: string | null
          public_uri?: string | null
          room_capacity?: string
          room_id: string
          room_name: string
          start_time: string
          status?: string | null
          title: string
        }
        Update: {
          additional_comments?: string | null
          approved_at?: string | null
          approved_by_email?: string | null
          calendar_url?: string | null
          cancelled_at?: string | null
          cancelled_by_email?: string | null
          created_at?: string | null
          created_by_email?: string
          created_by_name?: string | null
          description?: string | null
          end_time?: string
          estimated_attendees?: number | null
          id?: string
          is_public_event?: boolean | null
          luma_event_url?: string | null
          organizer?: string | null
          public_uri?: string | null
          room_capacity?: string
          room_id?: string
          room_name?: string
          start_time?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          booking_id: string
          content: string
          created_at: string
          created_by_email: string
          created_by_name: string | null
          id: string
          status: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string
          created_by_email: string
          created_by_name?: string | null
          id?: string
          status?: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string
          created_by_email?: string
          created_by_name?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string | null
          has_business: boolean | null
          id: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          has_business?: boolean | null
          id: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string | null
          has_business?: boolean | null
          id?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
