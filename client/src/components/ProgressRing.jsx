export default function ProgressRing({ value = 0, total = 1, size = 44, stroke = 4, label }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const complete = pct >= 1;
  return (
    <div className={`progress-ring ${complete ? "is-complete" : ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-track" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-fill"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring-label">{label ?? `${value}/${total}`}</span>
    </div>
  );
}
