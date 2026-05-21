'use client'

import type { Lead } from '@/lib/types'
import { formatINR } from '@/lib/utils'

const OWNERS = ['Madhan', 'Mani', 'Shifana']

function isOverdue(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

export default function OwnerSummary({ leads }: { leads: Lead[] }) {
  const rows = OWNERS.map((owner) => {
    const owned = leads.filter((l) => l.owner === owner)
    const active = owned.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
    const pipeline = active.reduce((s, l) => s + (parseFloat(l.value) || 0), 0)
    const overdueCount = active.filter((l) => isOverdue(l.nextAction)).length
    const noActionCount = active.filter((l) => !l.nextAction).length
    const wonCount = owned.filter((l) => l.stage === 'Won').length
    const closedCount = owned.filter((l) => l.stage === 'Won' || l.stage === 'Lost').length
    const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : null
    return { owner, active: active.length, pipeline, overdueCount, noActionCount, winRate }
  })

  return (
    <div
      className="bg-surface border border-border rounded-xl p-5 animate-fade-up"
      style={{ animationDelay: '600ms' }}
    >
      <div className="mb-5">
        <h2 className="text-[13px] font-semibold text-text">Team Performance</h2>
        <p className="text-[12px] text-text3 mt-0.5">Active pipeline per BD member</p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[460px]">
          <thead>
            <tr className="border-b border-border">
              {['Member', 'Active', 'Pipeline', 'Win Rate', 'Attention'].map((h) => (
                <th
                  key={h}
                  className="pb-2 text-left text-xs font-mono text-text3 uppercase tracking-widest pr-4 last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ owner, active, pipeline, overdueCount, noActionCount, winRate }) => {
              const attn = overdueCount + noActionCount
              return (
                <tr key={owner} className="border-b border-border last:border-0 group">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                        style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}
                      >
                        {owner[0]}
                      </div>
                      <span className="text-[13px] font-medium text-text">{owner}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[13px] font-mono font-semibold tabular text-accent">{active}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[13px] font-mono tabular" style={{ color: '#2dd4bf' }}>{pipeline > 0 ? formatINR(pipeline) : '—'}</span>
                  </td>
                  <td className="py-3 pr-4">
                    {winRate !== null ? (
                      <span className="text-sm font-mono text-text2">{winRate}%</span>
                    ) : (
                      <span className="text-sm font-mono text-text3">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {attn > 0 ? (
                      <span className="text-xs font-mono text-warn bg-warn/10 px-2 py-0.5 rounded-full">
                        {attn} {attn === 1 ? 'lead' : 'leads'}
                      </span>
                    ) : (
                      <span className="text-[12px] font-medium" style={{ color: '#10b981' }}>Clear</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
