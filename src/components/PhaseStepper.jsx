import { PHASES } from "../data/mockProjects.js";

/**
 * Compact horizontal phase indicator.
 *
 * - Completed phases: filled primary dot with thin connector.
 * - Current phase: larger ring with inner dot, label shown beneath.
 * - Upcoming phases: hollow dot.
 *
 * Size variants: "sm" fits in a table row, "md" fits on a detail page.
 */
export function PhaseStepper({ currentPhase, size = "sm" }) {
  const currentIdx = PHASES.findIndex((p) => p.id === currentPhase);
  const dot = size === "sm" ? 8 : 12;
  const current = size === "sm" ? 14 : 20;
  const gap = size === "sm" ? 20 : 36;

  return (
    <div className="inline-flex items-center">
      {PHASES.map((p, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        const isUpcoming = i > currentIdx;
        return (
          <div
            key={p.id}
            className="flex items-center"
            title={p.label}
            style={{ marginRight: i === PHASES.length - 1 ? 0 : 0 }}
          >
            <span
              className="rounded-full flex items-center justify-center transition-colors duration-fast"
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
            {i < PHASES.length - 1 && (
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
