'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, isManager } from '@/lib/auth'
import { LogoutButton } from './logout-button'

interface AppNavigationProps {
  user: User
}

export function AppNavigation({ user }: AppNavigationProps) {
  const pathname = usePathname()
  const userIsManager = isManager(user.roles)

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', show: true },
    { name: 'My Feedback', href: '/app/my-feedback', show: true },
    { name: 'Give Feedback', href: '/app/give-feedback', show: userIsManager },
    { name: 'Team', href: '/app/team', show: userIsManager },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/app/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">PerfEval</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navigation.filter(item => item.show).map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.companyName}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden border-t border-gray-200 px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {navigation.filter(item => item.show).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
