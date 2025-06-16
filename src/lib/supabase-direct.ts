import { createClient } from "@supabase/supabase-js"

// This is a direct client that uses hardcoded values
// Only for demonstration purposes in v0
export const createDirectClient = () => {
  // Hardcoded values from the provided credentials
  const supabaseUrl = "https://mkaxvldoxazsowvhzqkn.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYXh2bGRveGF6c293dmh6cWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjg4NjYsImV4cCI6MjA1OTk0NDg2Nn0.Z7Ru9tfU5L6FQ68BBQIj0v-i7IjzXQ7q0TOUbtWSajs"

  return createClient(supabaseUrl, supabaseAnonKey)
}
