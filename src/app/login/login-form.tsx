'use client'

import { useActionState, useState } from 'react'
import { login } from '@/lib/auth/actions'
import { FormState } from '@/lib/auth/types'

const initialState: FormState = {
  success: false,
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
            <span>{state.message}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="form-label">
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="form-input"
            placeholder="you@company.com"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="form-input"
            placeholder="••••••••••••"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-primary py-3 text-xs font-bold tracking-wide"
        >
          {pending ? (
            <span>Signing In...</span>
          ) : (
            <span>Sign In to Dashboard →</span>
          )}
        </button>
      </form>

      {/* Interactive Demo Profiles Section (2-Column Grid Layout) */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Select Demo Profile
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Password: password123</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Ashoka Group */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
              Ashoka Textiles
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('priya@ashoka.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-200 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate leading-tight">Priya Sharma</p>
                  <p className="text-[10px] text-slate-400 truncate">Manager</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('hr@ashoka.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-purple-50/70 hover:border-purple-200 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-purple-600 truncate leading-tight">Ananya Roy</p>
                  <p className="text-[10px] text-slate-400 truncate">HR Director</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('amit@ashoka.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-900 truncate leading-tight">Amit Kumar</p>
                  <p className="text-[10px] text-slate-400 truncate">Software Engineer</p>
                </div>
              </button>
            </div>
          </div>

          {/* Bright Path Group */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
              Bright Path Solutions
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('sarah@brightpath.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-200 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  S
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-indigo-600 truncate leading-tight">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-400 truncate">Founder & Manager</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('hr@brightpath.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-purple-50/70 hover:border-purple-200 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  D
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-purple-600 truncate leading-tight">David Miller</p>
                  <p className="text-[10px] text-slate-400 truncate">HR Lead</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('emily@brightpath.com')}
                className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all flex items-center gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  E
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-900 truncate leading-tight">Emily Watson</p>
                  <p className="text-[10px] text-slate-400 truncate">Product Designer</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
