import { NextResponse } from 'next/server'

// グローバル変数を使用（VercelのEdge Functionでも動作）
// 注意: これはFunctionのインスタンス間で共有されますが、再デプロイでリセットされます
global.authLogs = global.authLogs || []
const MAX_LOGS = 100

export async function GET() {
  try {
    const authLogs = global.authLogs || []
    
    return NextResponse.json({
      logs: authLogs.slice().reverse(), // 最新のログを最初に表示
      totalLogs: authLogs.length,
      status: 'success'
    })
  } catch (error) {
    console.error('Failed to get logs:', error)
    return NextResponse.json({
      logs: [],
      totalLogs: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const logEntry = await request.json()
    
    // タイムスタンプを追加
    const timestampedLog = {
      ...logEntry,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }
    
    // グローバル配列にログを追加
    if (!global.authLogs) {
      global.authLogs = []
    }
    
    global.authLogs.push(timestampedLog)
    if (global.authLogs.length > MAX_LOGS) {
      global.authLogs.shift()
    }
    
    return NextResponse.json({ 
      success: true,
      logId: timestampedLog.id,
      totalLogs: global.authLogs.length
    })
  } catch (error) {
    console.error('Failed to save log:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// ログをクリアするエンドポイント
export async function DELETE() {
  try {
    global.authLogs = []
    return NextResponse.json({ 
      success: true,
      message: 'All logs cleared'
    })
  } catch (error) {
    console.error('Failed to clear logs:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}