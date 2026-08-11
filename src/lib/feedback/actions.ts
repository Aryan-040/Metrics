'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '../db'
import { verifySession } from '../auth/dal'
import { isActiveDirectReport } from '../relationships'
import { getCurrentCycle } from '../cycles'
import { feedbackExists, getFeedbackParameters } from './queries'
import { FeedbackFormState } from './types'

const scoreSchema = z.object({
  parameterId: z.string().uuid(),
  score: z.coerce.number().int().min(1, 'Score must be at least 1').max(5, 'Score must be at most 5'),
  justification: z.string().min(1, 'Justification is required').trim(),
})

const feedbackSchema = z.object({
  employeeId: z.string().uuid(),
  scores: z.array(scoreSchema).length(5, 'All 5 parameters must be scored'),
})

export async function submitFeedback(
  prevState: FeedbackFormState | undefined,
  formData: FormData
): Promise<FeedbackFormState> {
  // Verify authentication
  const session = await verifySession()

  // Get current cycle
  const currentCycle = await getCurrentCycle(session.companyId)
  if (!currentCycle) {
    return {
      success: false,
      message: 'No active feedback cycle found.',
    }
  }

  // Parse form data
  const employeeId = formData.get('employeeId') as string
  const parameters = await getFeedbackParameters()
  
  const scores = parameters.map((param) => ({
    parameterId: param.id,
    score: formData.get(`score_${param.id}`),
    justification: formData.get(`justification_${param.id}`),
  }))

  // Validate input
  const validatedFields = feedbackSchema.safeParse({
    employeeId,
    scores,
  })

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    const errors: { [key: string]: string[] } = {}
    
    // Map array errors to individual field errors
    if (fieldErrors.scores) {
      validatedFields.error.issues.forEach((err) => {
        if (err.path[0] === 'scores' && typeof err.path[1] === 'number') {
          const index = err.path[1]
          const field = err.path[2] as string
          const paramId = parameters[index]?.id
          if (paramId) {
            const key = `${field}_${paramId}`
            errors[key] = errors[key] || []
            errors[key].push(err.message)
          }
        }
      })
    }
    
    if (fieldErrors.employeeId) {
      errors.employeeId = fieldErrors.employeeId
    }

    return {
      success: false,
      errors,
      message: 'Please correct the errors below.',
    }
  }

  const { employeeId: validEmployeeId, scores: validScores } = validatedFields.data

  // Verify manager relationship
  const isDirectReport = await isActiveDirectReport(
    session.userId,
    validEmployeeId,
    session.companyId
  )

  if (!isDirectReport) {
    return {
      success: false,
      message: 'You can only submit feedback for your direct reports.',
    }
  }

  // Check for duplicate feedback
  const alreadyExists = await feedbackExists(
    session.userId,
    validEmployeeId,
    currentCycle.id
  )

  if (alreadyExists) {
    return {
      success: false,
      message: 'Feedback has already been submitted for this employee this cycle.',
    }
  }

  try {
    // Create feedback with scores in a transaction
    await prisma.$transaction(async (tx) => {
      const feedback = await tx.feedback.create({
        data: {
          companyId: session.companyId,
          managerId: session.userId,
          employeeId: validEmployeeId,
          feedbackCycleId: currentCycle.id,
        },
      })

      await tx.feedbackScore.createMany({
        data: validScores.map((score) => ({
          feedbackId: feedback.id,
          parameterId: score.parameterId,
          score: score.score,
          justification: score.justification,
        })),
      })
    })

    // Revalidate relevant paths
    revalidatePath('/app/dashboard')
    revalidatePath('/app/give-feedback')
    revalidatePath('/app/team')
    revalidatePath('/hr/missing-feedback')
    
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return {
      success: false,
      message: 'Failed to submit feedback. Please try again.',
    }
  }

  // Redirect to dashboard on success
  redirect('/app/dashboard?success=feedback-submitted')
}
