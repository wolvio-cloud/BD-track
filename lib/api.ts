import type { Lead, User } from './types'

const BASE = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!

async function post<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export async function loginUser(name: string, pin: string): Promise<User> {
  const data = await post<{ success: boolean; user?: User; error?: string }>({
    action: 'login',
    name,
    pin,
  })
  if (!data.success || !data.user) {
    throw new Error(data.error ?? 'Invalid name or PIN')
  }
  return data.user
}

export async function fetchLeads(): Promise<Lead[]> {
  const url = `${BASE}?action=getLeads`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as { leads: Lead[] }
  return data.leads ?? []
}

export async function addLead(
  payload: Partial<Lead>
): Promise<{ success: boolean; leadId: string }> {
  return post({ action: 'addLead', ...payload })
}

export async function updateLead(
  payload: Partial<Lead> & { rowIndex: number }
): Promise<{ success: boolean }> {
  return post({ action: 'updateLead', ...payload })
}
