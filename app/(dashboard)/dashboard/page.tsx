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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f78166]"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-[-apple-system,BlinkMacSystemFont,'Segoe_UI','Noto_Sans',Helvetica,Arial,sans-serif]">
      {/* GitHub Header - Exact Copy */}
      <header className="bg-[#21262d] border-b border-[#30363d] h-[64px]">
        <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 mr-2">
                <svg className="w-8 h-8 text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </div>
              <span className="text-white font-semibold text-[16px] mr-4">TimeTrack</span>
            </div>
            
            <nav className="flex items-center space-x-0">
              <a href="#" className="px-3 py-2 text-[14px] font-medium text-white hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-md transition-colors">Timer</a>
              <a href="#" className="px-3 py-2 text-[14px] font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-md transition-colors">Reports</a>
              <a href="#" className="px-3 py-2 text-[14px] font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-md transition-colors">Projects</a>
              <a href="#" className="px-3 py-2 text-[14px] font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-md transition-colors">Settings</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#30363d] rounded-md transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-[#30363d] rounded-full flex items-center justify-center border border-[#30363d]">
              <span className="text-white text-[12px] font-medium">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-[12px] text-[#7d8590] hover:text-[#f0f6fc] px-2 py-1 hover:bg-[#30363d] rounded transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - GitHub Layout */}
      <main className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Left Column - 3/4 width */}
          <div className="col-span-3">
            {/* Timer Section - GitHub Style Card */}
            <div className="bg-[#21262d] border border-[#30363d] rounded-[6px] p-4 mb-6">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="What are you working on?"
                  className="flex-1 bg-transparent border-0 text-[14px] text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:ring-0 mr-4"
                />
                <div className="flex items-center space-x-3">
                  <div className="text-[20px] font-mono text-[#e6edf3] min-w-[100px] text-right">{time}</div>
                  <button
                    onClick={handleStartStop}
                    className={`px-4 py-2 text-[12px] font-medium rounded-[6px] border transition-colors ${
                      isRunning 
                        ? 'bg-[#da3633] border-[#f85149] text-white hover:bg-[#f85149]' 
                        : 'bg-[#238636] border-[#2ea043] text-white hover:bg-[#2ea043]'
                    }`}
                  >
                    {isRunning ? 'Stop' : 'Start'}
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-[#21262d] border border-[#30363d] rounded-[6px]">
              <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-[#e6edf3]">Recent activity</h2>
                <span className="text-[12px] text-[#7d8590]">Today: 0h 0m</span>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-40">
                    <svg className="w-16 h-16 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#e6edf3] mb-2">No time entries yet</h3>
                  <p className="text-[14px] text-[#7d8590] mb-4 max-w-sm mx-auto">
                    When you start tracking time, your entries will appear here.
                  </p>
                  <button 
                    onClick={handleStartStop}
                    className="bg-[#238636] border border-[#2ea043] text-white px-4 py-2 text-[12px] font-medium rounded-[6px] hover:bg-[#2ea043] transition-colors"
                  >
                    Start tracking time
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 1/4 width */}
          <div className="col-span-1 space-y-6">
            {/* Stats */}
            <div className="bg-[#21262d] border border-[#30363d] rounded-[6px] p-4">
              <h3 className="text-[14px] font-semibold text-[#e6edf3] mb-3">Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#7d8590]">This week</span>
                  <span className="text-[12px] font-mono text-[#e6edf3]">0h 0m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#7d8590]">This month</span>
                  <span className="text-[12px] font-mono text-[#e6edf3]">0h 0m</span>
                </div>
                <div className="border-t border-[#30363d] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#7d8590]">Projects</span>
                    <span className="text-[12px] font-mono text-[#e6edf3]">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-[#21262d] border border-[#30363d] rounded-[6px]">
              <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[#e6edf3]">Projects</h3>
                <button className="text-[12px] text-[#58a6ff] hover:text-[#79c0ff]">New</button>
              </div>
              <div className="p-4">
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 opacity-40">
                    <svg className="w-12 h-12 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-[12px] text-[#7d8590]">No projects yet</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#21262d] border border-[#30363d] rounded-[6px]">
              <div className="px-4 py-3 border-b border-[#30363d]">
                <h3 className="text-[14px] font-semibold text-[#e6edf3]">Quick links</h3>
              </div>
              <div className="p-2">
                <a href="#" className="flex items-center px-2 py-2 text-[12px] text-[#e6edf3] hover:bg-[#30363d] rounded-md transition-colors">
                  <svg className="w-4 h-4 mr-2 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                  View reports
                </a>
                <a href="#" className="flex items-center px-2 py-2 text-[12px] text-[#e6edf3] hover:bg-[#30363d] rounded-md transition-colors">
                  <svg className="w-4 h-4 mr-2 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export data
                </a>
                <a href="#" className="flex items-center px-2 py-2 text-[12px] text-[#e6edf3] hover:bg-[#30363d] rounded-md transition-colors">
                  <svg className="w-4 h-4 mr-2 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Version Info - GitHub Style */}
      <div className="fixed bottom-2 right-2 bg-[#21262d] border border-[#30363d] rounded-[6px] px-2 py-1 text-[10px] text-[#7d8590]">
        v{VERSION_INFO.version}
      </div>
    </div>
  )
}