import { Button } from '@/components/ui/button'
import { ArrowRight, Play, FileText, Brain, BarChart3, Upload, MessageSquare, Star } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background glow */}
      <div className="gradient-hero absolute inset-0 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 gradient-primary-soft border border-primary/15 rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Interview Prep
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.06] tracking-tight mb-5">
              Ace Your Next{' '}
              <span className="gradient-text">Interview</span>
              <br />
              with AI
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 max-w-[480px] mx-auto lg:mx-0">
              Upload your resume, paste the job description, and practice with a realistic AI interviewer. Get instant scores, detailed feedback, and a personalized action plan.
            </p>

            <div className="flex gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onStart}
                className="text-sm px-7 py-6 rounded-2xl gradient-primary border-0 shadow-lg shadow-primary/20 btn-glow font-semibold"
              >
                Start Free Interview
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm px-6 py-6 rounded-2xl font-medium"
                onClick={onStart}
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                See How It Works
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                Privacy-first
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                No sign-up needed
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                100% free
              </span>
            </div>
          </div>

          {/* Right — Mock UI Preview */}
          <div className="animate-fade-in-up hidden lg:block" style={{ animationDelay: '150ms' }}>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 gradient-primary-soft rounded-3xl blur-2xl opacity-60" />

              {/* Mock interview card */}
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-semibold">InterviewAI</span>
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    Question 2 of 5
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-5 space-y-4">
                  {/* AI message */}
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-muted/60 rounded-xl rounded-tl-sm px-4 py-2.5 text-xs leading-relaxed max-w-[85%]">
                      Tell me about a time you had to convince stakeholders to change direction on a product decision.
                    </div>
                  </div>

                  {/* Score preview */}
                  <div className="flex gap-2.5 justify-end">
                    <div className="gradient-card border border-primary/15 rounded-xl px-4 py-3 max-w-[70%]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full border-2 border-success flex items-center justify-center">
                          <span className="text-[10px] font-extrabold text-success font-mono">8</span>
                        </div>
                        <span className="text-[10px] font-bold text-success">Great answer!</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Strong use of STAR method with quantified outcomes...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score bar at bottom */}
                <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-4">
                  {[
                    { icon: Upload, label: 'Resume', color: 'text-primary' },
                    { icon: MessageSquare, label: 'Interview', color: 'text-primary' },
                    { icon: BarChart3, label: 'Report', color: 'text-muted-foreground' },
                  ].map((step, i) => (
                    <div key={step.label} className="flex items-center gap-1.5">
                      <step.icon className={`w-3 h-3 ${step.color}`} />
                      <span className={`text-[10px] font-medium ${i < 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                      {i < 2 && <div className="w-6 h-[1.5px] bg-primary/30 ml-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
