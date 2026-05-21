export const STAGES = [
  'Prospect',
  'Discovery Call',
  'Demo',
  'Proposal',
  'NDA Signed',
  'Negotiation',
  'Won',
  'Lost',
] as const

export type Stage = (typeof STAGES)[number]

export const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  Prospect:         { bg: 'rgba(99,102,241,0.10)',  text: '#4338ca' },
  'Discovery Call': { bg: 'rgba(124,58,237,0.10)',  text: '#6d28d9' },
  Demo:             { bg: 'rgba(139,92,246,0.10)',   text: '#7c3aed' },
  Proposal:         { bg: 'rgba(219,39,119,0.10)',   text: '#be185d' },
  'NDA Signed':     { bg: 'rgba(234,88,12,0.10)',    text: '#c2410c' },
  Negotiation:      { bg: 'rgba(161,98,7,0.10)',     text: '#92400e' },
  Won:              { bg: 'rgba(5,150,105,0.10)',    text: '#047857' },
  Lost:             { bg: 'rgba(185,28,28,0.10)',    text: '#b91c1c' },
}

export function stageColor(stage: string): { bg: string; text: string } {
  return STAGE_COLORS[stage] ?? { bg: 'rgba(156,163,175,0.15)', text: '#6b7280' }
}

export function formatINR(val: string | number): string {
  const n = parseFloat(String(val)) || 0
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function formatDate(val: string | null | undefined): string {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
