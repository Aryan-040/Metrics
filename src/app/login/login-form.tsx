'use client'

import { useActionState } from 'react'
import { login } from '@/lib/auth/actions'
import { FormState } from '@/lib/auth/types'

const initialState: FormState = {
  success: false,
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState)

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
        className="btn-primary"
      >
        {pending ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing In...
          </>
        ) : (
          <>
            Sign In to Dashboard →
          </>
        )}
      </button>
    </form>
  )
}
