export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>
      
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">今日の作業時間</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0:00:00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">今週の作業時間</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0:00:00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">今月の作業時間</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">0:00:00</p>
        </div>
      </div>

      {/* 最近のアクティビティ */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">最近のアクティビティ</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">まだアクティビティがありません。</p>
        </div>
      </div>
    </div>
  )
}