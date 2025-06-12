import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Appointment {
  id: number
  first_name: string
  last_name: string
  email: string
  title: string
  description?: string
  appointment_date: string
  appointment_time: string
  created_at: string
}
