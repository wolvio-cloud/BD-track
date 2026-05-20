'use client'

interface StatCardProps {
  label: string
  value: string | number
  accent?: string
  sub?: string
}

export default function StatCard({ label, value, accent = 'text-text', sub }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col gap-1">
      <span className="text-xs font-mono text-text3 uppercase tracking-widest">{label}</span>
      <span className={`text-3xl font-display font-bold ${accent}`}>{value}</span>
      {sub && <span className="text-xs text-text3 font-mono">{sub}</span>}
    </div>
  )
}
