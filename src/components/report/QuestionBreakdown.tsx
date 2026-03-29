import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { InterviewAnswer, QuestionType } from '@/types'

interface QuestionBreakdownProps {
  answers: InterviewAnswer[]
}

const typeBadge = (t: QuestionType) => {
  switch (t) {
    case 'behavioral': return 'bg-primary/7 text-primary border-primary/18'
    case 'technical': return 'bg-purple-500/7 text-purple-500 border-purple-500/18'
    case 'situational': return 'bg-warning/7 text-warning border-warning/18'
    case 'resume': return 'bg-success/7 text-success border-success/18'
  }
}

const scoreColor = (s: number) =>
  s >= 8 ? 'text-success' : s >= 5 ? 'text-warning' : 'text-destructive'

export function QuestionBreakdown({ answers }: QuestionBreakdownProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const toggle = (i: number) =>
    setExpanded((e) => ({ ...e, [i]: !e[i] }))

  return (
    <div className="space-y-2 animate-fade-in">
      {answers.map((a, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden hover:border-muted-foreground/20 transition-colors">
          <div
            className="p-3.5 flex items-center gap-2.5 cursor-pointer bg-card hover:bg-muted/50 transition-colors select-none"
            onClick={() => toggle(i)}
          >
            <span className="text-[10px] text-muted-foreground font-mono min-w-[22px]">
              Q{i + 1}
            </span>
            <div className="flex-1 text-[13px] font-medium leading-snug">
              {a.question.question}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge variant="outline" className={`text-[10px] px-2 py-0 ${typeBadge(a.question.type)}`}>
                {a.question.type}
              </Badge>
              <span className={`text-[13px] font-extrabold font-mono min-w-[32px] text-right ${scoreColor(a.evaluation?.score ?? 0)}`}>
                {a.evaluation?.score ?? 0}/10
              </span>
              {expanded[i] ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
          </div>
          {expanded[i] && (
            <div className="p-3.5 bg-muted/30 border-t border-border animate-fade-in">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Your Answer</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed">{a.answer}</div>
              <Separator className="my-2.5" />
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">AI Feedback</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed">{a.evaluation?.feedback}</div>
              {a.evaluation?.ideal_answer && (
                <>
                  <Separator className="my-2.5" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Ideal Answer</div>
                  <div className="text-[13px] text-muted-foreground leading-relaxed">{a.evaluation.ideal_answer}</div>
                </>
              )}
              {a.evaluation?.improvements && a.evaluation.improvements.length > 0 && (
                <>
                  <Separator className="my-2.5" />
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Improvements</div>
                  {a.evaluation.improvements.map((im, j) => (
                    <div key={j} className="flex gap-1.5 text-xs text-muted-foreground mb-1">
                      <span className="text-warning">•</span>{im}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
