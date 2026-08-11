import { verifySession } from '@/lib/auth/dal'
import { getFeedbackForEmployee, getFeedbackParameters } from '@/lib/feedback'
import { FeedbackViewCard } from '@/components/feedback/feedback-view-card'
import { FeedbackFilter } from '@/components/feedback/feedback-filter'

interface MyFeedbackPageProps {
  searchParams: Promise<{ parameter?: string }>
}

export default async function MyFeedbackPage({ searchParams }: MyFeedbackPageProps) {
  const params = await searchParams
  const session = await verifySession()
  
  const allFeedback = await getFeedbackForEmployee(session.userId, session.companyId)
  const parameters = await getFeedbackParameters()

  // Filter by parameter if specified
  const selectedParameter = params.parameter
  const filteredFeedback = selectedParameter
    ? allFeedback.map(f => ({
        ...f,
        scores: f.scores.filter(s => s.parameterName === selectedParameter)
      })).filter(f => f.scores.length > 0)
    : allFeedback

  // Calculate average scores per parameter across all feedback
  const parameterAverages = parameters.map(param => {
    const scores = allFeedback.flatMap(f => f.scores.filter(s => s.parameterName === param.name))
    const avg = scores.length > 0
      ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
      : 0
    return {
      name: param.name,
      average: avg,
      count: scores.length,
    }
  })

  const overallAverage = allFeedback.length > 0
    ? allFeedback.flatMap(f => f.scores).reduce((sum, s) => sum + s.score, 0) /
      allFeedback.flatMap(f => f.scores).length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
        <p className="text-gray-600 mt-1">
          {allFeedback.length} feedback {allFeedback.length === 1 ? 'review' : 'reviews'} received
        </p>
      </div>

      {allFeedback.length > 0 && (
        <>
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="card col-span-2 md:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Overall</p>
              <p className="text-3xl font-bold text-blue-600">{overallAverage.toFixed(1)}</p>
            </div>
            {parameterAverages.map((param) => (
              <div key={param.name} className="card">
                <p className="text-xs text-gray-500 mb-1 truncate">
                  {param.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
                <p className={`text-2xl font-bold ${
                  param.average >= 4 ? 'text-green-600' :
                  param.average >= 3 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {param.average > 0 ? param.average.toFixed(1) : '-'}
                </p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <FeedbackFilter parameters={parameters} selectedParameter={selectedParameter} />
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
            <p className="text-gray-500">No feedback found for the selected filter.</p>
          </div>
        ) : (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg">No feedback received yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Your manager will submit feedback during the evaluation cycle
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
