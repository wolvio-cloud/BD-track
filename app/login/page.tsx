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
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display font-extrabold text-4xl text-text tracking-tight">
            Wolvio<span className="text-accent">.</span>
          </h1>
          <p className="mt-2 text-sm text-text3 font-mono">Pipeline Intelligence</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <h2 className="text-lg font-display font-semibold text-text mb-6">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name dropdown */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-xs font-mono text-text2 uppercase tracking-widest"
              >
                Your Name
              </label>
              <select
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-accent2 transition-colors font-body cursor-pointer"
              >
                {NAMES.map((n) => (
                  <option key={n} value={n} className="bg-surface2">
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* PIN input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="pin"
                className="text-xs font-mono text-text2 uppercase tracking-widest"
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''))
                  setError('')
                }}
                placeholder="••••••"
                autoComplete="current-password"
                className="w-full bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-3 placeholder-text3 focus:outline-none focus:border-accent2 transition-colors font-mono tracking-[0.3em]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-danger text-sm font-body text-center -mt-1">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-accent text-bg font-display font-bold text-sm py-3 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <p className="text-center text-xs text-text3 font-mono mt-6">
          Wolvio Solutions Pvt Ltd — Internal Use Only
        </p>
      </div>
    </main>
  )
}
