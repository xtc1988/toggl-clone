'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { VERSION_INFO } from '@/utils/version'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      console.log('DashboardPage: Checking user authentication...')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      console.log('DashboardPage: User data:', user)
      
      if (!user) {
        console.log('DashboardPage: No user found, redirecting to login')
        redirect('/login')
      }
      
      setUser(user)
      setLoading(false)
      console.log('DashboardPage: User authenticated, loading complete')
    }
    
    checkUser()
  }, [])

  if (loading) {
    console.log('DashboardPage: Rendering loading state')
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    console.log('DashboardPage: No user, rendering redirect')
    redirect('/')
    return null
  }

  console.log('DashboardPage: Rendering dashboard for user:', user.email)
  return <Dashboard />
}