'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { VERSION_INFO } from '@/utils/version'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState('00:00:00')
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [taskName, setTaskName] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        redirect('/login')
      }
      
      setUser(user)
      setLoading(false)
    }
    
    checkUser()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    setTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
  }, [seconds])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header - GitHub/Linear Style */}
      <header className="bg-white border-b border-gray-200 h-14">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span className="font-medium text-gray-900">TimeTrack</span>
            </div>
            <nav className="flex items-center gap-1">
              <a href="#" className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded">Timer</a>
              <a href="#" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded">Reports</a>
              <a href="#" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded">Projects</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Timer Section - Compact */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What are you working on?"
                className="flex-1 text-sm border-0 focus:ring-0 bg-transparent placeholder-gray-400"
              />
              <div className="flex items-center gap-3">
                <div className="text-lg font-mono text-gray-900 min-w-[70px]">{time}</div>
                <button
                  onClick={handleStartStop}
                  className={`px-4 py-2 text-xs font-medium rounded transition-colors ${
                    isRunning 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRunning ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid - GitHub Style */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Today</div>
              <div className="text-xl font-bold text-gray-900">0h 0m</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">This Week</div>
              <div className="text-xl font-bold text-gray-900">0h 0m</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">This Month</div>
              <div className="text-xl font-bold text-gray-900">0h 0m</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Projects</div>
              <div className="text-xl font-bold text-gray-900">0</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Time Entries */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-sm font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No time entries</h3>
                    <p className="text-xs text-gray-500">Start the timer to track your work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Projects */}
              <div className="bg-white rounded-lg border border-gray-200 mb-4">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Projects</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700">+ New</button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-center py-4">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mx-auto mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500">No projects</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-2">
                  <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded">
                    View Reports
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded">
                    Export Data
                  </button>
                  <button className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compact Version Info */}
      <div className="fixed bottom-3 right-3 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-500">
        v{VERSION_INFO.version}
      </div>
    </div>
  )
}