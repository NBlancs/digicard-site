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
      scanned_students: {
        Row: {
          id: string
          full_name: string
          school_id: string
          program: string
          digital_card_link: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          school_id: string
          program: string
          digital_card_link: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          school_id?: string
          program?: string
          digital_card_link?: string
          created_at?: string
          updated_at?: string
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
  }
}

export type Student = Database['public']['Tables']['scanned_students']['Row'];
export type StudentInsert = Database['public']['Tables']['scanned_students']['Insert'];
export type StudentUpdate = Database['public']['Tables']['scanned_students']['Update'];
