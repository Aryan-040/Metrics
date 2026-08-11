import { verifySession } from '@/lib/auth/dal'
import { getFeedbackForEmployee, getFeedbackParameters } from '@/lib/feedback'
import { getCyclesByCompany } from '@/lib/cycles'
import { FeedbackViewCard } from '@/components/feedback/feedback-view-card'
import { FeedbackFilter } from '@/components/feedback/feedback-filter'

interface MyFeedbackPageProps {
  searchParams: Promise<{ parameter?: string; cycleId?: string }>
}

export default async function MyFeedbackPage({ searchParams }: MyFeedbackPageProps) {
  const params = await searchParams
  const session = await verifySession()
  
  const allFeedback = await getFeedbackForEmployee(session.userId, session.companyId)
  const parameters = await getFeedbackParameters()
  const cycles = await getCyclesByCompany(session.companyId)

  const selectedCycle = params.cycleId
  const selectedParameter = params.parameter

  // Step 1: Filter by cycle if specified
  const cycleFilteredFeedback = selectedCycle
    ? allFeedback.filter(f => f.feedbackCycleId === selectedCycle)
    : allFeedback

  // Step 2: Filter by parameter metric if specified
  const filteredFeedback = selectedParameter
    ? cycleFilteredFeedback.map(f => ({
        ...f,
        scores: f.scores.filter(s => s.parameterName === selectedParameter)
      })).filter(f => f.scores.length > 0)
    : cycleFilteredFeedback

  // Calculate average scores per parameter across cycleFilteredFeedback
  const parameterAverages = parameters.map(param => {
    const scores = cycleFilteredFeedback.flatMap(f => f.scores.filter(s => s.parameterName === param.name))
    const avg = scores.length > 0
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
      : 0
    return {
      name: param.name,
      average: avg,
      count: scores.length,
    }
  })

  const overallAverage = cycleFilteredFeedback.length > 0
    ? cycleFilteredFeedback.flatMap(f => f.scores).reduce((sum, s) => sum + s.score, 0) /
      (cycleFilteredFeedback.flatMap(f => f.scores).length || 1)
    : 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">
          {cycleFilteredFeedback.length} {cycleFilteredFeedback.length === 1 ? 'evaluation review' : 'evaluation reviews'} received across evaluation cycles
        </p>
      </div>

      {allFeedback.length > 0 && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="card col-span-2 md:col-span-1 flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Avg</p>
              <p className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                {overallAverage > 0 ? overallAverage.toFixed(1) : '-'}
              </p>
            </div>
            {parameterAverages.map((param) => (
              <div key={param.name} className="card">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
                  {param.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className={`text-2xl font-bold ${
                  param.average >= 4 ? 'text-emerald-600' :
                  param.average >= 3 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {param.average > 0 ? param.average.toFixed(1) : '-'}
                </p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <FeedbackFilter
            parameters={parameters}
            selectedParameter={selectedParameter}
            cycles={cycles}
            selectedCycle={selectedCycle}
          />
        </>
      )}

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <FeedbackViewCard
              key={feedback.id}
              feedback={feedback}
              showManager
            />
          ))
        ) : allFeedback.length > 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm text-slate-500">No feedback found for the selected filter.</p>
          </div>
        ) : (
          <div className="card text-center py-12">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-slate-900 font-semibold text-base">No feedback received yet</p>
            <p className="text-slate-500 text-xs mt-1">
              Your manager will submit feedback during evaluation cycles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
