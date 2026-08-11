export interface ManagerComplianceStatus {
  managerId: string
  managerName: string
  managerEmail: string
  totalDirectReports: number
  completedFeedback: number
  pendingFeedback: number
}
