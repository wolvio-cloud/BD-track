'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onDismiss: () => void
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
}

const colors: Record<ToastType, string> = {
  success: 'border-accent text-accent',
  error: 'border-danger text-danger',
  info: 'border-accent2 text-accent2',
}

export default function Toast({
  message,
  type = 'success',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onDismiss])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border bg-surface2 px-4 py-3 shadow-xl transition-all duration-300 ${colors[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <span className="text-sm font-mono font-medium">{icons[type]}</span>
      <span className="text-sm text-text font-body">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="ml-2 text-text3 hover:text-text2 transition-colors text-xs"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type })
  }

  const dismissToast = () => setToast(null)

  return { toast, showToast, dismissToast }
}
