import { Brain } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { QuestionType, Difficulty } from '@/types'

interface QuestionBubbleProps {
  question: string
  type: QuestionType
  difficulty: Difficulty
}

const typeBadgeVariant = (t: QuestionType) => {
  switch (t) {
    case 'behavioral': return 'bg-primary/7 text-primary border-primary/18'
    case 'technical': return 'bg-purple-500/7 text-purple-500 border-purple-500/18'
    case 'situational': return 'bg-warning/7 text-warning border-warning/18'
    case 'resume': return 'bg-success/7 text-success border-success/18'
  }
}

const diffBadgeVariant = (d: Difficulty) => {
  switch (d) {
    case 'easy': return 'bg-success/7 text-success border-success/18'
    case 'medium': return 'bg-warning/7 text-warning border-warning/18'
    case 'hard': return 'bg-destructive/7 text-destructive border-destructive/18'
  }
}

export function QuestionBubble({ question, type, difficulty }: QuestionBubbleProps) {
  return (
    <div className="flex gap-2.5 animate-fade-in">
      <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
        <Brain className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex gap-1.5 mb-1.5">
          <Badge variant="outline" className={`text-[10px] px-2 py-0 ${typeBadgeVariant(type)}`}>
            {type}
          </Badge>
          <Badge variant="outline" className={`text-[10px] px-2 py-0 ${diffBadgeVariant(difficulty)}`}>
            {difficulty}
          </Badge>
        </div>
        <div className="max-w-[80%] p-3 px-4 rounded-xl bg-card border border-border rounded-tl-sm text-[13px] leading-relaxed">
          {question}
        </div>
      </div>
    </div>
  )
}
