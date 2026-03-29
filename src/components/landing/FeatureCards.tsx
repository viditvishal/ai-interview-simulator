import { Card } from '@/components/ui/card'
import { FileText, Brain, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'ATS Resume Score',
    description: "See exactly which keywords you're missing and get a match percentage.",
  },
  {
    icon: Brain,
    title: 'AI Mock Interview',
    description: 'AI generates questions tailored to your resume and the exact role.',
  },
  {
    icon: BarChart3,
    title: 'Full Report',
    description: 'Scores, ideal answers, skills gap table, and a personalized action plan.',
  },
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[740px] mx-auto mb-11 px-4">
      {features.map((f) => (
        <Card
          key={f.title}
          className="p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/20"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/7 border border-primary/18 flex items-center justify-center text-primary mb-3">
            <f.icon className="w-[17px] h-[17px]" />
          </div>
          <h3 className="text-[13px] font-semibold mb-1">{f.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
        </Card>
      ))}
    </div>
  )
}
