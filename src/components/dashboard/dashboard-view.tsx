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
  // For managers: default to 'personal' or 'team'
  const [activeTab, setActiveTab] = useState<'personal' | 'team' | 'combined'>('personal')

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {params.success === 'feedback-submitted' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Feedback submitted successfully!</span>
        </div>
      )}
      {params.error === 'unauthorized' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          You don&apos;t have permission to access that page.
        </div>
      )}
      {params.error === 'not-direct-report' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          You can only give feedback to your direct reports.
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentCycle ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Cycle: <strong className="text-gray-700 font-semibold">{currentCycle.name}</strong>
              </span>
            ) : (
              'No active feedback cycle currently running.'
            )}
          </p>
        </div>

        {/* Manager Mode Selector */}
        {userIsManager && (
          <div className="flex bg-gray-100 p-1.5 rounded-xl self-start md:self-auto border border-gray-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Performance
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'team'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Team Management
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('combined')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'combined'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview (All)
            </button>
          </div>
        )}
      </div>

      {/* SECTION 1: MANAGER'S OWN PERSONAL PERFORMANCE */}
      {(!userIsManager || activeTab === 'personal' || activeTab === 'combined') && (
        <div className="space-y-8">
          {userIsManager && (
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">My Performance & Feedback Received</h2>
                <p className="text-xs text-gray-500">Your personal evaluation history and performance trajectory</p>
              </div>
            </div>
          )}

          {/* Performance Graph Component */}
          <PerformanceGraph feedbackList={myFeedback} />

          {/* My Recent Feedback Card */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Recent Feedback Received</h3>
              <Link
                href="/app/my-feedback"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                View all history →
              </Link>
            </div>

            {latestFeedback ? (
              <FeedbackViewCard feedback={latestFeedback} showManager />
            ) : (
              <div className="card text-center py-8">
                <p className="text-gray-500">No feedback received yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: TEAM MANAGEMENT (ONLY FOR MANAGERS) */}
      {userIsManager && (activeTab === 'team' || activeTab === 'combined') && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Team Performance Reviews</h2>
              <p className="text-xs text-gray-500">Evaluate and submit feedback for your direct reports</p>
            </div>
          </div>

          {currentCycle ? (
            <div className="card space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Direct Reports Feedback Status</h3>
                  <p className="text-xs text-gray-500">{currentCycle.name}</p>
                </div>
                <div className="flex gap-2 text-xs font-semibold">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                    {pendingCount} Pending
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    {completedCount} Completed
                  </span>
                </div>
              </div>

              {allComplete ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                  <svg className="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-emerald-800 font-bold">All feedback completed for {currentCycle.name}!</p>
                  <p className="text-emerald-600 text-xs mt-1">
                    You have submitted evaluations for all {directReports.length} team members.
                  </p>
                </div>
              ) : directReports.length === 0 ? (
                <p className="text-gray-500 text-sm">You do not have any direct reports assigned.</p>
              ) : (
                <div className="space-y-3">
                  {directReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/app/give-feedback/${report.id}`}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                          {report.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {report.name}
                          </p>
                          <p className="text-xs text-gray-500">{report.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {report.hasFeedbackThisCycle ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-amber-500 text-white rounded-full shadow-sm group-hover:bg-amber-600">
                            Give Feedback →
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card text-center py-6">
              <p className="text-gray-500 text-sm">No active feedback cycle currently open.</p>
            </div>
          )}
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        {userIsManager && (
          <Link
            href="/app/give-feedback"
            className="card hover:shadow-md transition-shadow flex items-center gap-4 border-purple-100 bg-purple-50/20"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Evaluate Team Members</p>
              <p className="text-xs text-gray-500">Submit performance feedback for direct reports</p>
            </div>
          </Link>
        )}

        <Link
          href="/app/my-feedback"
          className="card hover:shadow-md transition-shadow flex items-center gap-4 border-blue-100 bg-blue-50/20"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900">View All My Received Feedback</p>
            <p className="text-xs text-gray-500">Examine detailed performance history & parameters</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
