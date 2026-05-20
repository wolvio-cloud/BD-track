'use client'

import { formatINR } from '@/lib/utils'
import type { Lead } from '@/lib/types'

interface AlertPanelProps {
  leads: Lead[]
}

function NoActionPanel({ leads }: { leads: Lead[] }) {
  const items = leads.filter((l) => !l.nextAction && l.stage !== 'Won' && l.stage !== 'Lost')
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex-1 min-w-0">
      <h2 className="text-sm font-mono text-text3 uppercase tracking-widest mb-1">
        No Next Action
      </h2>
      <p className="text-xs text-text3 font-body mb-4">Active leads missing a follow-up date</p>
      {items.length === 0 ? (
        <p className="text-xs text-text3 font-mono text-center py-6">All caught up ✓</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.slice(0, 8).map((lead) => (
            <li
              key={lead.rowIndex}
              className="flex items-center justify-between gap-2 text-xs font-body py-2 border-b border-border last:border-0"
            >
              <span className="text-text font-medium truncate">{lead.company}</span>
              <span className="text-text3 shrink-0">{lead.stage}</span>
              <span className="text-text2 shrink-0">{lead.owner}</span>
            </li>
          ))}
          {items.length > 8 && (
            <li className="text-xs text-text3 font-mono text-center pt-1">
              +{items.length - 8} more
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

function HighOpportunityPanel({ leads }: { leads: Lead[] }) {
  const items = leads
    .filter((l) => l.quality === 'High' && l.stage !== 'Won' && l.stage !== 'Lost')
    .sort((a, b) => parseFloat(b.value || '0') - parseFloat(a.value || '0'))
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex-1 min-w-0">
      <h2 className="text-sm font-mono text-text3 uppercase tracking-widest mb-1">
        High Opportunity
      </h2>
      <p className="text-xs text-text3 font-body mb-4">High quality leads in active stages</p>
      {items.length === 0 ? (
        <p className="text-xs text-text3 font-mono text-center py-6">No high-quality leads yet</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.slice(0, 8).map((lead) => (
            <li
              key={lead.rowIndex}
              className="flex items-center justify-between gap-2 text-xs font-body py-2 border-b border-border last:border-0"
            >
              <span className="text-text font-medium truncate">{lead.company}</span>
              <span className="text-text3 shrink-0">{lead.stage}</span>
              <span className="text-accent font-mono shrink-0">{formatINR(lead.value)}</span>
            </li>
          ))}
          {items.length > 8 && (
            <li className="text-xs text-text3 font-mono text-center pt-1">
              +{items.length - 8} more
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default function AlertPanel({ leads }: AlertPanelProps) {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <NoActionPanel leads={leads} />
      <HighOpportunityPanel leads={leads} />
    </div>
  )
}
