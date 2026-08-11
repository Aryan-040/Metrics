export interface FeedbackParameter {
  id: string
  name: string
  description: string
  displayOrder: number
}

export interface FeedbackScore {
  parameterId: string
  parameterName: string
  score: number
  justification: string
}

export interface Feedback {
  id: string
  managerId: string
  managerName: string
  employeeId: string
  employeeName: string
  feedbackCycleId: string
  cycleName: string
  scores: FeedbackScore[]
  submittedAt: Date
}

export interface FeedbackSubmission {
  employeeId: string
  feedbackCycleId: string
  scores: Array<{
    parameterId: string
    score: number
    justification: string
  }>
}

export interface FeedbackFormState {
  success: boolean
  errors?: {
    [key: string]: string[]
  }
  message?: string
}
