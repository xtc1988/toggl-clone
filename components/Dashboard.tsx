'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TimerCard from './TimerCard'
import TimeEntryList from './TimeEntryList'
import { VERSION_INFO } from '@/utils/version'
import { Clock, LogOut, User } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    
    getUser()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Toggl Track</h1>
                <p className="text-xs text-gray-500">Time Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                  {user?.email}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Track your time, boost your productivity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start timing your work and see where your time goes. Make every minute count.
            </p>
          </div>

          {/* Timer Section */}
          <TimerCard />

          {/* Time Entries Section */}
          <TimeEntryList />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                v{VERSION_INFO.version}
              </div>
              <div className="text-gray-500">
                {VERSION_INFO.lastUpdated}
              </div>
            </div>
            <div className="text-gray-600 text-sm max-w-2xl mx-auto">
              {VERSION_INFO.description}
            </div>
            <div className="text-gray-500 text-xs">
              Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}