import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // During build, environment variables might not be available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Return a dummy URL if not configured (will fail at runtime if not properly configured)
  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
  )
}