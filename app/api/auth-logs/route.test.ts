import { GET, POST, DELETE } from './route'
import { NextResponse } from 'next/server'

// モックのリクエストを作成するヘルパー関数
function createMockRequest(body?: any): Request {
  return {
    json: async () => body,
  } as Request
}

describe('Auth Logs API', () => {
  // 各テストの前にログをリセット
  beforeEach(async () => {
    await DELETE()
  })

  describe('POST /api/auth-logs', () => {
    it('should save a log entry with timestamp and id', async () => {
      const logData = {
        event: 'auth_callback_received',
        url: 'http://localhost:3000/auth/callback?code=123',
        codeReceived: true
      }

      const request = createMockRequest(logData)
      const response = await POST(request)
      const data = await response.json()

      expect(response).toBeInstanceOf(NextResponse)
      expect(data.success).toBe(true)
      expect(data.logId).toBeDefined()
    })

    it('should handle multiple log entries', async () => {
      // 複数のログエントリを追加
      const logs = [
        { event: 'auth_callback_received', code: '123' },
        { event: 'code_exchange_started', code: '123' },
        { event: 'auth_success', userEmail: 'test@example.com' }
      ]

      for (const log of logs) {
        const request = createMockRequest(log)
        await POST(request)
      }

      // ログを取得
      const getResponse = await GET()
      const data = await getResponse.json()

      expect(data.logs).toHaveLength(3)
      expect(data.totalLogs).toBe(3)
      // 最新のログが最初に表示されることを確認
      expect(data.logs[0].event).toBe('auth_success')
    })

    it('should handle errors gracefully', async () => {
      // 不正なリクエスト（JSONパースエラーを発生させる）
      const request = {
        json: async () => {
          throw new Error('Invalid JSON')
        }
      } as Request

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid JSON')
    })

    it('should limit logs to MAX_LOGS (100)', async () => {
      // 105個のログを追加
      for (let i = 0; i < 105; i++) {
        const request = createMockRequest({
          event: 'test_event',
          index: i
        })
        await POST(request)
      }

      const response = await GET()
      const data = await response.json()

      // 最大100件に制限されていることを確認
      expect(data.logs).toHaveLength(100)
      expect(data.totalLogs).toBe(100)
      // 古いログが削除されていることを確認（最初の5つが削除される）
      expect(data.logs[99].index).toBe(5)
    })
  })

  describe('GET /api/auth-logs', () => {
    it('should return empty array when no logs exist', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response).toBeInstanceOf(NextResponse)
      expect(data.logs).toEqual([])
      expect(data.totalLogs).toBe(0)
    })

    it('should return logs in reverse order (newest first)', async () => {
      // 時系列順にログを追加
      const logs = [
        { event: 'first', timestamp: '2024-01-01' },
        { event: 'second', timestamp: '2024-01-02' },
        { event: 'third', timestamp: '2024-01-03' }
      ]

      for (const log of logs) {
        const request = createMockRequest(log)
        await POST(request)
      }

      const response = await GET()
      const data = await response.json()

      // 最新のログが最初に来ることを確認
      expect(data.logs[0].event).toBe('third')
      expect(data.logs[1].event).toBe('second')
      expect(data.logs[2].event).toBe('first')
    })
  })

  describe('DELETE /api/auth-logs', () => {
    it('should clear all logs', async () => {
      // ログを追加
      const logs = [
        { event: 'test1' },
        { event: 'test2' },
        { event: 'test3' }
      ]

      for (const log of logs) {
        const request = createMockRequest(log)
        await POST(request)
      }

      // ログが存在することを確認
      let response = await GET()
      let data = await response.json()
      expect(data.logs).toHaveLength(3)

      // ログをクリア
      const deleteResponse = await DELETE()
      const deleteData = await deleteResponse.json()
      expect(deleteData.success).toBe(true)
      expect(deleteData.message).toBe('All logs cleared')

      // ログが空になったことを確認
      response = await GET()
      data = await response.json()
      expect(data.logs).toHaveLength(0)
    })
  })

  describe('Log Entry Structure', () => {
    it('should add timestamp and id to log entries', async () => {
      const logData = {
        event: 'auth_callback_received',
        userEmail: 'test@example.com'
      }

      const request = createMockRequest(logData)
      await POST(request)

      const response = await GET()
      const data = await response.json()
      const log = data.logs[0]

      // 必須フィールドの存在を確認
      expect(log.event).toBe('auth_callback_received')
      expect(log.userEmail).toBe('test@example.com')
      expect(log.timestamp).toBeDefined()
      expect(log.id).toBeDefined()

      // タイムスタンプが有効なISO日付形式であることを確認
      const timestamp = new Date(log.timestamp)
      expect(timestamp.toISOString()).toBe(log.timestamp)
    })
  })
})