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
  Prospect: { bg: 'rgba(129,140,248,0.15)', text: '#818cf8' },
  'Discovery Call': { bg: 'rgba(167,139,250,0.15)', text: '#a78bfa' },
  Demo: { bg: 'rgba(192,132,252,0.15)', text: '#c084fc' },
  Proposal: { bg: 'rgba(244,114,182,0.15)', text: '#f472b6' },
  'NDA Signed': { bg: 'rgba(251,146,60,0.15)', text: '#fb923c' },
  Negotiation: { bg: 'rgba(251,191,36,0.15)', text: '#fbbf24' },
  Won: { bg: 'rgba(110,231,183,0.15)', text: '#6ee7b7' },
  Lost: { bg: 'rgba(248,113,113,0.15)', text: '#f87171' },
}

export function stageColor(stage: string): { bg: string; text: string } {
  return STAGE_COLORS[stage] ?? { bg: 'rgba(255,255,255,0.08)', text: '#9d9bbb' }
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
