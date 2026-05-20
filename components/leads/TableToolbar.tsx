'use client'

import { STAGES } from '@/lib/utils'
import type { Lead } from '@/lib/types'

const OWNERS = ['All', 'Madhan', 'Mani', 'Shifana']

type ViewMode = 'table' | 'board'

interface TableToolbarProps {
  leads: Lead[]
  search: string
  onSearch: (v: string) => void
  stage: string
  onStage: (v: string) => void
  owner: string
  onOwner: (v: string) => void
  industry: string
  onIndustry: (v: string) => void
  view: ViewMode
  onView: (v: ViewMode) => void
  onAdd: () => void
  onExport: () => void
}

export default function TableToolbar({
  leads,
  search,
  onSearch,
  stage,
  onStage,
  owner,
  onOwner,
  industry,
  onIndustry,
  view,
  onView,
  onAdd,
  onExport,
}: TableToolbarProps) {
  const industries = Array.from(
    new Set(leads.map((l) => l.industry).filter(Boolean))
  ).sort()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="search"
          placeholder="Search company, contact…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 min-w-48 bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-2 placeholder-text3 focus:outline-none focus:border-accent2 transition-colors font-body"
        />

        {/* Stage filter */}
        <select
          value={stage}
          onChange={(e) => onStage(e.target.value)}
          className="bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-accent2 transition-colors font-mono cursor-pointer"
        >
          <option value="All">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s} className="bg-surface2">{s}</option>
          ))}
        </select>

        {/* Owner filter */}
        <select
          value={owner}
          onChange={(e) => onOwner(e.target.value)}
          className="bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-accent2 transition-colors font-mono cursor-pointer"
        >
          {OWNERS.map((o) => (
            <option key={o} value={o} className="bg-surface2">{o === 'All' ? 'All Owners' : o}</option>
          ))}
        </select>

        {/* Industry filter */}
        {industries.length > 0 && (
          <select
            value={industry}
            onChange={(e) => onIndustry(e.target.value)}
            className="bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-accent2 transition-colors font-mono cursor-pointer"
          >
            <option value="All">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind} className="bg-surface2">{ind}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* View toggle */}
        <div className="flex items-center bg-surface2 border border-border rounded-lg p-0.5 gap-0.5">
          {(['table', 'board'] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                view === v
                  ? 'bg-surface text-text border border-border2'
                  : 'text-text3 hover:text-text2'
              }`}
            >
              {v === 'table' ? '≡ Table' : '⊞ Board'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Export */}
          <button
            onClick={onExport}
            className="text-sm font-mono text-text3 hover:text-text2 border border-border hover:border-border2 px-4 py-2 rounded-lg transition-all"
          >
            ↓ Export CSV
          </button>

          {/* Add Lead */}
          <button
            onClick={onAdd}
            className="bg-accent text-bg font-display font-bold text-sm px-5 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            + Add Lead
          </button>
        </div>
      </div>
    </div>
  )
}
