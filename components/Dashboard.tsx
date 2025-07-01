'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import TimerCard from './TimerCard'
import TimeEntryList from './TimeEntryList'
import { Clock } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Time Tracker</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
              <button 
                onClick={handleSignOut}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Single Column Layout */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <TimerCard />
          <TimeEntryList />
        </div>
      </div>
    </div>
  )
}