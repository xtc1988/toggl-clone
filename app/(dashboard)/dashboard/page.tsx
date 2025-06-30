'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { VERSION_INFO } from '@/utils/version'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState('00:00:00')
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [taskName, setTaskName] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

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
    if (isRunning) {
      // Stop timer
      setIsRunning(false)
      // ここで時間エントリーを保存する処理を追加
    } else {
      // Start timer
      if (taskName.trim()) {
        setIsRunning(true)
      }
    }
  }

  if (loading) return <div className="min-h-screen bg-[#2C1338] flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-[#2C1338] text-white">
      {/* Top Bar */}
      <div className="bg-[#44355B] h-12 flex items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-[#E57CD8] font-semibold text-lg">
            Toggl Track
          </Link>
          <nav className="flex items-center space-x-4 text-sm">
            <a href="#" className="text-white hover:text-[#E57CD8] transition-colors">Timer</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Reports</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Insights</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Projects</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Clients</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Team</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Tags</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#E57CD8] rounded-full flex items-center justify-center text-sm font-medium">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-gray-400 hover:text-white text-sm"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="bg-[#FFF3ED] text-gray-900 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What are you working on?"
            className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-500"
          />
          
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
          
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <span className="text-2xl font-mono font-bold">{time}</span>
          
          <button
            onClick={handleStartStop}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-[#E57CD8] hover:bg-[#d66cc7] text-white'
            }`}
          >
            {isRunning ? 'STOP' : 'START'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#412A4C] min-h-screen p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase text-gray-400 mb-3">Analyze</h3>
              <div className="space-y-1">
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Reports</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Insights</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs uppercase text-gray-400 mb-3">Manage</h3>
              <div className="space-y-1">
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Projects</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Clients</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Team</a>
                <a href="#" className="block px-3 py-2 rounded hover:bg-[#564260] transition-colors">Tags</a>
              </div>
            </div>
          </div>
        </div>

        {/* Time Entries */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-[#412A4C] rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl">Today</h2>
                <button className="p-2 hover:bg-[#412A4C] rounded transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-2xl font-bold">00:00:00</div>
              </div>
            </div>

            {/* Time Entry List */}
            <div className="space-y-1">
              {/* Sample Entries */}
              <div className="bg-[#412A4C] rounded-lg p-4 hover:bg-[#4A3456] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg">Sample task entry</div>
                    <span className="text-sm text-gray-400">No project</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">09:00 - 10:30</span>
                    <span className="font-mono">01:30:00</span>
                    <button className="p-2 hover:bg-[#564260] rounded">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Empty State */}
              <div className="text-center py-12 text-gray-500">
                <p>No time entries for this day</p>
                <p className="text-sm mt-2">Start tracking time to see your entries here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="fixed bottom-4 right-4 bg-[#412A4C] rounded-lg shadow-lg p-3">
        <div className="text-xs text-gray-400 space-y-1">
          <div>v{VERSION_INFO.version}</div>
          <div>{VERSION_INFO.lastUpdated}</div>
        </div>
      </div>
    </div>
  )
}