import { PHASES } from "../data/mockProjects.js";

/**
 * Compact horizontal phase indicator.
 *
 * - Completed phases: filled primary dot.
 * - Current phase: ring with inner dot, label always visible underneath.
 * - Upcoming phases: hollow dot.
 * - Every dot reveals the phase label on hover (custom tooltip).
 *
 * Two sizes (sm / md) tune dot diameter and gap.
 */
export function PhaseStepper({ currentPhase, size = "sm" }) {
  const currentIdx = PHASES.findIndex((p) => p.id === currentPhase);
  const dot = size === "sm" ? 8 : 10;
  const current = size === "sm" ? 14 : 16;
  const gap = size === "sm" ? 16 : 24;

  return (
    <div className="inline-flex items-center" role="list" aria-label="Project phases">
      {PHASES.map((p, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isUpcoming = i > currentIdx;
        const isLast = i === PHASES.length - 1;
        return (
          <div key={p.id} className="flex items-center">
            <div className="relative group" role="listitem">
              <span
                className="rounded-full flex items-center justify-center transition-colors duration-fast cursor-default"
                style={{
                  width: isCurrent ? current : dot,
                  height: isCurrent ? current : dot,
                  backgroundColor: isDone
                    ? "var(--color-primary-main)"
                    : isCurrent
                      ? "var(--color-primary-light)"
                      : "transparent",
                  border: isCurrent
                    ? `2px solid var(--color-primary-main)`
                    : isUpcoming
                      ? `1px solid var(--color-border-primary)`
                      : "none",
                }}
              >
                {isCurrent && (
                  <span
                    className="rounded-full"
                    style={{
                      width: dot - 2,
                      height: dot - 2,
                      backgroundColor: "var(--color-primary-main)",
                    }}
                  />
                )}
              </span>

              {/* Hover label (custom tooltip) */}
              <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-xs whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide pointer-events-none rounded-sm px-xs py-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-fast z-10"
                style={{
                  color: isDone || isCurrent
                    ? "var(--color-primary-dark)"
                    : "var(--color-text-secondary)",
                  backgroundColor: "var(--color-bg-paper)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                {p.label}
              </span>
            </div>
            {!isLast && (
              <span
                className="h-px inline-block"
                style={{
                  width: gap,
                  backgroundColor:
                    i < currentIdx
                      ? "var(--color-primary-main)"
                      : "var(--color-border-primary)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
