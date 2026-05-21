'use client'

import { formatINR, formatDate, STAGE_COLORS } from '@/lib/utils'
import StageBadge from '@/components/ui/StageBadge'
import type { Lead, User } from '@/lib/types'

interface LeadDetailPanelProps {
  lead: Lead
  currentUser: User
  onClose: () => void
  onEdit: (lead: Lead) => void
}

function Row({ label, value, mono = false }: { label: string; value: string | undefined; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-mono text-text3 uppercase tracking-widest">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : 'font-body'} text-text2`}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-mono text-text3 uppercase tracking-widest mb-3 pb-1 border-b border-border">
        {title}
      </p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

const QUALITY_COLOR: Record<string, string> = {
  High: '#047857',
  Medium: '#d97706',
  Low: '#9ca3af',
}

function isStale(lastContact: string | undefined): boolean {
  if (!lastContact) return false
  const d = new Date(lastContact)
  return !isNaN(d.getTime()) && (Date.now() - d.getTime()) > 14 * 24 * 60 * 60 * 1000
}

export default function LeadDetailPanel({ lead, currentUser, onClose, onEdit }: LeadDetailPanelProps) {
  const canEdit = currentUser.role === 'Founder' || lead.owner === currentUser.name
  const colors = STAGE_COLORS[lead.stage]
  const stale = isStale(lead.lastContact)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-surface border-l border-border flex flex-col overflow-hidden shadow-xl animate-slide-in-right">

        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-border shrink-0">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 100% 0%, ${colors?.text ?? '#818cf8'}18 0%, transparent 60%)` }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <StageBadge stage={lead.stage} />
                {lead.leadId && (
                  <span className="text-xs font-mono text-text3">{lead.leadId}</span>
                )}
                {stale && (
                  <span className="text-xs font-mono text-warn bg-warn/10 px-2 py-0.5 rounded-full">Stale</span>
                )}
              </div>
              <h2 className="text-[18px] font-semibold text-text leading-tight">{lead.company}</h2>
              {lead.location && (
                <p className="text-xs font-mono text-text3 mt-0.5">{lead.location}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {canEdit && (
                <button
                  onClick={() => onEdit(lead)}
                  className="text-[12px] font-medium border border-border hover:border-accent px-3 py-1.5 rounded-lg transition-colors text-text2 hover:text-text"
                >
                  Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="text-text3 hover:text-text transition-colors p-1.5 rounded-lg hover:bg-surface2 text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Key metrics bar */}
          <div className="relative flex items-center gap-4 mt-4 flex-wrap">
            {lead.value && parseFloat(lead.value) > 0 && (
              <div>
                <p className="text-[10px] font-mono text-text3 uppercase tracking-widest">Value</p>
                <p className="text-[20px] font-semibold tabular" style={{ color: '#0d9488' }}>
                  {formatINR(lead.value)}
                </p>
              </div>
            )}
            {lead.quality && (
              <div>
                <p className="text-[10px] font-mono text-text3 uppercase tracking-widest">Quality</p>
                <p className="text-sm font-mono font-semibold" style={{ color: QUALITY_COLOR[lead.quality] ?? '#9d9bbb' }}>
                  {lead.quality}
                </p>
              </div>
            )}
            {lead.owner && (
              <div>
                <p className="text-[10px] font-mono text-text3 uppercase tracking-widest">Owner</p>
                <p className="text-sm font-body text-text2">{lead.owner}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          <Section title="Contact">
            <Row label="Name" value={lead.contact} />
            <Row label="Designation" value={lead.designation} />
            <div className="flex flex-col gap-1.5">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-[13px] font-mono text-accent hover:text-accent2 transition-colors"
                >
                  <span className="text-text3">✉</span> {lead.email}
                </a>
              )}
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 text-[13px] font-mono text-accent hover:text-accent2 transition-colors"
                >
                  <span className="text-text3">✆</span> {lead.phone}
                </a>
              )}
              {lead.linkedin && (
                <a
                  href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] font-mono text-accent hover:text-accent2 transition-colors"
                >
                  <span className="text-text3">in</span> LinkedIn Profile
                </a>
              )}
            </div>
          </Section>

          <Section title="Company">
            <Row label="Industry" value={lead.industry} />
            <Row label="Employee Size" value={lead.empSize} />
            <Row label="Location" value={lead.location} />
            <Row label="Operating Regions" value={lead.operating} />
          </Section>

          <Section title="Deal">
            <Row label="Product / Solution" value={lead.product} />
            <Row label="Source" value={lead.source} />
            <Row label="Timeline" value={lead.timeline} />
            <Row label="Budget" value={lead.budget} />
            <Row label="Decision Maker" value={lead.dm} />
            <Row label="Procurement" value={lead.procurement} />
            {lead.challenges && (
              <div>
                <p className="text-[10px] font-mono text-text3 uppercase tracking-widest mb-1">Challenges</p>
                <p className="text-sm font-body text-text2 leading-relaxed">{lead.challenges}</p>
              </div>
            )}
          </Section>

          <Section title="Timeline">
            <Row label="Discovery Date" value={formatDate(lead.discoveryDate)} mono />
            <Row label="Last Contact" value={formatDate(lead.lastContact)} mono />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-text3 uppercase tracking-widest">Next Action</span>
              <span className={`text-sm font-mono ${
                lead.nextAction && new Date(lead.nextAction) < new Date() ? 'text-danger font-semibold' : 'text-text2'
              }`}>
                {formatDate(lead.nextAction)}
              </span>
            </div>
            <Row label="Entered By" value={lead.enteredBy} />
            <Row label="Created" value={formatDate(lead.createdAt)} mono />
            <Row label="Last Updated" value={formatDate(lead.updatedAt)} mono />
          </Section>

          {lead.comments && (
            <Section title="Notes">
              <p className="text-sm font-body text-text2 leading-relaxed bg-surface2 rounded-xl p-4">
                {lead.comments}
              </p>
            </Section>
          )}
        </div>
      </div>
    </>
  )
}
