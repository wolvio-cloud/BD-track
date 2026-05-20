'use client'

import { formatINR, formatDate, STAGE_COLORS } from '@/lib/utils'
import type { Lead } from '@/lib/types'

function isOverdue(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

function AttentionPanel({ leads }: { leads: Lead[] }) {
  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const overdue = active.filter((l) => l.nextAction && isOverdue(l.nextAction))
  const noAction = active.filter((l) => !l.nextAction)
  const items = [
    ...overdue.map((l) => ({ lead: l, type: 'overdue' as const })),
    ...noAction.map((l) => ({ lead: l, type: 'none' as const })),
  ].slice(0, 8)
  const urgentCount = overdue.length + noAction.length

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-6 flex-1 min-w-0 animate-fade-up"
      style={{ animationDelay: '400ms' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-display font-semibold text-text">Needs Attention</h2>
          <p className="text-xs font-mono text-text3 mt-0.5">Overdue or missing follow-ups</p>
        </div>
        {urgentCount > 0 && (
          <span className="text-xs font-mono bg-warn/10 text-warn px-2.5 py-1 rounded-full shrink-0">
            {urgentCount} leads
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="text-xl text-accent">✓</span>
          <p className="text-xs font-mono text-accent">All caught up</p>
          <p className="text-xs font-mono text-text3">Every active lead has a follow-up date</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {items.map(({ lead, type }) => {
            const colors = STAGE_COLORS[lead.stage]
            return (
              <li
                key={lead.rowIndex}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${type === 'overdue' ? 'bg-danger' : 'bg-warn'}`}
                />
                <span className="text-sm font-body font-medium text-text truncate flex-1">
                  {lead.company}
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
                  style={{ color: colors?.text ?? '#9d9bbb', background: `${colors?.text ?? '#9d9bbb'}15` }}
                >
                  {lead.stage}
                </span>
                {type === 'overdue' ? (
                  <span className="text-xs font-mono text-danger shrink-0">{formatDate(lead.nextAction)}</span>
                ) : (
                  <span className="text-xs font-mono text-warn shrink-0">No date</span>
                )}
              </li>
            )
          })}
          {urgentCount > 8 && (
            <li className="text-xs text-text3 font-mono text-center pt-2">+{urgentCount - 8} more</li>
          )}
        </ul>
      )}
    </div>
  )
}

function OpportunityPanel({ leads }: { leads: Lead[] }) {
  const items = leads
    .filter((l) => l.quality === 'High' && l.stage !== 'Won' && l.stage !== 'Lost')
    .sort((a, b) => parseFloat(b.value || '0') - parseFloat(a.value || '0'))
    .slice(0, 8)

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-6 flex-1 min-w-0 animate-fade-up"
      style={{ animationDelay: '500ms' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-display font-semibold text-text">High Opportunity</h2>
          <p className="text-xs font-mono text-text3 mt-0.5">Top active leads by quality &amp; value</p>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-mono bg-accent/10 text-accent px-2.5 py-1 rounded-full shrink-0">
            {items.length} leads
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <p className="text-xs font-mono text-text3 text-center">No high-quality leads yet</p>
          <p className="text-xs font-mono text-text3 text-center">Mark leads as "High" quality to see them here</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {items.map((lead, i) => {
            const colors = STAGE_COLORS[lead.stage]
            return (
              <li key={lead.rowIndex} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="text-xs font-mono text-text3 w-4 shrink-0 text-right">{i + 1}</span>
                <span className="text-sm font-body font-medium text-text truncate flex-1">{lead.company}</span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full shrink-0 hidden sm:inline"
                  style={{ color: colors?.text ?? '#9d9bbb', background: `${colors?.text ?? '#9d9bbb'}15` }}
                >
                  {lead.stage}
                </span>
                <span className="text-sm font-mono font-bold text-accent shrink-0">{formatINR(lead.value)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function AlertPanel({ leads }: { leads: Lead[] }) {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <AttentionPanel leads={leads} />
      <OpportunityPanel leads={leads} />
    </div>
  )
}
