'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLeads } from '@/hooks/useLeads'
import AppShell from '@/components/layout/AppShell'
import ChatWindow from '@/components/assistant/ChatWindow'

export default function AssistantPage() {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const { leads, loading } = useLeads()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) return null

  return (
    <AppShell>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-text">AI Assistant</h1>
            <p className="text-[12px] text-text3 mt-0.5 font-mono">
              {loading ? 'Loading pipeline data…' : `${leads.length} leads loaded · Powered by Claude`}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full text-[11px] font-mono border" style={{ color: '#4f46e5', background: 'rgba(79,70,229,0.08)', borderColor: 'rgba(79,70,229,0.2)' }}>
            claude-haiku-4-5
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 min-h-0 bg-bg">
          <ChatWindow leads={leads} />
        </div>
      </div>
    </AppShell>
  )
}
