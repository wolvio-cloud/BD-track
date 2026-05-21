'use client'

import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 min-h-screen overflow-x-hidden" style={{ marginLeft: '224px' }}>
        {children}
      </div>
    </div>
  )
}
