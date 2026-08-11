import Link from 'next/link'
import { verifySession, requireRole } from '@/lib/auth/dal'
import { getDirectReportsWithFeedbackStatus } from '@/lib/relationships'
import { getCurrentCycle, getCyclesByCompany } from '@/lib/cycles'
import { getFeedbackByManager } from '@/lib/feedback/queries'
import { FeedbackViewCard } from '@/components/feedback/feedback-view-card'

interface TeamPageProps {
  searchParams: Promise<{ cycleId?: string }>
}

export default async function TeamPage({ searchParams }: TeamPageProps) {
  await requireRole(['manager'])
  const session = await verifySession()
  const params = await searchParams

  const currentCycle = await getCurrentCycle(session.companyId)
  const cycles = await getCyclesByCompany(session.companyId)

  const selectedCycleId = params.cycleId || currentCycle?.id || (cycles.length > 0 ? cycles[0].id : '')
  const selectedCycle = cycles.find(c => c.id === selectedCycleId) || currentCycle

  if (!selectedCycle) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Team</h1>
        <div className="card">
          <p className="text-sm text-slate-500">No evaluation cycles found for your company.</p>
        </div>
      </div>
    )
  }

  const directReports = await getDirectReportsWithFeedbackStatus(
    session.userId,
    session.companyId,
    selectedCycle.id
  )

  // Also fetch all feedback submitted by this manager for the selected cycle
  const managerFeedbackInCycle = await getFeedbackByManager(
    session.userId,
    session.companyId,
    selectedCycle.id
  )

  const pendingCount = directReports.filter(dr => !dr.hasFeedbackThisCycle).length
  const completedCount = directReports.filter(dr => dr.hasFeedbackThisCycle).length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Cycle Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Team</h1>
          <p className="text-sm text-slate-500 mt-1">
            Viewing team evaluations for <span className="font-semibold text-slate-800">{selectedCycle.name}</span>
          </p>
        </div>

        {/* Past Cycle Switcher */}
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
                  href={`/app/team?cycleId=${c.id}`}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
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

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Direct Reports</p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{directReports.length}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted Reviews</p>
          <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">{completedCount}</p>
        </div>
        <div className="card">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Reviews</p>
          <p className="text-3xl font-extrabold text-amber-600 tracking-tight">{pendingCount}</p>
        </div>
      </div>

      {/* Team Member Status List for Selected Cycle */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {selectedCycle.name} Member Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cycle Period: {new Date(selectedCycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(selectedCycle.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {directReports.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">No direct reports assigned.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {directReports.map((report) => (
              <div
                key={report.id}
                className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                    {report.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{report.name}</p>
                    <p className="text-xs text-slate-400">{report.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {report.hasFeedbackThisCycle ? (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Evaluation Submitted
                    </span>
                  ) : (
                    currentCycle && selectedCycle.id === currentCycle.id ? (
                      <Link
                        href={`/app/give-feedback/${report.id}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Give Feedback →
                      </Link>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                        Not Evaluated
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Team Evaluations Cards for Selected Cycle */}
      {managerFeedbackInCycle.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Submitted Evaluations for {selectedCycle.name}
          </h2>
          <div className="space-y-4">
            {managerFeedbackInCycle.map((feedback) => (
              <FeedbackViewCard
                key={feedback.id}
                feedback={feedback}
                showEmployee
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
