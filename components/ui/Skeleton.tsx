'use client'

import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-surface2 ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col gap-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      {[40, 120, 100, 80, 70, 60, 50, 70, 60, 40].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: `${w}px` }} />
        </td>
      ))}
    </tr>
  )
}

export function FunnelSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-3">
      <Skeleton className="h-3 w-32 mb-2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-28 shrink-0" />
          <Skeleton className="h-6 flex-1" style={{ width: `${40 + Math.random() * 50}%` }} />
          <Skeleton className="h-3 w-4 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function AlertPanelSkeleton() {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      {[0, 1].map((i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-6 flex-1">
          <Skeleton className="h-3 w-32 mb-4" />
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="flex items-center justify-between py-2 border-b border-border">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
