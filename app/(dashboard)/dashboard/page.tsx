import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { VERSION_INFO } from '@/utils/version'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Toggl Track</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <span>{user.email}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
              >
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              <span>タイマー</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span>タイムシート</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
              </svg>
              <span>レポート</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>プロジェクト</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
              </svg>
              <span>チーム</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Timer Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">時間を記録</h1>
            
            {/* Timer Input */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="何に取り組んでいますか？"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
              </div>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>プロジェクトを選択</option>
                <option>ウェブサイト開発</option>
                <option>モバイルアプリ</option>
                <option>マーケティング</option>
              </select>
              <button className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                ▶
              </button>
            </div>

            {/* Current Timer Display */}
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-gray-900 mb-2">00:00:00</div>
                <div className="text-gray-500">停止中</div>
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">最近のエントリー</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  今日
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  今週
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  今月
                </button>
              </div>
            </div>

            {/* Sample Entry */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">ダッシュボードのデザイン改善</div>
                    <div className="text-sm text-gray-500">ウェブサイト開発</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">14:30 - 16:45</div>
                  <div className="font-mono font-medium text-gray-900">02:15:00</div>
                  <button className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 transition-colors">
                    ▶
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">ミーティング準備</div>
                    <div className="text-sm text-gray-500">マーケティング</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">09:00 - 10:30</div>
                  <div className="font-mono font-medium text-gray-900">01:30:00</div>
                  <button className="w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 transition-colors">
                    ▶
                  </button>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <p>今日はまだエントリーがありません</p>
                <p className="text-sm mt-1">上のタイマーで時間の記録を開始しましょう</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0:00</div>
                  <div className="text-sm text-gray-500">今日の作業時間</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0:00</div>
                  <div className="text-sm text-gray-500">今週の作業時間</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">0:00</div>
                  <div className="text-sm text-gray-500">今月の作業時間</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Version Info */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="text-xs text-gray-500 space-y-1">
          <div>v{VERSION_INFO.version}</div>
          <div>{VERSION_INFO.lastUpdated}</div>
        </div>
      </div>
    </div>
  )
}