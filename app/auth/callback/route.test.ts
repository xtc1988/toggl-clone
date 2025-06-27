import { GET } from './route'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// モックの設定
jest.mock('@/utils/supabase/server')
jest.mock('next/server')

// fetchのモック
global.fetch = jest.fn()

describe('Auth Callback Route', () => {
  const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
  const mockRedirect = NextResponse.redirect as jest.MockedFunction<typeof NextResponse.redirect>

  beforeEach(() => {
    jest.clearAllMocks()
    // fetchをモック（ログ送信用）
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })
  })

  const createMockRequest = (url: string): Request => {
    return new Request(url)
  }

  describe('Error handling', () => {
    it('should handle OAuth error and redirect to login with error params', async () => {
      const request = createMockRequest(
        'http://localhost:3000/auth/callback?error=access_denied&error_description=User%20denied%20access'
      )

      await GET(request)

      // ログが送信されたことを確認
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth-logs'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('auth_callback_error')
        })
      )

      // リダイレクトを確認
      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/login?error=access_denied&error_description=User%20denied%20access')
        })
      )
    })

    it('should handle missing code and redirect to login', async () => {
      const request = createMockRequest('http://localhost:3000/auth/callback')

      await GET(request)

      // ログが送信されたことを確認
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth-logs'),
        expect.objectContaining({
          body: expect.stringContaining('no_code_received')
        })
      )

      // リダイレクトを確認
      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/login?error=no_code')
        })
      )
    })
  })

  describe('Successful authentication', () => {
    it('should exchange code for session and redirect to dashboard', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        app_metadata: { provider: 'google' }
      }

      const mockSupabase = {
        auth: {
          exchangeCodeForSession: jest.fn().mockResolvedValue({
            data: { user: mockUser, session: { access_token: 'token123' } },
            error: null
          })
        }
      }

      mockCreateClient.mockResolvedValue(mockSupabase as any)

      const request = createMockRequest(
        'http://localhost:3000/auth/callback?code=valid_code_123'
      )

      await GET(request)

      // 複数のログが送信されたことを確認
      const logCalls = (fetch as jest.Mock).mock.calls
      
      // 初期ログ
      expect(logCalls[0][1].body).toContain('auth_callback_received')
      
      // コード交換開始ログ
      expect(logCalls[1][1].body).toContain('code_exchange_started')
      
      // 成功ログ
      expect(logCalls[2][1].body).toContain('auth_success')
      expect(logCalls[2][1].body).toContain('test@example.com')

      // Supabaseの呼び出しを確認
      expect(mockSupabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('valid_code_123')

      // ダッシュボードへのリダイレクトを確認
      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/dashboard')
        })
      )
    })
  })

  describe('Code exchange errors', () => {
    it('should handle exchange error and redirect to login', async () => {
      const mockSupabase = {
        auth: {
          exchangeCodeForSession: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Invalid authorization code' }
          })
        }
      }

      mockCreateClient.mockResolvedValue(mockSupabase as any)

      const request = createMockRequest(
        'http://localhost:3000/auth/callback?code=invalid_code'
      )

      await GET(request)

      // エラーログが送信されたことを確認
      const logCalls = (fetch as jest.Mock).mock.calls
      const errorLogCall = logCalls.find(call => 
        call[1].body.includes('code_exchange_error')
      )
      
      expect(errorLogCall).toBeDefined()
      expect(errorLogCall[1].body).toContain('Invalid authorization code')

      // エラーでリダイレクトを確認
      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/login?error=exchange_failed&error_description=Invalid%20authorization%20code')
        })
      )
    })

    it('should handle unexpected exceptions', async () => {
      const mockSupabase = {
        auth: {
          exchangeCodeForSession: jest.fn().mockRejectedValue(
            new Error('Network error')
          )
        }
      }

      mockCreateClient.mockResolvedValue(mockSupabase as any)

      const request = createMockRequest(
        'http://localhost:3000/auth/callback?code=valid_code'
      )

      await GET(request)

      // 例外ログが送信されたことを確認
      const logCalls = (fetch as jest.Mock).mock.calls
      const exceptionLogCall = logCalls.find(call => 
        call[1].body.includes('callback_exception')
      )
      
      expect(exceptionLogCall).toBeDefined()
      expect(exceptionLogCall[1].body).toContain('Network error')

      // エラーでリダイレクトを確認
      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining('/login?error=callback_failed&error_description=Network%20error')
        })
      )
    })
  })

  describe('Logging functionality', () => {
    it('should log all URL parameters', async () => {
      const request = createMockRequest(
        'http://localhost:3000/auth/callback?code=123&state=abc&extra=param'
      )

      await GET(request)

      // 初期ログにすべてのパラメータが含まれることを確認
      const firstLogCall = (fetch as jest.Mock).mock.calls[0]
      const logBody = JSON.parse(firstLogCall[1].body)
      
      expect(logBody.params).toEqual({
        code: '123',
        state: 'abc',
        extra: 'param'
      })
    })

    it('should handle log API failures gracefully', async () => {
      // ログAPIが失敗してもコールバック処理は続行される
      (fetch as jest.Mock).mockRejectedValue(new Error('Log API error'))

      const request = createMockRequest(
        'http://localhost:3000/auth/callback?error=test_error'
      )

      await GET(request)

      // ログAPIが失敗してもリダイレクトは実行される
      expect(mockRedirect).toHaveBeenCalled()
    })

    it('should include appropriate base URL for logs', async () => {
      // 環境変数をモック
      process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com'

      const request = createMockRequest(
        'http://localhost:3000/auth/callback?code=123'
      )

      await GET(request)

      // 正しいベースURLが使用されることを確認
      expect(fetch).toHaveBeenCalledWith(
        'https://myapp.com/api/auth-logs',
        expect.any(Object)
      )

      // 環境変数をクリア
      delete process.env.NEXT_PUBLIC_SITE_URL
    })
  })
})