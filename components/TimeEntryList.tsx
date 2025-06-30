'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Calendar, Edit, Trash2, Play, Clock } from 'lucide-react'

interface TimeEntry {
  id: string
  description: string
  project: {
    id: string
    name: string
    color: string
  }
  startTime: Date
  endTime: Date
  duration: number
}

export default function TimeEntryList() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      description: 'ウェブサイトのデザイン作成',
      project: {
        id: '2',
        name: 'ウェブ開発',
        color: '#3B82F6'
      },
      startTime: new Date(2024, 0, 1, 9, 0),
      endTime: new Date(2024, 0, 1, 11, 30),
      duration: 9000 // 2.5 hours in seconds
    },
    {
      id: '2',
      description: 'クライアントミーティング',
      project: {
        id: '4',
        name: 'ミーティング',
        color: '#F59E0B'
      },
      startTime: new Date(2024, 0, 1, 13, 0),
      endTime: new Date(2024, 0, 1, 14, 0),
      duration: 3600 // 1 hour in seconds
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getTotalDuration = () => {
    const total = timeEntries.reduce((sum, entry) => sum + entry.duration, 0)
    return formatTime(total)
  }

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry)
    setShowEditModal(true)
  }

  const handleDelete = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId))
    console.log('Deleted entry:', entryId)
  }

  const handleContinue = (entry: TimeEntry) => {
    console.log('Continue timer with:', {
      description: entry.description,
      project: entry.project.name
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">時間エントリー</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              合計: <span className="font-medium text-gray-900 dark:text-white">{getTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Entry List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : timeEntries.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              エントリーがありません
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              選択した日付にはまだ時間エントリーがありません
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Project Color */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.project.color }}
                    />
                    
                    {/* Entry Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.project.name}
                        </span>
                        {entry.description && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            • {entry.description}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(entry.startTime)} - {formatDateTime(entry.endTime)}
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {formatTime(entry.duration)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleContinue(entry)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="続ける"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                      title="編集"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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

      {/* Edit Modal */}
      {showEditModal && editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">エントリーを編集</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  説明
                </label>
                <input
                  type="text"
                  defaultValue={editingEntry.description}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    開始時間
                  </label>
                  <input
                    type="time"
                    defaultValue={formatDateTime(editingEntry.startTime)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    終了時間
                  </label>
                  <input
                    type="time"
                    defaultValue={formatDateTime(editingEntry.endTime)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  // Save changes
                  setShowEditModal(false)
                  console.log('Save changes for entry:', editingEntry.id)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}