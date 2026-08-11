import { redirect } from 'next/navigation'
import Link from 'next/link'
import { verifySession, requireRole } from '@/lib/auth/dal'
import { getDirectReportsWithFeedbackStatus } from '@/lib/relationships'
import { getCurrentCycle } from '@/lib/cycles'

export default async function GiveFeedbackPage() {
  // Require manager role
  await requireRole(['manager'])
  const session = await verifySession()

  const currentCycle = await getCurrentCycle(session.companyId)
  
  if (!currentCycle) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Give Feedback</h1>
        <div className="card">
          <p className="text-gray-600">No active feedback cycle found.</p>
        </div>
      </div>
    )
  }

  const directReports = await getDirectReportsWithFeedbackStatus(
    session.userId,
    session.companyId,
    currentCycle.id
  )

  if (directReports.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Give Feedback</h1>
        <div className="card">
          <p className="text-gray-600">You don&apos;t have any direct reports to give feedback to.</p>
        </div>
      </div>
    )
  }

  const pendingCount = directReports.filter(dr => !dr.hasFeedbackThisCycle).length
  const completedCount = directReports.filter(dr => dr.hasFeedbackThisCycle).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Give Feedback</h1>
          <p className="text-gray-600 mt-1">{currentCycle.name}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="badge badge-warning">{pendingCount} pending</span>
          <span className="badge badge-success">{completedCount} completed</span>
        </div>
      </div>

      <div className="grid gap-4">
        {directReports.map((report) => (
          <Link
            key={report.id}
            href={`/app/give-feedback/${report.id}`}
            className="card hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                {report.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-500">{report.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {report.hasFeedbackThisCycle ? (
                <span className="badge badge-success flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Complete
                </span>
              ) : (
                <span className="badge badge-warning">Pending</span>
              )}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
