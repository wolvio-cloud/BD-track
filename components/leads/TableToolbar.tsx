'use client'

import { STAGES } from '@/lib/utils'

const OWNERS = ['All', 'Madhan', 'Mani', 'Shifana']

interface TableToolbarProps {
  search: string
  onSearch: (v: string) => void
  stage: string
  onStage: (v: string) => void
  owner: string
  onOwner: (v: string) => void
  onAdd: () => void
}

export default function TableToolbar({
  search,
  onSearch,
  stage,
  onStage,
  owner,
  onOwner,
  onAdd,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <input
        type="search"
        placeholder="Search company or contact…"
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
          <option key={s} value={s} className="bg-surface2">
            {s}
          </option>
        ))}
      </select>

      {/* Owner filter */}
      <select
        value={owner}
        onChange={(e) => onOwner(e.target.value)}
        className="bg-surface2 border border-border text-text text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-accent2 transition-colors font-mono cursor-pointer"
      >
        {OWNERS.map((o) => (
          <option key={o} value={o} className="bg-surface2">
            {o === 'All' ? 'All Owners' : o}
          </option>
        ))}
      </select>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="ml-auto bg-accent text-bg font-display font-bold text-sm px-5 py-2 rounded-lg hover:bg-accent/90 active:scale-[0.98] transition-all whitespace-nowrap"
      >
        + Add Lead
      </button>
    </div>
  )
}
