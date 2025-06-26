import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const logFile = join(process.cwd(), 'logs', 'auth-callback.log')
    const content = await readFile(logFile, 'utf-8')
    
    return NextResponse.json({
      logs: content.split('\n\n').filter(Boolean).map(log => {
        try {
          return JSON.parse(log)
        } catch {
          return log
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'No logs found',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 404 })
  }
}