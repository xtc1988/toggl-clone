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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow border border-gray-200">
      {/* プロジェクト選択 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            disabled={isRunning}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-md hover:border-gray-400 disabled:opacity-50"
          >
            <div className="flex items-center space-x-2">
              {selectedProject && (
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedProject.color }}
                />
              )}
              <span className="text-sm font-medium">
                {selectedProject?.name || 'プロジェクトを選択'}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 ${showProjectDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProjectDropdown && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id)
                    setShowProjectDropdown(false)
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm">{project.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* タイマーセクション */}
      <div className="p-6 text-center">
        {/* 説明入力 */}
        <div className="mb-4">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="作業内容を入力"
            className="w-full p-2 text-center border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* タイマー表示 */}
        <div className="mb-6">
          <div className={`text-4xl font-mono font-bold ${
            isRunning ? 'text-emerald-600' : 'text-gray-900'
          }`}>
            {formatTime(seconds)}
          </div>
        </div>

        {/* コントロールボタン */}
        <div className="flex justify-center space-x-3">
          {isRunning ? (
            <>
              <button
                onClick={handleStartStop}
                disabled={loading}
                className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full"
                aria-label="停止"
              >
                <Pause className="h-5 w-5" />
              </button>
              <button
                onClick={handleStop}
                disabled={loading}
                className="flex items-center justify-center w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full"
                aria-label="完了"
              >
                <Square className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleStartStop}
              disabled={loading || !selectedProjectId}
              className="flex items-center justify-center w-16 h-16 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-full disabled:cursor-not-allowed"
              aria-label="開始"
            >
              <Play className="h-6 w-6 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}