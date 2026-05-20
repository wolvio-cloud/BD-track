'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLeads } from '@/hooks/useLeads'
import Topbar from '@/components/layout/Topbar'
import NavTabs from '@/components/layout/NavTabs'
import StatCard from '@/components/dashboard/StatCard'
import FunnelChart from '@/components/dashboard/FunnelChart'
import AlertPanel from '@/components/dashboard/AlertPanel'
import { StatCardSkeleton, FunnelSkeleton, AlertPanelSkeleton } from '@/components/ui/Skeleton'
import { formatINR } from '@/lib/utils'

export default function DashboardPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { leads, loading, error } = useLeads()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) return null

  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const pipelineValue = active.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0)
  const wonCount = leads.filter((l) => l.stage === 'Won').length
  const needsAttention = active.filter((l) => !l.nextAction).length
  const closeRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <NavTabs />

      <main className="flex-1 px-4 md:px-8 py-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
        <div className="animate-fade-up flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-mono text-text3 mb-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <h1 className="font-display font-extrabold text-3xl text-text tracking-tight">
              Pipeline Overview
            </h1>
          </div>
          <p className="text-sm font-body text-text3 mb-0.5">
            Welcome back, <span className="text-text font-medium">{user.name}</span>
          </p>
        </div>

        {loading ? (
          <>
            <p className="text-xs text-text3 font-mono -mt-2">
              Connecting to Google Sheets… (may take up to 20s on first load)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
            <FunnelSkeleton />
            <AlertPanelSkeleton />
          </>
        ) : error ? (
          <div className="bg-surface border border-danger/30 rounded-2xl p-8 flex flex-col items-center gap-3">
            <p className="text-danger text-sm font-body text-center">{error}</p>
            <p className="text-text3 text-xs font-mono text-center">
              Apps Script can be slow on first load — try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1 text-sm font-display font-bold bg-accent text-bg px-5 py-2 rounded-lg hover:bg-accent/90 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Active Leads"
                value={active.length}
                icon="◉"
                accentColor="#818cf8"
                delay={0}
                sub={`${leads.length} total in pipeline`}
              />
              <StatCard
                label="Pipeline Value"
                value={formatINR(pipelineValue)}
                icon="◈"
                accentColor="#6ee7b7"
                delay={50}
                sub="active leads only"
              />
              <StatCard
                label="Deals Won"
                value={wonCount}
                icon="★"
                accentColor="#6ee7b7"
                delay={100}
                sub={wonCount > 0 ? `${closeRate}% close rate` : 'Keep pushing!'}
              />
              <StatCard
                label="Needs Attention"
                value={needsAttention}
                icon="⚠"
                accentColor={needsAttention > 0 ? '#fb923c' : '#5a5870'}
                delay={150}
                sub={needsAttention > 0 ? 'Missing next action date' : 'All caught up'}
              />
            </div>
            <FunnelChart leads={leads} />
            <AlertPanel leads={leads} />
          </>
        )}
      </main>
    </div>
  )
}
