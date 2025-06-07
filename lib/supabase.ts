import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Get environment variables with fallbacks
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ""

// Check if URL is available
if (!supabaseUrl) {
  console.error("Supabase URL is not defined in environment variables")
}

// Server-side Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
      "X-Supabase-Auth-Override" : "service_role"
      },
    },
  }
)

// More secure version with service role key
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    }
  }
)

// Client-side Supabase client
export const createClientComponentClient = () => {
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const clientKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  
  return createClient<Database>(
    clientUrl,
    clientKey,
    {
      auth: {
        persistSession: true,
      },
    }
  )
}

// User types for authentication
export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  is_demo: boolean
  created_at: string
  updated_at: string
}

export interface Device {
  id: string
  user_id: string
  user_agent: string
  ip_address: string
  device_fingerprint: string
  last_login: string
  created_at: string
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("art_pieces").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error) {
    return { success: false, message: `Supabase connection failed: ${error}` }
  }
}