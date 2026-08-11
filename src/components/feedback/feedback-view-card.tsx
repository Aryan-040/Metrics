import { Feedback } from '@/lib/feedback/types'

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
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
      {/* Card Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">{feedback.cycleName}</h3>
          {showManager && (
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluator: <span className="font-semibold text-slate-700">{feedback.managerName}</span>
            </p>
          )}
          {showEmployee && (
            <p className="text-xs text-slate-500 mt-0.5">
              Employee: <span className="font-semibold text-slate-700">{feedback.employeeName}</span>
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Average Score</span>
            <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-md text-xs font-bold">
              {averageScore.toFixed(1)} / 5
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {new Date(feedback.submittedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Parameter Details */}
      <div className="space-y-4">
        {feedback.scores.map((score) => {
          const paramTitle = formatParameterName(score.parameterName)
          const label = SCORE_LABELS[score.score] || ''
          return (
            <div
              key={score.parameterId}
              className="pb-4 border-b border-slate-100 last:border-0 last:pb-0 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{paramTitle}</span>
                  <span className="text-xs font-medium text-slate-400">
                    &bull; {label}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  score.score >= 4
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : score.score >= 3
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {score.score} / 5
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">
                {score.justification}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
