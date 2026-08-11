import 'server-only'
import { cache } from 'react'
import { prisma } from '../db'
import { ManagerComplianceStatus } from './types'

// Get compliance report for all managers in a company
export const getComplianceReport = cache(async (
  companyId: string,
  cycleId: string
): Promise<ManagerComplianceStatus[]> => {
  const now = new Date()

  // Get all users who are managers (have active direct reports)
  const managersWithReports = await prisma.user.findMany({
    where: {
      companyId,
      managedRelationships: {
        some: {
          companyId,
          OR: [
            { endDate: null },
            { endDate: { gt: now } },
          ],
        },
      },
    },
    include: {
      managedRelationships: {
        where: {
          companyId,
          OR: [
            { endDate: null },
            { endDate: { gt: now } },
          ],
        },
        select: {
          directReportId: true,
        },
      },
      givenFeedback: {
        where: {
          feedbackCycleId: cycleId,
          companyId,
        },
        select: {
          employeeId: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return managersWithReports.map((manager) => {
    const totalDirectReports = manager.managedRelationships.length
    const completedFeedback = manager.givenFeedback.length
    const pendingFeedback = totalDirectReports - completedFeedback

    return {
      managerId: manager.id,
      managerName: manager.name,
      managerEmail: manager.email,
      totalDirectReports,
      completedFeedback,
      pendingFeedback: Math.max(0, pendingFeedback), // Ensure non-negative
    }
  })
})

// Get only managers with pending feedback
export const getManagersWithPendingFeedback = cache(async (
  companyId: string,
  cycleId: string
): Promise<ManagerComplianceStatus[]> => {
  const allManagers = await getComplianceReport(companyId, cycleId)
  return allManagers.filter((m) => m.pendingFeedback > 0)
})

// Get summary stats
export const getComplianceSummary = cache(async (
  companyId: string,
  cycleId: string
) => {
  const report = await getComplianceReport(companyId, cycleId)
  
  const totalManagers = report.length
  const managersComplete = report.filter(m => m.pendingFeedback === 0).length
  const managersPending = report.filter(m => m.pendingFeedback > 0).length
  const totalFeedbackRequired = report.reduce((sum, m) => sum + m.totalDirectReports, 0)
  const totalFeedbackCompleted = report.reduce((sum, m) => sum + m.completedFeedback, 0)
  const completionRate = totalFeedbackRequired > 0
    ? (totalFeedbackCompleted / totalFeedbackRequired) * 100
    : 0

  return {
    totalManagers,
    managersComplete,
    managersPending,
    totalFeedbackRequired,
    totalFeedbackCompleted,
    completionRate,
  }
})
