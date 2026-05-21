'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLeads } from '@/hooks/useLeads'
import AppShell from '@/components/layout/AppShell'
import TableToolbar from '@/components/leads/TableToolbar'
import LeadsTable from '@/components/leads/LeadsTable'
import KanbanBoard from '@/components/leads/KanbanBoard'
import LeadDetailPanel from '@/components/leads/LeadDetailPanel'
import LeadModal from '@/components/leads/LeadModal'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import Toast, { useToast } from '@/components/ui/Toast'
import { downloadLeadsCSV } from '@/lib/export'
import type { Lead } from '@/lib/types'

type ViewMode = 'table' | 'board'

export default function LeadsPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { leads, loading, error, reload } = useLeads()

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [ownerFilter, setOwnerFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [view, setView] = useState<ViewMode>('table')
  const [detailLead, setDetailLead] = useState<Lead | null>(null)
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; lead?: Lead } | null>(null)
  const { toast, showToast, dismissToast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase()
      const matchSearch = !q || l.company.toLowerCase().includes(q) || l.contact.toLowerCase().includes(q)
      const matchStage = stageFilter === 'All' || l.stage === stageFilter
      const matchOwner = ownerFilter === 'All' || l.owner === ownerFilter
      const matchIndustry = industryFilter === 'All' || l.industry === industryFilter
      return matchSearch && matchStage && matchOwner && matchIndustry
    })
  }, [leads, search, stageFilter, ownerFilter, industryFilter])

  if (authLoading || !user) return null

  function handleEdit(lead: Lead) {
    setDetailLead(null)
    setModal({ mode: 'edit', lead })
  }

  function handleView(lead: Lead) {
    setDetailLead(lead)
  }

  return (
    <AppShell>
      <div className="min-h-screen flex flex-col">
        {/* Page header */}
        <div className="bg-surface border-b border-border px-8 py-5 flex items-center justify-between shrink-0" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}>
          <div>
            <h1 className="text-[24px] font-black text-text tracking-tight leading-none">All Leads</h1>
            <p className="text-[12px] text-text3 font-mono mt-1 uppercase tracking-[0.08em]">
              {loading ? 'Loading…' : `${leads.length} total · ${filtered.length} shown`}
            </p>
          </div>
        </div>
      <main className="flex-1 px-6 py-5 flex flex-col gap-4">

        <TableToolbar
          leads={leads}
          search={search}
          onSearch={setSearch}
          stage={stageFilter}
          onStage={setStageFilter}
          owner={ownerFilter}
          onOwner={setOwnerFilter}
          industry={industryFilter}
          onIndustry={setIndustryFilter}
          view={view}
          onView={setView}
          onAdd={() => setModal({ mode: 'add' })}
          onExport={() => downloadLeadsCSV(filtered)}
        />

        {loading ? (
          <div className="bg-surface rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />)}
                </tbody>
              </table>
            </div>
          </div>
        ) : error ? (
          <div className="bg-surface border border-danger/30 rounded-2xl p-6 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <p className="text-danger text-sm font-body">{error}</p>
            <button onClick={reload} className="mt-3 text-xs font-mono text-text3 hover:text-text underline">
              Retry
            </button>
          </div>
        ) : view === 'board' ? (
          <KanbanBoard
            leads={filtered}
            currentUser={user}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : (
          <LeadsTable
            leads={filtered}
            currentUser={user}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}
      </main>
      </div>

      {/* Lead detail panel */}
      {detailLead && (
        <LeadDetailPanel
          lead={detailLead}
          currentUser={user}
          onClose={() => setDetailLead(null)}
          onEdit={handleEdit}
        />
      )}

      {/* Edit/Add modal */}
      {modal && (
        <LeadModal
          mode={modal.mode}
          lead={modal.lead}
          currentUser={user}
          onClose={() => setModal(null)}
          onSaved={(msg) => {
            showToast(msg, 'success')
            reload()
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
    </AppShell>
  )
}
