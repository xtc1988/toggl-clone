'use client'

import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

interface EnvStatus {
  supabaseUrl: string
  supabaseAnonKey: string
  siteUrl: string
  origin: string
  timestamp: string
}

export default function EnvCheckPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkEnv() {
      try {
        const response = await fetch('/api/env-check')
        const data = await response.json()
        setEnvStatus(data)
      } catch (error) {
        console.error('Failed to check environment:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkEnv()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">環境変数を確認中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">環境変数チェック</h1>
        
        {envStatus && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="pb-4 border-b">
              <p className="text-sm text-gray-500">確認日時</p>
              <p className="font-mono text-sm">{envStatus.timestamp}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Supabase設定</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">NEXT_PUBLIC_SUPABASE_URL:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {envStatus.supabaseUrl || '❌ 未設定'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {envStatus.supabaseAnonKey ? 
                      `✅ 設定済み (${envStatus.supabaseAnonKey.substring(0, 20)}...)` : 
                      '❌ 未設定'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">サイト設定</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">NEXT_PUBLIC_SITE_URL:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {envStatus.siteUrl || '⚠️ 未設定 (自動検出されます)'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">現在のOrigin:</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {envStatus.origin}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h2 className="font-semibold mb-2">Google OAuth コールバックURL</h2>
              <p className="text-sm text-gray-600 mb-2">
                以下のURLがGoogle Cloud ConsoleとSupabaseの両方に設定されている必要があります：
              </p>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-mono text-sm text-blue-800 break-all">
                  {envStatus.origin}/auth/callback
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <a
                href="/login"
                className="inline-block text-blue-600 hover:text-blue-500 underline text-sm"
              >
                ログインページに戻る
              </a>
              <br />
              <a
                href="/view-auth-logs"
                className="inline-block text-blue-600 hover:text-blue-500 underline text-sm"
              >
                認証ログを確認
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}