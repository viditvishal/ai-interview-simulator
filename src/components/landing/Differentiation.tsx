import { Zap, Shield, Wifi } from 'lucide-react'

const items = [
  {
    icon: Zap,
    title: 'Parallel Processing',
    description: 'Questions and ATS analysis run simultaneously — results in seconds.',
  },
  {
    icon: Shield,
    title: 'Privacy-First AI',
    description: 'Your data stays with you. Powered by Groq — no data stored on third-party servers.',
  },
  {
    icon: Wifi,
    title: 'Always Works',
    description: 'Smart fallback system ensures the app works even if AI response is slow.',
  },
]

export function Differentiation() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-12 lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-4 group">
            <div className="w-10 h-10 rounded-xl gradient-primary-soft border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-250">
              <item.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1 tracking-tight">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
