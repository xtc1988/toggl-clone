'use client'

import { useState } from 'react'
import { Clock, Edit, Trash2, Play, Calendar, Plus } from 'lucide-react'

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

  // モックデータ - 色をTimerCardと統一
  const [timeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      description: 'Website Development',
      duration: 3600,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      project: { id: '1', name: 'Website Development', color: '#059669' }
    },
    {
      id: '2',
      description: 'Team Meeting',
      duration: 1800,
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '14:30',
      project: { id: '4', name: 'Team Meeting', color: '#7c3aed' }
    },
    {
      id: '3',
      description: 'UI Design Review',
      duration: 2700,
      date: new Date().toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '16:45',
      project: { id: '3', name: 'Design Work', color: '#d97706' }
    }
  ])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}:${minutes.toString().padStart(2, '0')}`
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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow border border-gray-200">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-emerald-600" />
            記録一覧
          </h2>
          <button className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md">
            <Plus className="h-4 w-4" />
            <span>追加</span>
          </button>
        </div>

        {/* 日付選択と合計時間 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">合計時間</div>
            <div className="text-lg font-bold font-mono text-gray-900">
              {formatTime(getTotalDuration())}
            </div>
          </div>
        </div>
      </div>

      {/* エントリーリスト */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <div className="text-sm font-medium text-gray-500 mb-1">記録がありません</div>
            <div className="text-xs text-gray-400">時間の記録を開始してください</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="group p-3 bg-gray-50 border border-gray-200 rounded-md hover:shadow-md hover:border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: entry.project?.color || '#6366f1' }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {entry.project?.name || 'Unknown Project'}
                      </div>
                      {entry.description && (
                        <div className="text-xs text-gray-600 mt-1">
                          {entry.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.startTime} - {entry.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-gray-900">
                        {formatTime(entry.duration)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleStartTimer(entry.project.id, entry.description)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Continue"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
  )
}