'use client'

import { useState, useEffect } from 'react'

interface AuthLog {
  id: string
  timestamp: string
  event: string
  url?: string
  params?: any
  error?: string
  errorDescription?: string
  errorMessage?: string
  errorDetails?: any
  errorStack?: string
  userEmail?: string
  userId?: string
  provider?: string
  sessionCreated?: boolean
  codeReceived?: boolean
  code?: string
  action?: string
  allParams?: any
}

export default function ViewAuthLogsPage() {
  const [logs, setLogs] = useState<AuthLog[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/auth-logs')
      const data = await response.json()
      
      if (response.ok) {
        setLogs(data.logs || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch logs')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return
    
    try {
      const response = await fetch('/api/auth-logs', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setLogs([])
        setError(null)
      }
    } catch (err) {
      setError('Failed to clear logs')
    }
  }

  useEffect(() => {
    fetchLogs()
    
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 2000) // 2秒ごとに更新
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  const getEventColor = (event: string) => {
    switch (event) {
      case 'auth_success':
        return 'bg-green-100 border-green-500 text-green-900'
      case 'auth_callback_error':
      case 'code_exchange_error':
      case 'callback_exception':
        return 'bg-red-100 border-red-500 text-red-900'
      case 'auth_callback_received':
      case 'code_exchange_started':
        return 'bg-blue-100 border-blue-500 text-blue-900'
      case 'no_code_received':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">認証ログビューア</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={fetchLogs}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              手動更新
            </button>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded transition-colors ${
                autoRefresh 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              自動更新: {autoRefresh ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              ログをクリア
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            ログ件数: {logs.length} 件 {autoRefresh && '（2秒ごとに自動更新中）'}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            ログがありません
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getEventColor(log.event)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{log.event}</h3>
                  <span className="text-sm text-gray-600">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  {log.action && (
                    <div>
                      <span className="font-medium">アクション:</span> {log.action}
                    </div>
                  )}
                  
                  {log.url && (
                    <div>
                      <span className="font-medium">URL:</span>
                      <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.url}
                      </code>
                    </div>
                  )}
                  
                  {log.userEmail && (
                    <div>
                      <span className="font-medium">ユーザー:</span> {log.userEmail}
                    </div>
                  )}
                  
                  {log.provider && (
                    <div>
                      <span className="font-medium">プロバイダー:</span> {log.provider}
                    </div>
                  )}
                  
                  {log.error && (
                    <div>
                      <span className="font-medium text-red-600">エラー:</span> {log.error}
                    </div>
                  )}
                  
                  {(log.errorDescription || log.errorMessage) && (
                    <div>
                      <span className="font-medium text-red-600">エラー詳細:</span>{' '}
                      {log.errorDescription || log.errorMessage}
                    </div>
                  )}
                  
                  {log.params && Object.keys(log.params).length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">
                        パラメータ詳細
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.params, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {log.errorDetails && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium text-red-600">
                        エラー詳細情報
                      </summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.errorDetails, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  {log.errorStack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium text-red-600">
                        スタックトレース
                      </summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-x-auto">
                        {log.errorStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}