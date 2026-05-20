'use client'

import StageBadge from '@/components/ui/StageBadge'
import { formatINR, formatDate } from '@/lib/utils'
import type { Lead, User } from '@/lib/types'

interface LeadRowProps {
  lead: Lead
  currentUser: User
  onEdit: (lead: Lead) => void
}

const qualityColor: Record<string, string> = {
  High: 'text-accent',
  Medium: 'text-warn',
  Low: 'text-text3',
}

function isOverdue(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

export default function LeadRow({ lead, currentUser, onEdit }: LeadRowProps) {
  const canEdit = currentUser.role === 'Founder' || lead.owner === currentUser.name
  const closed = lead.stage === 'Won' || lead.stage === 'Lost'
  const overdue = !closed && isOverdue(lead.nextAction)

  return (
    <tr
      className={`border-b border-border transition-colors ${
        overdue ? 'bg-danger/5 hover:bg-danger/10' : 'hover:bg-surface2/60'
      }`}
    >
      <td className="px-4 py-3 text-xs font-mono text-text3 whitespace-nowrap">
        {lead.leadId || '—'}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-body font-medium text-text">{lead.company}</span>
        {lead.location && (
          <span className="block text-xs text-text3 font-mono mt-0.5">{lead.location}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-body text-text">{lead.contact}</span>
        {lead.designation && (
          <span className="block text-xs text-text3 font-mono mt-0.5">{lead.designation}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm font-body text-text2 whitespace-nowrap">
        {lead.product || '—'}
      </td>
      <td className="px-4 py-3">
        <StageBadge stage={lead.stage} />
      </td>
      <td className="px-4 py-3 text-sm font-mono text-accent whitespace-nowrap">
        {lead.value ? formatINR(lead.value) : '—'}
      </td>
      <td className={`px-4 py-3 text-xs font-mono font-medium whitespace-nowrap ${qualityColor[lead.quality] ?? 'text-text3'}`}>
        {lead.quality || '—'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {overdue ? (
          <span className="text-xs font-mono text-danger font-semibold">
            {formatDate(lead.nextAction)} ↑
          </span>
        ) : (
          <span className="text-xs font-mono text-text2">{formatDate(lead.nextAction)}</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs font-mono text-text2 whitespace-nowrap">
        {lead.owner || '—'}
      </td>
      <td className="px-4 py-3">
        {canEdit && (
          <button
            onClick={() => onEdit(lead)}
            className="text-xs font-mono text-accent2 hover:text-accent transition-colors px-2 py-1 rounded border border-border hover:border-accent2"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  )
}
