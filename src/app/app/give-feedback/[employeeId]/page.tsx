import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { verifySession, requireRole } from '@/lib/auth/dal'
import { isActiveDirectReport, getEmployee } from '@/lib/relationships'
import { getCurrentCycle } from '@/lib/cycles'
import { getFeedbackParameters, getExistingFeedback } from '@/lib/feedback'
import { FeedbackForm } from '@/components/feedback/feedback-form'
import { FeedbackViewCard } from '@/components/feedback/feedback-view-card'

interface GiveFeedbackToEmployeePageProps {
  params: Promise<{ employeeId: string }>
}

export default async function GiveFeedbackToEmployeePage({
  params,
}: GiveFeedbackToEmployeePageProps) {
  const { employeeId } = await params
  
  // Require manager role
  await requireRole(['manager'])
  const session = await verifySession()

  // Verify this employee exists and belongs to the same company
  const employee = await getEmployee(employeeId, session.companyId)
  if (!employee) {
    notFound()
  }

  // Verify manager relationship
  const isDirectReport = await isActiveDirectReport(
    session.userId,
    employeeId,
    session.companyId
  )

  if (!isDirectReport) {
    redirect('/app/dashboard?error=not-direct-report')
  }

  // Get current cycle
  const currentCycle = await getCurrentCycle(session.companyId)
  if (!currentCycle) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Give Feedback</h1>
        <div className="card">
          <p className="text-gray-600">No active feedback cycle found.</p>
        </div>
      </div>
    )
  }

  // Check if feedback already exists
  const existingFeedback = await getExistingFeedback(
    session.userId,
    employeeId,
    currentCycle.id,
    session.companyId
  )

  // Get feedback parameters
  const parameters = await getFeedbackParameters()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/app/give-feedback"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to team
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {existingFeedback ? 'View Feedback' : 'Give Feedback'}
      </h1>

      {existingFeedback ? (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Feedback already submitted for this cycle</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Submitted on {existingFeedback.submittedAt.toLocaleDateString()}
            </p>
          </div>
          
          <FeedbackViewCard feedback={existingFeedback} showEmployee />
        </div>
      ) : (
        <FeedbackForm
          employeeId={employeeId}
          employeeName={employee.name}
          cycleName={currentCycle.name}
          parameters={parameters}
        />
      )}
    </div>
  )
}
