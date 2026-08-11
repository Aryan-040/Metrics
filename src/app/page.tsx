import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export default async function Home() {
  const session = await getSession()
  
  if (session) {
    // Redirect based on role
    if (session.roles.includes('hr')) {
      redirect('/hr/dashboard')
    }
    redirect('/app/dashboard')
  }
  
  redirect('/login')
}
