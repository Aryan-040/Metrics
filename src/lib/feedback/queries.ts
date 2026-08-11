import 'server-only'
import { cache } from 'react'
import { prisma } from '../db'
import { FeedbackParameter, Feedback } from './types'

// Get all feedback parameters
export const getFeedbackParameters = cache(async (): Promise<FeedbackParameter[]> => {
  const parameters = await prisma.feedbackParameter.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  return parameters.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    displayOrder: p.displayOrder,
  }))
})

// Get all feedback received by an employee
export const getFeedbackForEmployee = cache(async (
  employeeId: string,
  companyId: string
): Promise<Feedback[]> => {
  const feedbackList = await prisma.feedback.findMany({
    where: {
      employeeId,
      companyId,
    },
    include: {
      manager: { select: { id: true, name: true } },
      employee: { select: { id: true, name: true } },
      feedbackCycle: { select: { id: true, name: true } },
      scores: {
        include: {
          parameter: { select: { id: true, name: true } },
        },
        orderBy: {
          parameter: { displayOrder: 'asc' },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })

  return feedbackList.map((f) => ({
    id: f.id,
    managerId: f.managerId,
    managerName: f.manager.name,
    employeeId: f.employeeId,
    employeeName: f.employee.name,
    feedbackCycleId: f.feedbackCycleId,
    cycleName: f.feedbackCycle.name,
    scores: f.scores.map((s) => ({
      parameterId: s.parameterId,
      parameterName: s.parameter.name,
      score: s.score,
      justification: s.justification,
    })),
    submittedAt: f.submittedAt,
  }))
})

// Get feedback for a specific employee filtered by parameter
export const getFeedbackByParameter = cache(async (
  employeeId: string,
  companyId: string,
  parameterName?: string
): Promise<Feedback[]> => {
  const feedbackList = await prisma.feedback.findMany({
    where: {
      employeeId,
      companyId,
    },
    include: {
      manager: { select: { id: true, name: true } },
      employee: { select: { id: true, name: true } },
      feedbackCycle: { select: { id: true, name: true } },
      scores: {
        include: {
          parameter: { select: { id: true, name: true } },
        },
        orderBy: {
          parameter: { displayOrder: 'asc' },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  })

  return feedbackList.map((f) => ({
    id: f.id,
    managerId: f.managerId,
    managerName: f.manager.name,
    employeeId: f.employeeId,
    employeeName: f.employee.name,
    feedbackCycleId: f.feedbackCycleId,
    cycleName: f.feedbackCycle.name,
    scores: parameterName
      ? f.scores
          .filter((s) => s.parameter.name === parameterName)
          .map((s) => ({
            parameterId: s.parameterId,
            parameterName: s.parameter.name,
            score: s.score,
            justification: s.justification,
          }))
      : f.scores.map((s) => ({
          parameterId: s.parameterId,
          parameterName: s.parameter.name,
          score: s.score,
          justification: s.justification,
        })),
    submittedAt: f.submittedAt,
  }))
})

// Check if feedback already exists for this manager-employee-cycle combination
export const feedbackExists = cache(async (
  managerId: string,
  employeeId: string,
  cycleId: string
): Promise<boolean> => {
  const existing = await prisma.feedback.findUnique({
    where: {
      managerId_employeeId_feedbackCycleId: {
        managerId,
        employeeId,
        feedbackCycleId: cycleId,
      },
    },
  })

  return existing !== null
})

// Get existing feedback for editing/viewing
export const getExistingFeedback = cache(async (
  managerId: string,
  employeeId: string,
  cycleId: string,
  companyId: string
): Promise<Feedback | null> => {
  const feedback = await prisma.feedback.findFirst({
    where: {
      managerId,
      employeeId,
      feedbackCycleId: cycleId,
      companyId,
    },
    include: {
      manager: { select: { id: true, name: true } },
      employee: { select: { id: true, name: true } },
      feedbackCycle: { select: { id: true, name: true } },
      scores: {
        include: {
          parameter: { select: { id: true, name: true } },
        },
        orderBy: {
          parameter: { displayOrder: 'asc' },
        },
      },
    },
  })

  if (!feedback) return null

  return {
    id: feedback.id,
    managerId: feedback.managerId,
    managerName: feedback.manager.name,
    employeeId: feedback.employeeId,
    employeeName: feedback.employee.name,
    feedbackCycleId: feedback.feedbackCycleId,
    cycleName: feedback.feedbackCycle.name,
    scores: feedback.scores.map((s) => ({
      parameterId: s.parameterId,
      parameterName: s.parameter.name,
      score: s.score,
      justification: s.justification,
    })),
    submittedAt: feedback.submittedAt,
  }
})
