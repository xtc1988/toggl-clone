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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ダッシュボード
        </h2>
        <p className="text-gray-600">
          時間を記録して生産性を向上させましょう
        </p>
      </div>

      {/* Timer Section */}
      <TimerCard />

      {/* Time Entries Section */}
      <TimeEntryList />

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
              v{VERSION_INFO.version}
            </div>
            <div className="text-gray-500">
              {VERSION_INFO.lastUpdated}
            </div>
          </div>
          <div className="text-gray-600 text-sm">
            {VERSION_INFO.description}
          </div>
        </div>
      </div>
    </div>
  )
}