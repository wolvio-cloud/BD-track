'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import { askClaude, type ChatMessage as Msg } from '@/lib/claude'
import type { Lead } from '@/lib/types'

const SUGGESTED = [
  'Which leads are overdue for follow-up?',
  "What's the total pipeline value?",
  'Who has the most active leads?',
  'Show me leads in the Proposal stage',
  'Which leads have no next action set?',
  'What is our win rate?',
]

const API_KEY_STORAGE = 'wolvio_claude_key'

interface Props {
  leads: Lead[]
}

export default function ChatWindow({ leads }: Props) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(API_KEY_STORAGE) ?? ''
    return ''
  })
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    if (!apiKey) {
      setShowKeyInput(true)
      return
    }

    const userMsg: Msg = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const reply = await askClaude(next, leads, apiKey)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setMessages([...next, { role: 'assistant', content: `Error: ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  function saveKey() {
    const k = keyDraft.trim()
    if (!k) return
    localStorage.setItem(API_KEY_STORAGE, k)
    setApiKey(k)
    setKeyDraft('')
    setShowKeyInput(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* API key banner */}
      {!apiKey && (
        <div className="shrink-0 bg-warn/8 border-b border-warn/20 px-5 py-3 flex items-center gap-3">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-warn shrink-0">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-[12px] text-warn font-mono flex-1">Claude API key required to use the assistant</p>
          <button
            onClick={() => setShowKeyInput(true)}
            className="text-[12px] font-semibold text-warn border border-warn/30 hover:border-warn/60 px-3 py-1 rounded-lg transition-colors"
          >
            Add Key
          </button>
        </div>
      )}

      {/* Key input overlay */}
      {showKeyInput && (
        <div className="shrink-0 bg-surface border-b border-border px-5 py-4 flex flex-col gap-3">
          <p className="text-[13px] font-semibold text-text">Enter Anthropic API Key</p>
          <p className="text-xs text-text3">Your key is stored only in your browser (localStorage). It is never sent to any server other than Anthropic.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
              placeholder="sk-ant-…"
              className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2 text-[13px] font-mono text-text focus:outline-none focus:border-accent"
              autoFocus
            />
            <button onClick={saveKey} className="px-4 py-2 bg-accent text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Save
            </button>
            <button onClick={() => setShowKeyInput(false)} className="px-3 py-2 text-text3 hover:text-text text-[13px] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.10)' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-accent">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-text">Ask about your pipeline</h3>
              <p className="text-[13px] text-text3 mt-1">I can answer questions about leads, revenue, follow-ups, and more.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left px-3 py-2.5 bg-surface2 hover:bg-surface3 border border-border hover:border-border2 rounded-xl text-[12px] text-text2 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 bg-surface3 text-text2">
              AI
            </div>
            <div className="px-4 py-3 bg-surface border border-border rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-text3 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-surface px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            placeholder="Ask about your pipeline… (Enter to send)"
            rows={1}
            className="flex-1 resize-none bg-surface2 border border-border rounded-xl px-4 py-2.5 text-[13px] text-text placeholder-text3 focus:outline-none focus:border-accent transition-colors font-body leading-relaxed"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-accent text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
          {apiKey && (
            <button
              onClick={() => { setApiKey(''); localStorage.removeItem(API_KEY_STORAGE); setMessages([]) }}
              className="p-2.5 text-text3 hover:text-danger rounded-xl hover:bg-danger/8 transition-all shrink-0"
              title="Remove API key"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="mt-2 text-[11px] font-mono text-text3 hover:text-text transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>
    </div>
  )
}
