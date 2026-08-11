import Link from 'next/link'
import { verifySession, getCurrentUser } from '@/lib/auth/dal'
import { isManager } from '@/lib/auth'
import { getDirectReportsWithFeedbackStatus } from '@/lib/relationships'
import { getCurrentCycle } from '@/lib/cycles'
import { getFeedbackForEmployee } from '@/lib/feedback'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const session = await verifySession()
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const currentCycle = await getCurrentCycle(session.companyId)
  const userIsManager = isManager(session.roles)

  // Get direct reports if user is a manager
  let directReports: Awaited<ReturnType<typeof getDirectReportsWithFeedbackStatus>> = []
  if (userIsManager && currentCycle) {
    directReports = await getDirectReportsWithFeedbackStatus(
      session.userId,
      session.companyId,
      currentCycle.id
    )
  }

  // Get user's own feedback
  const myFeedback = await getFeedbackForEmployee(session.userId, session.companyId)
  const latestFeedback = myFeedback[0]

  const pendingCount = directReports.filter(dr => !dr.hasFeedbackThisCycle).length
  const completedCount = directReports.filter(dr => dr.hasFeedbackThisCycle).length
  const allComplete = pendingCount === 0 && directReports.length > 0

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {params.success === 'feedback-submitted' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Feedback submitted successfully!
        </div>
      )}
      {params.error === 'unauthorized' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          You don&apos;t have permission to access that page.
        </div>
      )}
      {params.error === 'not-direct-report' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          You can only give feedback to your direct reports.
        </div>
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">
          {currentCycle ? `Current cycle: ${currentCycle.name}` : 'No active feedback cycle'}
        </p>
      </div>

      {/* Manager Section: Pending Feedback */}
      {userIsManager && currentCycle && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Feedback Status</h2>
            <div className="flex gap-3 text-sm">
              <span className="badge badge-warning">{pendingCount} pending</span>
              <span className="badge badge-success">{completedCount} completed</span>
            </div>
          </div>

          {allComplete ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 font-medium">All feedback completed for {currentCycle.name}!</p>
              <p className="text-green-600 text-sm mt-1">
                You&apos;ve submitted feedback for all {directReports.length} team members.
              </p>
            </div>
          ) : directReports.length === 0 ? (
            <p className="text-gray-500">You don&apos;t have any direct reports.</p>
          ) : (
            <div className="space-y-3">
              {directReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/app/give-feedback/${report.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                      {report.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-500">{report.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.hasFeedbackThisCycle ? (
                      <span className="badge badge-success flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete
                      </span>
                    ) : (
                      <span className="badge badge-warning">Give Feedback</span>
                    )}
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Feedback Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Recent Feedback</h2>
          <Link
            href="/app/my-feedback"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {latestFeedback ? (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{latestFeedback.cycleName}</p>
                <p className="text-sm text-gray-500">From: {latestFeedback.managerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {latestFeedback.submittedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {latestFeedback.scores.map((score) => (
                <div
                  key={score.parameterId}
                  className={`flex-1 text-center p-2 rounded-lg ${
                    score.score >= 4
                      ? 'bg-green-50 text-green-700'
                      : score.score >= 3
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  <p className="text-lg font-bold">{score.score}</p>
                  <p className="text-xs truncate">
                    {score.parameterName.split('_').map(w => w.charAt(0).toUpperCase()).join('')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No feedback received yet.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userIsManager && (
          <Link
            href="/app/give-feedback"
            className="card hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Give Feedback</p>
              <p className="text-sm text-gray-500">Submit feedback for your team</p>
            </div>
          </Link>
        )}
        <Link
          href="/app/my-feedback"
          className="card hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">View My Feedback</p>
            <p className="text-sm text-gray-500">See your performance history</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
