import { Feedback } from '@/lib/feedback/types'
import { ScoreBadge } from './score-badge'

interface FeedbackViewCardProps {
  feedback: Feedback
  showManager?: boolean
  showEmployee?: boolean
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below Expectations',
  3: 'Meets Expectations',
  4: 'Exceeds Expectations',
  5: 'Outstanding',
}

export function FeedbackViewCard({
  feedback,
  showManager = false,
  showEmployee = false,
}: FeedbackViewCardProps) {
  const formatParameterName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const averageScore = feedback.scores.length > 0
    ? feedback.scores.reduce((sum, s) => sum + s.score, 0) / feedback.scores.length
    : 0

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <p className="text-lg font-bold text-gray-900">{feedback.cycleName}</p>
          {showManager && (
            <p className="text-sm text-gray-500">Submitted by: <span className="font-medium text-gray-700">{feedback.managerName}</span></p>
          )}
          {showEmployee && (
            <p className="text-sm text-gray-500">For: <span className="font-medium text-gray-700">{feedback.employeeName}</span></p>
          )}
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Overall Avg</span>
            <ScoreBadge score={Math.round(averageScore)} size="lg" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {feedback.submittedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Parameter Scores & Justifications Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Score Breakdown & Feedback</h4>
        <div className="grid grid-cols-1 gap-4">
          {feedback.scores.map((score) => {
            const paramTitle = formatParameterName(score.parameterName)
            const label = SCORE_LABELS[score.score] || ''
            return (
              <div key={score.parameterId} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{paramTitle}</span>
                    {label && (
                      <span className="text-xs font-medium text-gray-600 bg-gray-200/70 px-2 py-0.5 rounded-full">
                        {label}
                      </span>
                    )}
                  </div>
                  <ScoreBadge score={score.score} size="md" />
                </div>
                {score.justification ? (
                  <p className="text-sm text-gray-700 leading-relaxed pl-3 border-l-2 border-blue-500 mt-1">
                    {score.justification}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic mt-1">No detailed justification provided.</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
