'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, ChevronDown } from 'lucide-react'

interface Project {
  id: string
  name: string
  color: string
}

export default function TimerCard() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  // モックプロジェクトデータ
  const [projects] = useState<Project[]>([
    { id: '1', name: 'Website Development', color: '#059669' },
    { id: '2', name: 'Mobile App', color: '#dc2626' },
    { id: '3', name: 'Design Work', color: '#d97706' },
    { id: '4', name: 'Team Meeting', color: '#7c3aed' },
    { id: '5', name: 'Research', color: '#2563eb' }
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartStop = () => {
    if (isRunning) {
      console.log('Stopped:', { 
        projectId: selectedProjectId, 
        description, 
        duration: seconds 
      })
      setDescription('')
      setSeconds(0)
    } else {
      console.log('Started:', { 
        projectId: selectedProjectId, 
        description 
      })
    }
    setIsRunning(!isRunning)
  }

  const handleStop = () => {
    if (isRunning) {
      console.log('Stopped:', { 
        projectId: selectedProjectId, 
        description, 
        duration: seconds 
      })
      setIsRunning(false)
      setDescription('')
      setSeconds(0)
    }
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* プロジェクト選択セクション */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            disabled={isRunning}
            className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center space-x-3">
              {selectedProject && (
                <div 
                  className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm" 
                  style={{ backgroundColor: selectedProject.color }}
                />
              )}
              <span className="text-gray-900 font-medium text-lg">
                {selectedProject?.name || 'プロジェクトを選択'}
              </span>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${showProjectDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProjectDropdown && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id)
                    setShowProjectDropdown(false)
                  }}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-gray-900 font-medium">{project.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* メインタイマーセクション */}
      <div className="p-8 text-center">
        {/* 説明入力 */}
        <div className="mb-8">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on?"
            className="w-full p-4 text-center text-xl border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 font-medium"
          />
        </div>

        {/* タイマー表示 */}
        <div className="mb-8">
          <div className={`text-7xl md:text-8xl font-mono font-bold transition-all duration-300 ${
            isRunning ? 'text-emerald-600 animate-pulse' : 'text-gray-900'
          }`}>
            {formatTime(seconds)}
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex justify-center space-x-4">
          {isRunning ? (
            <>
              <button
                onClick={handleStartStop}
                disabled={loading}
                className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                aria-label="停止"
              >
                <Pause className="h-7 w-7" />
              </button>
              <button
                onClick={handleStop}
                disabled={loading}
                className="flex items-center justify-center w-16 h-16 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                aria-label="完了"
              >
                <Square className="h-7 w-7" />
              </button>
            </>
          ) : (
            <button
              onClick={handleStartStop}
              disabled={loading || !selectedProjectId}
              className="flex items-center justify-center w-20 h-20 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-xl hover:shadow-2xl disabled:cursor-not-allowed group"
              aria-label="開始"
            >
              <Play className="h-8 w-8 ml-1 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}