import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

async function logToFile(data: any) {
  try {
    const logDir = join(process.cwd(), 'logs')
    const logFile = join(logDir, 'auth-callback.log')
    
    // ログディレクトリを作成
    await mkdir(logDir, { recursive: true })
    
    // ログデータを整形
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data
    }
    
    // ファイルに書き込み
    await writeFile(
      logFile, 
      JSON.stringify(logEntry, null, 2) + '\n\n',
      { flag: 'a' }
    )
  } catch (error) {
    console.error('Failed to write log:', error)
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  
  // すべてのパラメータをログ
  const allParams = Object.fromEntries(requestUrl.searchParams.entries())
  
  await logToFile({
    event: 'auth_callback_received',
    url: request.url,
    params: allParams,
    headers: Object.fromEntries(request.headers.entries()),
    code: code ? 'received' : 'missing',
    error,
    error_description
  })

  if (error) {
    console.error('Auth error:', error, error_description)
    await logToFile({
      event: 'auth_error',
      error,
      error_description
    })
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }

  if (code) {
    try {
      const supabase = await createClient()
      console.log('Exchanging code for session...')
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      await logToFile({
        event: 'code_exchange',
        success: !exchangeError,
        error: exchangeError?.message,
        user: data?.user?.email
      })
      
      if (exchangeError) {
        console.error('Exchange error:', exchangeError)
        return NextResponse.redirect(new URL(`/login?error=exchange_failed`, request.url))
      }
      
      console.log('Session created successfully')
    } catch (error) {
      console.error('Callback error:', error)
      await logToFile({
        event: 'callback_exception',
        error: error instanceof Error ? error.message : String(error)
      })
      return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
    }
  } else {
    await logToFile({
      event: 'no_code_received',
      params: allParams
    })
  }

  // URL to redirect to after sign in process completes
  console.log('Redirecting to dashboard...')
  return NextResponse.redirect(new URL('/dashboard', request.url))
}