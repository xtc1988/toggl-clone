import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    // 環境変数の確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 設定済み' : '❌ 未設定',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 設定済み' : '❌ 未設定',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '未設定',
      VERCEL_URL: process.env.VERCEL_URL || '未設定',
      NODE_ENV: process.env.NODE_ENV,
    }

    // Supabase接続テスト
    let supabaseStatus = '未テスト'
    let sessionInfo = null
    let providerInfo = null
    
    try {
      const supabase = await createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        supabaseStatus = `❌ エラー: ${error.message}`
      } else {
        supabaseStatus = '✅ 接続成功'
        sessionInfo = session ? 'セッションあり' : 'セッションなし'
      }

      // Google OAuth設定の確認（テスト的にOAuthURLを生成）
      const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://dainage2.vercel.app/auth/callback',
          skipBrowserRedirect: true // ブラウザリダイレクトをスキップ
        }
      })

      if (oauthError) {
        providerInfo = `❌ Google OAuth エラー: ${oauthError.message}`
      } else if (oauthData?.url) {
        // URLから情報を抽出
        const url = new URL(oauthData.url)
        providerInfo = {
          status: '✅ Google OAuth 設定済み',
          authUrl: url.hostname,
          hasClientId: url.searchParams.has('client_id'),
          redirectUri: url.searchParams.get('redirect_uri')
        }
      }
    } catch (e) {
      supabaseStatus = `❌ 例外: ${e instanceof Error ? e.message : '不明なエラー'}`
    }

    // リダイレクトURL設定の確認
    const redirectUrls = {
      expected: 'https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dainage2.vercel.app',
      callbackPath: '/auth/callback'
    }

    // 診断結果
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      supabase: {
        status: supabaseStatus,
        session: sessionInfo,
        googleOAuth: providerInfo
      },
      redirectUrls,
      recommendations: [] as string[]
    }

    // 推奨事項の追加
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      diagnostics.recommendations.push('Vercelで NEXT_PUBLIC_SUPABASE_URL 環境変数を設定してください')
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      diagnostics.recommendations.push('Vercelで NEXT_PUBLIC_SUPABASE_ANON_KEY 環境変数を設定してください')
    }
    if (providerInfo && typeof providerInfo === 'string' && providerInfo.includes('❌')) {
      diagnostics.recommendations.push('SupabaseダッシュボードでGoogle OAuthプロバイダーを設定してください')
      diagnostics.recommendations.push('Google Cloud ConsoleでOAuth 2.0クライアントIDを作成し、Supabaseに設定してください')
    }

    return NextResponse.json(diagnostics, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug API エラー',
      message: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}