/**
 * Donut chart — compact, label-free chart used in dashboards.
 *
 * Props:
 *   slices       — Array<{ label, value, color }>
 *   size         — pixel diameter (default 140)
 *   strokeWidth  — ring thickness (default 22)
 *   centerValue  — optional big number rendered in the middle
 *   centerLabel  — optional caption under centerValue
 */
export function PieChart({
  slices,
  size = 140,
  strokeWidth = 22,
  centerValue,
  centerLabel,
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((s, x) => s + (x.value || 0), 0);

  let cumulative = 0;
  const segments = slices.map((s, i) => {
    const value = Math.max(0, s.value || 0);
    const length = total > 0 ? (value / total) * circumference : 0;
    const dasharray = `${length} ${circumference - length}`;
    const dashoffset = -cumulative;
    cumulative += length;
    return (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={s.color}
        strokeWidth={strokeWidth}
        strokeDasharray={dasharray}
        strokeDashoffset={dashoffset}
      >
        <title>{`${s.label}: ${value}`}</title>
      </circle>
    );
  });

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} aria-hidden>
        {/* Track ring (subtle) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--color-border-secondary)"
          strokeWidth={strokeWidth}
        />
        <g transform={`rotate(-90 ${cx} ${cy})`}>{segments}</g>
      </svg>
      {(centerValue !== undefined || centerLabel !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue !== undefined && (
            <p
              className="text-h3 font-bold"
              style={{ letterSpacing: "-0.01em" }}
            >
              {centerValue}
            </p>
          )}
          {centerLabel && (
            <p className="text-xs text-text-secondary">{centerLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
