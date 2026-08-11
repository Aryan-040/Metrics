import Link from 'next/link'
import { verifySession } from '@/lib/auth/dal'
import { getCurrentCycle, getCyclesByCompany } from '@/lib/cycles'
import { getComplianceSummary, getManagersWithPendingFeedback } from '@/lib/hr'

interface HRDashboardPageProps {
  searchParams: Promise<{ cycleId?: string }>
}

export default async function HRDashboardPage({ searchParams }: HRDashboardPageProps) {
  const session = await verifySession()
  const params = await searchParams

  const currentCycle = await getCurrentCycle(session.companyId)
  const cycles = await getCyclesByCompany(session.companyId)

  const selectedCycleId = params.cycleId || currentCycle?.id || (cycles.length > 0 ? cycles[0].id : '')
  const selectedCycle = cycles.find(c => c.id === selectedCycleId) || currentCycle

  if (!selectedCycle) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Dashboard</h1>
        <div className="card">
          <p className="text-sm text-slate-500">No evaluation cycles found for your company.</p>
        </div>
      </div>
    )
  }

  const summary = await getComplianceSummary(session.companyId, selectedCycle.id)
  const pendingManagers = await getManagersWithPendingFeedback(session.companyId, selectedCycle.id)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Cycle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Feedback compliance for <span className="font-semibold text-slate-800">{selectedCycle.name}</span>
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
                  href={`/hr/dashboard?cycleId=${c.id}`}
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
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completion Rate</p>
          <p className={`text-3xl font-extrabold tracking-tight ${
            summary.completionRate >= 100 ? 'text-emerald-600' :
            summary.completionRate >= 50 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {summary.completionRate.toFixed(0)}%
          </p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Managers</p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{summary.totalManagers}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{summary.managersComplete}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-3xl font-extrabold text-amber-600 tracking-tight">{summary.managersPending}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-700">Overall Cycle Progress</span>
          <span className="text-slate-500">
            {summary.totalFeedbackCompleted} / {summary.totalFeedbackRequired} feedback submitted
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all ${
              summary.completionRate >= 100 ? 'bg-emerald-500' :
              summary.completionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, summary.completionRate)}%` }}
          />
        </div>
      </div>

      {/* Pending Managers Quick View */}
      {pendingManagers.length > 0 ? (
        <div className="card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Managers with Pending Feedback</h2>
            <Link
              href={`/hr/missing-feedback?cycleId=${selectedCycle.id}`}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              View detailed report →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingManagers.slice(0, 5).map((manager) => (
              <div
                key={manager.managerId}
                className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                    {manager.managerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{manager.managerName}</p>
                    <p className="text-xs text-slate-400">{manager.managerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {manager.pendingFeedback} pending
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {manager.completedFeedback}/{manager.totalDirectReports} completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-8 bg-emerald-50/50 border-emerald-200/80">
          <p className="text-base font-bold text-emerald-800">All feedback completed!</p>
          <p className="text-xs text-emerald-600 mt-1">
            All managers have submitted evaluation feedback for {selectedCycle.name}.
          </p>
        </div>
      )}
    </div>
  )
}
