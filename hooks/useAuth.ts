'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'
import { getUser, clearUser } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(getUser())
  }, [])

  const logout = useCallback(() => {
    clearUser()
    setUser(null)
    router.replace('/login')
  }, [router])

  return { user, logout }
}
