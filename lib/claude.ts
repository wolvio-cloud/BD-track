import type { Lead } from './types'
import { formatINR } from './utils'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function buildContext(leads: Lead[]): string {
  const active = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
  const won = leads.filter((l) => l.stage === 'Won')
  const lost = leads.filter((l) => l.stage === 'Lost')
  const pipelineValue = active.reduce((s, l) => s + (parseFloat(l.value) || 0), 0)

  const stageCounts: Record<string, number> = {}
  leads.forEach((l) => { stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1 })

  const ownerStats: Record<string, { count: number; value: number }> = {}
  leads.forEach((l) => {
    if (!ownerStats[l.owner]) ownerStats[l.owner] = { count: 0, value: 0 }
    ownerStats[l.owner].count++
    ownerStats[l.owner].value += parseFloat(l.value) || 0
  })

  const overdue = active.filter((l) => l.nextAction && new Date(l.nextAction) < new Date())
  const noNextAction = active.filter((l) => !l.nextAction)

  const staleMs = 14 * 24 * 60 * 60 * 1000
  const stale = active.filter((l) => l.lastContact && (Date.now() - new Date(l.lastContact).getTime()) > staleMs)

  const leadSummaries = leads.map((l) =>
    `- ${l.company} (${l.stage}): owner=${l.owner}, value=${l.value ? formatINR(l.value) : 'N/A'}, quality=${l.quality || 'N/A'}, product=${l.product || 'N/A'}, industry=${l.industry || 'N/A'}, nextAction=${l.nextAction || 'none'}, lastContact=${l.lastContact || 'none'}, contact=${l.contact || 'N/A'}`
  ).join('\n')

  return `You are an AI assistant for Wolvio Solutions' BD (Business Development) team. You have access to the real-time pipeline data below.

PIPELINE SUMMARY:
- Total leads: ${leads.length} (${active.length} active, ${won.length} won, ${lost.length} lost)
- Pipeline value: ${formatINR(pipelineValue)}
- Win rate: ${leads.length > 0 ? Math.round((won.length / leads.length) * 100) : 0}%
- Overdue follow-ups: ${overdue.length}
- No next action set: ${noNextAction.length}
- Stale (no contact >14 days): ${stale.length}

STAGE BREAKDOWN:
${Object.entries(stageCounts).map(([s, c]) => `  ${s}: ${c}`).join('\n')}

OWNER BREAKDOWN:
${Object.entries(ownerStats).map(([o, s]) => `  ${o}: ${s.count} leads, ${formatINR(s.value)}`).join('\n')}

OVERDUE LEADS:
${overdue.length ? overdue.map((l) => `  - ${l.company} (owner: ${l.owner}, due: ${l.nextAction})`).join('\n') : '  None'}

ALL LEADS:
${leadSummaries}

Answer questions clearly and concisely based on this data. Use specific company names, numbers, and actionable insights when relevant. Keep responses focused and to the point.`
}

export async function askClaude(
  messages: ChatMessage[],
  leads: Lead[],
  apiKey: string
): Promise<string> {
  const systemPrompt = buildContext(leads)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message || `API error ${response.status}`)
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> }
  return data.content[0]?.text ?? ''
}
