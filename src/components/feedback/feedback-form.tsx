'use client'

import { useActionState } from 'react'
import { submitFeedback } from '@/lib/feedback/actions'
import { FeedbackParameter, FeedbackFormState } from '@/lib/feedback/types'

interface FeedbackFormProps {
  employeeId: string
  employeeName: string
  cycleName: string
  parameters: FeedbackParameter[]
}

const initialState: FeedbackFormState = {
  success: false,
}

export function FeedbackForm({
  employeeId,
  employeeName,
  cycleName,
  parameters,
}: FeedbackFormProps) {
  const [state, action, pending] = useActionState(submitFeedback, initialState)

  const formatParameterName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="employeeId" value={employeeId} />

      {state?.message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${
          state.success 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {state.message}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
            {employeeName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{employeeName}</p>
            <p className="text-sm text-gray-600">Feedback for {cycleName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {parameters.map((param) => (
          <div key={param.id} className="card">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatParameterName(param.name)}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{param.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">
                  Score (1-5) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <label
                      key={score}
                      className="flex-1 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`score_${param.id}`}
                        value={score}
                        className="peer sr-only"
                        required
                      />
                      <div className={`
                        p-3 text-center rounded-lg border-2 transition-all
                        peer-checked:border-blue-500 peer-checked:bg-blue-50
                        hover:border-gray-400 border-gray-200
                      `}>
                        <span className="text-lg font-semibold">{score}</span>
                        <span className="block text-xs text-gray-500 mt-1">
                          {score === 1 && 'Poor'}
                          {score === 2 && 'Below'}
                          {score === 3 && 'Meets'}
                          {score === 4 && 'Exceeds'}
                          {score === 5 && 'Outstanding'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {state?.errors?.[`score_${param.id}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors[`score_${param.id}`][0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`justification_${param.id}`} className="form-label">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`justification_${param.id}`}
                  name={`justification_${param.id}`}
                  rows={3}
                  required
                  className="form-input resize-none"
                  placeholder={`Provide specific examples and feedback for ${formatParameterName(param.name).toLowerCase()}...`}
                />
                {state?.errors?.[`justification_${param.id}`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.errors[`justification_${param.id}`][0]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <a
          href="/app/dashboard"
          className="btn-secondary inline-block text-center w-auto px-6"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-auto px-8 flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </div>
    </form>
  )
}
