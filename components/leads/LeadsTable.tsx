'use client'

import { useState } from 'react'
import LeadRow from './LeadRow'
import type { Lead, User } from '@/lib/types'

type SortCol = 'company' | 'stage' | 'value' | 'quality' | 'nextAction' | 'owner' | null

const COLUMNS: { label: string; col: SortCol }[] = [
  { label: 'Lead ID', col: null },
  { label: 'Company', col: 'company' },
  { label: 'Contact / Title', col: null },
  { label: 'Product', col: null },
  { label: 'Stage', col: 'stage' },
  { label: 'Value (INR)', col: 'value' },
  { label: 'Quality', col: 'quality' },
  { label: 'Next Action', col: 'nextAction' },
  { label: 'Owner', col: 'owner' },
  { label: '', col: null },
]

const QUALITY_ORDER: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

function sortLeads(leads: Lead[], col: SortCol, dir: 'asc' | 'desc'): Lead[] {
  if (!col) return leads
  return [...leads].sort((a, b) => {
    let va: string | number = ''
    let vb: string | number = ''
    if (col === 'value') {
      va = parseFloat(a.value || '0')
      vb = parseFloat(b.value || '0')
    } else if (col === 'nextAction') {
      va = a.nextAction ? new Date(a.nextAction).getTime() : 0
      vb = b.nextAction ? new Date(b.nextAction).getTime() : 0
    } else if (col === 'quality') {
      va = QUALITY_ORDER[a.quality] ?? 3
      vb = QUALITY_ORDER[b.quality] ?? 3
    } else {
      va = (a[col as keyof Lead] as string) ?? ''
      vb = (b[col as keyof Lead] as string) ?? ''
    }
    if (va < vb) return dir === 'asc' ? -1 : 1
    if (va > vb) return dir === 'asc' ? 1 : -1
    return 0
  })
}

interface LeadsTableProps {
  leads: Lead[]
  currentUser: User
  onEdit: (lead: Lead) => void
  onView: (lead: Lead) => void
}

export default function LeadsTable({ leads, currentUser, onEdit, onView }: LeadsTableProps) {
  const [sortCol, setSortCol] = useState<SortCol>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(col: SortCol) {
    if (!col) return
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sorted = sortLeads(leads, sortCol, sortDir)

  if (leads.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-text2 font-body text-sm">No leads match your filters.</p>
        <p className="text-text3 font-mono text-xs">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {COLUMNS.map(({ label, col }) => (
                <th
                  key={label}
                  onClick={() => handleSort(col)}
                  className={`px-4 py-3 text-left text-xs font-mono text-text3 uppercase tracking-widest whitespace-nowrap select-none ${
                    col ? 'cursor-pointer hover:text-text2 transition-colors' : ''
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {col && (
                      <span className="text-[10px] leading-none">
                        {sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead) => (
              <LeadRow
                key={lead.rowIndex}
                lead={lead}
                currentUser={currentUser}
                onEdit={onEdit}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-border">
        <span className="text-xs font-mono text-text3">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
          {sortCol && (
            <span className="ml-2 text-text3">
              · sorted by {sortCol} {sortDir === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
