'use client'

import { useAuth } from '@/hooks/useAuth'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <span className="font-display font-extrabold text-xl tracking-tight text-text">
        Wolvio<span className="text-accent">.</span>
      </span>
      {user && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-display font-bold shrink-0"
              style={{ background: 'rgba(129,140,248,0.2)', color: '#818cf8' }}
            >
              {user.name[0]}
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-body font-medium text-text">{user.name}</span>
              <span className="text-xs font-mono text-text3">{user.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-xs font-mono text-text3 hover:text-danger transition-colors border border-border hover:border-danger/40 px-3 py-1.5 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
