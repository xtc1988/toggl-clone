export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          week_starts_on: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          week_starts_on?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          week_starts_on?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_entries: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          description: string | null
          start_time: string
          end_time: string | null
          duration: number | null
          is_running: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          description?: string | null
          start_time: string
          end_time?: string | null
          duration?: number | null
          is_running?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          description?: string | null
          start_time?: string
          end_time?: string | null
          duration?: number | null
          is_running?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      client_logs: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          log_level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
          message: string
          error_stack: string | null
          user_agent: string | null
          url: string | null
          timestamp: string
          metadata: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          log_level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
          message: string
          error_stack?: string | null
          user_agent?: string | null
          url?: string | null
          timestamp: string
          metadata?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          log_level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
          message?: string
          error_stack?: string | null
          user_agent?: string | null
          url?: string | null
          timestamp?: string
          metadata?: any | null
          created_at?: string
        }
      }
    }
  }
}