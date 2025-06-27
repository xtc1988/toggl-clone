'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthDebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ja-JP')
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testGoogleAuth = async () => {
    setLoading(true)
    clearLogs()
    addLog('=== Google認証テスト開始 ===')
    
    try {
      addLog('1. Supabaseクライアントを初期化')
      addLog(`   - URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...`)
      addLog(`   - Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...`)
      
      addLog('2. signInWithOAuthを実行')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        addLog(`❌ エラー発生: ${error.message}`)
        addLog(`   エラー詳細: ${JSON.stringify(error, null, 2)}`)
      } else {
        addLog('✅ OAuth初期化成功')
        addLog(`   - Provider: ${data?.provider}`)
        addLog(`   - URL: ${data?.url}`)
        if (data?.url) {
          addLog('3. Googleにリダイレクトします...')
          addLog('   ※ポップアップブロッカーが有効な場合は手動で許可してください')
        }
      }
    } catch (err) {
      addLog(`❌ 例外エラー: ${err instanceof Error ? err.message : String(err)}`)
      if (err instanceof Error) {
        addLog(`   スタック: ${err.stack}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentSession = async () => {
    addLog('=== 現在のセッション確認 ===')
    
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      addLog(`❌ セッション取得エラー: ${error.message}`)
    } else if (session) {
      addLog('✅ セッションあり')
      addLog(`   - ユーザー: ${session.user.email}`)
      addLog(`   - Provider: ${session.user.app_metadata.provider}`)
    } else {
      addLog('⚠️ セッションなし（未ログイン）')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">認証デバッグツール（画面表示版）</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={testGoogleAuth}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'テスト中...' : 'Google認証をテスト'}
            </button>
            
            <button
              onClick={checkCurrentSession}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              セッション確認
            </button>
            
            <button
              onClick={clearLogs}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              ログクリア
            </button>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-3">実行ログ：</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">ログはまだありません。上のボタンをクリックしてテストを開始してください。</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-3">使い方：</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>「Google認証をテスト」をクリック</li>
            <li>ログに表示される内容を確認</li>
            <li>エラーが出た場合は、エラー内容をコピーして報告</li>
            <li>成功した場合はGoogleの画面に遷移します</li>
          </ol>
          
          <div className="mt-4 p-4 bg-white rounded">
            <p className="font-semibold mb-2">確認すべき設定：</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Supabase: Google認証が有効化されている</li>
              <li>Supabase: Client IDとClient Secretが設定されている</li>
              <li>Supabase: Site URLが https://dainage2.vercel.app</li>
              <li>Google: リダイレクトURIが正しい</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}