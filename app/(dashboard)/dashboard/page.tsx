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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header - 高さ50px固定 */}
      <header className="h-[50px] bg-white border-b border-gray-200 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {/* Logo */}
            <div className="font-bold text-xl mr-8">Toggl Track</div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-900 font-medium">Timer</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Reports</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Insights</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Clients</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Team</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Tags</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Settings</a>
            </nav>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Timer Bar - 高さ66px固定 */}
      <div className="h-[66px] bg-white border-b border-gray-200 px-4 flex items-center">
        <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto">
          <div className="flex items-center flex-1">
            {/* Task input */}
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
              className="flex-1 h-[40px] px-3 text-[15px] border-0 outline-none placeholder-gray-400"
            />
            
            {/* Project selector */}
            <button className="h-[40px] px-3 flex items-center space-x-2 hover:bg-gray-50 text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">+ Project</span>
            </button>

            {/* Tag button */}
            <button className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-50 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </button>

            {/* Billable button */}
            <button className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-50 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Timer and controls */}
          <div className="flex items-center space-x-4">
            <span className="text-[24px] font-mono text-gray-800">{time}</span>
            
            <button
              onClick={handleStartStop}
              className={`h-[40px] px-6 rounded font-medium text-sm uppercase tracking-wider transition-all ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-[#E01B22] hover:bg-[#C51920] text-white'
              }`}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>

            <button className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-50 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-50 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex" style={{ height: 'calc(100vh - 116px)' }}>
        {/* Left Sidebar - 幅 220px 固定 */}
        <aside className="w-[220px] bg-[#F6F8FA] border-r border-gray-200 p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Analyze</h3>
              <nav className="space-y-1">
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Reports</a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Insights</a>
              </nav>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manage</h3>
              <nav className="space-y-1">
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Projects</a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Clients</a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Team</a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Tags</a>
                <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded">Help</a>
              </nav>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Workspace</h3>
              <div className="px-3 py-2 text-sm text-gray-700">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Sign out at bottom */}
          <form action="/auth/signout" method="post" className="absolute bottom-4 left-4 right-4">
            <button 
              type="submit"
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded"
            >
              Sign out
            </button>
          </form>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-medium">Today</h2>
                <span className="text-sm text-gray-500">Sun, 30 Jun</span>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Total:</span>
                <span className="text-lg font-medium">00:00:00</span>
              </div>
            </div>

            {/* Time Entries */}
            <div className="space-y-2">
              {/* Empty state */}
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries yet</h3>
                  <p className="text-sm text-gray-500">
                    When you track time it will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Calendar */}
        <aside className="w-[280px] bg-white border-l border-gray-200 p-4">
          <div className="text-sm font-medium mb-4">June 2025</div>
          {/* Calendar would go here */}
          <div className="grid grid-cols-7 gap-1 text-xs text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="py-1 text-gray-500">{day}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={`py-1 ${i === 29 ? 'bg-red-50 text-red-600 font-medium rounded' : 'text-gray-700'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Version Info */}
      <div className="fixed bottom-4 right-4 bg-white rounded shadow-lg p-2 text-xs text-gray-500">
        v{VERSION_INFO.version}
      </div>
    </div>
  )
}