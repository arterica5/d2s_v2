import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  FilePlus,
  FileText,
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  ExternalLink,
  GitBranch,
  Sparkles,
  Search,
  Filter,
  History,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { BOM_META } from "../data/mockBOM.js";
import { flattenAll } from "../data/costAnalysis.js";
import { getItemDetail } from "../data/itemDetails.js";
import { PAST_CHANGES, CHANGE_TYPES } from "../data/mockChangeRequests.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";
import { useItemDetail } from "../context/ItemDetailContext.jsx";

import { KpiCard } from "../components/KpiCard.jsx";
import { Th } from "../components/Th.jsx";
import { FilterSelect } from "../components/FilterSelect.jsx";
const DEFAULT_FILTER = { status: "all", category: "all" };

export function DesignWorkspacePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const { open: openCollab } = useCollaboration();
  const { open: openItemDetail } = useItemDetail();

  const nodes = useMemo(() => flattenAll().filter((n) => !n.children?.length), []);
  const rows = useMemo(
    () =>
      nodes.map((n) => {
        const d = getItemDetail(n);
        return { node: n, detail: d };
      }),
    [nodes],
  );

  const categories = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => set.add(r.detail.category));
    return [...set];
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !r.node.code.toLowerCase().includes(q) &&
          !r.node.name.toLowerCase().includes(q) &&
          !r.detail.spec.toLowerCase().includes(q)
        )
          return false;
      }
      if (
        filters.status !== "all" &&
        r.node.designStatus !== filters.status
      )
        return false;
      if (
        filters.category !== "all" &&
        r.detail.category !== filters.category
      )
        return false;
      return true;
    });
  }, [rows, query, filters]);

  const summary = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter((r) => r.node.designStatus === "completed").length;
    const inprogress = rows.filter((r) => r.node.designStatus === "inprogress").length;
    const pending = rows.filter((r) => r.node.designStatus === "pending").length;
    const notstarted = rows.filter((r) => r.node.designStatus === "notstarted").length;
    const openChanges = PAST_CHANGES.filter((c) => c.status === "review").length;
    return { total, completed, inprogress, pending, notstarted, openChanges };
  }, [rows]);

  const discuss = (node) => {
    openCollab({
      channel: "design",
      anchor: {
        type: "bom-item",
        id: node.id,
        label: `${node.code} ${node.name}`,
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Design Workspace"
        description="Spec maturity, drawing revisions, and change pipeline — the freeze checklist in one place."
        actions={
          <>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={16} /> Export
            </button>
            <Link
              to={`/projects/${BOM_META.projectId}/changes/new`}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <FilePlus size={16} /> Request Change
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="Design Completed"
          value={`${summary.completed} / ${summary.total}`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="In Progress"
          value={`${summary.inprogress}`}
          icon={Clock}
          tone={summary.inprogress > 0 ? "info" : undefined}
        />
        <KpiCard
          label="Pending / Blocked"
          value={`${summary.pending + summary.notstarted}`}
          icon={AlertTriangle}
          tone={summary.pending + summary.notstarted > 0 ? "warning" : undefined}
        />
        <KpiCard
          label="Open Change Requests"
          value={`${summary.openChanges}`}
          icon={FilePlus}
          tone={summary.openChanges > 0 ? "info" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        {/* Design items table */}
        <section className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Design Items
            </h3>
            <div className="flex items-center gap-sm flex-wrap">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-sm top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code, name, spec"
                  className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-56 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
                />
              </div>
              <FilterSelect
                label="Status"
                value={filters.status}
                onChange={(v) => setFilters({ ...filters, status: v })}
                options={[
                  { value: "all", label: "All" },
                  { value: "completed", label: "Completed" },
                  { value: "inprogress", label: "In Progress" },
                  { value: "pending", label: "Pending" },
                  { value: "notstarted", label: "Not Started" },
                ]}
              />
              <FilterSelect
                label="Category"
                value={filters.category}
                onChange={(v) => setFilters({ ...filters, category: v })}
                options={[
                  { value: "all", label: "All categories" },
                  ...categories.map((c) => ({ value: c, label: c })),
                ]}
              />
              {(filters.status !== "all" ||
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
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-text-secondary border-b border-border">
                  <Th>Item</Th>
                  <Th>Spec</Th>
                  <Th>Drawing</Th>
                  <Th>Design</Th>
                  <Th>Sourcing</Th>
                  <Th>PPAP</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ node, detail }) => (
                  <tr
                    key={node.id}
                    className="border-b border-border text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
                  >
                    <td className="px-md py-sm min-w-[220px]">
                      <p className="font-mono text-xs text-text-secondary">
                        {node.code}
                      </p>
                      <button
                        onClick={() => openItemDetail(node)}
                        className="block text-sm font-semibold mt-2xs text-left truncate hover:underline hover:decoration-primary-main hover:underline-offset-4"
                      >
                        {node.name}
                      </button>
                    </td>
                    <td className="px-md py-sm max-w-[240px]">
                      <p className="text-xs text-text-secondary truncate">
                        {detail.spec}
                      </p>
                      <p className="text-[10px] text-text-secondary mt-2xs">
                        {detail.category}
                      </p>
                    </td>
                    <td className="px-md py-sm text-xs">
                      <p className="font-mono">{detail.drawing}</p>
                      <p className="text-text-secondary mt-2xs">
                        {detail.revision}
                      </p>
                    </td>
                    <td className="px-md py-sm">
                      <StatusBadge status={node.designStatus} />
                    </td>
                    <td className="px-md py-sm">
                      <StatusBadge status={node.sourcingStatus} />
                    </td>
                    <td className="px-md py-sm">
                      <StatusBadge status={node.ppapStatus} />
                    </td>
                    <td className="px-md py-sm text-right">
                      <div className="inline-flex items-center gap-2xs">
                        <button
                          onClick={() => discuss(node)}
                          title="Discuss"
                          className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
                        >
                          <MessageSquare size={13} />
                        </button>
                        <Link
                          to={`/projects/${BOM_META.projectId}/changes/new?item=${node.id}`}
                          title="Request change"
                          className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
                        >
                          <FilePlus size={13} />
                        </Link>
                        <button
                          onClick={() => openItemDetail(node)}
                          title="Open Item 360"
                          className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
                        >
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-2xl text-sm text-text-secondary"
                    >
                      No items match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Change requests */}
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Change Requests
            </h3>
            <Link
              to={`/projects/${BOM_META.projectId}/changes/new`}
              className="text-xs font-semibold"
              style={{ color: "var(--color-primary-main)" }}
            >
              New →
            </Link>
          </div>
          <ul className="divide-y divide-border max-h-[520px] overflow-y-auto">
            {PAST_CHANGES.map((c) => (
              <ChangeRow key={c.id} change={c} />
            ))}
          </ul>
        </section>
      </div>

      {/* Freeze readiness + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
            Design Freeze Readiness
          </h3>
          <ReadinessBreakdown summary={summary} />
        </section>

        <section
          className="rounded-xl p-lg border"
          style={{
            borderColor: "var(--color-primary-main)",
            background:
              "linear-gradient(135deg, var(--color-primary-light) 0%, rgba(83, 45, 246, 0.03) 100%)",
          }}
        >
          <div className="flex items-start gap-md">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <Sparkles size={16} style={{ color: "var(--color-primary-contrast)" }} />
            </div>
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: "var(--color-primary-dark)" }}
              >
                Feasibility Signals
              </h3>
              <p className="text-sm mt-2xs">
                <b>A-113 Cooling Plate</b> has no PPAP history with the current
                supplier. Pre-freeze risk simulation recommends Hanon Systems
                (carry-over PPAP, −3 wks critical path).
              </p>
              <p className="text-sm mt-sm">
                <b>A-121 BMS Controller</b> spec revision B pending Mobis
                approval — Dev→SOP gate may slip 2 weeks if not closed by
                wk 22.
              </p>
              <Link
                to="/ai"
                className="inline-flex items-center gap-xs text-xs font-semibold mt-md"
                style={{ color: "var(--color-primary-main)" }}
              >
                <Sparkles size={12} /> Ask AI Workspace for full simulation
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ChangeRow({ change: c }) {
  const typeLabel =
    CHANGE_TYPES.find((t) => t.id === c.type)?.label ?? c.type;
  const color = {
    approved: "var(--color-success-main)",
    review: "var(--color-warning-main)",
    rejected: "var(--color-error-main)",
  }[c.status];
  const Icon =
    c.status === "approved"
      ? CheckCircle2
      : c.status === "rejected"
        ? AlertTriangle
        : Clock;
  return (
    <li className="flex items-start gap-sm px-lg py-sm">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={13} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-xs">
          <span className="font-mono text-[10px] text-text-secondary">
            {c.id}
          </span>
          <span
            className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
            style={{
              color: "var(--color-primary-dark)",
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            {typeLabel}
          </span>
        </div>
        <p className="text-sm font-semibold mt-2xs">{c.title}</p>
        <p className="text-xs text-text-secondary mt-2xs">
          {c.submittedBy} · {c.submittedAt}
        </p>
      </div>
    </li>
  );
}

function ReadinessBreakdown({ summary }) {
  const items = [
    {
      label: "Completed",
      value: summary.completed,
      color: "var(--color-success-main)",
    },
    {
      label: "In Progress",
      value: summary.inprogress,
      color: "var(--color-info-main)",
    },
    {
      label: "Pending",
      value: summary.pending,
      color: "var(--color-warning-main)",
    },
    {
      label: "Not Started",
      value: summary.notstarted,
      color: "var(--color-text-disabled)",
    },
  ];
  const total = summary.total || 1;
  return (
    <>
      <div className="flex h-8 rounded-md overflow-hidden">
        {items.map((it) => (
          <div
            key={it.label}
            style={{
              width: `${(it.value / total) * 100}%`,
              backgroundColor: it.color,
            }}
            title={`${it.label}: ${it.value}`}
          />
        ))}
      </div>
      <div className="mt-md space-y-sm">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-sm">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: it.color }}
            />
            <span className="text-sm">{it.label}</span>
            <span className="text-xs text-text-secondary ml-auto">
              {Math.round((it.value / total) * 100)}%
            </span>
            <span className="text-sm font-bold font-mono tabular-nums w-8 text-right">
              {it.value}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary mt-md">
        Design freeze gate checks all items completed · sourcing decided ·
        PPAP plan in place.
      </p>
    </>
  );
}
