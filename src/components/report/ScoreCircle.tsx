interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ScoreCircle({ score = 0, size = 104, strokeWidth = 8, label }: ScoreCircleProps) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const c = Math.max(0, Math.min(100, Math.round(score)))
  const dash = (c / 100) * circ
  const cx = size / 2

  const color =
    c >= 70 ? 'var(--color-success)' : c >= 50 ? 'var(--color-warning)' : 'var(--color-destructive)'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div
          className="absolute font-mono font-extrabold"
          style={{ fontSize: size > 90 ? 22 : 15, color }}
        >
          {c}
        </div>
      </div>
      {label && (
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      )}
    </div>
  )
}
