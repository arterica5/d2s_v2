import { useMemo } from "react";

const TONE_COLORS = {
  success: "var(--color-success-main)",
  warning: "var(--color-warning-main)",
  error: "var(--color-error-main)",
  info: "var(--color-info-main)",
  primary: "var(--color-primary-main)",
};

/**
 * KPI card — compact metric display used at the top of every workspace.
 *
 * Props:
 *   label    — caption above the value (required)
 *   value    — formatted metric string (required)
 *   tone     — success / warning / error / info / primary; drives colour
 *   muted    — renders value in secondary text colour (used for target
 *              / reference metrics that should not compete)
 *   icon     — lucide icon component (Icon)
 *   hint     — small helper line below the value
 */
export function KpiCard({ label, value, tone, icon: Icon, muted, hint }) {
  const color = useMemo(() => {
    if (muted) return "var(--color-text-secondary)";
    if (tone && TONE_COLORS[tone]) return TONE_COLORS[tone];
    return "var(--color-text-primary)";
  }, [tone, muted]);

  return (
    <div className="bg-surface-paper border border-border rounded-xl p-lg shadow-elevation-2">
      <p className="text-xs text-text-secondary uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-h3 mt-2xs font-bold inline-flex items-center gap-xs"
        style={{ color, letterSpacing: "-0.01em" }}
      >
        {Icon && <Icon size={20} />}
        {value}
      </p>
      {hint && <p className="text-xs text-text-secondary mt-2xs">{hint}</p>}
    </div>
  );
}
