import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download } from 'lucide-react'
import type { Recommendation } from '@/types'

interface RecommendationsProps {
  recommendations: Recommendation[]
  onRestart: () => void
}

const priorityBar = (p: string) => {
  switch (p) {
    case 'high': return 'bg-destructive'
    case 'medium': return 'bg-warning'
    default: return 'bg-success'
  }
}

const priorityBadge = (p: string) => {
  switch (p) {
    case 'high': return 'bg-destructive/7 text-destructive border-destructive/18'
    case 'medium': return 'bg-warning/7 text-warning border-warning/18'
    default: return 'bg-success/7 text-success border-success/18'
  }
}

export function Recommendations({ recommendations, onRestart }: RecommendationsProps) {
  return (
    <div className="space-y-2 animate-fade-in">
      {recommendations.map((r, i) => (
        <div
          key={i}
          className="flex gap-3 p-3.5 bg-card border border-border rounded-lg hover:border-muted-foreground/20 transition-colors"
        >
          <div className={`w-[3px] rounded-full flex-shrink-0 ${priorityBar(r.priority)}`} style={{ minHeight: 36 }} />
          <div className="flex-1">
            <div className="text-[13px] font-semibold mb-0.5">{r.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{r.description}</div>
          </div>
          <Badge variant="outline" className={`text-[10px] flex-shrink-0 self-start ${priorityBadge(r.priority)}`}>
            {r.priority}
          </Badge>
        </div>
      ))}

      <Card className="p-4 mt-4">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
          Next Steps
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-3.5">
          Start with <strong className="text-foreground">high priority</strong> items. Update your resume with the missing ATS keywords, then re-run this interview in 2 weeks to track your improvement.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={onRestart}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Practice Again
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}
