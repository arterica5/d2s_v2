import { Filter } from "lucide-react";

/**
 * Labeled dropdown used in every filter bar. Keeps the same chrome
 * (Filter icon, small grey label, bold value) across pages.
 *
 * Props:
 *   label    — string shown before the native select
 *   value    — current value (string)
 *   onChange — (newValue: string) => void
 *   options  — Array<{ value, label }>
 */
export function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="inline-flex items-center gap-xs px-md py-xs rounded-md text-sm text-text-primary bg-surface-paper border border-border">
      <Filter size={12} className="text-text-secondary" />
      <span className="text-text-secondary text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-semibold focus:outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
