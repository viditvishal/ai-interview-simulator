import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, BarChart3, ChevronRight, Brain, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/interview/ProgressBar'
import { AnswerInput } from '@/components/interview/AnswerInput'
import { useInterviewStore } from '@/store/interviewStore'
import { aiService } from '@/services/aiService'
import type { AnswerEvaluation, InterviewAnswer } from '@/types'

export default function InterviewPage() {
  const navigate = useNavigate()
  const store = useInterviewStore()
  const { session, answers, currentQuestionIndex } = store

  const [ans, setAns] = useState('')
  const [evaling, setEvaling] = useState(false)
  const [currEval, setCurrEval] = useState<(AnswerEvaluation & { fromAI: boolean }) | null>(null)
  const [showIdeal, setShowIdeal] = useState(false)
  const [done, setDone] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session) navigate('/')
  }, [session, navigate])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentQuestionIndex, currEval, evaling])

  if (!session) return null

  const { questions, jobDescription } = session
  const q = questions[currentQuestionIndex]

  const scoreColor = (s: number) =>
    s >= 8 ? 'text-success' : s >= 5 ? 'text-warning' : 'text-destructive'

  const scoreBorder = (s: number) =>
    s >= 8 ? 'border-success' : s >= 5 ? 'border-warning' : 'border-destructive'

  const submit = async () => {
    if (!ans.trim() || evaling) return
    const myAns = ans.trim()
    setAns('')
    setEvaling(true)

    const { evaluation, fromAI } = await aiService.evaluateAnswer(
      q.question,
      q.type,
      myAns,
      jobDescription
    )

    setCurrEval({ ...evaluation, fromAI })
    store.addAnswer({
      question: q,
      answer: myAns,
      evaluation,
    })
    setEvaling(false)
  }

  const next = () => {
    setCurrEval(null)
    setShowIdeal(false)
    if (currentQuestionIndex + 1 >= questions.length) {
      setDone(true)
    } else {
      store.nextQuestion()
    }
  }

  const skip = () => {
    store.addAnswer({
      question: q,
      answer: '[Skipped]',
      evaluation: { score: 0, feedback: 'Skipped', ideal_answer: '', strengths: [], improvements: [] },
    })
    setCurrEval(null)
    if (currentQuestionIndex + 1 >= questions.length) {
      setDone(true)
    } else {
      store.nextQuestion()
    }
  }

  const finishInterview = () => {
    navigate(`/report/${store.sessionId}`)
  }

  // Done screen
  if (done) {
    const answered = answers.filter((a) => a.answer !== '[Skipped]').length
    const avgPct = Math.round(
      (answers.reduce((s, a) => s + (a.evaluation?.score ?? 0), 0) / answers.length) * 10
    )
    return (
      <div className="max-w-[700px] mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center min-h-[calc(100vh-50px)]">
        <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success mb-4">
          <Check className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold mb-2 tracking-tight">Interview Complete!</h2>
        <p className="text-muted-foreground text-[13px] mb-6">
          {answered}/{questions.length} answered · Avg {avgPct}%
        </p>
        <Button size="lg" onClick={finishInterview} className="rounded-xl">
          <BarChart3 className="w-4 h-4 mr-1.5" />
          View Full Report
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 pt-4 flex-1 flex flex-col min-h-[calc(100vh-50px)]">
      <ProgressBar current={currentQuestionIndex} total={questions.length} />

      <div className="flex-1 flex flex-col gap-3 pb-3.5 overflow-y-auto min-h-[200px]">
        {/* AI Question */}
        <div className="flex gap-2.5 animate-fade-in">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Brain className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <div className="max-w-[80%] p-3 px-4 rounded-xl bg-card border border-border rounded-tl-sm text-[13px] leading-relaxed">
            {q.question}
          </div>
        </div>

        {/* Evaluating state */}
        {evaling && (
          <>
            <div className="flex gap-2.5 flex-row-reverse animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="max-w-[80%] p-3 px-4 rounded-xl bg-primary text-primary-foreground rounded-tr-sm text-[13px] opacity-65 italic">
                Submitting…
              </div>
            </div>
            <div className="flex gap-2.5 animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Brain className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2 p-3 px-4 bg-card border border-border rounded-xl rounded-tl-sm text-xs text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" style={{ animationDelay: '0.16s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bop" style={{ animationDelay: '0.32s' }} />
                </div>
                Evaluating your answer…
              </div>
            </div>
          </>
        )}

        {/* Eval result */}
        {currEval && !evaling && (
          <>
            <div className="flex gap-2.5 flex-row-reverse animate-fade-in">
              <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="max-w-[80%] p-3 px-4 rounded-xl bg-primary text-primary-foreground rounded-tr-sm text-[13px]">
                {answers[answers.length - 1]?.answer}
              </div>
            </div>
            <div className="flex gap-2.5 animate-pop-in">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Brain className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="bg-card border border-border rounded-xl p-3.5">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold font-mono border-2 flex-shrink-0 ${scoreColor(currEval.score)} ${scoreBorder(currEval.score)}`}>
                      {currEval.score}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-bold">
                        {currEval.score >= 8 ? 'Excellent!' : currEval.score >= 6 ? 'Good answer' : currEval.score >= 4 ? 'Needs work' : 'Keep practicing'}
                      </div>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0 ${currEval.fromAI ? 'bg-success/7 text-success border-success/18' : 'bg-warning/7 text-warning border-warning/18'}`}>
                          {currEval.fromAI ? '● AI' : '● Demo'}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{currEval.score}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] text-muted-foreground leading-relaxed mb-2">{currEval.feedback}</div>
                  {currEval.ideal_answer && (
                    <>
                      <button
                        className="text-xs text-primary font-medium flex items-center gap-0.5 cursor-pointer hover:underline"
                        onClick={() => setShowIdeal((s) => !s)}
                      >
                        {showIdeal ? 'Hide' : 'Show'} ideal answer
                        <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showIdeal ? 'rotate-180' : ''}`} />
                      </button>
                      {showIdeal && (
                        <div className="text-xs text-muted-foreground leading-relaxed bg-muted rounded-lg p-2.5 px-3 mt-2 animate-fade-in">
                          {currEval.ideal_answer}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Answer input */}
      {!currEval && !evaling && (
        <AnswerInput
          value={ans}
          onChange={setAns}
          onSubmit={submit}
          onSkip={skip}
        />
      )}

      {/* Next button */}
      {currEval && !evaling && (
        <div className="flex justify-end mb-3.5">
          {currentQuestionIndex + 1 >= questions.length ? (
            <Button onClick={next}>
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Finish & Report
            </Button>
          ) : (
            <Button onClick={next}>
              Next Question
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
