'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

interface DebugInfo {
  isLoading: boolean
  isAuthenticated: boolean
  user: any
  session: any
  error: string | null
  timestamp: string
}

export default function AuthStatusPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    session: null,
    error: null,
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        setDebugInfo({
          isLoading: false,
          isAuthenticated: !!session,
          user: session?.user || null,
          session: session ? {
            access_token: session.access_token ? '***' + session.access_token.slice(-10) : null,
            refresh_token: session.refresh_token ? '***' + session.refresh_token.slice(-10) : null,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type
          } : null,
          error: error?.message || null,
          timestamp: new Date().toISOString()
        })
      } catch (err) {
        setDebugInfo(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }))
      }
    }

    checkAuth()
    
    // 3秒ごとに再チェック
    const interval = setInterval(checkAuth, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">認証状態デバッグ</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">現在の状態</h2>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${debugInfo.isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                {debugInfo.isLoading ? '確認中...' : debugInfo.isAuthenticated ? '認証済み' : '未認証'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              最終確認: {debugInfo.timestamp}
            </div>
          </div>
        </div>

        {debugInfo.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-red-900 mb-2">エラー</h3>
            <p className="text-red-700">{debugInfo.error}</p>
          </div>
        )}

        {debugInfo.user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span> {debugInfo.user.email}
              </div>
              <div>
                <span className="font-medium">ID:</span> {debugInfo.user.id}
              </div>
              <div>
                <span className="font-medium">Provider:</span> {debugInfo.user.app_metadata?.provider || 'N/A'}
              </div>
              <div>
                <span className="font-medium">作成日時:</span> {debugInfo.user.created_at}
              </div>
            </div>
          </div>
        )}

        {debugInfo.session && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">セッション情報</h2>
            <div className="space-y-2 text-sm font-mono">
              <div>access_token: {debugInfo.session.access_token}</div>
              <div>refresh_token: {debugInfo.session.refresh_token}</div>
              <div>expires_at: {debugInfo.session.expires_at}</div>
              <div>token_type: {debugInfo.session.token_type}</div>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            このページは3秒ごとに自動更新されます。Google認証後にこのページを開いて認証状態を確認してください。
          </p>
        </div>
      </div>
    </div>
  )
}