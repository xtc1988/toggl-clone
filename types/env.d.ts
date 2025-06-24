declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_SITE_URL?: string
    NEXT_PUBLIC_VERCEL_URL?: string
    VERCEL_URL?: string
  }
}