import { useNavigate } from 'react-router-dom'
import { Hero } from '@/components/landing/Hero'
import { FeatureCards } from '@/components/landing/FeatureCards'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 pb-16 animate-fade-in">
      <Hero onStart={() => navigate('/setup')} />
      <FeatureCards />
      <div className="flex gap-8 justify-center flex-wrap px-4">
        {[
          ['Parallel', 'Q + ATS run simultaneously'],
          ['Ollama', 'Local AI — your data stays private'],
          ['Always', 'Works even if AI is slow'],
        ].map(([v, l]) => (
          <div key={l} className="text-center">
            <div className="text-xl font-extrabold text-primary font-mono">{v}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
