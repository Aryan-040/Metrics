import 'server-only'
import { cache } from 'react'
import { prisma } from '../db'
import { FeedbackCycle } from './types'

// Get the current active feedback cycle for a company
export const getCurrentCycle = cache(async (
  companyId: string
): Promise<FeedbackCycle | null> => {
  const now = new Date()
  
  const cycle = await prisma.feedbackCycle.findFirst({
    where: {
      companyId,
      startDate: { lte: now },
      endDate: { gte: now },
    },
  })

  if (!cycle) return null

  return {
    id: cycle.id,
    name: cycle.name,
    companyId: cycle.companyId,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
  }
})

// Get all feedback cycles for a company
export const getCyclesByCompany = cache(async (
  companyId: string
): Promise<FeedbackCycle[]> => {
  const cycles = await prisma.feedbackCycle.findMany({
    where: { companyId },
    orderBy: { startDate: 'desc' },
  })

  return cycles.map((c) => ({
    id: c.id,
    name: c.name,
    companyId: c.companyId,
    startDate: c.startDate,
    endDate: c.endDate,
  }))
})

// Get a specific cycle by ID
export const getCycleById = cache(async (
  cycleId: string,
  companyId: string
): Promise<FeedbackCycle | null> => {
  const cycle = await prisma.feedbackCycle.findFirst({
    where: {
      id: cycleId,
      companyId,
    },
  })

  if (!cycle) return null

  return {
    id: cycle.id,
    name: cycle.name,
    companyId: cycle.companyId,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
  }
})
