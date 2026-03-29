interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = (current / total) * 100

  return (
    <div className="flex-shrink-0 mb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground">
          Question <strong className="text-foreground">{current + 1}</strong> of{' '}
          <strong className="text-foreground">{total}</strong>
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">{Math.round(pct)}%</span>
      </div>
      {/* Segmented progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-500"
            style={{
              background: i < current
                ? 'var(--color-success)'
                : i === current
                ? 'var(--color-primary)'
                : 'var(--color-muted)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
