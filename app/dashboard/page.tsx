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
import Spinner from '@/components/ui/Spinner'
import { formatINR } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { leads, loading, error } = useLeads()

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const pipelineValue = active.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0)
  const wonCount = leads.filter((l) => l.stage === 'Won').length
  const needsAttention = active.filter((l) => !l.nextAction).length

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Topbar />
      <NavTabs />

      <main className="flex-1 px-4 md:px-8 py-6 flex flex-col gap-6 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-text">Pipeline Overview</h1>
          <p className="text-sm text-text3 font-mono mt-1">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-surface border border-danger/30 rounded-xl p-6 text-center">
            <p className="text-danger text-sm font-body">{error}</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Active Leads"
                value={active.length}
                accent="text-accent2"
              />
              <StatCard
                label="Pipeline Value"
                value={formatINR(pipelineValue)}
                accent="text-accent"
              />
              <StatCard
                label="Won"
                value={wonCount}
                accent="text-accent"
              />
              <StatCard
                label="Needs Attention"
                value={needsAttention}
                accent={needsAttention > 0 ? 'text-warn' : 'text-text'}
                sub={needsAttention > 0 ? 'Missing next action date' : undefined}
              />
            </div>

            {/* Funnel Chart */}
            <FunnelChart leads={leads} />

            {/* Alert Panels */}
            <AlertPanel leads={leads} />
          </>
        )}
      </main>
    </div>
  )
}
