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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/30 mb-4">
              P
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Perf<span className="text-indigo-600">Eval</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Performance Evaluation & Trajectory Intelligence
            </p>
          </div>

          <LoginForm />

          {/* Quick Demo Credentials Panel */}
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Demo Accounts</span>
              <span className="text-xs text-slate-400 font-mono">pass: password123</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-1">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-1">Ashoka Textiles</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">Mgr:</span> priya@ashoka.com</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">HR:</span> hr@ashoka.com</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">Emp:</span> amit@ashoka.com</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-1">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-1">Bright Path</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">Founder:</span> sarah@brightpath.com</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">HR:</span> hr@brightpath.com</p>
                <p className="text-slate-600"><span className="text-slate-400 font-medium">Emp:</span> emily@brightpath.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
