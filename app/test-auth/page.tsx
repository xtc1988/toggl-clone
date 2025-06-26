'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testSignup = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      setResult({
        success: !error,
        data,
        error: error?.message,
        message: error ? 'エラーが発生しました' : 'メールを確認してください（Supabaseの設定によってはメールが届かない場合があります）'
      })
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setResult({
      user,
      message: user ? 'ログイン中' : 'ログインしていません'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">認証テストページ</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">サインアップテスト</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={testSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'テスト中...' : 'サインアップテスト'}
            </button>
            <button
              onClick={checkAuthStatus}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              認証状態を確認
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">結果</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">メールが届かない場合</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Supabaseダッシュボード → Authentication → Users を確認</li>
            <li>ユーザーが作成されていれば、メール認証をスキップして手動で確認可能</li>
            <li>Project Settings → Auth → SMTP Settings でメール設定を確認</li>
          </ol>
        </div>
      </div>
    </div>
  )
}