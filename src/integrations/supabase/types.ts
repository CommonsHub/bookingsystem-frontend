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
          catering_comments: string | null
          catering_options: string[] | null
          created_at: string | null
          created_by_email: string
          created_by_name: string | null
          currency: string | null
          description: string | null
          end_time: string
          estimated_attendees: number | null
          event_support_options: string[] | null
          id: string
          is_public_event: boolean | null
          language: string | null
          luma_event_url: string | null
          membership_status: string | null
          organizer: string | null
          price: number | null
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
          catering_comments?: string | null
          catering_options?: string[] | null
          created_at?: string | null
          created_by_email: string
          created_by_name?: string | null
          currency?: string | null
          description?: string | null
          end_time: string
          estimated_attendees?: number | null
          event_support_options?: string[] | null
          id?: string
          is_public_event?: boolean | null
          language?: string | null
          luma_event_url?: string | null
          membership_status?: string | null
          organizer?: string | null
          price?: number | null
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
          catering_comments?: string | null
          catering_options?: string[] | null
          created_at?: string | null
          created_by_email?: string
          created_by_name?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string
          estimated_attendees?: number | null
          event_support_options?: string[] | null
          id?: string
          is_public_event?: boolean | null
          language?: string | null
          luma_event_url?: string | null
          membership_status?: string | null
          organizer?: string | null
          price?: number | null
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
      request_comments: {
        Row: {
          id: string
          request_id: string
          content: string
          created_at: string
          created_by_email: string
          created_by_name: string | null
          status: string
        }
        Insert: {
          id?: string
          request_id: string
          content: string
          created_at?: string
          created_by_email: string
          created_by_name?: string | null
          status?: string
        }
        Update: {
          id?: string
          request_id?: string
          content?: string
          created_at?: string
          created_by_email?: string
          created_by_name?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_comments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
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
      requests: {
        Row: {
          id: string
          title: string
          description: string
          request_type: string
          priority: string
          status: string
          created_at: string
          created_by_email: string
          created_by_name: string | null
          email: string
          name: string
          phone: string | null
          organization: string | null
          expected_completion_date: string | null
          additional_details: string | null
          attachments: string[] | null
          language: string | null
          completed_at: string | null
          completed_by_email: string | null
          cancelled_at: string | null
          cancelled_by_email: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          request_type: string
          priority: string
          status?: string
          created_at?: string
          created_by_email: string
          created_by_name?: string | null
          email: string
          name: string
          phone?: string | null
          organization?: string | null
          expected_completion_date?: string | null
          additional_details?: string | null
          attachments?: string[] | null
          language?: string | null
          completed_at?: string | null
          completed_by_email?: string | null
          cancelled_at?: string | null
          cancelled_by_email?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          request_type?: string
          priority?: string
          status?: string
          created_at?: string
          created_by_email?: string
          created_by_name?: string | null
          email?: string
          name?: string
          phone?: string | null
          organization?: string | null
          expected_completion_date?: string | null
          additional_details?: string | null
          attachments?: string[] | null
          language?: string | null
          completed_at?: string | null
          completed_by_email?: string | null
          cancelled_at?: string | null
          cancelled_by_email?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          user_id: string
          role: string
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: number
          user_id: string
          role: string
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          role?: string
          created_at?: string
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          role: string
          permission: string
          created_at: string
        }
        Insert: {
          id?: number
          role: string
          permission: string
          created_at?: string
        }
        Update: {
          id?: number
          role?: string
          permission?: string
          created_at?: string
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
