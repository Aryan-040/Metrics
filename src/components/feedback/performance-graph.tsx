'use client'

import { useState } from 'react'
import { Feedback } from '@/lib/feedback/types'

interface PerformanceGraphProps {
  feedbackList: Feedback[]
}

const PARAMETER_COLORS: Record<string, string> = {
  quality_of_work: '#3b82f6', // blue
  ownership: '#8b5cf6', // purple
  communication: '#ec4899', // pink
  teamwork: '#10b981', // emerald
  initiative: '#f59e0b', // amber
}

const PARAMETER_LABELS: Record<string, string> = {
  quality_of_work: 'Quality of Work',
  ownership: 'Ownership',
  communication: 'Communication',
  teamwork: 'Teamwork',
  initiative: 'Initiative',
}

export function PerformanceGraph({ feedbackList }: PerformanceGraphProps) {
  const [selectedView, setSelectedView] = useState<'overall' | 'parameters'>('overall')
  const [hoveredPoint, setHoveredPoint] = useState<{
    cycleName: string
    date: string
    score: number
    label?: string
  } | null>(null)

  // Sort feedback by date ascending for chronological graph display
  const chronologicalFeedback = [...feedbackList].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  )

  if (chronologicalFeedback.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-500">No performance data available to graph yet.</p>
      </div>
    )
  }

  // Compute dataset points
  const points = chronologicalFeedback.map((f) => {
    const avgScore =
      f.scores.length > 0
        ? f.scores.reduce((sum, s) => sum + s.score, 0) / f.scores.length
        : 0

    return {
      id: f.id,
      cycleName: f.cycleName,
      date: new Date(f.submittedAt).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      }),
      average: Number(avgScore.toFixed(1)),
      scores: f.scores,
    }
  })

  // Calculate metrics
  const latestPoint = points[points.length - 1]
  const previousPoint = points.length > 1 ? points[points.length - 2] : null
  const overallAvg =
    points.reduce((sum, p) => sum + p.average, 0) / (points.length || 1)
  
  const delta = previousPoint
    ? Number((latestPoint.average - previousPoint.average).toFixed(1))
    : 0

  // SVG Dimension constants
  const width = 650
  const height = 220
  const paddingX = 45
  const paddingY = 30
  const graphWidth = width - paddingX * 2
  const graphHeight = height - paddingY * 2

  // Y axis scale (1 to 5)
  const getY = (val: number) => {
    const minVal = 1
    const maxVal = 5
    const ratio = (val - minVal) / (maxVal - minVal)
    return height - paddingY - ratio * graphHeight
  }

  // X axis scale
  const getX = (index: number) => {
    if (points.length === 1) return width / 2
    return paddingX + (index / (points.length - 1)) * graphWidth
  }

  // Generate SVG path for line
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.average)}`)
    .join(' ')

  // Area path for gradient under line
  const areaPath = points.length > 1
    ? `${linePath} L ${getX(points.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`
    : ''

  return (
    <div className="card space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Performance Trajectory</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {points.length} {points.length === 1 ? 'Cycle' : 'Cycles'}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Evaluation trends across performance cycles
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedView === 'overall'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overall Average
          </button>
          <button
            onClick={() => setSelectedView('parameters')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedView === 'parameters'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Parameter Breakdown
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3.5 rounded-xl border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Latest Score</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-gray-900">{latestPoint.average}</span>
            <span className="text-xs text-gray-500">/ 5.0</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-3.5 rounded-xl border border-purple-100">
          <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Historical Avg</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-gray-900">{overallAvg.toFixed(1)}</span>
            <span className="text-xs text-gray-500">/ 5.0</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3.5 rounded-xl border border-emerald-100">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Growth Delta</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${delta >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {delta > 0 ? `+${delta}` : delta}
            </span>
            <span className="text-xs text-gray-500">vs prev</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="relative pt-2">
        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-0 right-4 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg transition-opacity duration-200 z-10">
            <p className="font-semibold text-blue-300">{hoveredPoint.cycleName}</p>
            <p className="text-gray-300">
              {hoveredPoint.label ? `${hoveredPoint.label}: ` : 'Average: '}
              <span className="font-bold text-white">{hoveredPoint.score} / 5</span>
            </p>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[500px]"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y Axis Grid Lines & Labels */}
            {[1, 2, 3, 4, 5].map((val) => {
              const y = getY(val)
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray={val === 1 || val === 5 ? '0' : '4 4'}
                  />
                  <text
                    x={paddingX - 12}
                    y={y + 4}
                    className="text-[10px] fill-gray-400 font-medium"
                    textAnchor="end"
                  >
                    {val}.0
                  </text>
                </g>
              )
            })}

            {/* X Axis Labels */}
            {points.map((p, i) => (
              <text
                key={p.id}
                x={getX(i)}
                y={height - 8}
                className="text-[11px] fill-gray-500 font-medium"
                textAnchor="middle"
              >
                {p.cycleName}
              </text>
            ))}

            {/* VIEW 1: Overall Average Line & Gradient */}
            {selectedView === 'overall' && (
              <>
                {points.length > 1 && (
                  <>
                    <path d={areaPath} fill="url(#lineGradient)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Point Circles */}
                {points.map((p, i) => {
                  const x = getX(i)
                  const y = getY(p.average)
                  return (
                    <g key={p.id} className="cursor-pointer group">
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-blue-600 stroke-white stroke-[2.5] transition-transform duration-200 group-hover:r-8"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            cycleName: p.cycleName,
                            date: p.date,
                            score: p.average,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Value label on top of point */}
                      <text
                        x={x}
                        y={y - 12}
                        className="text-[11px] font-bold fill-blue-700"
                        textAnchor="middle"
                      >
                        {p.average}
                      </text>
                    </g>
                  )
                })}
              </>
            )}

            {/* VIEW 2: Parameter Breakdown (Multi-line representation) */}
            {selectedView === 'parameters' && (
              <>
                {Object.keys(PARAMETER_LABELS).map((paramKey) => {
                  const color = PARAMETER_COLORS[paramKey] || '#3b82f6'

                  const paramPoints = points
                    .map((p, i) => {
                      const scoreObj = p.scores.find(
                        (s) => s.parameterName === paramKey
                      )
                      if (!scoreObj) return null
                      return {
                        x: getX(i),
                        y: getY(scoreObj.score),
                        score: scoreObj.score,
                        cycleName: p.cycleName,
                        date: p.date,
                      }
                    })
                    .filter(Boolean) as Array<{
                    x: number
                    y: number
                    score: number
                    cycleName: string
                    date: string
                  }>

                  if (paramPoints.length === 0) return null

                  const paramPath = paramPoints
                    .map(
                      (pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`
                    )
                    .join(' ')

                  return (
                    <g key={paramKey}>
                      {paramPoints.length > 1 && (
                        <path
                          d={paramPath}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeDasharray="2 2"
                          opacity="0.8"
                        />
                      )}
                      {paramPoints.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="cursor-pointer hover:r-6 transition-all"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              cycleName: pt.cycleName,
                              date: pt.date,
                              score: pt.score,
                              label: PARAMETER_LABELS[paramKey],
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </g>
                  )
                })}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Parameter Legend (when in parameter view) */}
      {selectedView === 'parameters' && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-gray-100">
          {Object.entries(PARAMETER_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: PARAMETER_COLORS[key] }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
