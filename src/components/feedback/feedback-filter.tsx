'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FeedbackParameter } from '@/lib/feedback/types'

interface FeedbackFilterProps {
  parameters: FeedbackParameter[]
  selectedParameter?: string
  cycles?: { id: string; name: string }[]
  selectedCycle?: string
}

export function FeedbackFilter({
  parameters,
  selectedParameter,
  cycles = [],
  selectedCycle,
}: FeedbackFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleParameterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('parameter', value)
    } else {
      params.delete('parameter')
    }
    router.push(`?${params.toString()}`)
  }

  const handleCycleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('cycleId', value)
    } else {
      params.delete('cycleId')
    }
    router.push(`?${params.toString()}`)
  }

  const formatParameterName = (name: string) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3">
      {/* Cycle Filter */}
      {cycles.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">
            Cycle:
          </span>
          <button
            onClick={() => handleCycleChange('')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              !selectedCycle
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cycles
          </button>
          {cycles.map((cycle) => (
            <button
              key={cycle.id}
              onClick={() => handleCycleChange(cycle.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedCycle === cycle.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cycle.name}
            </button>
          ))}
        </div>
      )}

      {/* Parameter Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">
          Metric:
        </span>
        <button
          onClick={() => handleParameterChange('')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            !selectedParameter
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Metrics
        </button>
        {parameters.map((param) => (
          <button
            key={param.id}
            onClick={() => handleParameterChange(param.name)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedParameter === param.name
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {formatParameterName(param.name)}
          </button>
        ))}
      </div>
    </div>
  )
}
