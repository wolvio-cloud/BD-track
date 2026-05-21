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
      className="relative bg-surface rounded-2xl p-5 flex flex-col gap-3 overflow-hidden animate-fade-up cursor-default"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)` }}
      />

      {/* Ambient tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${accentColor}0a 0%, transparent 70%)` }}
      />

      {/* Label */}
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.12em] text-text3 mt-1">
        {label}
      </p>

      {/* Value */}
      <p
        className="relative text-[40px] font-black leading-none tabular tracking-tight"
        style={{ color: accentColor }}
      >
        {value}
      </p>

      {/* Sub */}
      {sub && (
        <p className="relative text-[12px] text-text3 leading-snug font-mono">{sub}</p>
      )}
    </div>
  )
}
