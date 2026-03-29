import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, SkipForward, Lightbulb } from 'lucide-react'

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
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden flex-shrink-0 mb-4 transition-all duration-250 focus-within:border-primary/40 focus-within:shadow-lg focus-within:shadow-primary/5">
      <textarea
        ref={ref}
        className="w-full bg-transparent border-none outline-none text-sm text-foreground p-4 px-5 min-h-[100px] resize-none leading-relaxed placeholder:text-muted-foreground/60"
        placeholder="Type your answer here... Be specific and use real examples from your experience. Press Ctrl+Enter to submit."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) onSubmit()
        }}
        disabled={disabled}
      />
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground font-mono">{value.length} chars</span>
          {value.length > 0 && value.length < 50 && (
            <span className="text-[10px] text-warning font-medium flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Aim for 150+ chars
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 rounded-xl text-muted-foreground hover:text-foreground"
            onClick={onSkip}
          >
            <SkipForward className="w-3.5 h-3.5 mr-1" />
            Skip
          </Button>
          <Button
            size="sm"
            className="text-xs h-8 rounded-xl gradient-primary border-0 shadow-sm shadow-primary/20 font-medium"
            onClick={onSubmit}
            disabled={!value.trim()}
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
