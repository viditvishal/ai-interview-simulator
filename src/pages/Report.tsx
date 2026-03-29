import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, RefreshCw, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScoreCircle } from '@/components/report/ScoreCircle'
import { QuestionBreakdown } from '@/components/report/QuestionBreakdown'
import { ATSAnalysisView } from '@/components/report/ATSAnalysis'
import { Recommendations } from '@/components/report/Recommendations'
import { useInterviewStore } from '@/store/interviewStore'
import { aiService } from '@/services/aiService'
import type { ReportGeneration } from '@/types'

const READINESS = {
  not_ready: { label: 'Not Ready', color: 'text-destructive', bg: 'bg-destructive/10' },
  needs_practice: { label: 'Needs Practice', color: 'text-warning', bg: 'bg-warning/10' },
  almost_ready: { label: 'Almost Ready', color: 'text-primary', bg: 'bg-primary/10' },
  ready: { label: 'Interview Ready!', color: 'text-success', bg: 'bg-success/10' },
}

export default function ReportPage() {
  const navigate = useNavigate()
  const store = useInterviewStore()
  const { session, answers } = store

  const [report, setReport] = useState<(ReportGeneration & { fromAI?: boolean }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      navigate('/')
      return
    }

    aiService
      .generateReport(answers, session.atsData.ats_score, session.jobTitle)
      .then(({ report: r, fromAI }) => {
        setReport({ ...r, fromAI })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [session, answers, navigate])

  if (!session) return null

  const { atsData, jobTitle } = session
  const avg10 = answers.reduce((s, a) => s + (a.evaluation?.score ?? 0), 0) / Math.max(answers.length, 1)
  const avg100 = Math.round(avg10 * 10)

  const scoreColor = (s: number) =>
    s >= 70 ? 'text-success' : s >= 50 ? 'text-warning' : 'text-destructive'

  const onRestart = () => {
    store.reset()
    navigate('/')
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 pt-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start gap-2.5 flex-wrap mb-6 no-print">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight mb-0.5">Interview Report</h1>
          <p className="text-[13px] text-muted-foreground">
            {jobTitle} · {answers.length} questions · Avg score {avg100}%
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Download className="w-3 h-3 mr-1" /> Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            <RefreshCw className="w-3 h-3 mr-1" /> New
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-5 no-print">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="ats">ATS Analysis</TabsTrigger>
          <TabsTrigger value="recs">Action Plan</TabsTrigger>
        </TabsList>

        {/* Loading state */}
        {loading && (
          <Card className="p-8 text-center flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
            <div className="text-[13px] font-semibold">Generating report…</div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" style={{ animationDelay: '0.16s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" style={{ animationDelay: '0.32s' }} />
            </div>
          </Card>
        )}

        {/* OVERVIEW */}
        <TabsContent value="overview">
          {!loading && report && (
            <div className="space-y-4 animate-fade-in">
              {/* Score cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Card className="text-center p-5">
                  <ScoreCircle score={report.overall_score} label="Interview" />
                </Card>
                <Card className="text-center p-5">
                  <ScoreCircle score={atsData.ats_score} label="ATS Score" />
                </Card>
                <Card className="text-center p-5 flex flex-col items-center justify-center gap-2 col-span-2 sm:col-span-1">
                  {(() => {
                    const r = READINESS[report.interview_readiness] ?? READINESS.needs_practice
                    return (
                      <>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${r.color} ${r.bg}`}>
                          {r.label}
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Readiness</div>
                      </>
                    )
                  })()}
                </Card>
              </div>

              {/* Summary */}
              {report.performance_summary && (
                <Card className="p-4 bg-primary/5 border-primary/15">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                    Performance Summary
                  </div>
                  <div className="text-[13px] leading-relaxed">{report.performance_summary}</div>
                </Card>
              )}

              {/* Strengths / Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="text-[10px] font-bold text-success uppercase tracking-wider mb-2.5">Strengths</div>
                  {report.strengths.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-2 text-[13px] text-muted-foreground">
                      <span className="text-success flex-shrink-0">→</span>{s}
                    </div>
                  ))}
                </Card>
                <Card className="p-4">
                  <div className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-2.5">Improve</div>
                  {report.weaknesses.map((w, i) => (
                    <div key={i} className="flex gap-2 mb-2 text-[13px] text-muted-foreground">
                      <span className="text-destructive flex-shrink-0">→</span>{w}
                    </div>
                  ))}
                </Card>
              </div>

              {/* Per-question scores */}
              <Card className="p-4">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Per-Question Scores
                </div>
                {answers.map((a, i) => (
                  <div key={i} className="mb-2.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-medium flex-1 truncate pr-2">
                        Q{i + 1}: {a.question.question.slice(0, 52)}
                        {a.question.question.length > 52 ? '…' : ''}
                      </span>
                      <span className={`font-mono font-bold flex-shrink-0 ${scoreColor((a.evaluation?.score ?? 0) * 10)}`}>
                        {a.evaluation?.score ?? 0}/10
                      </span>
                    </div>
                    <Progress value={(a.evaluation?.score ?? 0) * 10} className="h-1.5" />
                  </div>
                ))}
              </Card>
            </div>
          )}
          {!loading && !report && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Failed to generate report. Try restarting.</p>
              <Button className="mt-4" onClick={onRestart}>Start Over</Button>
            </Card>
          )}
        </TabsContent>

        {/* QUESTIONS */}
        <TabsContent value="questions">
          <QuestionBreakdown answers={answers} />
        </TabsContent>

        {/* ATS */}
        <TabsContent value="ats">
          <ATSAnalysisView data={atsData} />
        </TabsContent>

        {/* RECOMMENDATIONS */}
        <TabsContent value="recs">
          {!loading && report && (
            <Recommendations recommendations={report.recommendations} onRestart={onRestart} />
          )}
          {loading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
