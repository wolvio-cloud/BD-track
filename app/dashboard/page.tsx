'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLeads } from '@/hooks/useLeads'
import AppShell from '@/components/layout/AppShell'
import StatCard from '@/components/dashboard/StatCard'
import FunnelChart from '@/components/dashboard/FunnelChart'
import AlertPanel from '@/components/dashboard/AlertPanel'
import OwnerSummary from '@/components/dashboard/OwnerSummary'
import InsightBar from '@/components/dashboard/InsightBar'
import { StatCardSkeleton, FunnelSkeleton, AlertPanelSkeleton } from '@/components/ui/Skeleton'
import { formatINR } from '@/lib/utils'

const STAGE_PROBABILITY: Record<string, number> = {
  'Prospect': 0.10,
  'Discovery Call': 0.20,
  'Demo': 0.35,
  'Proposal': 0.50,
  'NDA Signed': 0.65,
  'Negotiation': 0.80,
  'Won': 1.00,
  'Lost': 0,
}

function isOverdue(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

function isTodayAction(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return false
  const today = new Date()
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
}

export default function DashboardPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { leads, loading, error } = useLeads()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) return null

  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const pipelineValue = active.reduce((s, l) => s + (parseFloat(l.value) || 0), 0)
  const weightedValue = leads.reduce((s, l) => s + (parseFloat(l.value) || 0) * (STAGE_PROBABILITY[l.stage] ?? 0), 0)
  const wonCount = leads.filter((l) => l.stage === 'Won').length
  const overdueCount = active.filter((l) => isOverdue(l.nextAction)).length
  const needsAttention = active.filter((l) => !l.nextAction).length + overdueCount
  const todayItems = active.filter((l) => isTodayAction(l.nextAction))
  const closeRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">

        {/* Page header */}
        <div className="bg-surface border-b border-border px-8 py-5 flex items-center justify-between" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
          <div>
            <p className="text-[11px] font-mono text-text3 uppercase tracking-[0.12em] mb-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-[24px] font-black text-text tracking-tight leading-none">Pipeline Overview</h1>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-text3">Welcome back</p>
            <p className="text-[15px] font-bold text-text">{user.name}</p>
          </div>
        </div>

        <main className="flex-1 px-6 py-6 flex flex-col gap-6">

          {loading ? (
            <>
              <p className="text-xs text-text3 font-mono">Connecting to Google Sheets… (may take up to 20s on first load)</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
              </div>
              <FunnelSkeleton />
              <AlertPanelSkeleton />
            </>
          ) : error ? (
            <div className="bg-surface border border-danger/30 rounded-2xl p-8 flex flex-col items-center gap-3" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <p className="text-danger text-sm font-body text-center">{error}</p>
              <p className="text-text3 text-xs font-mono text-center">Apps Script can be slow on first load — try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1 text-sm font-bold bg-accent text-white px-5 py-2 rounded-xl hover:opacity-90 transition-all"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Today banner */}
              {todayItems.length > 0 && (
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border animate-fade-up"
                  style={{
                    background: 'rgba(79,70,229,0.06)',
                    borderColor: 'rgba(79,70,229,0.2)',
                    boxShadow: '0 1px 3px rgba(79,70,229,0.08)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0 animate-pulse" />
                  <p className="text-[13px] font-semibold text-accent">
                    {todayItems.length} follow-up{todayItems.length > 1 ? 's' : ''} due today
                  </p>
                  <span className="text-text3 text-[13px]">—</span>
                  <p className="text-[13px] text-text2 truncate">
                    {todayItems.map((l) => l.company).join(' · ')}
                  </p>
                </div>
              )}

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Leads" value={active.length} accentColor="#4f46e5" delay={0} sub={`${leads.length} total in pipeline`} />
                <StatCard label="Pipeline Value" value={formatINR(pipelineValue)} accentColor="#0d9488" delay={60} sub={`${formatINR(weightedValue)} weighted`} />
                <StatCard label="Deals Won" value={wonCount} accentColor="#059669" delay={120} sub={wonCount > 0 ? `${closeRate}% close rate` : 'Keep pushing!'} />
                <StatCard
                  label="Needs Attention"
                  value={needsAttention}
                  accentColor={needsAttention > 0 ? '#d97706' : '#9ca3af'}
                  delay={180}
                  sub={overdueCount > 0 ? `${overdueCount} overdue · ${active.filter((l) => !l.nextAction).length} no date` : needsAttention > 0 ? 'Missing next action date' : 'All caught up'}
                />
              </div>

              {/* Insights */}
              <InsightBar leads={leads} />

              {/* Main grid — funnel + team side by side */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <div className="xl:col-span-3">
                  <FunnelChart leads={leads} />
                </div>
                <div className="xl:col-span-2">
                  <OwnerSummary leads={leads} />
                </div>
              </div>

              {/* Alert panel full width */}
              <AlertPanel leads={leads} />
            </>
          )}
        </main>
      </div>
    </AppShell>
  )
}
