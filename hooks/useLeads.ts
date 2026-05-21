'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Lead } from '@/lib/types'
import { fetchLeads } from '@/lib/api'

const CACHE_KEY = 'wolvio_leads_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function readCache(): Lead[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw) as { data: Lead[]; ts: number }
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(leads: Lead[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: leads, ts: Date.now() }))
  } catch {}
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      const cached = readCache()
      if (cached) {
        setLeads(cached)
        setLoading(false)
        // Refresh in background without showing loading state
        fetchLeads()
          .then((fresh) => { setLeads(fresh); writeCache(fresh) })
          .catch(() => {})
        return
      }
    }
    setLoading(true)
    setError(null)
    try {
      const data = await fetchLeads()
      setLeads(data)
      writeCache(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const reload = useCallback(() => load({ silent: false }), [load])

  return { leads, loading, error, reload }
}
