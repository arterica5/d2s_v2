import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Package,
  Building2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { BOM_NODES } from "../data/mockBOM.js";
import { getItemDetail } from "../data/itemDetails.js";
import { flattenAll } from "../data/costAnalysis.js";
import { useItemDetail } from "../context/ItemDetailContext.jsx";

const KRW = new Intl.NumberFormat("en-US");

const DEFAULT_FILTER = { buyMode: "all", supplier: "all" };

export function ItemListPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const { open: openItemDetail } = useItemDetail();

  const allItems = useMemo(() => flattenAll(), []);

  const allSuppliers = useMemo(() => {
    const set = new Set();
    allItems.forEach((i) => i.supplier && set.add(i.supplier));
    return [...set];
  }, [allItems]);

  const filtered = useMemo(() => {
    return allItems.filter((it) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !it.code.toLowerCase().includes(q) &&
          !it.name.toLowerCase().includes(q) &&
          !(it.supplier ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.buyMode !== "all" && it.buyMode !== filters.buyMode)
        return false;
      if (filters.supplier !== "all" && it.supplier !== filters.supplier)
        return false;
      return true;
    });
  }, [allItems, query, filters]);

  const summary = useMemo(() => {
    const total = allItems.length;
    const overTarget = allItems.filter(
      (i) => (i.unitPrice ?? 0) > (i.targetCost ?? 0),
    ).length;
    const approved = allItems.filter((i) => i.ppapStatus === "approved").length;
    const atRisk = allItems.filter(
      (i) => i.riskLevel === "high" || i.riskLevel === "medium",
    ).length;
    return { total, overTarget, approved, atRisk };
  }, [allItems]);

  return (
    <>
      <PageHeader
        breadcrumbs={["Items"]}
        title="Items"
        description="Cross-project item master — specs, suppliers, and risk at a glance."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Total" value={`${summary.total}`} icon={Package} />
        <KpiCard
          label="PPAP Approved"
          value={`${summary.approved}`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="Over Target"
          value={`${summary.overTarget}`}
          icon={AlertTriangle}
          tone={summary.overTarget > 0 ? "warning" : undefined}
        />
        <KpiCard
          label="At Risk"
          value={`${summary.atRisk}`}
          tone={summary.atRisk > 0 ? "warning" : undefined}
          hint="Medium + High risk items"
        />
      </div>

      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
          <div className="flex items-center gap-sm flex-wrap">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-sm top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, name, supplier"
                className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-64 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
              />
            </div>
            <FilterSelect
              label="Buy Mode"
              value={filters.buyMode}
              onChange={(v) => setFilters({ ...filters, buyMode: v })}
              options={[
                { value: "all", label: "All" },
                { value: "BUY", label: "Buy" },
                { value: "INHOUSE", label: "In-house" },
                { value: "AVAP", label: "AVAP" },
                { value: "ODM", label: "ODM" },
              ]}
            />
            <FilterSelect
              label="Supplier"
              value={filters.supplier}
              onChange={(v) => setFilters({ ...filters, supplier: v })}
              options={[
                { value: "all", label: "All suppliers" },
                ...allSuppliers.map((s) => ({ value: s, label: s })),
              ]}
            />
            {(filters.buyMode !== "all" ||
              filters.supplier !== "all" ||
              query.trim()) && (
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTER);
                  setQuery("");
                }}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-fast"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-xs text-text-secondary">
            <b className="text-text-primary">{filtered.length}</b> of {allItems.length} items
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-2xl text-sm text-text-secondary">
            No items match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-text-secondary border-b border-border">
                  <Th>Item</Th>
                  <Th>Category / Spec</Th>
                  <Th>Supplier</Th>
                  <Th>Buy Mode</Th>
                  <Th className="text-right">Unit Price</Th>
                  <Th className="text-right">Target</Th>
                  <Th>PPAP</Th>
                  <Th>Risk</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => {
                  const d = getItemDetail(it);
                  return (
                    <tr
                      key={it.id}
                      onClick={() => openItemDetail(it)}
                      className="border-b border-border text-sm cursor-pointer hover:bg-surface-container-secondary transition-colors duration-fast"
                    >
                      <td className="px-md py-md min-w-[220px]">
                        <p className="font-mono text-xs text-text-secondary">
                          {it.code}
                        </p>
                        <p className="text-sm font-semibold mt-2xs">{it.name}</p>
                      </td>
                      <td className="px-md py-md text-xs text-text-secondary max-w-[260px]">
                        <p className="font-semibold text-text-primary">
                          {d.category}
                        </p>
                        <p className="mt-2xs truncate">{d.spec}</p>
                      </td>
                      <td className="px-md py-md text-sm">
                        {it.supplier ? (
                          <span className="inline-flex items-center gap-xs">
                            <Building2 size={12} className="text-text-secondary" />
                            {it.supplier}
                          </span>
                        ) : (
                          <span className="text-xs text-text-disabled italic">
                            In-house
                          </span>
                        )}
                      </td>
                      <td className="px-md py-md text-xs text-text-secondary">
                        {it.buyMode ?? "—"}
                      </td>
                      <td className="px-md py-md text-right font-mono tabular-nums">
                        ₩{KRW.format(it.unitPrice ?? 0)}
                      </td>
                      <td className="px-md py-md text-right font-mono tabular-nums text-text-secondary">
                        ₩{KRW.format(it.targetCost ?? 0)}
                      </td>
                      <td className="px-md py-md">
                        <StatusBadge status={it.ppapStatus} />
                      </td>
                      <td className="px-md py-md">
                        <RiskDot level={it.riskLevel} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function RiskDot({ level }) {
  const color = {
    high: "var(--color-error-main)",
    medium: "var(--color-warning-main)",
    low: "var(--color-success-main)",
  }[level];
  return (
    <span
      className="inline-flex items-center gap-xs text-xs font-semibold uppercase tracking-wide"
      style={{ color }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {level}
    </span>
  );
}

function FilterSelect({ label, value, onChange, options }) {
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

function KpiCard({ label, value, icon: Icon, tone, hint }) {
  const color =
    tone === "success"
      ? "var(--color-success-main)"
      : tone === "warning"
        ? "var(--color-warning-main)"
        : tone === "error"
          ? "var(--color-error-main)"
          : "var(--color-text-primary)";
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

function Th({ children, className = "" }) {
  return (
    <th
      className={`text-left font-semibold px-md py-sm uppercase tracking-wide ${className}`}
      style={{ letterSpacing: "0.04em" }}
    >
      {children}
    </th>
  );
}
