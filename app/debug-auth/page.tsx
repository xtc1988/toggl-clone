'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()
    
    setDebugInfo(prev => ({
      ...prev,
      user,
      session,
      timestamp: new Date().toISOString()
    }))
  }

  const testGoogleAuth = async () => {
    setLoading(true)
    setDebugInfo(prev => ({ ...prev, status: 'Googleログインを開始...' }))
    
    try {
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
      
      setDebugInfo(prev => ({
        ...prev,
        googleAuthResult: { data, error },
        status: error ? 'エラー発生' : 'リダイレクト待機中...'
      }))
    } catch (err) {
      setDebugInfo(prev => ({
        ...prev,
        exception: err instanceof Error ? err.message : String(err),
        status: '例外発生'
      }))
    } finally {
      setLoading(false)
    }
  }

  const checkSupabaseConfig = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setDebugInfo(prev => ({
      ...prev,
      config: {
        supabaseUrl: url ? `${url.substring(0, 30)}...` : 'Not set',
        anonKey: anonKey ? `${anonKey.substring(0, 20)}...` : 'Not set',
        currentUrl: window.location.origin,
        callbackUrl: `${window.location.origin}/auth/callback`
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">認証デバッグページ</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testGoogleAuth}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'テスト中...' : 'Googleログインをテスト'}
          </button>
          
          <button
            onClick={checkAuthStatus}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-4"
          >
            認証状態を更新
          </button>
          
          <button
            onClick={checkSupabaseConfig}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
          >
            設定を確認
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">デバッグ情報</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">チェックリスト</h3>
          <div className="space-y-2 text-sm">
            <div>✓ Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '❌ 未設定'}</div>
            <div>✓ Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '❌ 未設定'}</div>
            <div>✓ 現在のURL: {typeof window !== 'undefined' && window.location.origin}</div>
            <div>✓ コールバックURL: {typeof window !== 'undefined' && `${window.location.origin}/auth/callback`}</div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Supabaseで確認すべき設定</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Authentication → Providers → Google が有効化されている</li>
            <li>Client IDとClient Secretが正しく設定されている</li>
            <li>Site URL: https://dainage2.vercel.app</li>
            <li>Redirect URLs: https://dainage2.vercel.app/**</li>
          </ol>
        </div>
      </div>
    </div>
  )
}