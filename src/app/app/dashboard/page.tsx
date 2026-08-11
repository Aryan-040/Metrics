import { verifySession, getCurrentUser } from '@/lib/auth/dal'
import { isManager } from '@/lib/auth'
import { getDirectReportsWithFeedbackStatus } from '@/lib/relationships'
import { getCurrentCycle } from '@/lib/cycles'
import { getFeedbackForEmployee } from '@/lib/feedback'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const session = await verifySession()
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }

  const currentCycle = await getCurrentCycle(session.companyId)
  const userIsManager = isManager(session.roles)

  // Get direct reports if user is a manager
  let directReports: Awaited<ReturnType<typeof getDirectReportsWithFeedbackStatus>> = []
  if (userIsManager && currentCycle) {
    directReports = await getDirectReportsWithFeedbackStatus(
      session.userId,
      session.companyId,
      currentCycle.id
    )
  }

  // Get user's own feedback
  const myFeedback = await getFeedbackForEmployee(session.userId, session.companyId)
  const latestFeedback = myFeedback[0]

  const pendingCount = directReports.filter(dr => !dr.hasFeedbackThisCycle).length
  const completedCount = directReports.filter(dr => dr.hasFeedbackThisCycle).length
  const allComplete = pendingCount === 0 && directReports.length > 0

  return (
    <DashboardView
      user={user}
      userIsManager={userIsManager}
      currentCycle={currentCycle}
      myFeedback={myFeedback}
      latestFeedback={latestFeedback}
      directReports={directReports}
      pendingCount={pendingCount}
      completedCount={completedCount}
      allComplete={allComplete}
      params={params}
    />
  )
}
