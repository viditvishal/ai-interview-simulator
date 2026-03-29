import { FileSearch, Brain, BarChart3, Target, ListChecks, Sparkles } from 'lucide-react'

const features = [
  {
    icon: FileSearch,
    title: 'ATS Resume Score',
    description: 'See exactly which keywords you\'re missing and get a match percentage against the JD.',
    gradient: 'from-violet-500/10 to-purple-500/10',
    iconBg: 'from-violet-500 to-purple-600',
  },
  {
    icon: Brain,
    title: 'AI Mock Interview',
    description: 'Practice with questions tailored to your resume and the exact role you\'re applying for.',
    gradient: 'from-blue-500/10 to-indigo-500/10',
    iconBg: 'from-blue-500 to-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Full Report',
    description: 'Detailed scores, ideal answers, skills gap analysis, and a personalized action plan.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconBg: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Target,
    title: 'Resume Match Score',
    description: 'Understand how well your resume matches the job requirements with keyword-level detail.',
    gradient: 'from-amber-500/10 to-orange-500/10',
    iconBg: 'from-amber-500 to-orange-600',
  },
  {
    icon: ListChecks,
    title: 'Application Tracker',
    description: 'Track your interview sessions, scores, and improvement over time in one place.',
    gradient: 'from-pink-500/10 to-rose-500/10',
    iconBg: 'from-pink-500 to-rose-600',
  },
  {
    icon: Sparkles,
    title: 'AI Answer Generator',
    description: 'Get ideal answer suggestions for every question to learn what great responses look like.',
    gradient: 'from-cyan-500/10 to-sky-500/10',
    iconBg: 'from-cyan-500 to-sky-600',
  },
]

export function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-16 lg:py-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-4 gradient-primary-soft border border-primary/15 rounded-full px-4 py-1.5">
          Features
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Everything you need to <span className="gradient-text">land the job</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          From resume analysis to AI-powered practice interviews — one platform, zero guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {features.map((f) => (
          <div
            key={f.title}
            className={`group relative bg-gradient-to-br ${f.gradient} border border-border/60 rounded-2xl p-6 card-hover cursor-default`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center mb-4 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform duration-250`}>
              <f.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold mb-1.5 tracking-tight">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
