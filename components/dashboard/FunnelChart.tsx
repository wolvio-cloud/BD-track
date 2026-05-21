'use client'

import { STAGE_COLORS } from '@/lib/utils'
import type { Lead } from '@/lib/types'

const ACTIVE_STAGES = ['Prospect', 'Discovery Call', 'Demo', 'Proposal', 'NDA Signed', 'Negotiation']
const CLOSED_STAGES = ['Won', 'Lost']

export default function FunnelChart({ leads }: { leads: Lead[] }) {
  const total = leads.length

  const count = (stage: string) => leads.filter((l) => l.stage === stage).length
  const maxActive = Math.max(...ACTIVE_STAGES.map(count), 1)

  const wonCount = count('Won')
  const lostCount = count('Lost')
  const closedTotal = wonCount + lostCount
  const winRate = closedTotal > 0 ? Math.round((wonCount / closedTotal) * 100) : null

  const activeLeads = leads.filter((l) => !['Won', 'Lost'].includes(l.stage))
  const avgValue =
    activeLeads.filter((l) => parseFloat(l.value) > 0).length > 0
      ? activeLeads.reduce((s, l) => s + (parseFloat(l.value) || 0), 0) /
        activeLeads.filter((l) => parseFloat(l.value) > 0).length
      : null

  return (
    <div className="relative bg-surface border border-border rounded-xl p-5 animate-fade-up overflow-hidden" style={{ animationDelay: '200ms' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(99,102,241,0.07) 0%, transparent 50%)' }} />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[13px] font-semibold text-text">Pipeline Funnel</h2>
          <p className="text-[12px] text-text3 mt-0.5">{total} total leads across all stages</p>
        </div>
        <div className="flex items-center gap-2">
          {winRate !== null && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full" style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)' }}>
              {winRate}% win rate
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-2">
        {/* Active stages */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] text-text3 uppercase tracking-[0.08em] mb-2">Active</p>
          {ACTIVE_STAGES.map((stage) => {
            const c = count(stage)
            const barPct = Math.round((c / maxActive) * 100)
            const ofTotal = total > 0 ? Math.round((c / total) * 100) : 0
            const colors = STAGE_COLORS[stage]
            return (
              <div key={stage} className="flex items-center gap-3 group/row">
                <span className="w-24 text-xs font-mono text-text2 shrink-0 text-right leading-tight group-hover/row:text-text transition-colors">
                  {stage}
                </span>
                <div className="flex-1 h-5 bg-surface2 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-700 ease-out"
                    style={{
                      width: c === 0 ? '0%' : `${barPct}%`,
                      backgroundColor: colors?.text ?? '#9d9bbb',
                      opacity: c === 0 ? 0 : 0.75,
                    }}
                  />
                </div>
                <div className="w-14 flex items-center justify-end gap-1.5 shrink-0">
                  <span className="text-[13px] font-semibold tabular" style={{ color: c > 0 ? colors?.text : '#44445c' }}>
                    {c}
                  </span>
                  {c > 0 && (
                    <span className="text-xs font-mono text-text3">{ofTotal}%</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Closed + mini stats */}
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] text-text3 uppercase tracking-[0.08em] mb-2">Closed</p>
          {CLOSED_STAGES.map((stage) => {
            const c = count(stage)
            const ofTotal = total > 0 ? Math.round((c / total) * 100) : 0
            const colors = STAGE_COLORS[stage]
            return (
              <div key={stage} className="flex items-center gap-3 group/row">
                <span className="w-24 text-xs font-mono text-text2 shrink-0 text-right group-hover/row:text-text transition-colors">
                  {stage}
                </span>
                <div className="flex-1 h-5 bg-surface2 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-700 ease-out"
                    style={{
                      width: c === 0 || total === 0 ? '0%' : `${ofTotal}%`,
                      backgroundColor: colors?.text ?? '#9d9bbb',
                      opacity: c === 0 ? 0 : 0.75,
                    }}
                  />
                </div>
                <div className="w-14 flex items-center justify-end gap-1.5 shrink-0">
                  <span className="text-[13px] font-semibold tabular" style={{ color: c > 0 ? colors?.text : '#44445c' }}>
                    {c}
                  </span>
                  {c > 0 && (
                    <span className="text-xs font-mono text-text3">{ofTotal}%</span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Mini stat grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-surface2 border border-border rounded-lg p-4">
              <p className="text-[11px] text-text3 uppercase tracking-wider mb-2">Win Rate</p>
              <p className="text-[22px] font-semibold tabular leading-none" style={{ color: '#10b981' }}>
                {winRate !== null ? `${winRate}%` : '—'}
              </p>
              <p className="text-[11px] text-text3 mt-1.5">
                {closedTotal > 0 ? `${wonCount} of ${closedTotal} closed` : 'No closed deals yet'}
              </p>
            </div>
            <div className="bg-surface2 border border-border rounded-lg p-4">
              <p className="text-[11px] text-text3 uppercase tracking-wider mb-2">Avg Value</p>
              <p className="text-[22px] font-semibold tabular leading-none" style={{ color: '#2dd4bf' }}>
                {avgValue
                  ? avgValue >= 1e7
                    ? `₹${(avgValue / 1e7).toFixed(1)}Cr`
                    : avgValue >= 1e5
                    ? `₹${(avgValue / 1e5).toFixed(1)}L`
                    : `₹${Math.round(avgValue).toLocaleString('en-IN')}`
                  : '—'}
              </p>
              <p className="text-[11px] text-text3 mt-1.5">active leads with value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
