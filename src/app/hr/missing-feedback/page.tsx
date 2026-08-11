import Link from 'next/link'
import { verifySession } from '@/lib/auth/dal'
import { getCurrentCycle, getCyclesByCompany } from '@/lib/cycles'
import { getComplianceReport, getComplianceSummary } from '@/lib/hr'
import { ComplianceTable } from '@/components/hr/compliance-table'

interface MissingFeedbackPageProps {
  searchParams: Promise<{ filter?: string; cycleId?: string }>
}

export default async function MissingFeedbackPage({ searchParams }: MissingFeedbackPageProps) {
  const params = await searchParams
  const session = await verifySession()
  const currentCycle = await getCurrentCycle(session.companyId)
  const cycles = await getCyclesByCompany(session.companyId)

  const selectedCycleId = params.cycleId || currentCycle?.id || (cycles.length > 0 ? cycles[0].id : '')
  const selectedCycle = cycles.find(c => c.id === selectedCycleId) || currentCycle

  if (!selectedCycle) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Missing Feedback Report</h1>
        <div className="card">
          <p className="text-sm text-slate-500">No evaluation cycles found for your company.</p>
        </div>
      </div>
    )
  }

  const report = await getComplianceReport(session.companyId, selectedCycle.id)
  const summary = await getComplianceSummary(session.companyId, selectedCycle.id)
  
  const showPendingOnly = params.filter === 'pending'
  const filteredReport = showPendingOnly
    ? report.filter(m => m.pendingFeedback > 0)
    : report

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Cycle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Missing Feedback Report</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compliance report for <span className="font-semibold text-slate-800">{selectedCycle.name}</span>
          </p>
        </div>

        {cycles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Cycle:
            </span>
            {cycles.map((c) => {
              const isSelected = c.id === selectedCycle.id
              const isCurrent = currentCycle && c.id === currentCycle.id
              return (
                <Link
                  key={c.id}
                  href={`/hr/missing-feedback?cycleId=${c.id}${params.filter ? `&filter=${params.filter}` : ''}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {c.name} {isCurrent && ' (Current)'}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Managers</p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{summary.totalManagers}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">All Complete</p>
          <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{summary.managersComplete}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Have Pending</p>
          <p className="text-3xl font-extrabold text-amber-600 tracking-tight">{summary.managersPending}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completion Rate</p>
          <p className={`text-3xl font-extrabold tracking-tight ${
            summary.completionRate >= 100 ? 'text-emerald-600' :
            summary.completionRate >= 50 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {summary.completionRate.toFixed(0)}%
          </p>
        </div>
      </div>

      {summary.managersPending === 0 ? (
        <div className="card text-center py-8 bg-emerald-50/50 border-emerald-200/80">
          <p className="text-base font-bold text-emerald-800">All feedback complete!</p>
          <p className="text-xs text-emerald-600 mt-1">
            All managers have submitted feedback for {selectedCycle.name}.
          </p>
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
