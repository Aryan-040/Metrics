export type UserRole = 'employee' | 'manager' | 'hr'

export interface User {
  id: string
  email: string
  name: string
  companyId: string
  companyName: string
  roles: UserRole[]
}

export interface SessionPayload {
  userId: string
  companyId: string
  roles: UserRole[]
  expiresAt: Date
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface FormState {
  success: boolean
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
}

// Helper functions for checking user roles (client & server safe)
export function hasRole(roles: UserRole[], requiredRole: UserRole): boolean {
  return roles.includes(requiredRole)
}

export function isManager(roles: UserRole[]): boolean {
  return hasRole(roles, 'manager')
}

export function isHR(roles: UserRole[]): boolean {
  return hasRole(roles, 'hr')
}

