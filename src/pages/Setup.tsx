import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Zap, ChevronRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResumeUploader } from '@/components/setup/ResumeUploader'
import { JobDescriptionInput } from '@/components/setup/JobDescriptionInput'
import { InterviewConfig } from '@/components/setup/InterviewConfig'
import { useInterviewStore } from '@/store/interviewStore'
import { aiService } from '@/services/aiService'
import type { QuestionType } from '@/types'

type Toast = { msg: string; type: 'success' | 'error' | 'warn' | 'info' }

export default function SetupPage() {
  const navigate = useNavigate()
  const store = useInterviewStore()

  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jd, setJd] = useState('')
  const [count, setCount] = useState(5)
  const [types, setTypes] = useState<QuestionType[]>(['behavioral', 'technical', 'situational', 'resume'])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ q: string; ats: string }>({ q: 'wait', ats: 'wait' })
  const [toasts, setToasts] = useState<(Toast & { id: number })[]>([])

  const toast = useCallback((t: Toast) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev.slice(-3), { ...t, id }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000)
  }, [])

  const toggleType = (t: QuestionType) =>
    setTypes((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))

  const canNext = () => {
    if (step === 1) return !!file
    if (step === 2) return jobTitle.trim().length > 1 && jd.trim().length > 15
    return types.length > 0
  }

  const generate = async () => {
    setLoading(true)
    setProgress({ q: 'active', ats: 'active' })

    const [qRes, atsRes] = await Promise.all([
      aiService
        .generateQuestions(resumeText, jd, jobTitle, count, types)
        .then((r) => { setProgress((p) => ({ ...p, q: 'done' })); return r }),
      aiService
        .analyzeATS(resumeText, jd)
        .then((r) => { setProgress((p) => ({ ...p, ats: 'done' })); return r }),
    ])

    if (!qRes.fromAI) toast({ msg: 'Using demo questions (AI timeout)', type: 'warn' })
    if (!atsRes.fromAI) toast({ msg: 'Using demo ATS analysis', type: 'warn' })

    // Brief pause so user sees both checkmarks
    await new Promise((r) => setTimeout(r, 300))

    const sessionId = crypto.randomUUID()
    store.setJobDetails(jobTitle, jd)
    store.setResumeData(resumeText, file?.name ?? null)
    store.setInterviewConfig(count, types)
    store.startSession(sessionId, qRes.questions, atsRes.analysis)

    setLoading(false)
    navigate(`/interview/${sessionId}`)
  }

  const STEPS = ['Upload Resume', 'Job Details', 'Configure']

  return (
    <div className="max-w-[620px] mx-auto px-4 pt-8 pb-14 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold tracking-tight mb-1">Set Up Your Interview</h1>
        <p className="text-[13px] text-muted-foreground">Three steps to a personalized AI mock interview.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-6">
        {STEPS.map((lbl, i) => (
          <div key={lbl} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all
                ${i + 1 < step ? 'bg-success text-white' : i + 1 === step ? 'bg-primary text-primary-foreground ring-2 ring-primary/20' : 'bg-muted text-muted-foreground border border-border'}`}
            >
              {i + 1 < step ? <Check className="w-2.5 h-2.5" /> : i + 1}
            </div>
            <span className={`text-[11px] font-medium ml-1.5 whitespace-nowrap ${i + 1 === step ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              {lbl}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-[1.5px] mx-2 transition-colors ${i + 1 < step ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card className="p-5 animate-fade-in">
          <ResumeUploader
            file={file}
            onFileChange={(f, text) => { setFile(f); setResumeText(text) }}
            onError={(msg) => toast({ msg, type: 'error' })}
            onSuccess={(msg) => toast({ msg, type: 'success' })}
          />
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card className="p-5 animate-fade-in">
          <JobDescriptionInput
            jobTitle={jobTitle}
            jobDescription={jd}
            onJobTitleChange={setJobTitle}
            onJobDescriptionChange={setJd}
          />
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && !loading && (
        <Card className="p-5 animate-fade-in">
          <InterviewConfig
            count={count}
            types={types}
            jobTitle={jobTitle}
            onCountChange={setCount}
            onToggleType={toggleType}
          />
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <Card className="p-8 text-center flex flex-col items-center gap-3 animate-fade-in">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
          <div className="text-[13px] font-semibold">Generating your interview…</div>
          <div className="w-full max-w-[280px] space-y-1.5">
            {[
              { key: 'q', label: 'Interview questions (Ollama)' },
              { key: 'ats', label: 'ATS resume analysis' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0
                    ${progress[key as 'q' | 'ats'] === 'done' ? 'bg-success text-white' : progress[key as 'q' | 'ats'] === 'active' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {progress[key as 'q' | 'ats'] === 'done' ? '✓' : '·'}
                </div>
                <span className={`flex-1 text-left ${progress[key as 'q' | 'ats'] === 'done' ? 'text-success font-medium' : progress[key as 'q' | 'ats'] === 'active' ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground">Auto-fallback · never hangs</div>
        </Card>
      )}

      {/* Nav buttons */}
      {!loading && (
        <div className="flex justify-between mt-3.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Continue
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          ) : (
            <Button onClick={generate} disabled={!canNext()}>
              <Zap className="w-3.5 h-3.5 mr-1" />
              Generate Interview
            </Button>
          )}
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-2.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg pointer-events-auto max-w-[270px] animate-fade-in bg-card
              ${t.type === 'error' ? 'text-destructive border border-destructive/20' : ''}
              ${t.type === 'success' ? 'text-success border border-success/20' : ''}
              ${t.type === 'warn' ? 'text-warning border border-warning/20' : ''}
              ${t.type === 'info' ? 'text-primary border border-primary/20' : ''}
            `}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
