import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = (current / total) * 100

  return (
    <div className="flex-shrink-0 mb-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground">
          Question <strong className="text-foreground">{current + 1}</strong> of{' '}
          <strong className="text-foreground">{total}</strong>
        </span>
      </div>
      <Progress value={pct} className="h-[3px]" />
    </div>
  )
}
