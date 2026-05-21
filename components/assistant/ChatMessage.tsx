import type { ChatMessage as Msg } from '@/lib/claude'

export default function ChatMessage({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
          isUser ? 'bg-accent text-white' : 'bg-surface3 text-text2'
        }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-accent text-white rounded-tr-sm'
            : 'bg-surface border border-border text-text2 rounded-tl-sm'
        }`}
      >
        {msg.content}
      </div>
    </div>
  )
}
