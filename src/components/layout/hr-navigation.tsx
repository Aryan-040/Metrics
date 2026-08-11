'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@/lib/auth'
import { LogoutButton } from './logout-button'

interface HRNavigationProps {
  user: User
}

export function HRNavigation({ user }: HRNavigationProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/hr/dashboard' },
    { name: 'Missing Feedback', href: '/hr/missing-feedback' },
  ]

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/hr/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                HR
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-purple-600 transition-colors">
                  Perf<span className="text-purple-600">Eval</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  HR Portal
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-purple-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/app/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
            >
              Employee View →
            </Link>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                  {user.companyName}
                </p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-slate-200/80 px-4 py-2 bg-slate-50/80">
        <div className="flex flex-wrap gap-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
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
