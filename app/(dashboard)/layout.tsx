import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Toggl Clone</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* サイドバーとメインコンテンツ */}
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-1">
            <a
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              ダッシュボード
            </a>
            <a
              href="/timer"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              タイマー
            </a>
            <a
              href="/projects"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              プロジェクト
            </a>
            <a
              href="/reports"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              レポート
            </a>
            <a
              href="/settings"
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              設定
            </a>
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}