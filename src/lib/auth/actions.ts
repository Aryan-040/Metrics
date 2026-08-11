'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { prisma } from '../db'
import { createSession, deleteSession } from './session'
import { FormState, UserRole } from './types'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function login(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  // Validate form fields
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
      include: { company: true },
    })

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Create session
    await createSession(user.id, user.companyId, user.roles as UserRole[])

    // Determine redirect based on role
    const roles = user.roles as UserRole[]
    if (roles.includes('hr')) {
      redirect('/hr/dashboard')
    } else {
      redirect('/app/dashboard')
    }
  } catch (error) {
    // Check if it's a redirect (Next.js throws NEXT_REDIRECT)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    
    console.error('Login error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
