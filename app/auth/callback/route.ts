import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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
      const supabase = await createClient()
      console.log('Exchanging code for session...')
      
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
      
      // 成功ログ
      await sendLog({
        event: 'auth_success',
        userEmail: data?.user?.email,
        userId: data?.user?.id,
        provider: data?.user?.app_metadata?.provider,
        sessionCreated: !!data?.session,
        action: 'redirecting_to_dashboard'
      })
      
      return NextResponse.redirect(new URL('/dashboard', request.url))
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

  console.log('No code received, redirecting to login')
  
  // コードなしログ
  await sendLog({
    event: 'no_code_received',
    allParams: Object.fromEntries(requestUrl.searchParams.entries()),
    action: 'redirecting_to_login_with_error'
  })
  
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}