import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, SkipForward } from 'lucide-react'

interface AnswerInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onSkip: () => void
  disabled?: boolean
}

export function AnswerInput({ value, onChange, onSubmit, onSkip, disabled }: AnswerInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!disabled) ref.current?.focus()
  }, [disabled])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex-shrink-0 mb-3.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
      <textarea
        ref={ref}
        className="w-full bg-transparent border-none outline-none text-[13px] text-foreground p-3.5 px-4 min-h-[88px] resize-none leading-relaxed placeholder:text-muted-foreground"
        placeholder="Type your answer… be specific, use real examples. Ctrl+Enter to submit."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) onSubmit()
        }}
        disabled={disabled}
      />
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/50">
        <span className="text-[11px] text-muted-foreground">{value.length} chars</span>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onSkip}>
            <SkipForward className="w-3 h-3 mr-1" />
            Skip
          </Button>
          <Button size="sm" className="text-xs h-7" onClick={onSubmit} disabled={!value.trim()}>
            <Send className="w-3 h-3 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
