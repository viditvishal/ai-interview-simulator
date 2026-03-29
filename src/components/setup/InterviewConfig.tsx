import { Slider } from '@/components/ui/slider'
import type { QuestionType } from '@/types'

interface InterviewConfigProps {
  count: number
  types: QuestionType[]
  jobTitle: string
  onCountChange: (n: number) => void
  onToggleType: (t: QuestionType) => void
}

const ALL_TYPES: QuestionType[] = ['behavioral', 'technical', 'situational', 'resume']

export function InterviewConfig({
  count,
  types,
  jobTitle,
  onCountChange,
  onToggleType,
}: InterviewConfigProps) {
  return (
    <div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
        Configure
      </div>
      <div className="mb-5">
        <label className="text-xs font-semibold text-muted-foreground block mb-2.5">
          Number of Questions
        </label>
        <div className="flex items-center gap-3">
          <Slider
            min={3}
            max={10}
            step={1}
            value={[count]}
            onValueChange={(v) => onCountChange(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="text-lg font-extrabold text-primary min-w-[24px] text-center font-mono">
            {count}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Est. {count * 3}–{count * 5} min
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-2.5">
          Question Types
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onToggleType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-all cursor-pointer
                ${
                  types.includes(t)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 p-2.5 px-3 bg-muted rounded-lg text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Ready.</strong> {count} questions for{' '}
        <strong>{jobTitle || 'the role'}</strong>. Q generation + ATS analysis run{' '}
        <em>in parallel</em> — with auto-fallback.
      </div>
    </div>
  )
}
