'use client'

import { STAGES, STAGE_COLORS } from '@/lib/utils'
import type { Lead } from '@/lib/types'

interface FunnelChartProps {
  leads: Lead[]
}

export default function FunnelChart({ leads }: FunnelChartProps) {
  const counts = STAGES.map((stage) => ({
    stage,
    count: leads.filter((l) => l.stage === stage).length,
  }))
  const max = Math.max(...counts.map((c) => c.count), 1)

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-sm font-mono text-text3 uppercase tracking-widest mb-5">
        Funnel Breakdown
      </h2>
      <div className="flex flex-col gap-3">
        {counts.map(({ stage, count }) => {
          const colors = STAGE_COLORS[stage]
          const pct = Math.round((count / max) * 100)
          return (
            <div key={stage} className="flex items-center gap-3">
              <span className="w-28 text-xs font-mono text-text2 shrink-0 text-right">
                {stage}
              </span>
              <div className="flex-1 h-6 bg-surface2 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{
                    width: count === 0 ? '2px' : `${pct}%`,
                    backgroundColor: colors?.text ?? '#9d9bbb',
                    opacity: count === 0 ? 0.2 : 1,
                  }}
                />
              </div>
              <span
                className="w-6 text-xs font-mono text-right shrink-0"
                style={{ color: colors?.text ?? '#9d9bbb' }}
              >
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
