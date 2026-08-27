import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lmmhzqrulehhwgklkahw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbWh6cXJ1bGVoaHdna2xrYWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDA4OTEsImV4cCI6MjEwMjAxNjg5MX0.Q0ys_IkphnCqTr9l0h3_Z4KDlHChWTBF-fIbgagGR48";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
