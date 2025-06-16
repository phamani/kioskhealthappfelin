import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and anon key are required. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are set."
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a single supabase client for server components
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase URL and service key are required. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are set."
    )
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}