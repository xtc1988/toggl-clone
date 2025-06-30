'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Play, Pause, Square, ChevronDown, Folder } from 'lucide-react'

interface Project {
  id: string
  name: string
  color: string
}

export default function TimerCard() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [description, setDescription] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'プロジェクトなし', color: '#6B7280' },
    { id: '2', name: 'ウェブ開発', color: '#3B82F6' },
    { id: '3', name: 'デザイン', color: '#10B981' },
    { id: '4', name: 'ミーティング', color: '#F59E0B' },
  ])
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

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
      // Stop timer and save entry
      console.log('Timer stopped:', {
        description: description || 'タスク名なし',
        project: selectedProject?.name || 'プロジェクトなし',
        duration: seconds,
        user: user?.email
      })
      
      // Reset for next entry
      setDescription('')
      setSeconds(0)
    } else {
      // Start timer
      console.log('Timer started:', {
        description: description || 'タスク名なし',
        project: selectedProject?.name || 'プロジェクトなし',
        user: user?.email
      })
    }
    
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
    setDescription('')
    console.log('Timer reset')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white mb-2">
          {formatTime(seconds)}
        </div>
        {isRunning && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            実行中...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleStartStop}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium transition-all ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        
        <button
          onClick={handleReset}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white transition-all"
        >
          <Square className="h-6 w-6" />
        </button>
      </div>

      {/* Task Input */}
      <div className="space-y-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="何に取り組んでいますか？"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          disabled={isRunning}
        />

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            disabled={isRunning}
          >
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">
                {selectedProject?.name || 'プロジェクトを選択'}
              </span>
              {selectedProject && (
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedProject.color }}
                />
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showProjectDropdown && (
            <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project)
                    setShowProjectDropdown(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-gray-900 dark:text-white">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Running Project Info */}
      {isRunning && selectedProject && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
            <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              {selectedProject.name}で作業中
            </span>
          </div>
          {description && (
            <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}