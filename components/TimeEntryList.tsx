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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="h-6 w-6 mr-3 text-emerald-600" />
            Time Entries
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* 日付選択と合計時間 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Time</div>
            <div className="text-2xl font-bold font-mono text-gray-900">
              {formatTime(getTotalDuration())}
            </div>
          </div>
        </div>
      </div>

      {/* エントリーリスト */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-xl font-medium text-gray-500 mb-2">No entries for this date</div>
            <div className="text-gray-400">Start tracking time to see entries here</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="group p-5 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" 
                      style={{ backgroundColor: entry.project?.color || '#6366f1' }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900 mb-1">
                        {entry.project?.name || 'Unknown Project'}
                      </div>
                      {entry.description && (
                        <div className="text-gray-600 mb-2">
                          {entry.description}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {entry.startTime} - {entry.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-gray-900">
                        {formatTime(entry.duration)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleStartTimer(entry.project.id, entry.description)}
                        className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Continue"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
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