import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This Mock client for when Supabase is not configured
const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  }),
}

export function createClient() {
  // If environment variables are not set, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase environment variables not found. Using mock client. ' +
      'To enable Supabase features, please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
    return mockSupabaseClient as any
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
