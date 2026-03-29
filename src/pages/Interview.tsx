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
      <div className="max-w-[700px] mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center min-h-[calc(100vh-56px)]">
        <div className="w-20 h-20 rounded-2xl gradient-primary-soft border border-primary/15 flex items-center justify-center text-primary mb-6 animate-pop-in">
          <Check className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2 tracking-tight animate-fade-in">Interview Complete!</h2>
        <p className="text-muted-foreground text-sm mb-8 animate-fade-in">
          {answered}/{questions.length} answered · Average score {avgPct}%
        </p>
        <Button
          size="lg"
          onClick={finishInterview}
          className="rounded-2xl gradient-primary border-0 shadow-lg shadow-primary/20 btn-glow px-8 py-6 font-semibold animate-fade-in"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Full Report
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 pt-5 flex-1 flex flex-col min-h-[calc(100vh-56px)]">
      <ProgressBar current={currentQuestionIndex} total={questions.length} />

      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-y-auto min-h-[200px]">
        {/* AI Question */}
        <div className="flex gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="max-w-[85%] p-4 rounded-2xl bg-card border border-border/60 rounded-tl-md text-sm leading-relaxed shadow-sm">
            {q.question}
          </div>
        </div>

        {/* Evaluating state */}
        {evaling && (
          <>
            <div className="flex gap-3 flex-row-reverse animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-muted border border-border/60 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="max-w-[80%] p-4 rounded-2xl gradient-primary text-white rounded-tr-md text-sm opacity-65 italic">
                Submitting…
              </div>
            </div>
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2.5 p-4 bg-card border border-border/60 rounded-2xl rounded-tl-md text-xs text-muted-foreground shadow-sm">
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
            <div className="flex gap-3 flex-row-reverse animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-muted border border-border/60 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="max-w-[80%] p-4 rounded-2xl gradient-primary text-white rounded-tr-md text-sm">
                {answers[answers.length - 1]?.answer}
              </div>
            </div>
            <div className="flex gap-3 animate-pop-in">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold font-mono border-2 flex-shrink-0 ${scoreColor(currEval.score)} ${scoreBorder(currEval.score)}`}>
                      {currEval.score}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">
                        {currEval.score >= 8 ? 'Excellent!' : currEval.score >= 6 ? 'Good answer' : currEval.score >= 4 ? 'Needs work' : 'Keep practicing'}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0 rounded-full ${currEval.fromAI ? 'bg-success/7 text-success border-success/18' : 'bg-warning/7 text-warning border-warning/18'}`}>
                          {currEval.fromAI ? '● AI' : '● Demo'}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">{currEval.score}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed mb-3">{currEval.feedback}</div>
                  {currEval.ideal_answer && (
                    <>
                      <button
                        className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                        onClick={() => setShowIdeal((s) => !s)}
                      >
                        {showIdeal ? 'Hide' : 'Show'} ideal answer
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showIdeal ? 'rotate-180' : ''}`} />
                      </button>
                      {showIdeal && (
                        <div className="text-xs text-muted-foreground leading-relaxed gradient-primary-soft rounded-xl p-4 mt-2.5 animate-fade-in border border-primary/10">
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
        <div className="flex justify-end mb-4">
          {currentQuestionIndex + 1 >= questions.length ? (
            <Button
              onClick={next}
              className="rounded-2xl gradient-primary border-0 shadow-sm shadow-primary/20 font-medium px-6 py-5"
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Finish & View Report
            </Button>
          ) : (
            <Button
              onClick={next}
              className="rounded-2xl gradient-primary border-0 shadow-sm shadow-primary/20 font-medium px-6 py-5"
            >
              Next Question
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
