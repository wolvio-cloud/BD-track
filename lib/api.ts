import type { Lead, User } from './types'

const BASE = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL!

async function get<T>(params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}?${qs}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export async function loginUser(name: string, pin: string): Promise<User> {
  const data = await get<{ success: boolean; user?: User; error?: string }>({
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
  const data = await get<{ leads: Lead[] }>({ action: 'getLeads' })
  return data.leads ?? []
}

export async function addLead(
  payload: Partial<Lead>
): Promise<{ success: boolean; leadId: string }> {
  return get({ action: 'addLead', data: JSON.stringify(payload) })
}

export async function updateLead(
  payload: Partial<Lead> & { rowIndex: number }
): Promise<{ success: boolean }> {
  return get({ action: 'updateLead', data: JSON.stringify(payload) })
}
