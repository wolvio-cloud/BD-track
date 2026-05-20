'use client'

import { useAuth } from '@/hooks/useAuth'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6">
      <span className="font-display font-bold text-lg tracking-tight text-text">
        Wolvio<span className="text-accent">.</span>
      </span>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-text2 font-mono">
            {user.name}
            <span className="ml-2 text-text3">·</span>
            <span className="ml-2 text-text3">{user.role}</span>
          </span>
          <button
            onClick={logout}
            className="text-xs text-text3 hover:text-danger transition-colors font-mono"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
