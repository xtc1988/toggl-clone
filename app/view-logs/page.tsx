'use client'

import { useState, useEffect } from 'react'

export default function ViewLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/logs')
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        setLogs([])
      } else {
        setLogs(data.logs || [])
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // 5秒ごとに自動更新
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">認証ログビューア</h1>
          <button
            onClick={fetchLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            更新
          </button>
        </div>

        {loading && <div className="text-gray-600">ログを読み込み中...</div>}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-gray-600 mt-2">
              まだログがない場合は、Googleログインを試してみてください。
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              最新のログが上に表示されます（5秒ごとに自動更新）
            </p>
            {logs.reverse().map((log, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="mb-2">
                  <span className="font-semibold text-blue-600">{log.event}</span>
                  <span className="text-gray-500 text-sm ml-4">
                    {new Date(log.timestamp).toLocaleString('ja-JP')}
                  </span>
                </div>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="font-semibold mb-2">ログの見方</h2>
          <ul className="space-y-1 text-sm">
            <li>• <strong>auth_callback_received</strong>: コールバックURLにアクセスした</li>
            <li>• <strong>auth_error</strong>: 認証エラーが発生</li>
            <li>• <strong>code_exchange</strong>: 認証コードをセッションに交換</li>
            <li>• <strong>callback_exception</strong>: 例外エラーが発生</li>
            <li>• <strong>no_code_received</strong>: 認証コードが受信されなかった</li>
          </ul>
        </div>
      </div>
    </div>
  )
}