import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
  MapPin,
  Star,
  CheckCircle2,
  AlertTriangle,
  Package,
  FileText,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import { FilterSelect } from "../components/FilterSelect.jsx";
import {
  SUPPLIERS,
  SUPPLIER_TIERS,
  summarizeSuppliers,
} from "../data/mockSuppliers.js";

const DEFAULT_FILTER = {
  tier: "all",
  region: "all",
  category: "all",
};

export function SupplierListPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTER);

  const summary = useMemo(() => summarizeSuppliers(), []);
  const allCategories = useMemo(() => {
    const set = new Set();
    SUPPLIERS.forEach((s) => s.categories.forEach((c) => set.add(c)));
    return [...set];
  }, []);
  const allRegions = useMemo(() => {
    const set = new Set();
    SUPPLIERS.forEach((s) => set.add(s.region));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    return SUPPLIERS.filter((s) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.hq.toLowerCase().includes(q) &&
          !s.categories.join(" ").toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.tier !== "all" && s.tier !== filters.tier) return false;
      if (filters.region !== "all" && s.region !== filters.region) return false;
      if (
        filters.category !== "all" &&
        !s.categories.includes(filters.category)
      )
        return false;
      return true;
    });
  }, [query, filters]);

  return (
    <>
      <PageHeader
        breadcrumbs={["Suppliers"]}
        title="Suppliers"
        description="Relationship-aware directory — performance, tier, and open RFx at a glance."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Total" value={`${summary.total}`} />
        <KpiCard
          label="Prime + Long-term"
          value={`${(summary.byTier.prime ?? 0) + (summary.byTier.longterm ?? 0)}`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="Avg. On-Time"
          value={`${Math.round(summary.avgOnTime * 100)}%`}
        />
        <KpiCard
          label="Under Review"
          value={`${summary.review}`}
          icon={AlertTriangle}
          tone={summary.review > 0 ? "warning" : undefined}
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
                placeholder="Search name, HQ, or category"
                className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-64 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
              />
            </div>
            <FilterSelect
              label="Tier"
              value={filters.tier}
              onChange={(v) => setFilters({ ...filters, tier: v })}
              options={[
                { value: "all", label: "All tiers" },
                ...Object.entries(SUPPLIER_TIERS).map(([id, t]) => ({
                  value: id,
                  label: t.label,
                })),
              ]}
            />
            <FilterSelect
              label="Region"
              value={filters.region}
              onChange={(v) => setFilters({ ...filters, region: v })}
              options={[
                { value: "all", label: "All regions" },
                ...allRegions.map((r) => ({ value: r, label: r })),
              ]}
            />
            <FilterSelect
              label="Category"
              value={filters.category}
              onChange={(v) => setFilters({ ...filters, category: v })}
              options={[
                { value: "all", label: "All categories" },
                ...allCategories.map((c) => ({ value: c, label: c })),
              ]}
            />
            {(filters.tier !== "all" ||
              filters.region !== "all" ||
              filters.category !== "all" ||
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
            <b className="text-text-primary">{filtered.length}</b> of{" "}
            {SUPPLIERS.length} suppliers
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-2xl text-sm text-text-secondary">
            No suppliers match the current filters.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((s) => (
              <SupplierRow key={s.id} supplier={s} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function SupplierRow({ supplier: s }) {
  const tierMeta = SUPPLIER_TIERS[s.tier];
  return (
    <li>
      <Link
        to={`/suppliers/${s.id}`}
        className="flex flex-wrap items-center gap-md px-lg py-md hover:bg-surface-container-secondary transition-colors duration-fast group"
      >
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center text-text-inverse font-bold shrink-0"
          style={{ backgroundColor: s.color }}
        >
          {s.logo}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-xs">
            <p className="text-md font-semibold truncate">{s.name}</p>
            <span
              className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
              style={{
                color: tierMeta.color,
                backgroundColor: `${tierMeta.color}15`,
              }}
            >
              {tierMeta.label}
            </span>
          </div>
          <div className="flex items-center gap-md mt-2xs text-xs text-text-secondary">
            <span className="inline-flex items-center gap-2xs">
              <MapPin size={11} /> {s.region} · {s.hq}
            </span>
            <span>·</span>
            <span className="truncate">{s.categories.join(" · ")}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-lg text-xs text-text-secondary">
          <Metric
            label="Score"
            value={s.performance.toFixed(1)}
            icon={Star}
            tone="primary"
          />
          <Metric
            label="On-Time"
            value={`${Math.round(s.onTimeRate * 100)}%`}
            tone={s.onTimeRate > 0.94 ? "success" : s.onTimeRate > 0.9 ? "info" : "warning"}
          />
          <Metric
            label="PPM"
            value={`${s.defectPpm}`}
            tone={s.defectPpm < 30 ? "success" : s.defectPpm < 100 ? "info" : "warning"}
          />
          <Metric label="Items" value={`${s.items.length}`} icon={Package} />
          <Metric
            label="RFx"
            value={`${s.activeRfx.length}`}
            icon={FileText}
            tone={s.activeRfx.length > 0 ? "info" : undefined}
          />
        </div>
        <ArrowRight
          size={16}
          className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
        />
      </Link>
    </li>
  );
}

function Metric({ label, value, tone, icon: Icon }) {
  const color =
    tone === "success"
      ? "var(--color-success-main)"
      : tone === "warning"
        ? "var(--color-warning-main)"
        : tone === "info"
          ? "var(--color-info-main)"
          : tone === "primary"
            ? "var(--color-primary-main)"
            : "var(--color-text-primary)";
  return (
    <div className="min-w-[60px]">
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p
        className="text-sm font-bold font-mono mt-2xs inline-flex items-center gap-2xs"
        style={{ color }}
      >
        {Icon && <Icon size={11} />}
        {value}
      </p>
    </div>
  );
}
