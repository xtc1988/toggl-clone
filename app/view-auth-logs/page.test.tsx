import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ViewAuthLogsPage from './page'

// fetchのモック
global.fetch = jest.fn()

describe('ViewAuthLogsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mockLogs = [
    {
      id: '1',
      timestamp: '2024-01-01T12:00:00.000Z',
      event: 'auth_callback_received',
      url: 'http://localhost:3000/auth/callback?code=123',
      codeReceived: true,
      params: { code: '123' }
    },
    {
      id: '2',
      timestamp: '2024-01-01T12:00:05.000Z',
      event: 'auth_success',
      userEmail: 'test@example.com',
      provider: 'google',
      action: 'redirecting_to_dashboard'
    },
    {
      id: '3',
      timestamp: '2024-01-01T12:00:10.000Z',
      event: 'auth_callback_error',
      error: 'invalid_request',
      errorDescription: 'Missing required parameter',
      action: 'redirecting_to_login'
    }
  ]

  it('should render the page title', () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: [] })
    })

    render(<ViewAuthLogsPage />)
    expect(screen.getByText('認証ログビューア')).toBeInTheDocument()
  })

  it('should fetch and display logs on mount', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: mockLogs })
    })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth-logs')
      expect(screen.getByText('auth_callback_received')).toBeInTheDocument()
      expect(screen.getByText('auth_success')).toBeInTheDocument()
      expect(screen.getByText('auth_callback_error')).toBeInTheDocument()
    })
  })

  it('should display error message when fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to fetch logs' })
    })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch logs')).toBeInTheDocument()
    })
  })

  it('should display network error message', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to connect to server')).toBeInTheDocument()
    })
  })

  it('should handle manual refresh', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ logs: [] })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ logs: mockLogs })
      })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('ログがありません')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('手動更新'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(screen.getByText('auth_success')).toBeInTheDocument()
    })
  })

  it('should toggle auto-refresh', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ logs: [] })
    })

    render(<ViewAuthLogsPage />)

    // 初期状態では自動更新ON
    expect(screen.getByText('自動更新: ON')).toBeInTheDocument()

    // 自動更新をOFFにする
    fireEvent.click(screen.getByText('自動更新: ON'))
    expect(screen.getByText('自動更新: OFF')).toBeInTheDocument()

    // 2秒経過しても追加のfetchが呼ばれないことを確認
    jest.advanceTimersByTime(2000)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1) // 初回のみ
    })
  })

  it('should auto-refresh every 2 seconds when enabled', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ logs: mockLogs })
    })

    render(<ViewAuthLogsPage />)

    // 初回fetch
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    // 2秒経過
    jest.advanceTimersByTime(2000)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    // さらに2秒経過
    jest.advanceTimersByTime(2000)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3)
    })
  })

  it('should clear logs with confirmation', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ logs: mockLogs })
      })
      .mockResolvedValueOnce({
        ok: true,
        method: 'DELETE',
        json: async () => ({ success: true })
      })

    // confirmのモック
    window.confirm = jest.fn(() => true)

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('auth_success')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('ログをクリア'))

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear all logs?')
      expect(fetch).toHaveBeenCalledWith('/api/auth-logs', {
        method: 'DELETE'
      })
    })
  })

  it('should not clear logs when cancelled', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: mockLogs })
    })

    // confirmのモック（キャンセル）
    window.confirm = jest.fn(() => false)

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('auth_success')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('ログをクリア'))

    expect(window.confirm).toHaveBeenCalled()
    // DELETEリクエストが送信されないことを確認
    expect(fetch).toHaveBeenCalledTimes(1) // 初回のGETのみ
  })

  it('should display different colors for different event types', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: mockLogs })
    })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      // 各イベントタイプの要素を取得
      const successLog = screen.getByText('auth_success').closest('div')
      const errorLog = screen.getByText('auth_callback_error').closest('div')
      const receivedLog = screen.getByText('auth_callback_received').closest('div')

      // 適切なカラークラスが適用されていることを確認
      expect(successLog?.className).toContain('bg-green-100')
      expect(errorLog?.className).toContain('bg-red-100')
      expect(receivedLog?.className).toContain('bg-blue-100')
    })
  })

  it('should display expandable details for params and errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: [mockLogs[0]] })
    })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      expect(screen.getByText('パラメータ詳細')).toBeInTheDocument()
    })

    // detailsタグの開閉をテスト
    const details = screen.getByText('パラメータ詳細').closest('details')
    expect(details).toBeInTheDocument()
    
    // パラメータの内容が表示されることを確認
    fireEvent.click(screen.getByText('パラメータ詳細'))
    expect(screen.getByText(/"code": "123"/)).toBeInTheDocument()
  })

  it('should format timestamps in Japanese locale', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ logs: [mockLogs[0]] })
    })

    render(<ViewAuthLogsPage />)

    await waitFor(() => {
      // タイムスタンプが日本語形式で表示されることを確認
      const timestampElement = screen.getByText(/2024\/01\/01/)
      expect(timestampElement).toBeInTheDocument()
    })
  })
})