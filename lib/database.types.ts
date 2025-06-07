export interface Database {
  public: {
    Tables: {
      art_pieces: {
        Row: {
          id: string
          type: "poem" | "story" | "image"
          content: string
          image_url: string | null
          source_email: string
          created_at: string
          approved: boolean
          anonymous: boolean
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          type: "poem" | "story" | "image"
          content: string
          image_url?: string | null
          source_email: string
          created_at?: string
          approved?: boolean
          anonymous?: boolean
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          type?: "poem" | "story" | "image"
          content?: string
          image_url?: string | null
          source_email?: string
          created_at?: string
          approved?: boolean
          anonymous?: boolean
          metadata?: Record<string, any> | null
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          subscribed_at: string
          active: boolean
          preferences: Record<string, any> | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscribed_at?: string
          active?: boolean
          preferences?: Record<string, any> | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscribed_at?: string
          active?: boolean
          preferences?: Record<string, any> | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          password_hash: string
          is_demo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          password_hash: string
          is_demo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password_hash?: string
          is_demo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string
          user_agent: string | null
          ip_address: string | null
          device_fingerprint: string | null
          last_login: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_agent?: string | null
          ip_address?: string | null
          device_fingerprint?: string | null
          last_login?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          user_agent?: string | null
          ip_address?: string | null
          device_fingerprint?: string | null
          last_login?: string
          created_at?: string
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
