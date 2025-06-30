'use client'

import { useEffect, useState, useCallback } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { VERSION_INFO } from '@/utils/version'
import { 
  Play, 
  Pause, 
  Clock, 
  Folder, 
  Tag, 
  Calendar,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Download,
  Menu,
  X
} from 'lucide-react'

interface TimeEntry {
  id: string
  description: string
  projectId: string | null
  startTime: Date
  endTime: Date | null
  duration: number
}

interface Project {
  id: string
  name: string
  color: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState('00:00:00')
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [taskName, setTaskName] = useState('')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'No Project', color: '#666666' }
  ])
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [startTime, setStartTime] = useState<Date | null>(null)

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

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries')
    const savedProjects = localStorage.getItem('projects')
    
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries))
    }
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem('timeEntries', JSON.stringify(timeEntries))
    }
  }, [timeEntries])

  useEffect(() => {
    if (projects.length > 1) {
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }, [projects])

  // Timer logic
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        handleStartStop()
      } else if (e.key === 'Escape') {
        setShowProjectDropdown(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning])

  const handleStartStop = useCallback(() => {
    if (isRunning) {
      // Stop timer and save entry
      const entry: TimeEntry = {
        id: Date.now().toString(),
        description: taskName || 'Untitled',
        projectId: selectedProject,
        startTime: startTime!,
        endTime: new Date(),
        duration: seconds
      }
      setTimeEntries([entry, ...timeEntries])
      setTaskName('')
      setSeconds(0)
      setStartTime(null)
    } else {
      // Start timer
      setStartTime(new Date())
    }
    setIsRunning(!isRunning)
  }, [isRunning, taskName, selectedProject, seconds, timeEntries, startTime])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getTodayTotal = () => {
    const today = new Date().toDateString()
    const todayEntries = timeEntries.filter(entry => 
      new Date(entry.startTime).toDateString() === today
    )
    const totalSeconds = todayEntries.reduce((sum, entry) => sum + entry.duration, 0) + (isRunning ? seconds : 0)
    return formatDuration(totalSeconds)
  }

  const getWeekTotal = () => {
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEntries = timeEntries.filter(entry => 
      new Date(entry.startTime) >= weekStart
    )
    const totalSeconds = weekEntries.reduce((sum, entry) => sum + entry.duration, 0) + (isRunning ? seconds : 0)
    return formatDuration(totalSeconds)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-[Inter,system-ui,-apple-system,sans-serif]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EAEAEA] border-t-[#000000]"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-[Inter,system-ui,-apple-system,sans-serif] text-[#000000]">
      {/* Header */}
      <header className="bg-white border-b border-[#EAEAEA] h-16 sticky top-0 z-40">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              className="md:hidden p-2 hover:bg-[#FAFAFA] rounded-lg transition-all duration-150"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#000000]" />
              <span className="text-lg font-semibold">TimeTracker</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-[#000000] hover:opacity-80 transition-all duration-150">Timer</a>
              <a href="#" className="text-sm text-[#666666] hover:text-[#000000] transition-all duration-150">Reports</a>
              <a href="#" className="text-sm text-[#666666] hover:text-[#000000] transition-all duration-150">Insights</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#FAFAFA] rounded-lg transition-all duration-150">
              <Download size={16} className="text-[#666666]" />
            </button>
            <div className="w-8 h-8 bg-[#EAEAEA] rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-sm text-[#666666] hover:text-[#000000] transition-all duration-150"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 bg-white border-r border-[#EAEAEA] transition-all duration-300 overflow-hidden`}>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Folder size={16} />
                  Projects
                </h3>
                <button className="p-1 hover:bg-[#FAFAFA] rounded transition-all duration-150">
                  <Plus size={16} className="text-[#666666]" />
                </button>
              </div>
              <div className="space-y-2">
                {projects.map(project => (
                  <button
                    key={project.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] rounded-lg transition-all duration-150 flex items-center gap-2"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                    {project.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Tag size={16} />
                  Tags
                </h3>
                <button className="p-1 hover:bg-[#FAFAFA] rounded transition-all duration-150">
                  <Plus size={16} className="text-[#666666]" />
                </button>
              </div>
              <p className="text-sm text-[#666666]">No tags yet</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Timer Section */}
          <div className="bg-white border-b border-[#EAEAEA] p-6">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="What are you working on?"
                className="flex-1 text-base border-0 outline-none focus:ring-2 focus:ring-[#0070F3] bg-transparent placeholder-[#666666] px-3 py-2 rounded-lg"
              />
              
              <div className="relative">
                <button
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAFA] rounded-lg transition-all duration-150"
                >
                  <Folder size={16} className="text-[#666666]" />
                  <span className="text-sm">
                    {projects.find(p => p.id === selectedProject)?.name || 'Project'}
                  </span>
                  <ChevronDown size={16} className="text-[#666666]" />
                </button>
                
                {showProjectDropdown && (
                  <div className="absolute top-full mt-2 w-48 bg-white border border-[#EAEAEA] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.12)] py-2 z-50">
                    {projects.map(project => (
                      <button
                        key={project.id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] transition-all duration-150 flex items-center gap-2"
                        onClick={() => {
                          setSelectedProject(project.id)
                          setShowProjectDropdown(false)
                        }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                        {project.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-mono font-medium min-w-[140px] text-right">{time}</div>
                <button
                  onClick={handleStartStop}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 ${
                    isRunning 
                      ? 'bg-[#E00] hover:opacity-80' 
                      : 'bg-[#0070F3] hover:opacity-80'
                  }`}
                >
                  {isRunning ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Time Entries */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Today</h2>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {timeEntries.length === 0 && !isRunning ? (
                <div className="bg-white rounded-xl border border-[#EAEAEA] p-16 text-center">
                  <Clock size={48} className="mx-auto mb-4 text-[#EAEAEA]" />
                  <h3 className="text-lg font-medium mb-2">No time entries yet</h3>
                  <p className="text-sm text-[#666666] mb-4">Start tracking time to see your entries here</p>
                  <button 
                    onClick={handleStartStop}
                    className="px-4 py-2 bg-[#0070F3] text-white text-sm font-medium rounded-lg hover:opacity-80 transition-all duration-150"
                  >
                    Start Timer
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeEntries.map(entry => (
                    <div key={entry.id} className="bg-white rounded-xl border border-[#EAEAEA] p-4 hover:shadow-[0_4px_8px_rgba(0,0,0,0.12)] transition-all duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className="font-medium">{entry.description}</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#666666]" />
                            <span className="text-sm text-[#666666]">
                              {projects.find(p => p.id === entry.projectId)?.name || 'No Project'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-[#666666]">
                            {new Date(entry.startTime).toLocaleTimeString()} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'Running'}
                          </span>
                          <span className="font-mono font-medium">{formatDuration(entry.duration)}</span>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-[#FAFAFA] rounded transition-all duration-150">
                              <Edit2 size={16} className="text-[#666666]" />
                            </button>
                            <button 
                              className="p-1 hover:bg-[#FAFAFA] rounded transition-all duration-150"
                              onClick={() => setTimeEntries(timeEntries.filter(e => e.id !== entry.id))}
                            >
                              <Trash2 size={16} className="text-[#666666]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Stats Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-l border-[#EAEAEA] p-6">
          <h3 className="text-sm font-semibold mb-6">Statistics</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#FAFAFA] rounded-xl">
              <div className="text-sm text-[#666666] mb-1">Today</div>
              <div className="text-2xl font-semibold">{getTodayTotal()}</div>
            </div>
            
            <div className="p-4 bg-[#FAFAFA] rounded-xl">
              <div className="text-sm text-[#666666] mb-1">This Week</div>
              <div className="text-2xl font-semibold">{getWeekTotal()}</div>
            </div>
            
            <div className="p-4 bg-[#FAFAFA] rounded-xl">
              <div className="text-sm text-[#666666] mb-1">Active Projects</div>
              <div className="text-2xl font-semibold">{projects.length - 1}</div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] rounded-lg transition-all duration-150">
                View Reports
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] rounded-lg transition-all duration-150">
                Export to CSV
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAFAFA] rounded-lg transition-all duration-150">
                Settings
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Version */}
      <div className="fixed bottom-4 right-4 text-xs text-[#666666]">
        v{VERSION_INFO.version}
      </div>
    </div>
  )
}