'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[17px] h-[17px]">
        <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm5-1a1 1 0 100 2h6a1 1 0 100-2H7z" />
      </svg>
    ),
    altIcon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[17px] h-[17px]">
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[17px] h-[17px]">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
    altIcon: null,
  },
  {
    label: 'AI Assistant',
    href: '/assistant',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-[17px] h-[17px]">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
    altIcon: null,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside
      className="w-56 shrink-0 sticky top-0 h-screen flex flex-col overflow-y-auto z-30"
      style={{ backgroundColor: '#1a1744' }}
    >
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[13px] font-black tracking-tight"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            W
          </div>
          <div>
            <p className="text-white text-[13px] font-bold tracking-tight leading-none">Wolvio</p>
            <p className="text-[10px] mt-0.5 font-mono tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
              BD TRACK
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group"
              style={{
                background: active ? 'rgba(99,102,241,0.20)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
              }}
            >
              <span style={{ color: active ? '#a5b4fc' : 'rgba(255,255,255,0.35)' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#818cf8' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 mt-2 mb-3" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* User section */}
      {user && (
        <div className="px-3 pb-4 flex flex-col gap-1">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white/85 truncate leading-none">{user.name}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#f87171'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  )
}
