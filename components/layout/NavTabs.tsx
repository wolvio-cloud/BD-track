'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Dashboard', href: '/dashboard', icon: '◈' },
  { label: 'Leads', href: '/leads', icon: '◉' },
]

export default function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-0.5 px-6 border-b border-border bg-surface/60 backdrop-blur-sm">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-body font-medium border-b-2 transition-all duration-200 ${
              active
                ? 'border-accent text-text'
                : 'border-transparent text-text3 hover:text-text2 hover:border-border2'
            }`}
          >
            <span className={`text-xs ${active ? 'text-accent' : 'text-text3'}`}>{tab.icon}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
