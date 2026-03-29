import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScoreCircle } from './ScoreCircle'
import type { ATSAnalysis as ATSAnalysisType } from '@/types'

interface ATSAnalysisProps {
  data: ATSAnalysisType
}

const scoreColor = (s: number) =>
  s >= 70 ? 'text-success' : s >= 50 ? 'text-warning' : 'text-destructive'

export function ATSAnalysisView({ data }: ATSAnalysisProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top row: Score + Summary */}
      <div className="flex gap-3 flex-wrap">
        <Card className="flex-shrink-0 w-[148px] text-center p-5">
          <ScoreCircle score={data.ats_score} size={90} strokeWidth={7} label="ATS Match" />
        </Card>
        <Card className="flex-1 min-w-[180px] p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Resume vs JD Match
          </div>
          <div className="text-[13px] text-muted-foreground mb-3 leading-relaxed">
            Matched <strong className="text-foreground">{data.matched_keywords?.length ?? 0}</strong> keywords.
            Score 75%+ greatly increases shortlisting odds.
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">Keyword match rate</span>
              <span className={`font-mono font-bold ${scoreColor(data.ats_score)}`}>{data.ats_score}%</span>
            </div>
            <Progress value={data.ats_score} className="h-1.5" />
          </div>
        </Card>
      </div>

      {/* Keywords grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-[10px] font-bold text-success uppercase tracking-wider mb-2.5">
            Matched Keywords
          </div>
          <div className="flex flex-wrap gap-1">
            {(data.matched_keywords ?? []).map((k, i) => (
              <Badge key={i} variant="outline" className="bg-success/7 text-success border-success/18 text-[11px]">
                {k}
              </Badge>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-2.5">
            Missing Keywords
          </div>
          <div className="flex flex-wrap gap-1">
            {(data.missing_keywords ?? []).map((k, i) => (
              <Badge key={i} variant="outline" className="bg-destructive/7 text-destructive border-destructive/18 text-[11px]">
                {k}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills gap table */}
      {data.skill_gaps && (
        <Card className="p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Skills Gap Table
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2">Required (Missing)</th>
                  <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2">Present</th>
                  <th className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-2">Bonus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 pr-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {(data.skill_gaps.required ?? []).map((s, i) => (
                        <Badge key={i} variant="outline" className="bg-destructive/7 text-destructive border-destructive/18 text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 pr-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {(data.skill_gaps.present ?? []).map((s, i) => (
                        <Badge key={i} variant="outline" className="bg-success/7 text-success border-success/18 text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {(data.skill_gaps.bonus ?? []).map((s, i) => (
                        <Badge key={i} variant="outline" className="bg-primary/7 text-primary border-primary/18 text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Improvement suggestions */}
      {data.improvement_suggestions?.length > 0 && (
        <Card className="p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
            Resume Improvements
          </div>
          {data.improvement_suggestions.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2.5 text-[13px] text-muted-foreground leading-relaxed">
              <span className="text-primary flex-shrink-0 font-bold">→</span>{s}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
