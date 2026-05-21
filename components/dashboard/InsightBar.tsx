'use client'

import type { Lead } from '@/lib/types'

interface Insight {
  type: 'warning' | 'info' | 'success' | 'danger'
  text: string
}

const COLORS = {
  warning: { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)', dot: '#d97706', text: '#92400e' },
  info:    { bg: 'rgba(79,70,229,0.07)',  border: 'rgba(79,70,229,0.2)',  dot: '#4f46e5', text: '#3730a3' },
  success: { bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.2)', dot: '#059669', text: '#065f46' },
  danger:  { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.2)', dot: '#dc2626', text: '#991b1b' },
}

function generateInsights(leads: Lead[]): Insight[] {
  const insights: Insight[] = []
  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const now = Date.now()
  const staleMs = 14 * 24 * 60 * 60 * 1000
  const stagnantMs = 21 * 24 * 60 * 60 * 1000

  // Stagnant high-value leads
  const stagnant = active.filter((l) => {
    const val = parseFloat(l.value) || 0
    const lastContact = l.lastContact ? now - new Date(l.lastContact).getTime() : Infinity
    return val > 0 && lastContact > stagnantMs && l.quality === 'High'
  })
  if (stagnant.length > 0) {
    insights.push({ type: 'danger', text: `${stagnant.length} high-value lead${stagnant.length > 1 ? 's' : ''} not contacted in 3+ weeks: ${stagnant.slice(0, 2).map((l) => l.company).join(', ')}${stagnant.length > 2 ? '…' : ''}` })
  }

  // Industry concentration risk
  const industryCounts: Record<string, number> = {}
  active.forEach((l) => { if (l.industry) industryCounts[l.industry] = (industryCounts[l.industry] || 0) + 1 })
  const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0]
  if (topIndustry && active.length > 0 && (topIndustry[1] / active.length) > 0.5) {
    insights.push({ type: 'warning', text: `Pipeline concentration risk: ${Math.round((topIndustry[1] / active.length) * 100)}% of leads are from ${topIndustry[0]}` })
  }

  // Funnel bottleneck — find largest single stage
  const stageCounts: Record<string, number> = {}
  active.forEach((l) => { stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1 })
  const bottleneck = Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]
  if (bottleneck && bottleneck[1] >= 3) {
    insights.push({ type: 'info', text: `Funnel bottleneck: ${bottleneck[1]} leads stuck in "${bottleneck[0]}" — consider prioritizing progression` })
  }

  // No source tracked
  const noSource = active.filter((l) => !l.source).length
  if (noSource > active.length * 0.3 && noSource > 2) {
    insights.push({ type: 'warning', text: `${noSource} leads have no source tracked — add source data for better attribution analysis` })
  }

  // Upcoming wins — proposals or negotiations with high quality
  const nearClose = active.filter((l) => ['Proposal', 'NDA Signed', 'Negotiation'].includes(l.stage) && l.quality === 'High')
  if (nearClose.length > 0) {
    const totalVal = nearClose.reduce((s, l) => s + (parseFloat(l.value) || 0), 0)
    const formatted = totalVal >= 1e7 ? `₹${(totalVal / 1e7).toFixed(1)}Cr` : totalVal >= 1e5 ? `₹${(totalVal / 1e5).toFixed(1)}L` : `₹${Math.round(totalVal).toLocaleString('en-IN')}`
    insights.push({ type: 'success', text: `${nearClose.length} high-quality lead${nearClose.length > 1 ? 's' : ''} near closing (${formatted} potential): ${nearClose.slice(0, 2).map((l) => l.company).join(', ')}${nearClose.length > 2 ? '…' : ''}` })
  }

  // Stale with no next action
  const forgotten = active.filter((l) => !l.nextAction && l.lastContact && (now - new Date(l.lastContact).getTime()) > staleMs)
  if (forgotten.length > 0) {
    insights.push({ type: 'warning', text: `${forgotten.length} lead${forgotten.length > 1 ? 's' : ''} with no next action and last contact >14 days ago — schedule follow-ups` })
  }

  return insights.slice(0, 4)
}

export default function InsightBar({ leads }: { leads: Lead[] }) {
  const insights = generateInsights(leads)
  if (insights.length === 0) return null

  return (
    <div className="flex flex-col gap-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
      <p className="text-[11px] font-mono text-text3 uppercase tracking-[0.08em]">Smart Insights</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {insights.map((ins, i) => {
          const c = COLORS[ins.type]
          return (
            <div
              key={i}
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-[12px] leading-relaxed"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: c.dot }} />
              <span style={{ color: c.text }}>{ins.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
