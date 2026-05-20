'use client'

interface StatCardProps {
  label: string
  value: string | number
  icon: string
  accentColor: string
  sub?: string
  delay?: number
}

export default function StatCard({ label, value, icon, accentColor, sub, delay = 0 }: StatCardProps) {
  return (
    <div
      className="relative bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 overflow-hidden group hover:border-border2 transition-all duration-300 cursor-default animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 0%, ${accentColor}12 0%, transparent 65%)` }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <span className="text-xs font-mono text-text3 uppercase tracking-[0.12em]">{label}</span>
        <span
          className="text-base leading-none p-1.5 rounded-lg"
          style={{ color: accentColor, background: `${accentColor}15` }}
        >
          {icon}
        </span>
      </div>

      <div>
        <div
          className="text-4xl font-display font-bold leading-none tracking-tight"
          style={{ color: accentColor }}
        >
          {value}
        </div>
        {sub && (
          <p className="mt-2 text-xs font-mono text-text3 leading-relaxed">{sub}</p>
        )}
      </div>
    </div>
  )
}
