'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Leads', href: '/leads' },
]

export default function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 px-6 border-b border-border bg-surface">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-3 text-sm font-body font-medium border-b-2 transition-colors ${
              active
                ? 'border-accent text-accent'
                : 'border-transparent text-text2 hover:text-text'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
