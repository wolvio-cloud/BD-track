'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/api'
import { getUser, setUser } from '@/lib/auth'
import Spinner from '@/components/ui/Spinner'

const NAMES = ['Madhan', 'Mani', 'Shifana'] as const

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState<string>(NAMES[0])
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getUser()) router.replace('/dashboard')
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!pin.trim()) {
      setError('Please enter your PIN.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const user = await loginUser(name, pin)
      setUser(user)
      router.replace('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid name or PIN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">

        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-text tracking-tight">
            Wolvio <span className="text-text3 font-normal">BD Track</span>
          </h1>
          <p className="mt-1 text-[13px] text-text3">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[11px] font-medium text-text3 uppercase tracking-[0.08em]">
                Name
              </label>
              <select
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface2 border border-border text-text text-[13px] rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent transition-colors cursor-pointer"
              >
                {NAMES.map((n) => (
                  <option key={n} value={n} className="bg-surface2">{n}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pin" className="text-[11px] font-medium text-text3 uppercase tracking-[0.08em]">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="••••••"
                autoComplete="current-password"
                className="w-full bg-surface2 border border-border text-text text-[13px] rounded-lg px-3 py-2.5 placeholder-text3 focus:outline-none focus:border-accent transition-colors font-mono tracking-[0.25em]"
              />
            </div>

            {error && (
              <p className="text-[13px] text-danger text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-accent text-white font-semibold text-[13px] py-2.5 rounded-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-text3 mt-6">
          Wolvio Solutions — Internal use only
        </p>
      </div>
    </main>
  )
}
