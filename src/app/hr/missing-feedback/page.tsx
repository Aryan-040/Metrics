import { verifySession } from '@/lib/auth/dal'
import { getCurrentCycle } from '@/lib/cycles'
import { getComplianceReport, getComplianceSummary } from '@/lib/hr'
import { ComplianceTable } from '@/components/hr/compliance-table'

interface MissingFeedbackPageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function MissingFeedbackPage({ searchParams }: MissingFeedbackPageProps) {
  const params = await searchParams
  const session = await verifySession()
  const currentCycle = await getCurrentCycle(session.companyId)

  if (!currentCycle) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Missing Feedback Report</h1>
        <div className="card">
          <p className="text-gray-600">No active feedback cycle found.</p>
        </div>
      </div>
    )
  }

  const report = await getComplianceReport(session.companyId, currentCycle.id)
  const summary = await getComplianceSummary(session.companyId, currentCycle.id)
  
  const showPendingOnly = params.filter === 'pending'
  const filteredReport = showPendingOnly
    ? report.filter(m => m.pendingFeedback > 0)
    : report

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Missing Feedback Report</h1>
        <p className="text-gray-600 mt-1">{currentCycle.name}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Managers</p>
          <p className="text-3xl font-bold text-gray-900">{summary.totalManagers}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">All Complete</p>
          <p className="text-3xl font-bold text-green-600">{summary.managersComplete}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Have Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{summary.managersPending}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Completion Rate</p>
          <p className={`text-3xl font-bold ${
            summary.completionRate >= 100 ? 'text-green-600' :
            summary.completionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {summary.completionRate.toFixed(0)}%
          </p>
        </div>
      </div>

      {summary.managersPending === 0 ? (
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
      ) : (
        <ComplianceTable
          managers={filteredReport}
          showPendingOnly={showPendingOnly}
        />
      )}
    </div>
  )
}
