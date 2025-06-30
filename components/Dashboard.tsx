'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TimerCard from './TimerCard'
import TimeEntryList from './TimeEntryList'
import { AlertCircle, BarChart3, Calendar, Clock, Settings, Users } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [todayTotal, setTodayTotal] = useState('0h 0m')
  const [weekTotal, setWeekTotal] = useState('0h 0m')
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Log user access
      if (user) {
        console.log('Dashboard: User accessed dashboard:', user.email)
        // You can add more detailed logging here
      }
    }
    
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">TimeTracker</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Calendar className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <BarChart3 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Users className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Settings className="h-5 w-5" />
              </button>
              
              {/* Debug Button */}
              <button 
                onClick={() => setShowLogs(!showLogs)}
                className="p-2 text-gray-400 hover:text-red-500"
                title="システムログ"
              >
                <AlertCircle className="h-5 w-5" />
              </button>
              
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            <TimerCard />
            <TimeEntryList />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* 今日の集計 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">今日</h3>
              <div className="text-3xl font-bold text-blue-600">{todayTotal}</div>
            </div>

            {/* 今週の集計 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">今週</h3>
              <div className="text-3xl font-bold text-green-600">{weekTotal}</div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">クイックアクション</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  📊 レポート表示
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  📁 プロジェクト管理
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  ⚙️ 設定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug/Log Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">システムログ</h3>
              <button 
                onClick={() => setShowLogs(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>ダッシュボード表示中...</p>
              <p>ユーザー: {user?.email}</p>
              <p>今日の合計: {todayTotal}</p>
              <p>今週の合計: {weekTotal}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}