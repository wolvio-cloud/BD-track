import type { Lead } from './types'

const HEADERS = [
  'Lead ID', 'Company', 'Contact', 'Designation', 'Email', 'Phone', 'LinkedIn',
  'Industry', 'Emp Size', 'Location', 'Operating', 'Product', 'Source',
  'Stage', 'Quality', 'Value (INR)', 'Timeline', 'Budget', 'DM', 'Procurement',
  'Challenges', 'Discovery Date', 'Last Contact', 'Next Action',
  'Owner', 'Entered By', 'Comments', 'Created At', 'Updated At',
]

function cell(val: string | undefined): string {
  const s = val ?? ''
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function downloadLeadsCSV(leads: Lead[]) {
  const rows = [
    HEADERS.join(','),
    ...leads.map((l) =>
      [
        l.leadId, l.company, l.contact, l.designation, l.email, l.phone, l.linkedin,
        l.industry, l.empSize, l.location, l.operating, l.product, l.source,
        l.stage, l.quality, l.value, l.timeline, l.budget, l.dm, l.procurement,
        l.challenges, l.discoveryDate, l.lastContact, l.nextAction,
        l.owner, l.enteredBy, l.comments, l.createdAt, l.updatedAt,
      ]
        .map(cell)
        .join(',')
    ),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
