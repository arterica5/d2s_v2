import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Circle,
  TrendingDown,
  TrendingUp,
  Minus,
  Download,
  FilePlus2,
  Target,
  Calculator,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { BOM_META, BOM_NODES, flattenBOM, collectAllIds } from "../data/mockBOM.js";
import {
  computeCostStructure,
  computeTopContributors,
  computeTopLevelTotals,
  countOverTarget,
  itemCostAnalysis,
} from "../data/costAnalysis.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";
import { useItemDetail } from "../context/ItemDetailContext.jsx";

import { KpiCard } from "../components/KpiCard.jsx";
import { Th } from "../components/Th.jsx";
import { FilterBtn } from "../components/FilterBtn.jsx";
const KRW = new Intl.NumberFormat("en-US");

export function CostWorkspacePage() {
  const [expandedIds, setExpandedIds] = useState(() =>
    new Set(BOM_NODES.map((n) => n.id)),
  );
  const [filter, setFilter] = useState("all"); // all | over | under
  const [selectedId, setSelectedId] = useState(null);
  const { open: openCollab } = useCollaboration();
  const { open: openItemDetail } = useItemDetail();

  const totals = useMemo(() => computeTopLevelTotals(), []);
  const structure = useMemo(() => computeCostStructure(), []);
  const top = useMemo(() => computeTopContributors(BOM_NODES, 5), []);
  const overCount = useMemo(() => countOverTarget(), []);

  const allRows = useMemo(() => flattenBOM(BOM_NODES, expandedIds), [expandedIds]);
  const rows = useMemo(() => {
    if (filter === "all") return allRows;
    return allRows.filter((r) => {
      const gap = (r.unitPrice ?? 0) - (r.targetCost ?? 0);
      if (filter === "over") return gap > 0;
      if (filter === "under") return gap < 0;
      return true;
    });
  }, [allRows, filter]);

  const toggle = (id) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setExpandedIds(collectAllIds(BOM_NODES));
  const collapseAll = () => setExpandedIds(new Set());

  const discuss = (row) => {
    openCollab({
      channel: "cost",
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

  return (
    <>
      <PageHeader
        title="Cost Workspace"
        description="Track Target vs Current vs Should Cost — drive negotiation before design freeze."
        actions={
          <>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={16} /> Export
            </button>
            <button
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <FilePlus2 size={16} /> Enter Should Cost
            </button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="Current Cost"
          value={`₩${KRW.format(totals.current)}`}
        />
        <KpiCard
          label="Target Cost"
          value={`₩${KRW.format(totals.target)}`}
          icon={Target}
          muted
        />
        <KpiCard
          label="Gap"
          value={`${totals.gap >= 0 ? "+" : ""}₩${KRW.format(totals.gap)}`}
          tone={totals.gap > 0 ? "error" : totals.gap < 0 ? "success" : undefined}
          icon={totals.gap > 0 ? TrendingUp : totals.gap < 0 ? TrendingDown : Minus}
          hint={
            totals.target
              ? `${((totals.gap / totals.target) * 100).toFixed(1)}% vs target`
              : undefined
          }
        />
        <KpiCard
          label="Items Over Target"
          value={`${overCount}`}
          tone={overCount > 0 ? "warning" : undefined}
          icon={AlertTriangle}
          hint="per unit price"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        <div className="lg:col-span-1 bg-surface-paper border border-border rounded-xl p-lg shadow-elevation-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm">
            Cost Structure
          </h3>
          <p className="text-h3 font-bold mt-2xs" style={{ letterSpacing: "-0.01em" }}>
            ₩{KRW.format(structure.total)}
          </p>
          <p className="text-xs text-text-secondary mt-2xs mb-md">
            Aggregated should-cost across all leaf items
          </p>
          <StackedBar structure={structure} />
        </div>

        <div className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="px-lg pt-lg pb-md">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Top Cost Contributors
            </h3>
            <p className="text-xs text-text-secondary mt-2xs">
              Items driving the gap — click to inspect or discuss.
            </p>
          </div>
          <ul className="border-t border-border divide-y divide-border">
            {top.map((c, i) => (
              <TopContribRow
                key={c.node.id}
                rank={i + 1}
                contrib={c}
                onDiscuss={() => discuss(c.node)}
                onOpen={() => showDetail(c.node)}
              />
            ))}
            {top.length === 0 && (
              <li className="px-lg py-xl text-sm text-text-secondary text-center">
                All items are tracking against target.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Cost table */}
      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
          <div className="flex items-center gap-2xs rounded-lg p-2xs bg-surface-container-secondary">
            <FilterBtn
              label="All"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterBtn
              label="Over Target"
              active={filter === "over"}
              onClick={() => setFilter("over")}
            />
            <FilterBtn
              label="Under Target"
              active={filter === "under"}
              onClick={() => setFilter("under")}
            />
          </div>
          <div className="flex items-center gap-sm text-xs text-text-secondary">
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-xs text-text-secondary border-b border-border bg-surface-paper">
                <Th className="w-[30%]">Item</Th>
                <Th className="text-right">Qty</Th>
                <Th className="text-right">Target</Th>
                <Th className="text-right">Current</Th>
                <Th className="text-right">Should Cost</Th>
                <Th className="text-right">Unit Gap</Th>
                <Th className="text-right">Ext. Cost</Th>
                <Th className="text-right">% of Total</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <CostRow
                  key={row.id}
                  row={row}
                  total={totals.current}
                  selected={selectedId === row.id}
                  isExpanded={expandedIds.has(row.id)}
                  onToggle={toggle}
                  onSelect={setSelectedId}
                  onDiscuss={discuss}
                  onOpen={showDetail}
                />
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-2xl text-sm text-text-secondary"
                  >
                    No items match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-md py-sm text-xs text-text-secondary border-t border-border bg-surface-container-secondary flex items-center justify-between">
          <span>
            Ext. Cost = Unit Current × Qty (leaf items). Parents show declared roll-up.
          </span>
          <span>
            Rows: <b className="text-text-primary">{rows.length}</b>
          </span>
        </div>
      </div>
    </>
  );
}

/* ───────────────────── Cost Structure bar ───────────────────── */

function StackedBar({ structure }) {
  const parts = [
    {
      key: "material",
      label: "Material",
      value: structure.material,
      pct: structure.pct.material,
      color: "var(--color-primary-main)",
    },
    {
      key: "labor",
      label: "Labor",
      value: structure.labor,
      pct: structure.pct.labor,
      color: "var(--color-info-main)",
    },
    {
      key: "overhead",
      label: "Overhead",
      value: structure.overhead,
      pct: structure.pct.overhead,
      color: "var(--color-warning-main)",
    },
  ];
  return (
    <>
      <div className="flex h-6 rounded-sm overflow-hidden">
        {parts.map((p) => (
          <div
            key={p.key}
            style={{ backgroundColor: p.color, width: `${p.pct * 100}%` }}
            title={`${p.label}: ₩${KRW.format(p.value)}`}
          />
        ))}
      </div>
      <div className="mt-md space-y-sm">
        {parts.map((p) => (
          <div key={p.key} className="flex items-center gap-sm">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-sm text-text-primary">{p.label}</span>
            <span className="text-xs text-text-secondary ml-auto">
              {Math.round(p.pct * 100)}%
            </span>
            <span className="text-sm font-bold font-mono tabular-nums w-28 text-right">
              ₩{KRW.format(p.value)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ───────────────────── Top Contributor row ───────────────────── */

function TopContribRow({ rank, contrib, onDiscuss, onOpen }) {
  const { node, unitGap, extendedGap } = contrib;
  const pct = node.targetCost ? (unitGap / node.targetCost) * 100 : 0;
  const isOver = extendedGap > 0;
  const color = isOver
    ? "var(--color-error-main)"
    : "var(--color-success-main)";
  return (
    <li className="flex items-center gap-md px-lg py-sm hover:bg-surface-container-secondary transition-colors duration-fast">
      <span
        className="text-xs font-bold w-6 text-center"
        style={{ color: "var(--color-text-secondary)" }}
      >
        #{rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-xs">
          <span className="font-mono text-xs text-text-secondary">
            {node.code}
          </span>
          {isOver && (
            <AlertTriangle size={11} style={{ color }} />
          )}
        </div>
        <button
          onClick={onOpen}
          className="block text-sm font-semibold mt-2xs truncate text-left hover:underline hover:decoration-primary-main hover:underline-offset-4"
        >
          {node.name}
        </button>
      </div>
      <div className="text-right">
        <p
          className="text-sm font-bold font-mono tabular-nums"
          style={{ color }}
        >
          {extendedGap >= 0 ? "+" : ""}₩{KRW.format(extendedGap)}
        </p>
        <p className="text-[10px] font-semibold" style={{ color, opacity: 0.8 }}>
          unit {pct >= 0 ? "+" : ""}{pct.toFixed(1)}% · qty {node.qty}
        </p>
      </div>
      <div className="flex items-center gap-2xs shrink-0">
        <button
          onClick={onDiscuss}
          aria-label="Discuss"
          className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
        >
          <MessageSquare size={14} />
        </button>
        <button
          onClick={onOpen}
          aria-label="Open Item 360"
          className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
        >
          <ExternalLink size={14} />
        </button>
      </div>
    </li>
  );
}

/* ───────────────────── Cost table row ───────────────────── */

function CostRow({ row, total, selected, isExpanded, onToggle, onSelect, onDiscuss, onOpen }) {
  const analysis = itemCostAnalysis(row);
  const extended = analysis.current * (row.qty ?? 1);
  const pctOfTotal = total ? extended / total : 0;
  const overTarget = analysis.vsTarget > 0;

  return (
    <tr
      onClick={() => onSelect(row.id)}
      className="border-b border-border text-sm cursor-pointer transition-colors duration-fast hover:bg-surface-container-secondary"
      style={{
        backgroundColor: selected ? "var(--color-primary-selected)" : undefined,
        borderLeft: overTarget
          ? `3px solid var(--color-error-main)`
          : analysis.vsTarget < 0
            ? `3px solid var(--color-success-main)`
            : undefined,
      }}
    >
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
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-5 h-5 inline-flex items-center justify-center">
              <Circle size={4} className="text-text-disabled" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-mono text-xs text-text-secondary">{row.code}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen(row);
              }}
              className="block font-semibold text-text-primary text-left truncate hover:underline hover:decoration-primary-main hover:underline-offset-4"
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
      <td className="px-md py-sm text-right font-mono tabular-nums text-text-secondary">
        ₩{KRW.format(analysis.target)}
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums">
        ₩{KRW.format(analysis.current)}
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums text-text-secondary">
        ₩{KRW.format(analysis.shouldCost)}
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums">
        <GapCell gap={analysis.vsTarget} ref_={analysis.target} />
      </td>
      <td className="px-md py-sm text-right font-mono tabular-nums font-semibold">
        ₩{KRW.format(extended)}
      </td>
      <td className="px-md py-sm text-right">
        <PctBar pct={pctOfTotal} />
      </td>
      <td className="px-md py-sm text-right">
        <div className="inline-flex items-center gap-2xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDiscuss(row);
            }}
            aria-label="Discuss"
            title="Discuss cost"
            className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
          >
            <MessageSquare size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(row);
            }}
            aria-label="Open Item 360"
            title="Open Item 360"
            className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
          >
            <Calculator size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ───────────────────── Atoms ───────────────────── */

function GapCell({ gap, ref_ }) {
  if (gap === 0) {
    return <span className="text-text-secondary">—</span>;
  }
  const isOver = gap > 0;
  const color = isOver
    ? "var(--color-error-main)"
    : "var(--color-success-main)";
  const pct = ref_ ? (gap / ref_) * 100 : 0;
  return (
    <span
      className="inline-flex flex-col items-end font-mono tabular-nums"
      style={{ color }}
    >
      <span className="font-bold">
        {gap >= 0 ? "+" : ""}₩{KRW.format(gap)}
      </span>
      <span className="text-[10px] font-semibold" style={{ opacity: 0.8 }}>
        {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
      </span>
    </span>
  );
}

function PctBar({ pct }) {
  const p = Math.min(1, Math.max(0, pct));
  return (
    <div className="inline-flex items-center gap-xs justify-end min-w-[100px]">
      <span className="text-xs font-mono tabular-nums text-text-secondary w-12 text-right">
        {(p * 100).toFixed(1)}%
      </span>
      <div
        className="h-1.5 w-16 rounded-full"
        style={{ backgroundColor: "var(--color-border-secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-normal"
          style={{
            width: `${p * 100}%`,
            backgroundColor: "var(--color-primary-main)",
          }}
        />
      </div>
    </div>
  );
}
