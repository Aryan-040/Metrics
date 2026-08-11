import { Feedback } from '@/lib/feedback/types'
import { ScoreBadge } from './score-badge'

interface FeedbackViewCardProps {
  feedback: Feedback
  showManager?: boolean
  showEmployee?: boolean
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
    <div className="card">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="font-semibold text-gray-900">{feedback.cycleName}</p>
          {showManager && (
            <p className="text-sm text-gray-500">From: {feedback.managerName}</p>
          )}
          {showEmployee && (
            <p className="text-sm text-gray-500">For: {feedback.employeeName}</p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Avg:</span>
            <ScoreBadge score={Math.round(averageScore)} size="lg" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {feedback.submittedAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {feedback.scores.map((score) => (
          <div key={score.parameterId} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {formatParameterName(score.parameterName)}
              </h4>
              <ScoreBadge score={score.score} />
            </div>
            <p className="text-sm text-gray-600">{score.justification}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
