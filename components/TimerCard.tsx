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
    { id: '1', name: 'Website Development', color: '#3b82f6' },
    { id: '2', name: 'Mobile App', color: '#10b981' },
    { id: '3', name: 'Design Work', color: '#f59e0b' },
    { id: '4', name: 'Team Meeting', color: '#ef4444' },
    { id: '5', name: 'Research', color: '#8b5cf6' }
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
      // Stop and save
      console.log('Stopped:', { 
        projectId: selectedProjectId, 
        description, 
        duration: seconds 
      })
      setDescription('')
      setSeconds(0)
    } else {
      // Start timer
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-6">
        {/* プロジェクト選択ドロップダウン */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            disabled={isRunning}
            className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              {selectedProjectId && (
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: projects.find(p => p.id === selectedProjectId)?.color || '#6b7280' }}
                />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {selectedProjectId ? 
                  projects.find(p => p.id === selectedProjectId)?.name || 'プロジェクトを選択' :
                  'プロジェクトを選択'
                }
              </span>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </button>

          {showProjectDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id)
                    setShowProjectDropdown(false)
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{project.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 説明入力 */}
        <div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="何をしていますか？"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* タイマー表示とコントロール */}
        <div className="flex items-center justify-between">
          <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
            {formatTime(seconds)}
          </div>

          <div className="flex space-x-3">
            {isRunning ? (
              <>
                <button
                  onClick={handleStartStop}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                >
                  <Pause className="h-5 w-5" />
                  <span>停止</span>
                </button>
                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Square className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleStartStop}
                disabled={loading || !selectedProjectId}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>開始</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}