import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { prisma } from '../db'
import { User, UserRole } from './types'

// Verify session and return user data - memoized per request
export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/login')
  }

  return {
    isAuth: true,
    userId: session.userId,
    companyId: session.companyId,
    roles: session.roles,
  }
})

// Get current user with full details
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession()
  
  if (!session?.userId) {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { company: true },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      companyId: user.companyId,
      companyName: user.company.name,
      roles: user.roles as UserRole[],
    }
  } catch {
    console.log('Failed to fetch user')
    return null
  }
})

// Check if user has a specific role, is manager, or is HR
export { hasRole, isManager, isHR } from './types'

// Require specific roles - redirects if not authorized
export const requireRole = cache(async (requiredRoles: UserRole[]) => {
  const session = await verifySession()
  
  const hasRequiredRole = requiredRoles.some(role => session.roles.includes(role))
  
  if (!hasRequiredRole) {
    redirect('/app/dashboard?error=unauthorized')
  }
  
  return session
})
