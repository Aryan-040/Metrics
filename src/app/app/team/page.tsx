import Link from 'next/link'
import { verifySession, requireRole } from '@/lib/auth/dal'
import { getDirectReportsWithFeedbackStatus } from '@/lib/relationships'
import { getCurrentCycle, getCyclesByCompany } from '@/lib/cycles'

export default async function TeamPage() {
  await requireRole(['manager'])
  const session = await verifySession()

  const currentCycle = await getCurrentCycle(session.companyId)
  const cycles = await getCyclesByCompany(session.companyId)

  if (!currentCycle) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Team</h1>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Team</h1>
        <div className="card">
          <p className="text-gray-600">You don&apos;t have any direct reports.</p>
        </div>
      </div>
    )
  }

  const pendingCount = directReports.filter(dr => !dr.hasFeedbackThisCycle).length
  const completedCount = directReports.filter(dr => dr.hasFeedbackThisCycle).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Team</h1>
          <p className="text-gray-600 mt-1">{directReports.length} direct reports</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Team Members</p>
          <p className="text-3xl font-bold text-gray-900">{directReports.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Feedback Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Feedback Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {/* Current Cycle Status */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {currentCycle.name} Status
        </h2>
        <div className="space-y-3">
          {directReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
                  {report.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-500">{report.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.hasFeedbackThisCycle ? (
                  <>
                    <span className="badge badge-success">Completed</span>
                    <Link
                      href={`/app/give-feedback/${report.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/app/give-feedback/${report.id}`}
                    className="btn-primary py-1.5 px-4 text-sm"
                  >
                    Give Feedback
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Cycles */}
      {cycles.length > 1 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Cycles</h2>
          <div className="space-y-2">
            {cycles.slice(1).map((cycle) => (
              <div
                key={cycle.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <span className="font-medium text-gray-900">{cycle.name}</span>
                <span className="text-sm text-gray-500">
                  {cycle.startDate.toLocaleDateString('en-US')} - {cycle.endDate.toLocaleDateString('en-US')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
