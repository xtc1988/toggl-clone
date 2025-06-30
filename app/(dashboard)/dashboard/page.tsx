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
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-[Inter,system-ui,-apple-system,sans-serif]">
      <div className="text-sm text-[#6b7280]">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] font-[Inter,system-ui,-apple-system,sans-serif] text-[#1f2937]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] h-[52px]">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <div className="w-[20px] h-[20px] mr-3 text-[#3b82f6]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <span className="text-[16px] font-[600] text-[#1f2937]">TimeTracker</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-[14px] font-[500] text-[#3b82f6]">Timer</a>
              <a href="#" className="text-[14px] text-[#6b7280] hover:text-[#1f2937]">Reports</a>
              <a href="#" className="text-[14px] text-[#6b7280] hover:text-[#1f2937]">Projects</a>
              <a href="#" className="text-[14px] text-[#6b7280] hover:text-[#1f2937]">Team</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 text-[#6b7280] hover:text-[#1f2937]">
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-5 5v-5z"/>
                <path d="M9 12h12"/>
              </svg>
            </button>
            <div className="w-[24px] h-[24px] bg-[#e5e7eb] rounded-full flex items-center justify-center">
              <span className="text-[11px] font-[500] text-[#6b7280]">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-[12px] text-[#6b7280] hover:text-[#1f2937]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Timer Section */}
        <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-5 mb-6">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
              className="flex-1 text-[14px] border-0 focus:ring-0 bg-transparent placeholder-[#9ca3af] mr-4"
            />
            <div className="flex items-center space-x-4">
              <div className="text-[18px] font-mono font-[500] text-[#1f2937] min-w-[80px] text-right">{time}</div>
              <button
                onClick={handleStartStop}
                className={`px-4 py-2 text-[12px] font-[500] rounded-[6px] transition-colors ${
                  isRunning 
                    ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]' 
                    : 'bg-[#10b981] text-white hover:bg-[#059669]'
                }`}
              >
                {isRunning ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Today Stats */}
            <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-4">
              <h3 className="text-[13px] font-[600] text-[#374151] mb-3">Today</h3>
              <div className="text-[20px] font-[600] text-[#1f2937]">0h 0m</div>
            </div>

            {/* Week/Month Stats */}
            <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-4">
              <h3 className="text-[13px] font-[600] text-[#374151] mb-3">Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#6b7280]">This week</span>
                  <span className="text-[12px] font-mono text-[#1f2937]">0h 0m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#6b7280]">This month</span>
                  <span className="text-[12px] font-mono text-[#1f2937]">0h 0m</span>
                </div>
                <div className="border-t border-[#f3f4f6] pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#6b7280]">Projects</span>
                    <span className="text-[12px] font-mono text-[#1f2937]">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[8px] border border-[#e5e7eb] p-4">
              <h3 className="text-[13px] font-[600] text-[#374151] mb-3">Quick Actions</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-2 py-1.5 text-[12px] text-[#6b7280] hover:text-[#1f2937] hover:bg-[#f9fafb] rounded-[4px]">
                  View Reports
                </button>
                <button className="w-full text-left px-2 py-1.5 text-[12px] text-[#6b7280] hover:text-[#1f2937] hover:bg-[#f9fafb] rounded-[4px]">
                  Export Data
                </button>
                <button className="w-full text-left px-2 py-1.5 text-[12px] text-[#6b7280] hover:text-[#1f2937] hover:bg-[#f9fafb] rounded-[4px]">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Tasks */}
          <div className="col-span-2">
            <div className="bg-white rounded-[8px] border border-[#e5e7eb]">
              <div className="px-5 py-4 border-b border-[#f3f4f6]">
                <h2 className="text-[14px] font-[600] text-[#1f2937]">Recent Tasks</h2>
              </div>
              <div className="p-5">
                <div className="text-center py-8">
                  <div className="w-[32px] h-[32px] mx-auto mb-3 text-[#d1d5db]">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[14px] font-[500] text-[#374151] mb-1">No tasks yet</h3>
                  <p className="text-[12px] text-[#9ca3af] mb-4">Start the timer to begin tracking your work</p>
                  <button 
                    onClick={handleStartStop}
                    className="bg-[#3b82f6] text-white px-3 py-1.5 text-[12px] font-[500] rounded-[6px] hover:bg-[#2563eb]"
                  >
                    Start Timer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Version */}
      <div className="fixed bottom-3 right-3 text-[10px] text-[#9ca3af]">
        v{VERSION_INFO.version}
      </div>
    </div>
  )
}