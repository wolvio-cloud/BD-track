'use client'

import { useAuth } from '@/hooks/useAuth'

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="h-12 border-b border-border bg-surface/90 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <span className="text-[15px] font-semibold text-text tracking-tight">
        Wolvio <span className="text-text3 font-normal">BD Track</span>
      </span>

      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5">
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}
            >
              {user.name[0]}
            </div>
            <div className="leading-none">
              <p className="text-[13px] font-medium text-text">{user.name}</p>
              <p className="text-[11px] text-text3 mt-0.5">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-[12px] text-text3 hover:text-danger transition-colors px-3 py-1.5 rounded-md border border-border hover:border-danger/30"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
