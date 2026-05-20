'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLeads } from '@/hooks/useLeads'
import Topbar from '@/components/layout/Topbar'
import NavTabs from '@/components/layout/NavTabs'
import TableToolbar from '@/components/leads/TableToolbar'
import LeadsTable from '@/components/leads/LeadsTable'
import LeadModal from '@/components/leads/LeadModal'
import Spinner from '@/components/ui/Spinner'
import Toast, { useToast } from '@/components/ui/Toast'
import type { Lead } from '@/lib/types'

export default function LeadsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { leads, loading, error, reload } = useLeads()

  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [ownerFilter, setOwnerFilter] = useState('All')
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; lead?: Lead } | null>(null)
  const { toast, showToast, dismissToast } = useToast()

  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        l.company.toLowerCase().includes(q) ||
        l.contact.toLowerCase().includes(q)
      const matchStage = stageFilter === 'All' || l.stage === stageFilter
      const matchOwner = ownerFilter === 'All' || l.owner === ownerFilter
      return matchSearch && matchStage && matchOwner
    })
  }, [leads, search, stageFilter, ownerFilter])

  if (!user) return null

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Topbar />
      <NavTabs />

      <main className="flex-1 px-4 md:px-8 py-6 flex flex-col gap-5 max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-text">All Leads</h1>
            <p className="text-sm text-text3 font-mono mt-1">
              {loading ? 'Loading…' : `${leads.length} total leads`}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <TableToolbar
          search={search}
          onSearch={setSearch}
          stage={stageFilter}
          onStage={setStageFilter}
          owner={ownerFilter}
          onOwner={setOwnerFilter}
          onAdd={() => setModal({ mode: 'add' })}
        />

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-surface border border-danger/30 rounded-xl p-6 text-center">
            <p className="text-danger text-sm font-body">{error}</p>
            <button
              onClick={reload}
              className="mt-3 text-xs font-mono text-text3 hover:text-text underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <LeadsTable
            leads={filtered}
            currentUser={user}
            onEdit={(lead) => setModal({ mode: 'edit', lead })}
          />
        )}
      </main>

      {/* Modal */}
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

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  )
}
