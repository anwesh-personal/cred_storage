export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          url: string
          price: number
          purchase_date: string
          category: string
          description: string
          features: Json
          user_id: string
          ai_analysis: Json | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          url: string
          price: number
          purchase_date: string
          category: string
          description: string
          features?: Json
          user_id: string
          ai_analysis?: Json | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          url?: string
          price?: number
          purchase_date?: string
          category?: string
          description?: string
          features?: Json
          user_id?: string
          ai_analysis?: Json | null
          tags?: string[] | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          budget: number | null
          goals: string[] | null
          preferences: Json | null
          ai_insights: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          budget?: number | null
          goals?: string[] | null
          preferences?: Json | null
          ai_insights?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          budget?: number | null
          goals?: string[] | null
          preferences?: Json | null
          ai_insights?: Json | null
        }
      }
      ai_recommendations: {
        Row: {
          id: string
          created_at: string
          user_id: string
          product_id: string | null
          recommendation_type: string
          content: Json
          is_read: boolean
          relevance_score: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          product_id?: string | null
          recommendation_type: string
          content: Json
          is_read?: boolean
          relevance_score?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          product_id?: string | null
          recommendation_type?: string
          content?: Json
          is_read?: boolean
          relevance_score?: number | null
        }
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
