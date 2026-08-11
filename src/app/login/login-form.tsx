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
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            placeholder="you@company.com"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            placeholder="••••••••••••"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {pending ? (
            <span>Signing In...</span>
          ) : (
            <span>Sign In to Workspace →</span>
          )}
        </button>
      </form>

      {/* Subtle Monochrome Demo Profiles Selector */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Click on Demo Profile to Sign In
          </span>
          <span className="text-[11px] text-slate-400 font-mono">pass: password123</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Ashoka Group */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
              Ashoka Textiles
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fillDemoAccount('priya@ashoka.com')}
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  P
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">Priya Sharma</p>
                  <p className="text-[10px] text-slate-500 truncate">Manager</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('hr@ashoka.com')}
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  A
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">Ananya Roy</p>
                  <p className="text-[10px] text-slate-500 truncate">HR Director</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('amit@ashoka.com')}
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  A
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">Amit Kumar</p>
                  <p className="text-[10px] text-slate-500 truncate">Software Engineer</p>
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
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  S
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-500 truncate">Founder & Manager</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('hr@brightpath.com')}
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  D
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">David Miller</p>
                  <p className="text-[10px] text-slate-500 truncate">HR Lead</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('emily@brightpath.com')}
                className="w-full text-left p-2.5 bg-slate-50/80 hover:bg-white hover:border-slate-300 border border-slate-200/80 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-slate-200/80 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 transition-colors duration-150">
                  E
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-800 group-hover:text-slate-950 transition-colors duration-150 truncate leading-tight">Emily Watson</p>
                  <p className="text-[10px] text-slate-500 truncate">Product Designer</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
