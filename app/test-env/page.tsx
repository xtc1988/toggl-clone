export const dynamic = 'force-dynamic'

export default function TestEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">環境変数テスト</h1>
      <div className="space-y-2">
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
          {supabaseUrl ? `設定済み (${supabaseUrl})` : '未設定'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
          {hasAnonKey ? '設定済み' : '未設定'}
        </p>
        <p className="mt-4 text-sm text-gray-600">
          このページは環境変数の設定状況を確認するためのテストページです。
        </p>
      </div>
    </div>
  )
}