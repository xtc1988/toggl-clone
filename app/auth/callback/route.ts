import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  // デバッグ用：すべてのパラメータをコンソールに出力
  console.log('=== Auth Callback Debug ===')
  console.log('URL:', request.url)
  console.log('All params:', Object.fromEntries(requestUrl.searchParams.entries()))
  console.log('Code:', code ? 'received' : 'missing')
  console.log('Error:', error)
  console.log('Error Description:', error_description)

  if (error) {
    console.error('Auth error:', error, error_description)
    // エラー詳細をURLパラメータで渡す
    const errorUrl = new URL('/login', request.url)
    errorUrl.searchParams.set('error', error)
    if (error_description) {
      errorUrl.searchParams.set('error_description', error_description)
    }
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    try {
      const supabase = await createClient()
      console.log('Exchanging code for session...')
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        const errorUrl = new URL('/login', request.url)
        errorUrl.searchParams.set('error', 'exchange_failed')
        errorUrl.searchParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(errorUrl)
      }
      
      console.log('Session created successfully for user:', data?.user?.email)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.error('Callback exception:', error)
      const errorUrl = new URL('/login', request.url)
      errorUrl.searchParams.set('error', 'callback_failed')
      errorUrl.searchParams.set('error_description', error instanceof Error ? error.message : 'Unknown error')
      return NextResponse.redirect(errorUrl)
    }
  }

  console.log('No code received, redirecting to login')
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}