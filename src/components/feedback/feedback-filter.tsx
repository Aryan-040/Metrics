'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FeedbackParameter } from '@/lib/feedback/types'

interface FeedbackFilterProps {
  parameters: FeedbackParameter[]
  selectedParameter?: string
}

export function FeedbackFilter({ parameters, selectedParameter }: FeedbackFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('parameter', value)
    } else {
      params.delete('parameter')
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">Filter by:</span>
      <button
        onClick={() => handleFilterChange('')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selectedParameter
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All Parameters
      </button>
      {parameters.map((param) => (
        <button
          key={param.id}
          onClick={() => handleFilterChange(param.name)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedParameter === param.name
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {formatParameterName(param.name)}
        </button>
      ))}
    </div>
  )
}
