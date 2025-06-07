// Environment variable validation and configuration
export const env = {
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,


  // Postmark
  POSTMARK_SERVER_TOKEN: process.env.POSTMARK_SERVER_TOKEN!,
  POSTMARK_FROM_EMAIL: process.env.POSTMARK_FROM_EMAIL!,

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN!,

  //gemini 
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
}
 



// Validate required environment variables
export function validateEnv() {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "POSTMARK_SERVER_TOKEN",
    "POSTMARK_FROM_EMAIL",
    "BLOB_READ_WRITE_TOKEN",
    "GEMINI_API_KEY"
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Only validate in server-side contexts
if (typeof window === "undefined") {
  try {
    validateEnv()
  } catch (error) {
    console.error("Environment validation failed:", error)
    // Don't throw in development to allow for gradual setup
    if (process.env.NODE_ENV === "production") {
      throw error
    }
  }
}
