'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ManagerComplianceStatus } from '@/lib/hr/types'

interface ComplianceTableProps {
  managers: ManagerComplianceStatus[]
  showPendingOnly: boolean
}

export function ComplianceTable({ managers, showPendingOnly }: ComplianceTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const toggleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (showPendingOnly) {
      params.delete('filter')
    } else {
      params.set('filter', 'pending')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Manager Status</h2>
        <button
          onClick={toggleFilter}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showPendingOnly
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showPendingOnly ? 'Show All' : 'Show Pending Only'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Manager</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Direct Reports</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Completed</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Pending</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr
                key={manager.managerId}
                className={`border-b border-gray-100 ${
                  manager.pendingFeedback > 0 ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      manager.pendingFeedback > 0
                        ? 'bg-yellow-200 text-yellow-700'
                        : 'bg-green-200 text-green-700'
                    }`}>
                      {manager.managerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{manager.managerName}</p>
                      <p className="text-sm text-gray-500">{manager.managerEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-gray-900 font-medium">{manager.totalDirectReports}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-green-600 font-medium">{manager.completedFeedback}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-medium ${
                    manager.pendingFeedback > 0 ? 'text-yellow-600' : 'text-gray-400'
                  }`}>
                    {manager.pendingFeedback}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {manager.pendingFeedback === 0 ? (
                    <span className="badge badge-success">Complete</span>
                  ) : (
                    <span className="badge badge-warning">
                      {Math.round((manager.completedFeedback / manager.totalDirectReports) * 100)}%
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {managers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No managers found matching the filter.</p>
        </div>
      )}
    </div>
  )
}
