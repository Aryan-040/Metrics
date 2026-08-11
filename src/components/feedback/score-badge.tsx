interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  const colorClasses = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-orange-100 text-orange-700',
    3: 'bg-yellow-100 text-yellow-700',
    4: 'bg-green-100 text-green-700',
    5: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-semibold
        ${sizeClasses[size]}
        ${colorClasses[score as keyof typeof colorClasses] || 'bg-gray-100 text-gray-700'}
      `}
    >
      {score}
    </span>
  )
}
