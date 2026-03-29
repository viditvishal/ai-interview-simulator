import { Button } from '@/components/ui/button'
import { Zap, ArrowRight } from 'lucide-react'

interface HeroProps {
  onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="max-w-[600px] mx-auto px-5 pt-16 pb-11 text-center">
      <div className="inline-flex items-center gap-1.5 bg-primary/7 border border-primary/18 rounded-full px-3 py-0.5 text-[11px] font-bold text-primary uppercase tracking-wider mb-5">
        <Zap className="w-2.5 h-2.5" />
        Powered by Ollama · Instant fallback
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight mb-4">
        Ace Your Next
        <br />
        <span className="text-primary">Interview with AI</span>
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed mb-7 max-w-[440px] mx-auto">
        Upload your resume, paste the JD, and practice with a realistic AI interviewer. Get scored on every answer.
      </p>
      <div className="flex gap-2.5 justify-center">
        <Button size="lg" onClick={onStart} className="text-sm px-6 rounded-xl">
          Start Free Interview
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
