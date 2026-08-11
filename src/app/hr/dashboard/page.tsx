import Link from 'next/link'
import { verifySession } from '@/lib/auth/dal'
import { getCurrentCycle } from '@/lib/cycles'
import { getComplianceSummary, getManagersWithPendingFeedback } from '@/lib/hr'

export default async function HRDashboardPage() {
  const session = await verifySession()
  const currentCycle = await getCurrentCycle(session.companyId)

  if (!currentCycle) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">HR Dashboard</h1>
        <div className="card">
          <p className="text-gray-600">No active feedback cycle found.</p>
        </div>
      </div>
    )
  }

  const summary = await getComplianceSummary(session.companyId, currentCycle.id)
  const pendingManagers = await getManagersWithPendingFeedback(session.companyId, currentCycle.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-600 mt-1">Feedback compliance for {currentCycle.name}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
          <p className={`text-3xl font-bold ${
            summary.completionRate >= 100 ? 'text-green-600' :
            summary.completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {summary.completionRate.toFixed(0)}%
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Managers</p>
          <p className="text-3xl font-bold text-gray-900">{summary.totalManagers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">{summary.managersComplete}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{summary.managersPending}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">
            {summary.totalFeedbackCompleted} / {summary.totalFeedbackRequired} feedback submitted
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              summary.completionRate >= 100 ? 'bg-green-500' :
              summary.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, summary.completionRate)}%` }}
          />
        </div>
      </div>

      {/* Pending Managers Quick View */}
      {pendingManagers.length > 0 ? (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Managers with Pending Feedback</h2>
            <Link
              href="/hr/missing-feedback"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {pendingManagers.slice(0, 5).map((manager) => (
              <div
                key={manager.managerId}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center font-semibold text-yellow-700">
                    {manager.managerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{manager.managerName}</p>
                    <p className="text-sm text-gray-500">{manager.managerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="badge badge-warning">
                    {manager.pendingFeedback} pending
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {manager.completedFeedback}/{manager.totalDirectReports} done
                  </p>
                </div>
              </div>
            ))}
          </div>
          {pendingManagers.length > 5 && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              And {pendingManagers.length - 5} more...
            </p>
          )}
        </div>
      ) : (
        <div className="card bg-green-50 border-green-200">
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-700 text-lg font-semibold">All feedback complete!</p>
            <p className="text-green-600 text-sm mt-1">
              All managers have submitted feedback for {currentCycle.name}
            </p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/hr/missing-feedback"
          className="card hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Missing Feedback Report</p>
            <p className="text-sm text-gray-500">View detailed compliance status</p>
          </div>
        </Link>
        <Link
          href="/app/dashboard"
          className="card hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Switch to Employee View</p>
            <p className="text-sm text-gray-500">View your own feedback</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
