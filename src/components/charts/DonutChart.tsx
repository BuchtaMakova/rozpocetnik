interface Segment {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);

  if (total === 0) {
    return (
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center text-xs flex-shrink-0"
        style={{ background: "var(--color-primary-subtle)", color: "var(--color-text-faint)" }}
      >
        žádná data
      </div>
    );
  }

  const r = 40, cx = 56, cy = 56, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <svg viewBox="0 0 112 112" className="w-28 h-28 drop-shadow-md flex-shrink-0" style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circumference;
        const offset = cumulative * circumference;
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  );
}
