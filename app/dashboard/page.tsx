'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  Calendar, 
  FolderOpen, 
  DollarSign, 
  Play, 
  Pause, 
  TrendingUp, 
  ChevronDown,
  Edit2,
  Trash2,
  MoreHorizontal
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// ダミーデータ
const weeklyData = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 7.2 },
  { day: 'Wed', hours: 9.1 },
  { day: 'Thu', hours: 6.8 },
  { day: 'Fri', hours: 8.0 },
  { day: 'Sat', hours: 4.5 },
  { day: 'Sun', hours: 2.3 }
]

const projectData = [
  { name: 'Website Redesign', hours: 24.5, color: '#6366f1' },
  { name: 'Mobile App', hours: 18.2, color: '#10b981' },
  { name: 'Dashboard', hours: 12.8, color: '#f59e0b' },
  { name: 'API Development', hours: 8.5, color: '#ef4444' }
]

const recentActivities = [
  { id: 1, project: 'Website Redesign', task: 'UI Design Review', startTime: '14:30', duration: '2h 15m', projectColor: '#6366f1' },
  { id: 2, project: 'Mobile App', task: 'Bug Fixes', startTime: '12:00', duration: '1h 45m', projectColor: '#10b981' },
  { id: 3, project: 'Dashboard', task: 'Data Visualization', startTime: '10:15', duration: '3h 30m', projectColor: '#f59e0b' },
  { id: 4, project: 'API Development', task: 'Database Schema', startTime: '09:00', duration: '1h 15m', projectColor: '#ef4444' }
]

const activeProjects = [
  { name: 'Website Redesign', client: 'Tech Corp', thisWeek: '24h 30m', progress: 75, status: 'Active', color: '#6366f1' },
  { name: 'Mobile App', client: 'StartupXYZ', thisWeek: '18h 15m', progress: 60, status: 'Active', color: '#10b981' },
  { name: 'Dashboard', client: 'Enterprise Ltd', thisWeek: '12h 45m', progress: 40, status: 'On Hold', color: '#f59e0b' }
]

export default function Dashboard() {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [description, setDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState('No Project')

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        // タイマーの更新ロジック（実際の実装では状態管理が必要）
        const now = new Date()
        const seconds = now.getSeconds()
        const minutes = now.getMinutes()
        const hours = now.getHours()
        setCurrentTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isTimerRunning])

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Toggle Clone</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-indigo-600 font-medium">Timer</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Reports</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Team</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.894 2.553a1 1 0 00-.894 0l-4.382 2.191A2 2 0 004 6.618v8.764a2 2 0 001.618 1.956l4.382 2.191a1 1 0 00.894 0l4.382-2.191A2 2 0 0016 15.382V6.618a2 2 0 00-1.618-1.956l-4.382-2.191z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* ブレッドクラム */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="text-sm text-gray-600">
          <span>Home</span> <span className="mx-2">/</span> <span className="text-gray-900">Dashboard</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* タイマーセクション */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold mb-2">
                {isTimerRunning ? (
                  <span className="text-red-300">{currentTime}</span>
                ) : (
                  <span>00:00:00</span>
                )}
              </div>
              <div className="text-sm opacity-90">
                Today's total: 7h 32m
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="space-y-3">
                <div className="relative">
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <option value="No Project">No Project</option>
                    <option value="Website Redesign">Website Redesign</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Dashboard">Dashboard</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
            
            <div>
              <button
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all ${
                  isTimerRunning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 今日の時間 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">7h 32m</div>
                <div className="text-sm text-gray-600">Today's total</div>
                <div className="text-xs text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +1h 15m from yesterday
                </div>
              </div>
            </div>
          </div>

          {/* 今週の時間 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">32h 15m</div>
                <div className="text-sm text-gray-600">This week</div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">80% of 40h goal</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクティブプロジェクト */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Active projects</div>
                <div className="text-xs text-gray-500 mt-1">2 due this week</div>
              </div>
            </div>
          </div>

          {/* 今月の収益 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">$3,240</div>
                <div className="text-sm text-gray-600">This month</div>
                <div className="text-xs text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* チャートセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 週次時間チャート */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Tracking This Week</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* プロジェクト別時間配分 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time by Projects</h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="hours"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {projectData.map((project, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{backgroundColor: project.color}}
                    ></div>
                    <span className="text-gray-700">{project.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{project.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{backgroundColor: activity.projectColor}}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{activity.project}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{activity.task}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{activity.startTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
              View all activities
            </button>
          </div>
        </div>

        {/* プロジェクト概要 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="text-lg font-bold text-gray-900">{project.thisWeek}</div>
                  <div className="text-sm text-gray-600">This week</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-gray-900 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}