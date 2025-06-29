import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ログをメモリAPIに送信する関数
async function sendLog(logData: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                    'http://localhost:3000'
    
    await fetch(`${baseUrl}/api/auth-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData)
    })
  } catch (error) {
    console.error('Failed to send log:', error)
  }
}

export async function GET(request: Request) {
  try {
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
  
  // 初期ログ：コールバック受信
  await sendLog({
    event: 'auth_callback_received',
    url: request.url,
    params: Object.fromEntries(requestUrl.searchParams.entries()),
    codeReceived: !!code,
    error: error,
    errorDescription: error_description
  })

  if (error) {
    console.error('Auth error:', error, error_description)
    
    // エラーログを送信
    await sendLog({
      event: 'auth_callback_error',
      error: error,
      errorDescription: error_description,
      action: 'redirecting_to_login'
    })
    
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
      console.log('Exchanging code for session...')
      const supabase = await createClient()
      
      // コード交換開始ログ
      await sendLog({
        event: 'code_exchange_started',
        code: code.substring(0, 10) + '...', // セキュリティのため一部のみ
      })
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        
        // コード交換エラーログ
        await sendLog({
          event: 'code_exchange_error',
          error: 'exchange_failed',
          errorMessage: exchangeError.message,
          errorDetails: exchangeError,
          action: 'redirecting_to_login'
        })
        
        const errorUrl = new URL('/login', request.url)
        errorUrl.searchParams.set('error', 'exchange_failed')
        errorUrl.searchParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(errorUrl)
      }
      
      console.log('Session created successfully for user:', data?.user?.email)
      
      // セッション設定後にユーザー情報を再確認
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      console.log('Current user after session exchange:', currentUser?.email)
      
      // 成功ログ
      await sendLog({
        event: 'auth_success',
        userEmail: data?.user?.email,
        userId: data?.user?.id,
        provider: data?.user?.app_metadata?.provider,
        sessionCreated: !!data?.session,
        currentUserAfterExchange: currentUser?.email,
        action: 'redirecting_to_dashboard'
      })
      
      // レスポンスを作成してCookieを確実に設定
      const response = NextResponse.redirect(new URL('/dashboard', request.url))
      
      // セッションが確実に設定されるようにCookieを明示的に設定
      if (data?.session) {
        console.log('Setting session cookies explicitly')
        // アクセストークンとリフレッシュトークンを設定
        response.cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          maxAge: data.session.expires_in,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        
        if (data.session.refresh_token) {
          response.cookies.set('sb-refresh-token', data.session.refresh_token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30日
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
        }
      }
      
      return response
    } catch (error) {
      console.error('Callback exception:', error)
      
      // 例外エラーログ
      await sendLog({
        event: 'callback_exception',
        error: 'callback_failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        action: 'redirecting_to_login'
      })
      
      const errorUrl = new URL('/login', request.url)
      errorUrl.searchParams.set('error', 'callback_failed')
      errorUrl.searchParams.set('error_description', error instanceof Error ? error.message : 'Unknown error')
      return NextResponse.redirect(errorUrl)
    }
  }

  console.log('No code received, checking if user is already authenticated')
  
  // ユーザーが既に認証されているかチェック
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      console.log('User already authenticated, redirecting to dashboard')
      await sendLog({
        event: 'user_already_authenticated',
        userId: user.id,
        userEmail: user.email,
        action: 'redirecting_to_dashboard'
      })
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (e) {
    console.error('Error checking user session:', e)
  }
  
  // コードなしログ
  await sendLog({
    event: 'no_code_received',
    allParams: Object.fromEntries(requestUrl.searchParams.entries()),
    action: 'redirecting_to_login_with_error'
  })
  
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  } catch (error) {
    console.error('Callback route error:', error)
    await sendLog({
      event: 'callback_route_error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}