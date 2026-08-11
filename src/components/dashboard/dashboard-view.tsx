'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@/lib/auth/types'
import { Feedback } from '@/lib/feedback/types'
import { FeedbackViewCard } from '@/components/feedback/feedback-view-card'
import { PerformanceGraph } from '@/components/feedback/performance-graph'

interface DirectReportStatus {
  id: string
  name: string
  email: string
  hasFeedbackThisCycle: boolean
}

interface DashboardViewProps {
  user: User
  userIsManager: boolean
  currentCycle: { id: string; name: string } | null
  myFeedback: Feedback[]
  latestFeedback: Feedback | undefined
  directReports: DirectReportStatus[]
  pendingCount: number
  completedCount: number
  allComplete: boolean
  params: { success?: string; error?: string }
}

export function DashboardView({
  user,
  userIsManager,
  currentCycle,
  myFeedback,
  latestFeedback,
  directReports,
  pendingCount,
  completedCount,
  allComplete,
  params,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'team'>('personal')

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast notifications */}
      {params.success === 'feedback-submitted' && (
        <div className="p-4 bg-slate-900 text-white rounded-xl text-sm font-medium flex items-center justify-between shadow-lg">
          <span>Feedback submitted successfully.</span>
        </div>
      )}
      {params.error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {params.error === 'unauthorized' ? 'Access denied.' : 'Action restricted.'}
        </div>
      )}

      {/* Sleek Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {user.name} &bull; {currentCycle ? currentCycle.name : 'No active cycle'}
          </p>
        </div>

        {/* Minimal Tab Bar for Managers */}
        {userIsManager && (
          <div className="flex gap-6 border-b border-slate-200 -mb-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === 'personal'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Performance
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
                activeTab === 'team'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Team Reviews
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* SECTION 1: PERSONAL PERFORMANCE */}
      {(!userIsManager || activeTab === 'personal') && (
        <div className="space-y-8">
          {/* Performance Trajectory Graph */}
          <PerformanceGraph feedbackList={myFeedback} />

          {/* My Recent Feedback */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Evaluation Received
              </h2>
              <Link
                href="/app/my-feedback"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View all history →
              </Link>
            </div>

            {latestFeedback ? (
              <FeedbackViewCard feedback={latestFeedback} showManager />
            ) : (
              <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl">
                <p className="text-sm text-slate-500">No evaluation received for current cycle yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: TEAM MANAGEMENT (FOR MANAGERS) */}
      {userIsManager && activeTab === 'team' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Team Evaluations</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct report submissions for {currentCycle?.name || 'current cycle'}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {pendingCount} Pending
                </span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {completedCount} Completed
                </span>
              </div>
            </div>

            {allComplete ? (
              <div className="p-6 text-center bg-slate-50 border border-slate-200/60 rounded-xl">
                <p className="text-sm font-semibold text-slate-900">
                  All team evaluations submitted for {currentCycle?.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  You have reviewed all {directReports.length} team members.
                </p>
              </div>
            ) : directReports.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No direct reports assigned.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {directReports.map((report) => (
                  <div
                    key={report.id}
                    className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {report.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{report.name}</p>
                        <p className="text-xs text-slate-400">{report.email}</p>
                      </div>
                    </div>

                    <div>
                      {report.hasFeedbackThisCycle ? (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Submitted
                        </span>
                      ) : (
                        <Link
                          href={`/app/give-feedback/${report.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                        >
                          Give Feedback →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
