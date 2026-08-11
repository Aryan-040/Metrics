'use client'

import { useState } from 'react'
import { Feedback } from '@/lib/feedback/types'

interface PerformanceGraphProps {
  feedbackList: Feedback[]
}

const PARAMETER_LABELS: Record<string, string> = {
  quality_of_work: 'Quality of Work',
  ownership: 'Ownership',
  communication: 'Communication',
  teamwork: 'Teamwork',
  initiative: 'Initiative',
}

const PARAMETER_COLORS: Record<string, string> = {
  quality_of_work: '#6366f1', // indigo
  ownership: '#8b5cf6', // purple
  communication: '#ec4899', // pink
  teamwork: '#10b981', // emerald
  initiative: '#f59e0b', // amber
}

export function PerformanceGraph({ feedbackList }: PerformanceGraphProps) {
  const [selectedView, setSelectedView] = useState<'overall' | 'parameters'>('overall')
  const [hoveredPoint, setHoveredPoint] = useState<{
    cycleName: string
    score: number
    label?: string
  } | null>(null)

  // Sort feedback by date ascending
  const chronologicalFeedback = [...feedbackList].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  )

  if (chronologicalFeedback.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl">
        <p className="text-sm text-slate-500">No performance data recorded yet.</p>
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
  const width = 600
  const height = 180
  const paddingX = 40
  const paddingY = 25
  const graphWidth = width - paddingX * 2
  const graphHeight = height - paddingY * 2

  const getY = (val: number) => {
    const minVal = 1
    const maxVal = 5
    const ratio = (val - minVal) / (maxVal - minVal)
    return height - paddingY - ratio * graphHeight
  }

  const getX = (index: number) => {
    if (points.length === 1) return width / 2
    return paddingX + (index / (points.length - 1)) * graphWidth
  }

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.average)}`)
    .join(' ')

  return (
    <div className="card space-y-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Performance Trajectory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluation scores across {points.length} {points.length === 1 ? 'cycle' : 'cycles'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('overall')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedView === 'overall'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setSelectedView('parameters')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedView === 'parameters'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>

      {/* Sleek Minimal Stats Row */}
      <div className="grid grid-cols-3 gap-6 pt-1">
        <div>
          <span className="text-xs font-medium text-slate-400">Latest Rating</span>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {latestPoint.average} <span className="text-xs text-slate-400 font-normal">/ 5</span>
          </p>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-400">Overall Average</span>
          <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {overallAvg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5</span>
          </p>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-400">Growth</span>
          <p className={`text-2xl font-bold tracking-tight mt-0.5 ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {delta > 0 ? `+${delta}` : delta}
          </p>
        </div>
      </div>

      {/* Crisp Chart */}
      <div className="relative pt-2">
        {hoveredPoint && (
          <div className="absolute top-0 right-0 bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-medium shadow-md">
            {hoveredPoint.label ? `${hoveredPoint.label}: ` : `${hoveredPoint.cycleName}: `}
            <span className="font-bold">{hoveredPoint.score} / 5</span>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[450px]">
            {/* Gridlines */}
            {[1, 3, 5].map((val) => {
              const y = getY(val)
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    className="text-[10px] fill-slate-400 font-medium"
                    textAnchor="end"
                  >
                    {val}.0
                  </text>
                </g>
              )
            })}

            {/* X Labels */}
            {points.map((p, i) => (
              <text
                key={p.id}
                x={getX(i)}
                y={height - 5}
                className="text-[11px] fill-slate-400 font-medium"
                textAnchor="middle"
              >
                {p.cycleName}
              </text>
            ))}

            {/* OVERALL VIEW */}
            {selectedView === 'overall' && (
              <>
                {points.length > 1 && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {points.map((p, i) => {
                  const x = getX(i)
                  const y = getY(p.average)
                  return (
                    <g key={p.id} className="cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="4.5"
                        className="fill-indigo-600 stroke-white stroke-2 hover:r-6 transition-all"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            cycleName: p.cycleName,
                            score: p.average,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  )
                })}
              </>
            )}

            {/* PARAMETER BREAKDOWN */}
            {selectedView === 'parameters' && (
              <>
                {Object.keys(PARAMETER_LABELS).map((paramKey) => {
                  const color = PARAMETER_COLORS[paramKey] || '#6366f1'
                  const paramPoints = points
                    .map((p, i) => {
                      const scoreObj = p.scores.find((s) => s.parameterName === paramKey)
                      if (!scoreObj) return null
                      return {
                        x: getX(i),
                        y: getY(scoreObj.score),
                        score: scoreObj.score,
                        cycleName: p.cycleName,
                      }
                    })
                    .filter(Boolean) as Array<{ x: number; y: number; score: number; cycleName: string }>

                  if (paramPoints.length === 0) return null

                  const paramPath = paramPoints
                    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
                    .join(' ')

                  return (
                    <g key={paramKey}>
                      {paramPoints.length > 1 && (
                        <path
                          d={paramPath}
                          fill="none"
                          stroke={color}
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}
                      {paramPoints.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r="3.5"
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          className="cursor-pointer hover:r-5 transition-all"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              cycleName: pt.cycleName,
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

      {selectedView === 'parameters' && (
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 border-t border-slate-100">
          {Object.entries(PARAMETER_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PARAMETER_COLORS[key] }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
