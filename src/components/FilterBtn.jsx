/**
 * Pill-style toggle button used inside filter groups (All / Over / Under,
 * E-BOM / Sourcing / Q-BOM / Part List, etc.). The parent is expected
 * to wrap these in a grey rail:
 *   <div className="flex gap-2xs rounded-lg p-2xs bg-surface-container-secondary">
 *     <FilterBtn ... />
 *   </div>
 *
 * size="sm" is a more compact variant used inside dense headers
 * (e.g. the APQP PPAP table phase filter).
 */
export function FilterBtn({ label, active, onClick, size = "md" }) {
  const sizing =
    size === "sm"
      ? "px-sm py-2xs rounded-sm text-xs"
      : "px-md py-xs rounded-md text-sm";
  return (
    <button
      onClick={onClick}
      className={`${sizing} font-semibold transition-colors duration-fast ${
        active
          ? "bg-surface-paper text-text-primary shadow-elevation-2"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}
