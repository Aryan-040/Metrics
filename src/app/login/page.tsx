import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { LoginForm } from './login-form'

export default async function LoginPage() {
  const session = await getSession()

  // If user is already authenticated, redirect to appropriate dashboard
  if (session?.userId) {
    if (session.roles?.includes('hr')) {
      redirect('/hr/dashboard')
    }
    redirect('/app/dashboard')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
      {/* LEFT HALF: MINIMAL HIGH-CRAFT BRAND SHOWCASE */}
      <div className="relative bg-slate-900 text-slate-100 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-r border-slate-800">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Perf<span className="text-indigo-400">Eval</span>
            </span>
          </div>
        </div>

        {/* Center Minimal Copy */}
        <div className="relative z-10 space-y-6 max-w-md my-auto py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Performance & Trajectory Intelligence
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Continuous evaluations, trajectory analytics, and transparent team growth tracking.
          </p>

          <div className="pt-2 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Interactive Trajectory Charts</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Multi-Parameter Ratings & Justifications</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>HR Compliance Monitoring</span>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} PerfEval Platform Inc.
        </div>
      </div>

      {/* RIGHT HALF: SLEEK SIGN IN CONTAINER */}
      <div className="relative bg-slate-100/70 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-xl space-y-5">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-500">
              Select a demo profile or enter your credentials
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
