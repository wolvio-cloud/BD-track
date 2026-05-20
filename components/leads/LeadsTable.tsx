'use client'

import LeadRow from './LeadRow'
import type { Lead, User } from '@/lib/types'

const COLUMNS = [
  'Lead ID',
  'Company',
  'Contact / Title',
  'Product',
  'Stage',
  'Value (INR)',
  'Quality',
  'Next Action',
  'Owner',
  '',
]

interface LeadsTableProps {
  leads: Lead[]
  currentUser: User
  onEdit: (lead: Lead) => void
}

export default function LeadsTable({ leads, currentUser, onEdit }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-4xl">📋</span>
        <p className="text-text2 font-body text-sm">No leads match your filters.</p>
        <p className="text-text3 font-mono text-xs">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-mono text-text3 uppercase tracking-widest whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow
                key={lead.rowIndex}
                lead={lead}
                currentUser={currentUser}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-border">
        <span className="text-xs font-mono text-text3">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}
