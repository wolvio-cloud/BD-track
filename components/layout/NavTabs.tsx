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
    <nav className="flex px-6 border-b border-border bg-surface/60 backdrop-blur-sm">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 -mb-px ${
              active
                ? 'border-accent text-text'
                : 'border-transparent text-text3 hover:text-text2'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
