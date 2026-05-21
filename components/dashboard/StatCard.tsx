'use client'

interface StatCardProps {
  label: string
  value: string | number
  accentColor: string
  sub?: string
  delay?: number
}

export default function StatCard({ label, value, accentColor, sub, delay = 0 }: StatCardProps) {
  return (
    <div
      className="relative bg-surface border border-border rounded-xl px-5 py-5 flex flex-col gap-2.5 overflow-hidden group hover:border-border2 transition-colors duration-150 cursor-default animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Ambient tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${accentColor}0d 0%, transparent 65%)` }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${accentColor}50, transparent 60%)` }}
      />

      <p className="relative text-[11px] font-medium text-text3 uppercase tracking-[0.1em]">
        {label}
      </p>

      <p
        className="relative text-3xl font-bold leading-none tabular"
        style={{ color: accentColor }}
      >
        {value}
      </p>

      {sub && (
        <p className="relative text-xs text-text3 leading-relaxed">{sub}</p>
      )}
    </div>
  )
}
