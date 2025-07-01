'use client'

import { useState } from 'react'
import { Clock, Edit, Trash2, Play, Calendar } from 'lucide-react'

interface Project {
  id: string
  name: string
  color: string
}

interface TimeEntry {
  id: string
  description: string
  duration: number
  date: string
  startTime: string
  endTime: string
  project: Project
}

export default function TimeEntryList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading] = useState(false)

  // モックデータ
  const [timeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      description: 'Website Development',
      duration: 3600,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      project: { id: '1', name: 'Website Development', color: '#3b82f6' }
    },
    {
      id: '2',
      description: 'Team Meeting',
      duration: 1800,
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '14:30',
      project: { id: '4', name: 'Team Meeting', color: '#ef4444' }
    },
    {
      id: '3',
      description: 'UI Design Review',
      duration: 2700,
      date: new Date().toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '16:45',
      project: { id: '3', name: 'Design Work', color: '#f59e0b' }
    }
  ])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  const formatDateTime = (time: string): string => {
    return time
  }

  const getTotalDuration = () => {
    return timeEntries
      .filter(entry => entry.date === selectedDate)
      .reduce((sum, entry) => sum + entry.duration, 0)
  }

  const handleStartTimer = (projectId: string, description: string) => {
    console.log('Starting timer:', { projectId, description })
  }

  const handleEditEntry = (entry: TimeEntry) => {
    console.log('Editing entry:', entry)
  }

  const handleDeleteEntry = (entryId: string) => {
    console.log('Deleting entry:', entryId)
  }

  const filteredEntries = timeEntries.filter(entry => entry.date === selectedDate)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* ヘッダー */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            時間エントリー
          </h2>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            手動追加
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            合計: <span className="font-semibold font-mono">{formatTime(getTotalDuration())}</span>
          </div>
        </div>
      </div>

      {/* エントリーリスト */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            この日には時間エントリーがありません
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: entry.project?.color || '#6366f1' }}
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.project?.name || '不明なプロジェクト'}
                    </div>
                    {entry.description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDateTime(entry.startTime)} - {formatDateTime(entry.endTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="font-mono font-semibold text-gray-900 dark:text-white">
                    {formatTime(entry.duration)}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleStartTimer(entry.project.id, entry.description)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="続行"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="編集"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}