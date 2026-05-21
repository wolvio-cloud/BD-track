'use client'

import { STAGE_COLORS, formatINR, formatDate } from '@/lib/utils'
import StageBadge from '@/components/ui/StageBadge'
import type { Lead, User } from '@/lib/types'

const BOARD_STAGES = [
  'Prospect', 'Discovery Call', 'Demo', 'Proposal',
  'NDA Signed', 'Negotiation', 'Won', 'Lost',
]

function isOverdue(dateStr: string | undefined): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime()) && d < new Date()
}

interface CardProps {
  lead: Lead
  currentUser: User
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
}

function LeadCard({ lead, currentUser, onView, onEdit }: CardProps) {
  const canEdit = currentUser.role === 'Founder' || lead.owner === currentUser.name
  const overdue = isOverdue(lead.nextAction)
  const qualityColor = lead.quality === 'High' ? '#059669' : lead.quality === 'Medium' ? '#d97706' : '#9ca3af'

  return (
    <div
      onClick={() => onView(lead)}
      className={`group bg-surface2 border rounded-xl p-3.5 cursor-pointer transition-all duration-200 hover:border-border2 hover:shadow-xl ${
        overdue ? 'border-danger/30 hover:border-danger/60' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-body font-medium text-text leading-snug flex-1 min-w-0 break-words">
          {lead.company}
        </span>
        <div
          className="w-2 h-2 rounded-full shrink-0 mt-1"
          style={{ backgroundColor: qualityColor }}
          title={`${lead.quality} quality`}
        />
      </div>

      {lead.value && parseFloat(lead.value) > 0 && (
        <p className="text-[12px] font-mono font-semibold tabular mb-2" style={{ color: '#0d9488' }}>{formatINR(lead.value)}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-text3 truncate">{lead.owner || '—'}</span>
        {lead.nextAction ? (
          <span className={`text-xs font-mono shrink-0 ${overdue ? 'text-danger font-semibold' : 'text-text3'}`}>
            {formatDate(lead.nextAction)}
          </span>
        ) : (
          <span className="text-xs font-mono text-warn shrink-0">No date</span>
        )}
      </div>

      {canEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(lead) }}
          className="mt-2.5 w-full text-[11px] text-text3 hover:text-text border border-border hover:border-border2 rounded-lg py-1 transition-all opacity-0 group-hover:opacity-100"
        >
          Edit
        </button>
      )}
    </div>
  )
}

interface KanbanBoardProps {
  leads: Lead[]
  currentUser: User
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
}

export default function KanbanBoard({ leads, currentUser, onView, onEdit }: KanbanBoardProps) {
  return (
    <div className="overflow-x-auto pb-4 -mx-1 px-1">
      <div className="flex gap-3" style={{ minWidth: `${BOARD_STAGES.length * 232}px` }}>
        {BOARD_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage)
          const stageValue = stageLeads.reduce((s, l) => s + (parseFloat(l.value) || 0), 0)
          const colors = STAGE_COLORS[stage]
          const isClosed = stage === 'Won' || stage === 'Lost'

          return (
            <div key={stage} className="flex-1 min-w-[220px] max-w-[260px] flex flex-col">
              {/* Column header */}
              <div
                className="rounded-xl px-3 py-2.5 mb-3 border"
                style={{
                  backgroundColor: `${colors?.text ?? '#9d9bbb'}10`,
                  borderColor: `${colors?.text ?? '#9d9bbb'}25`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: colors?.text ?? '#9d9bbb' }}
                    />
                    <span
                      className="text-xs font-mono font-semibold truncate"
                      style={{ color: colors?.text ?? '#9d9bbb' }}
                    >
                      {stage}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-text3 shrink-0 ml-1">{stageLeads.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="text-xs font-mono mt-1" style={{ color: `${colors?.text ?? '#9d9bbb'}cc` }}>
                    {formatINR(stageValue)}
                  </p>
                )}
              </div>

              {/* Cards */}
              <div className={`flex flex-col gap-2 flex-1 ${isClosed ? 'opacity-75' : ''}`}>
                {stageLeads.length === 0 ? (
                  <div className="h-14 border border-dashed border-border rounded-xl flex items-center justify-center">
                    <span className="text-xs font-mono text-text3">Empty</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <LeadCard
                      key={lead.rowIndex}
                      lead={lead}
                      currentUser={currentUser}
                      onView={onView}
                      onEdit={onEdit}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
