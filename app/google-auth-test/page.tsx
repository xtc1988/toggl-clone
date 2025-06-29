'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function GoogleAuthTestPage() {
  const [config, setConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    // 設定情報を取得
    const checkConfig = async () => {
      try {
        // 環境変数をチェック
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

        setConfig({
          supabaseUrl,
          supabaseKey: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not set',
          siteUrl,
          currentOrigin: window.location.origin,
          redirectUrl: `${window.location.origin}/auth/callback`
        })

        // Supabase接続テスト
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setTestResults(prev => [...prev, `❌ Supabase接続エラー: ${error.message}`])
        } else {
          setTestResults(prev => [...prev, `✅ Supabase接続成功`])
        }

        // Google OAuth設定をテスト
        const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        })

        if (oauthError) {
          setTestResults(prev => [...prev, `❌ Google OAuth設定エラー: ${oauthError.message}`])
          setError(oauthError.message)
        } else {
          setTestResults(prev => [...prev, `✅ Google OAuth設定正常`])
          // 実際にリダイレクトはしない（テスト目的）
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setTestResults(prev => [...prev, `❌ テスト実行エラー: ${err}`])
      }
    }

    checkConfig()
  }, [])

  const testGoogleAuth = async () => {
    setError(null)
    setTestResults(prev => [...prev, '🔄 Google認証テスト開始...'])

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        setError(error.message)
        setTestResults(prev => [...prev, `❌ Google認証エラー: ${error.message}`])
        
        // エラーの詳細分析
        if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid credentials')) {
          setTestResults(prev => [...prev, '💡 Google OAuth設定がSupabaseで正しく設定されていない可能性があります'])
        } else if (error.message.includes('redirect_uri')) {
          setTestResults(prev => [...prev, '💡 リダイレクトURIの設定を確認してください'])
        } else if (error.message.includes('client_id')) {
          setTestResults(prev => [...prev, '💡 Google Client IDの設定を確認してください'])
        }
      } else {
        setTestResults(prev => [...prev, `✅ Google認証リクエスト成功 - URL: ${data.url}`])
        console.log('OAuth成功:', data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラー'
      setError(errorMessage)
      setTestResults(prev => [...prev, `❌ 認証テストエラー: ${errorMessage}`])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Google認証設定テスト</h1>
      
      <div className="space-y-6">
        {/* 設定情報 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">現在の設定</h2>
          {config ? (
            <div className="space-y-2 font-mono text-sm">
              <div><strong>Supabase URL:</strong> {config.supabaseUrl}</div>
              <div><strong>Supabase Key:</strong> {config.supabaseKey}</div>
              <div><strong>Site URL:</strong> {config.siteUrl}</div>
              <div><strong>Current Origin:</strong> {config.currentOrigin}</div>
              <div><strong>Redirect URL:</strong> {config.redirectUrl}</div>
            </div>
          ) : (
            <div>設定を読み込み中...</div>
          )}
        </div>

        {/* テスト結果 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">テスト結果</h2>
          {testResults.length > 0 ? (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm">
                  {result}
                </div>
              ))}
            </div>
          ) : (
            <div>テスト実行中...</div>
          )}
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-2">エラー詳細</h2>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {/* 手動テストボタン */}
        <div className="space-y-4">
          <button
            onClick={testGoogleAuth}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Google認証をテスト
          </button>
          
          <button
            onClick={() => {
              setTestResults([])
              setError(null)
            }}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold ml-4"
          >
            結果をクリア
          </button>
        </div>

        {/* 診断チェックリスト */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">診断チェックリスト</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>1. Google Cloud Console設定</strong>
              <ul className="ml-4 space-y-1">
                <li>• OAuth 2.0クライアントIDが作成されているか</li>
                <li>• 承認済みのJavaScriptオリジンに「https://dainage2.vercel.app」が含まれているか</li>
                <li>• 承認済みのリダイレクトURIに「https://unaxmzlvejyjopeuciyz.supabase.co/auth/v1/callback」が含まれているか</li>
              </ul>
            </div>
            <div>
              <strong>2. Supabase設定</strong>
              <ul className="ml-4 space-y-1">
                <li>• Authentication → Providers → GoogleでClient IDとClient Secretが設定されているか</li>
                <li>• Authentication → URL ConfigurationでSite URLが「https://dainage2.vercel.app」に設定されているか</li>
                <li>• Redirect URLsに「https://dainage2.vercel.app/**」が含まれているか</li>
              </ul>
            </div>
            <div>
              <strong>3. Vercel設定</strong>
              <ul className="ml-4 space-y-1">
                <li>• プロジェクトのProject Protectionが無効化されているか</li>
                <li>• 環境変数が正しく設定されているか</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}