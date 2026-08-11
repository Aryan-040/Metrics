import { redirect } from 'next/navigation'
import { getCurrentUser, isHR } from '@/lib/auth/dal'
import { HRNavigation } from '@/components/layout/hr-navigation'

export default async function HRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Redirect non-HR users
  if (!isHR(user.roles)) {
    redirect('/app/dashboard?error=unauthorized')
  }

  return (
    <div className="min-h-screen relative z-10">
      <HRNavigation user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
