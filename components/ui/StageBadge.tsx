'use client'

import { stageColor } from '@/lib/utils'

interface StageBadgeProps {
  stage: string
  className?: string
}

export default function StageBadge({ stage, className = '' }: StageBadgeProps) {
  const { bg, text } = stageColor(stage)
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium whitespace-nowrap ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {stage}
    </span>
  )
}
