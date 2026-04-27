import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Users,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { BOM_META } from "../data/mockBOM.js";
import { KpiCard } from "../components/KpiCard.jsx";
import { Th } from "../components/Th.jsx";
import { FilterSelect } from "../components/FilterSelect.jsx";
import {
  RFX_LIST,
  RFX_STATUS,
  RFX_TYPES,
  summarizeRfx,
} from "../data/mockSourcing.js";

const KRW = new Intl.NumberFormat("en-US");

const DEFAULT_FILTER = { type: "all", status: "all" };

export function SourcingWorkspacePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTER);

  const summary = useMemo(() => summarizeRfx(), []);

  const filtered = useMemo(() => {
    return RFX_LIST.filter((r) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !r.title.toLowerCase().includes(q) &&
          !r.id.toLowerCase().includes(q) &&
          !r.itemCode.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.type !== "all" && r.type !== filters.type) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <>
      <PageHeader
        title="Sourcing Workspace"
        description="RFx pipeline — track invitations, quotes, and awards across categories."
        actions={
          <button
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Plus size={16} /> New RFx
          </button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Total" value={`${summary.total}`} />
        <KpiCard
          label="Active"
          value={`${summary.active}`}
          icon={Send}
          tone="info"
          hint="Sent / Responded / Comparing"
        />
        <KpiCard
          label="Awarded"
          value={`${summary.awarded}`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="Pending Responses"
          value={`${summary.pendingResponses}`}
          icon={Clock}
          tone={summary.pendingResponses > 0 ? "warning" : undefined}
          hint="Invitees without a quote"
        />
      </div>

      {/* Filter bar */}
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
                placeholder="Search RFx ID, title, or item code"
                className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-64 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
              />
            </div>
            <FilterSelect
              label="Type"
              value={filters.type}
              onChange={(v) => setFilters({ ...filters, type: v })}
              options={[
                { value: "all", label: "All types" },
                ...Object.entries(RFX_TYPES).map(([id, t]) => ({
                  value: id,
                  label: t.label,
                })),
              ]}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(v) => setFilters({ ...filters, status: v })}
              options={[
                { value: "all", label: "All status" },
                ...Object.entries(RFX_STATUS).map(([id, s]) => ({
                  value: id,
                  label: s.label,
                })),
              ]}
            />
            {(filters.type !== "all" ||
              filters.status !== "all" ||
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
            <b className="text-text-primary">{filtered.length}</b> of {RFX_LIST.length} RFx
          </span>
        </div>

        {/* RFx list */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-border">
                <Th>RFx</Th>
                <Th>Item</Th>
                <Th>Owner</Th>
                <Th>Responses</Th>
                <Th>Best Price</Th>
                <Th>Target</Th>
                <Th>Status</Th>
                <Th className="text-right">Due</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <RfxRow key={r.id} rfx={r} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-2xl text-sm text-text-secondary"
                  >
                    No RFx matches the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RfxRow({ rfx }) {
  const statusMeta = RFX_STATUS[rfx.status];
  const typeMeta = RFX_TYPES[rfx.type];
  const bestPrice =
    rfx.quotes.length > 0
      ? Math.min(...rfx.quotes.map((q) => q.price))
      : null;
  const gap = bestPrice != null ? bestPrice - rfx.targetCost : null;
  return (
    <tr className="border-b border-border text-sm group hover:bg-surface-container-secondary transition-colors duration-fast">
      <td className="px-md py-md min-w-[240px]">
        <div className="flex items-center gap-xs">
          <span className="font-mono text-xs text-text-secondary">
            {rfx.id}
          </span>
          <span
            className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
            style={{
              color: "var(--color-primary-dark)",
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            {typeMeta.label}
          </span>
        </div>
        <Link
          to={`/projects/${BOM_META.projectId}/sourcing/rfx/${rfx.id}`}
          className="block font-semibold text-text-primary mt-2xs hover:underline hover:decoration-primary-main hover:underline-offset-4"
        >
          {rfx.title}
        </Link>
        <p className="text-xs text-text-secondary mt-2xs truncate max-w-[360px]">
          {rfx.scope}
        </p>
      </td>
      <td className="px-md py-md">
        <p className="font-mono text-xs text-text-secondary">{rfx.itemCode}</p>
        <p className="text-sm mt-2xs">{rfx.itemName}</p>
      </td>
      <td className="px-md py-md">
        <span className="text-sm">{rfx.owner}</span>
      </td>
      <td className="px-md py-md">
        <div className="flex items-center gap-xs">
          <Users size={12} className="text-text-secondary" />
          <span className="text-sm font-semibold">
            {rfx.responses}
            <span className="text-text-secondary font-normal">
              {" / "}
              {rfx.invitees}
            </span>
          </span>
        </div>
        <ProgressMeter value={rfx.invitees ? rfx.responses / rfx.invitees : 0} />
      </td>
      <td className="px-md py-md font-mono tabular-nums">
        {bestPrice != null ? `₩${KRW.format(bestPrice)}` : "—"}
      </td>
      <td className="px-md py-md font-mono tabular-nums text-text-secondary">
        ₩{KRW.format(rfx.targetCost)}
      </td>
      <td className="px-md py-md">
        <span
          className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm"
          style={{
            color: statusMeta.color,
            backgroundColor: `${statusMeta.color}15`,
          }}
        >
          {statusMeta.label}
        </span>
        {gap != null && (
          <p
            className="text-[10px] font-semibold mt-2xs font-mono"
            style={{
              color: gap > 0 ? "var(--color-error-main)" : "var(--color-success-main)",
            }}
          >
            best {gap >= 0 ? "+" : ""}₩{KRW.format(gap)} vs target
          </p>
        )}
      </td>
      <td className="px-md py-md text-right">
        <span className="inline-flex items-center gap-xs text-xs text-text-secondary font-mono tabular-nums whitespace-nowrap">
          <Calendar size={11} /> {rfx.dueDate}
        </span>
      </td>
      <td className="px-md py-md text-right">
        <Link
          to={`/projects/${BOM_META.projectId}/sourcing/rfx/${rfx.id}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
          aria-label={`Open ${rfx.id}`}
        >
          <ArrowRight size={14} />
        </Link>
      </td>
    </tr>
  );
}

/* ───────────────────── Atoms ───────────────────── */

function ProgressMeter({ value }) {
  const pct = Math.min(1, Math.max(0, value ?? 0));
  return (
    <div className="mt-2xs h-1 w-20 rounded-full" style={{ backgroundColor: "var(--color-border-secondary)" }}>
      <div
        className="h-full rounded-full transition-all duration-normal"
        style={{
          width: `${pct * 100}%`,
          backgroundColor: "var(--color-primary-main)",
        }}
      />
    </div>
  );
}
