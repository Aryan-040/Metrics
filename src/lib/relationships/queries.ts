import 'server-only'
import { cache } from 'react'
import { prisma } from '../db'
import { ManagerRelationship, DirectReportWithStatus } from './types'

// Get all active direct reports for a manager
export const getDirectReports = cache(async (
  managerId: string,
  companyId: string
): Promise<ManagerRelationship[]> => {
  const now = new Date()
  
  const relationships = await prisma.managerRelationship.findMany({
    where: {
      managerId,
      companyId,
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
    },
    include: {
      directReport: {
        select: { id: true, name: true },
      },
      manager: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      directReport: { name: 'asc' },
    },
  })

  return relationships.map((r) => ({
    id: r.id,
    managerId: r.managerId,
    managerName: r.manager.name,
    directReportId: r.directReportId,
    directReportName: r.directReport.name,
    companyId: r.companyId,
    startDate: r.startDate,
    endDate: r.endDate,
  }))
})

// Get active direct reports with their feedback status for current cycle
export const getDirectReportsWithFeedbackStatus = cache(async (
  managerId: string,
  companyId: string,
  cycleId: string
): Promise<DirectReportWithStatus[]> => {
  const now = new Date()
  
  const relationships = await prisma.managerRelationship.findMany({
    where: {
      managerId,
      companyId,
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
    },
    include: {
      directReport: {
        select: { 
          id: true, 
          name: true, 
          email: true,
          receivedFeedback: {
            where: {
              feedbackCycleId: cycleId,
              managerId,
            },
            select: { id: true },
          },
        },
      },
    },
    orderBy: {
      directReport: { name: 'asc' },
    },
  })

  return relationships.map((r) => ({
    id: r.directReport.id,
    name: r.directReport.name,
    email: r.directReport.email,
    hasFeedbackThisCycle: r.directReport.receivedFeedback.length > 0,
  }))
})

// Get the manager for an employee
export const getManager = cache(async (
  employeeId: string,
  companyId: string
): Promise<ManagerRelationship | null> => {
  const now = new Date()
  
  const relationship = await prisma.managerRelationship.findFirst({
    where: {
      directReportId: employeeId,
      companyId,
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
    },
    include: {
      manager: {
        select: { id: true, name: true },
      },
      directReport: {
        select: { id: true, name: true },
      },
    },
  })

  if (!relationship) return null

  return {
    id: relationship.id,
    managerId: relationship.managerId,
    managerName: relationship.manager.name,
    directReportId: relationship.directReportId,
    directReportName: relationship.directReport.name,
    companyId: relationship.companyId,
    startDate: relationship.startDate,
    endDate: relationship.endDate,
  }
})

// Check if a user is an active direct report of a manager
export const isActiveDirectReport = cache(async (
  managerId: string,
  employeeId: string,
  companyId: string
): Promise<boolean> => {
  const now = new Date()
  
  const relationship = await prisma.managerRelationship.findFirst({
    where: {
      managerId,
      directReportId: employeeId,
      companyId,
      OR: [
        { endDate: null },
        { endDate: { gt: now } },
      ],
    },
  })

  return relationship !== null
})

// Get employee details by ID (with company scoping)
export const getEmployee = cache(async (
  employeeId: string,
  companyId: string
) => {
  const employee = await prisma.user.findFirst({
    where: {
      id: employeeId,
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
    },
  })

  return employee
})
