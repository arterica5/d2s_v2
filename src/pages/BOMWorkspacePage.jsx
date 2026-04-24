import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  GitCompare,
  Download,
  FilePlus,
  AlertTriangle,
  Circle,
  Building2,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import {
  BOM_META,
  BOM_NODES,
  flattenBOM,
  collectAllIds,
} from "../data/mockBOM.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";
import { useItemDetail } from "../context/ItemDetailContext.jsx";

const VIEWS = [
  { id: "ebom", label: "E-BOM", hint: "Engineering hierarchy" },
  { id: "sourcing", label: "Sourcing BOM", hint: "Flattened by end item" },
  { id: "qbom", label: "Q-BOM", hint: "Item × Supplier PPAP" },
  { id: "partlist", label: "Part List", hint: "Initial part list" },
];

const RISK_COLOR = {
  high: "var(--color-error-main)",
  medium: "var(--color-warning-main)",
  low: "var(--color-success-main)",
};

const DELTA_STYLE = {
  added: {
    bg: "rgba(0, 153, 85, 0.08)",
    border: "var(--color-success-main)",
    label: "+ Added",
    labelColor: "var(--color-success-dark)",
  },
  removed: {
    bg: "rgba(211, 47, 47, 0.06)",
    border: "var(--color-error-main)",
    label: "− Removed",
    labelColor: "var(--color-error-dark)",
  },
  modified: {
    bg: "rgba(224, 105, 0, 0.08)",
    border: "var(--color-warning-main)",
    label: "~ Modified",
    labelColor: "var(--color-warning-dark)",
  },
};

const KRW = new Intl.NumberFormat("ko-KR");

export function BOMWorkspacePage() {
  const [view, setView] = useState("ebom");
  const [version, setVersion] = useState(BOM_META.currentVersion);
  const [compareMode, setCompareMode] = useState(true);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(() =>
    // Default: expand level 1 only
    new Set(BOM_NODES.map((n) => n.id)),
  );
  const [selectedId, setSelectedId] = useState(null);
  const { open: openPanel } = useCollaboration();
  const { open: openItemDetail } = useItemDetail();

  const openDiscussion = (row) => {
    openPanel({
      channel: "design",
      anchor: {
        type: "bom-item",
        id: row.id,
        label: `${row.code} ${row.name}`,
      },
    });
  };

  const showDetail = (row) => {
    setSelectedId(row.id);
    openItemDetail(row);
  };

  const rows = useMemo(() => {
    const flat = flattenBOM(BOM_NODES, expandedIds);
    if (!query.trim()) return flat;
    const q = query.toLowerCase();
    return flat.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        (r.supplier ?? "").toLowerCase().includes(q),
    );
  }, [expandedIds, query]);

  const toggle = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setExpandedIds(collectAllIds(BOM_NODES));
  const collapseAll = () => setExpandedIds(new Set());

  const totals = useMemo(() => {
    const topLevel = BOM_NODES;
    const itemCount = [...collectAllIds(BOM_NODES)].length;
    const totalCost = topLevel.reduce(
      (s, n) => s + (n.unitPrice ?? 0) * (n.qty ?? 1),
      0,
    );
    const totalTarget = topLevel.reduce(
      (s, n) => s + (n.targetCost ?? 0) * (n.qty ?? 1),
      0,
    );
    return {
      itemCount,
      totalCost,
      totalTarget,
      gap: totalCost - totalTarget,
    };
  }, []);

  return (
    <>
      <PageHeader
        breadcrumbs={["Projects", BOM_META.projectName, "BOM Workspace"]}
        title="BOM Workspace"
        description="BOM is a view, not data — switch the lens to fit the task."
        actions={
          <>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={16} /> Export
            </button>
            <Link
              to={`/projects/${BOM_META.projectId}/changes/new${selectedId ? `?item=${selectedId}` : ""}`}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <FilePlus size={16} /> Request Change
            </Link>
          </>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Items" value={`${totals.itemCount}`} />
        <KpiCard
          label="Current Cost"
          value={`₩${KRW.format(totals.totalCost)}`}
        />
        <KpiCard
          label="Target Cost"
          value={`₩${KRW.format(totals.totalTarget)}`}
        />
        <KpiCard
          label="Gap"
          value={`${totals.gap >= 0 ? "+" : ""}₩${KRW.format(totals.gap)}`}
          tone={totals.gap > 0 ? "error" : "success"}
          hint={
            totals.gap > 0
              ? "Over target — cost review needed"
              : "Under target"
          }
        />
      </div>

      {/* View toggle */}
      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden mb-lg">
        <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
          <div className="flex items-center gap-2xs rounded-lg p-2xs bg-surface-container-secondary">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                title={v.hint}
                className={`px-md py-xs rounded-md text-sm font-semibold transition-colors duration-fast ${
                  view === v.id
                    ? "bg-surface-paper text-text-primary shadow-elevation-2"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-sm top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search code, part, or supplier"
                className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-64 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
              />
            </div>
            <VersionSelect
              value={version}
              onChange={setVersion}
              versions={BOM_META.versions}
            />
            <button
              onClick={() => setCompareMode((v) => !v)}
              className={`inline-flex items-center gap-xs px-md py-xs rounded-md text-sm font-semibold border transition-colors duration-fast ${
                compareMode
                  ? "text-text-inverse"
                  : "text-text-secondary bg-surface-paper border-border hover:bg-surface-container-secondary"
              }`}
              style={
                compareMode
                  ? {
                      backgroundColor: "var(--color-primary-main)",
                      borderColor: "var(--color-primary-main)",
                    }
                  : undefined
              }
            >
              <GitCompare size={14} />
              vs {BOM_META.previousVersion}
            </button>
            <Link
              to={`/projects/${BOM_META.projectId}/bom/compare`}
              className="inline-flex items-center gap-xs px-md py-xs rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
              title="Open full compare view"
            >
              <GitCompare size={14} />
              Full compare
            </Link>
            <button className="inline-flex items-center gap-xs px-md py-xs rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Filter size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* Toolbar context row */}
        <div className="flex items-center justify-between gap-md px-md py-sm text-xs text-text-secondary bg-surface-container-secondary border-b border-border">
          <div className="flex items-center gap-md">
            <span>
              Current View:{" "}
              <b className="text-text-primary">
                {VIEWS.find((v) => v.id === view)?.label}
              </b>{" "}
              — {VIEWS.find((v) => v.id === view)?.hint}
            </span>
            {compareMode && (
              <span
                className="inline-flex items-center gap-xs font-semibold"
                style={{ color: "var(--color-warning-dark)" }}
              >
                <AlertTriangle size={12} />
                Highlighting changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-sm">
            <button
              onClick={expandAll}
              className="hover:text-text-primary transition-colors duration-fast"
            >
              Expand all
            </button>
            <span className="opacity-30">|</span>
            <button
              onClick={collapseAll}
              className="hover:text-text-primary transition-colors duration-fast"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-border bg-surface-paper">
                <Th className="w-[28%]">Item</Th>
                <Th className="text-right">Qty</Th>
                <Th>UOM</Th>
                <Th className="text-right">Unit Price</Th>
                <Th className="text-right">Target</Th>
                <Th className="text-right">Δ</Th>
                <Th>Supplier</Th>
                <Th>Design</Th>
                <Th>Sourcing</Th>
                <Th>PPAP</Th>
                <Th>Risk</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <BOMRow
                  key={row.id}
                  row={row}
                  selected={selectedId === row.id}
                  compareMode={compareMode}
                  onToggle={toggle}
                  onSelect={setSelectedId}
                  onOpenDetail={showDetail}
                  isExpanded={expandedIds.has(row.id)}
                  onDiscuss={openDiscussion}
                />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-2xl text-sm text-text-secondary"
                  >
                    No matching parts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-lg px-md py-sm text-xs text-text-secondary border-t border-border bg-surface-container-secondary">
          <span className="font-semibold">Legend:</span>
          {Object.entries(DELTA_STYLE).map(([key, s]) => (
            <span key={key} className="inline-flex items-center gap-xs">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: s.bg,
                  borderLeft: `2px solid ${s.border}`,
                }}
              />
              <span style={{ color: s.labelColor, fontWeight: 600 }}>
                {s.label}
              </span>
            </span>
          ))}
          <span className="ml-auto">
            Rows: <b className="text-text-primary">{rows.length}</b>
          </span>
        </div>
      </div>
    </>
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

function KpiCard({ label, value, tone, hint }) {
  const color =
    tone === "error"
      ? "var(--color-error-main)"
      : tone === "success"
        ? "var(--color-success-main)"
        : "var(--color-text-primary)";
  return (
    <div className="bg-surface-paper border border-border rounded-xl p-lg shadow-elevation-2">
      <p className="text-xs text-text-secondary uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-h3 mt-2xs font-bold"
        style={{ color, letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-text-secondary mt-2xs">{hint}</p>}
    </div>
  );
}

function VersionSelect({ value, onChange, versions }) {
  return (
    <label className="inline-flex items-center gap-xs px-md py-xs rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border">
      <span className="text-text-secondary font-normal">Version</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none cursor-pointer"
      >
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}

function BOMRow({ row, selected, compareMode, onToggle, onSelect, onOpenDetail, isExpanded, onDiscuss }) {
  const deltaStyle = compareMode && row.delta ? DELTA_STYLE[row.delta] : null;
  const costGap = (row.unitPrice ?? 0) - (row.targetCost ?? 0);

  return (
    <tr
      onClick={() => onSelect(row.id)}
      className={`border-b border-border text-sm cursor-pointer transition-colors duration-fast ${
        selected ? "" : "hover:bg-surface-container-secondary"
      }`}
      style={{
        backgroundColor: selected
          ? "var(--color-primary-selected)"
          : deltaStyle?.bg,
        borderLeft: deltaStyle ? `3px solid ${deltaStyle.border}` : undefined,
      }}
    >
      {/* Item cell: indent + chevron + code + name */}
      <td className="px-md py-sm">
        <div
          className="flex items-center gap-sm"
          style={{ paddingLeft: `${(row.depth ?? 0) * 20}px` }}
        >
          {row.hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(row.id);
              }}
              className="w-5 h-5 inline-flex items-center justify-center rounded-sm hover:bg-surface-container-tertiary transition-colors duration-fast"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className="w-5 h-5 inline-flex items-center justify-center">
              <Circle size={4} className="text-text-disabled" />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-xs">
              <span className="font-mono text-xs text-text-secondary">
                {row.code}
              </span>
              {deltaStyle && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: deltaStyle.labelColor }}
                >
                  {deltaStyle.label}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(row);
              }}
              className="font-semibold text-text-primary truncate text-left hover:underline hover:decoration-primary-main hover:underline-offset-4 transition-colors duration-fast"
              title="Open Item 360"
            >
              {row.name}
            </button>
          </div>
        </div>
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums">
        {row.qty}
      </td>
      <td className="px-md py-sm text-text-secondary">{row.uom}</td>
      <td className="px-md py-sm text-right font-mono tabular-nums">
        ₩{KRW.format(row.unitPrice ?? 0)}
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums text-text-secondary">
        ₩{KRW.format(row.targetCost ?? 0)}
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums">
        <span
          style={{
            color:
              costGap > 0
                ? "var(--color-error-main)"
                : costGap < 0
                  ? "var(--color-success-main)"
                  : "var(--color-text-secondary)",
            fontWeight: 600,
          }}
        >
          {costGap >= 0 ? "+" : ""}₩{KRW.format(costGap)}
        </span>
      </td>
      <td className="px-md py-sm">
        {row.supplier ? (
          <span className="inline-flex items-center gap-xs text-sm text-text-primary">
            <Building2 size={14} className="text-text-secondary" />
            {row.supplier}
          </span>
        ) : (
          <span className="text-xs text-text-disabled italic">
            In-house
          </span>
        )}
      </td>
      <td className="px-md py-sm">
        <StatusBadge status={row.designStatus} />
      </td>
      <td className="px-md py-sm">
        <StatusBadge status={row.sourcingStatus} />
      </td>
      <td className="px-md py-sm">
        <StatusBadge status={row.ppapStatus} />
      </td>
      <td className="px-md py-sm">
        <span
          className="inline-flex items-center gap-xs text-xs font-semibold uppercase tracking-wide"
          style={{ color: RISK_COLOR[row.riskLevel] }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: RISK_COLOR[row.riskLevel] }}
          />
          {row.riskLevel}
        </span>
      </td>
      <td className="px-md py-sm text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDiscuss(row);
          }}
          title="Open discussion for this item"
          aria-label={`Discuss ${row.code}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
        >
          <MessageSquare size={14} />
        </button>
      </td>
    </tr>
  );
}
