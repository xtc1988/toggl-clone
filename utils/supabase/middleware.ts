import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  
  // During build, environment variables might not be available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/test-env', '/auth-debug', '/debug-auth', '/test-auth', '/test-button', '/view-logs', '/auth-status', '/view-auth-logs', '/env-check', '/google-auth-test', '/api/debug-google-auth']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  
  // Override: If accessing google-auth-test, always allow
  if (request.nextUrl.pathname === '/google-auth-test') {
    console.log('OVERRIDE: Allowing access to /google-auth-test')
    return response
  }
  
  // デバッグログ
  console.log('Middleware - Path:', request.nextUrl.pathname)
  console.log('Middleware - Is Public Path:', isPublicPath)
  console.log('Middleware - Supabase URL:', !!supabaseUrl)
  console.log('Middleware - Supabase Key:', !!supabaseKey)

  const supabase = createServerClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Only check authentication if properly configured and not on public path
  if (supabaseUrl && supabaseKey && !isPublicPath) {
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    
    console.log('Middleware - User check result:', {
      hasUser: !!user,
      userEmail: user?.email,
      userId: user?.id,
      error: getUserError?.message,
      path: request.nextUrl.pathname,
      cookies: request.cookies.getAll().map(c => c.name)
    })
    
    // If no user and trying to access protected route, redirect to login
    if (!user && !isPublicPath) {
      console.log('Middleware - No user found, redirecting to login from:', request.nextUrl.pathname)
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // If user is authenticated and accessing root, redirect to dashboard
    if (user && request.nextUrl.pathname === '/') {
      console.log('Middleware - Authenticated user accessing root, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // If user is authenticated and accessing dashboard, allow
    if (user && request.nextUrl.pathname === '/dashboard') {
      console.log('Middleware - Authenticated user accessing dashboard, allowing')
    }
  }

  return response
}