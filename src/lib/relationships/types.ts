export interface ManagerRelationship {
  id: string
  managerId: string
  managerName: string
  directReportId: string
  directReportName: string
  companyId: string
  startDate: Date
  endDate: Date | null
}

export interface DirectReportWithStatus {
  id: string
  name: string
  email: string
  hasFeedbackThisCycle: boolean
}
