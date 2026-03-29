import { useNavigate } from 'react-router-dom'
import { Hero } from '@/components/landing/Hero'
import { FeatureCards } from '@/components/landing/FeatureCards'
import { Differentiation } from '@/components/landing/Differentiation'
import { Separator } from '@/components/ui/separator'

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1">
      <Hero onStart={() => navigate('/setup')} />
      <Separator />
      <FeatureCards />
      <Separator />
      <Differentiation />

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-muted-foreground">
        <p>Built with AI. Designed for serious candidates.</p>
      </footer>
    </div>
  )
}
