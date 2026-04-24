import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Pencil,
  ChevronDown,
  ChevronRight,
  Circle,
  Filter,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { BOM_META, BOM_NODES } from "../data/mockBOM.js";
import { flattenAll } from "../data/costAnalysis.js";

const KRW = new Intl.NumberFormat("en-US");

const DELTA_META = {
  added: {
    label: "Added",
    color: "var(--color-success-main)",
    dark: "var(--color-success-dark)",
    icon: Plus,
  },
  removed: {
    label: "Removed",
    color: "var(--color-error-main)",
    dark: "var(--color-error-dark)",
    icon: Minus,
  },
  modified: {
    label: "Modified",
    color: "var(--color-warning-main)",
    dark: "var(--color-warning-dark)",
    icon: Pencil,
  },
};

/**
 * Build a synthetic v1.1 state from the v1.2 mock data by reversing
 * the mocked deltas — added rows disappear, modified rows revert to
 * their "before" values.
 */
function buildPreviousVersion(nodes) {
  return nodes
    .map((n) => {
      if (n.delta === "added") return null;
      const copy = { ...n };
      if (n.delta === "modified") {
        if (n.id === "A-110") {
          copy.qty = 6; // was 6 → 8
        }
        if (n.id === "A-121") {
          copy.supplier = "Bosch Automotive";
          copy.unitPrice = 115_000;
        }
      }
      if (n.children) copy.children = buildPreviousVersion(n.children).filter(Boolean);
      delete copy.delta;
      return copy;
    })
    .filter(Boolean);
}

const PREV_NODES = buildPreviousVersion(BOM_NODES);

function mapById(nodes) {
  const map = {};
  const walk = (arr, parent = null) => {
    for (const n of arr) {
      map[n.id] = { ...n, parent };
      if (n.children) walk(n.children, n.id);
    }
  };
  walk(nodes);
  return map;
}

const CURRENT_MAP = mapById(BOM_NODES);
const PREV_MAP = mapById(PREV_NODES);

function buildDiff() {
  const all = new Set([
    ...Object.keys(CURRENT_MAP),
    ...Object.keys(PREV_MAP),
  ]);
  const rows = [];
  for (const id of all) {
    const cur = CURRENT_MAP[id];
    const prev = PREV_MAP[id];
    if (cur && !prev) {
      rows.push({ id, kind: "added", current: cur, previous: null });
      continue;
    }
    if (!cur && prev) {
      rows.push({ id, kind: "removed", current: null, previous: prev });
      continue;
    }
    if (!cur || !prev) continue;
    const changedFields = [];
    if (cur.qty !== prev.qty) {
      changedFields.push({
        field: "qty",
        from: `${prev.qty} ${prev.uom}`,
        to: `${cur.qty} ${cur.uom}`,
      });
    }
    if (cur.supplier !== prev.supplier) {
      changedFields.push({
        field: "supplier",
        from: prev.supplier ?? "—",
        to: cur.supplier ?? "—",
      });
    }
    if (cur.unitPrice !== prev.unitPrice) {
      changedFields.push({
        field: "unitPrice",
        from: `₩${KRW.format(prev.unitPrice ?? 0)}`,
        to: `₩${KRW.format(cur.unitPrice ?? 0)}`,
      });
    }
    if (changedFields.length > 0) {
      rows.push({
        id,
        kind: "modified",
        current: cur,
        previous: prev,
        changes: changedFields,
      });
    } else {
      rows.push({ id, kind: "unchanged", current: cur, previous: prev });
    }
  }
  return rows;
}

export function BOMVersionComparePage() {
  const { projectId } = useParams();
  const [filter, setFilter] = useState("changes"); // changes | added | removed | modified | all

  const diff = useMemo(() => buildDiff(), []);

  const visible = useMemo(() => {
    if (filter === "all") return diff;
    if (filter === "changes") return diff.filter((d) => d.kind !== "unchanged");
    return diff.filter((d) => d.kind === filter);
  }, [diff, filter]);

  const summary = useMemo(() => {
    const added = diff.filter((d) => d.kind === "added").length;
    const removed = diff.filter((d) => d.kind === "removed").length;
    const modified = diff.filter((d) => d.kind === "modified").length;

    const curTotal = flattenAll(BOM_NODES).reduce(
      (s, n) =>
        s + (n.parent || n.children?.length ? 0 : (n.unitPrice ?? 0) * (n.qty ?? 1)),
      0,
    );
    const prevTotal = flattenAll(PREV_NODES).reduce(
      (s, n) => s + (n.children?.length ? 0 : (n.unitPrice ?? 0) * (n.qty ?? 1)),
      0,
    );
    // Fallback top-level rollup for demo
    const topLevelCur = BOM_NODES.reduce(
      (s, n) => s + (n.unitPrice ?? 0) * (n.qty ?? 1),
      0,
    );
    const topLevelPrev = PREV_NODES.reduce(
      (s, n) => s + (n.unitPrice ?? 0) * (n.qty ?? 1),
      0,
    );

    return {
      added,
      removed,
      modified,
      costDelta: topLevelCur - topLevelPrev,
    };
  }, [diff]);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          "Projects",
          BOM_META.projectName,
          "BOM",
          `Compare ${BOM_META.previousVersion} → ${BOM_META.currentVersion}`,
        ]}
        title="BOM Version Compare"
        description={`Changes between ${BOM_META.previousVersion} and ${BOM_META.currentVersion} — triage what moved.`}
        actions={
          <>
            <Link
              to={`/projects/${projectId}/bom`}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <ArrowLeft size={14} /> Back to BOM
            </Link>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={14} /> Export
            </button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="Added"
          value={`${summary.added}`}
          icon={Plus}
          tone="success"
        />
        <KpiCard
          label="Removed"
          value={`${summary.removed}`}
          icon={Minus}
          tone="error"
        />
        <KpiCard
          label="Modified"
          value={`${summary.modified}`}
          icon={Pencil}
          tone="warning"
        />
        <KpiCard
          label="Cost Delta"
          value={`${summary.costDelta >= 0 ? "+" : ""}₩${KRW.format(summary.costDelta)}`}
          tone={summary.costDelta > 0 ? "error" : summary.costDelta < 0 ? "success" : undefined}
          icon={summary.costDelta > 0 ? TrendingUp : summary.costDelta < 0 ? TrendingDown : GitCompare}
        />
      </div>

      {/* Filter bar */}
      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
          <div className="flex items-center gap-2xs rounded-lg p-2xs bg-surface-container-secondary">
            <FilterBtn
              label={`Changes (${summary.added + summary.removed + summary.modified})`}
              active={filter === "changes"}
              onClick={() => setFilter("changes")}
            />
            <FilterBtn
              label={`Added (${summary.added})`}
              active={filter === "added"}
              onClick={() => setFilter("added")}
            />
            <FilterBtn
              label={`Removed (${summary.removed})`}
              active={filter === "removed"}
              onClick={() => setFilter("removed")}
            />
            <FilterBtn
              label={`Modified (${summary.modified})`}
              active={filter === "modified"}
              onClick={() => setFilter("modified")}
            />
            <FilterBtn
              label="All"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
          </div>
          <div className="text-xs text-text-secondary">
            Showing{" "}
            <b className="text-text-primary">{visible.length}</b> of{" "}
            {diff.length} items
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-2xl text-sm text-text-secondary">
            Nothing to show under the current filter.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((row) => (
              <DiffRow key={row.id} row={row} />
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-lg px-md py-sm border-t border-border bg-surface-container-secondary text-xs text-text-secondary">
          <span className="font-semibold">Legend:</span>
          {Object.entries(DELTA_META).map(([key, m]) => {
            const Icon = m.icon;
            return (
              <span key={key} className="inline-flex items-center gap-xs">
                <Icon size={12} style={{ color: m.color }} />
                <span style={{ color: m.dark, fontWeight: 600 }}>
                  {m.label}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}

function DiffRow({ row }) {
  const meta = DELTA_META[row.kind];
  const node = row.current ?? row.previous;

  if (row.kind === "unchanged") {
    return (
      <li className="flex items-center gap-md px-lg py-sm text-sm">
        <Circle size={6} className="text-text-disabled" />
        <span className="font-mono text-xs text-text-secondary">
          {node.code}
        </span>
        <span className="text-text-secondary">{node.name}</span>
        <span className="ml-auto text-xs text-text-secondary italic">
          Unchanged
        </span>
      </li>
    );
  }

  const Icon = meta.icon;
  return (
    <li
      className="flex flex-col md:flex-row md:items-start gap-md px-lg py-md"
      style={{
        borderLeft: `3px solid ${meta.color}`,
        backgroundColor: `${meta.color}08`,
      }}
    >
      <div className="flex items-center gap-sm md:w-56 shrink-0">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${meta.color}15` }}
        >
          <Icon size={14} style={{ color: meta.color }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-xs">
            <span
              className="text-[10px] uppercase tracking-wide font-bold"
              style={{ color: meta.dark }}
            >
              {meta.label}
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {node.code}
            </span>
          </div>
          <p className="text-sm font-semibold mt-2xs">{node.name}</p>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {row.kind === "modified" ? (
          <ChangeList changes={row.changes} />
        ) : row.kind === "added" ? (
          <AddedSummary node={node} />
        ) : (
          <RemovedSummary node={node} />
        )}
      </div>
    </li>
  );
}

function ChangeList({ changes }) {
  const fieldLabel = {
    qty: "Quantity",
    supplier: "Supplier",
    unitPrice: "Unit Price",
  };
  return (
    <ul className="space-y-xs">
      {changes.map((c) => (
        <li
          key={c.field}
          className="flex items-center gap-sm text-sm flex-wrap"
        >
          <span className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold w-24">
            {fieldLabel[c.field] ?? c.field}
          </span>
          <span
            className="font-mono text-xs px-sm py-2xs rounded-sm"
            style={{
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-bg-container-secondary)",
            }}
          >
            {c.from}
          </span>
          <ChevronRight size={12} className="text-text-secondary" />
          <span
            className="font-mono text-xs px-sm py-2xs rounded-sm font-semibold"
            style={{
              color: "var(--color-primary-dark)",
              backgroundColor: "var(--color-primary-light)",
            }}
          >
            {c.to}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AddedSummary({ node }) {
  return (
    <div className="text-sm grid grid-cols-1 sm:grid-cols-3 gap-sm">
      <Meta label="Qty" value={`${node.qty} ${node.uom}`} />
      <Meta
        label="Supplier"
        value={node.supplier ?? "In-house"}
      />
      <Meta
        label="Unit Price"
        value={`₩${KRW.format(node.unitPrice ?? 0)}`}
      />
    </div>
  );
}

function RemovedSummary({ node }) {
  return (
    <div className="text-sm text-text-secondary italic">
      Removed from BOM · was {node.qty} {node.uom} at{" "}
      {node.supplier ?? "In-house"}.
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p className="text-sm mt-2xs truncate">{value}</p>
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-md py-xs rounded-md text-sm font-semibold transition-colors duration-fast ${
        active
          ? "bg-surface-paper text-text-primary shadow-elevation-2"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
    </button>
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
