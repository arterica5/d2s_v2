import { useMemo, useState } from "react";
import {
  Download,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  GitCompare,
  Calendar,
  MessageSquare,
  ExternalLink,
  Circle,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { BOM_META } from "../data/mockBOM.js";
import { flattenAll } from "../data/costAnalysis.js";
import {
  APQP_PHASES,
  MILESTONES,
  OPEN_RISKS,
  PPAP_PROGRESS,
  QBOM_SYNC_STATUS,
  summarizeAPQP,
} from "../data/mockAPQP.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";
import { useItemDetail } from "../context/ItemDetailContext.jsx";

export function APQPWorkspacePage() {
  const summary = useMemo(() => summarizeAPQP(), []);
  const [phaseFilter, setPhaseFilter] = useState("all");
  const { open: openCollab } = useCollaboration();
  const { open: openItemDetail } = useItemDetail();

  const bomNodes = useMemo(() => flattenAll(), []);
  const itemById = useMemo(() => {
    const map = {};
    bomNodes.forEach((n) => (map[n.id] = n));
    return map;
  }, [bomNodes]);

  const ppapRows = useMemo(() => {
    if (phaseFilter === "all") return PPAP_PROGRESS;
    return PPAP_PROGRESS.filter((p) => p.phase === phaseFilter);
  }, [phaseFilter]);

  const discussItem = (itemId, channel = "quality") => {
    const node = itemById[itemId];
    openCollab({
      channel,
      anchor: node
        ? { type: "bom-item", id: node.id, label: `${node.code} ${node.name}` }
        : undefined,
    });
  };

  return (
    <>
      <PageHeader
        breadcrumbs={["Projects", BOM_META.projectName, "APQP Workspace"]}
        title="APQP Workspace"
        description="Quality process readiness — APQP phases, PPAP progress, and Q-BOM sync."
        actions={
          <>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={16} /> Export
            </button>
            <button
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <Plus size={16} /> New Milestone
            </button>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="PPAP First-Pass"
          value={`${Math.round(summary.firstPassRate * 100)}%`}
          icon={ShieldCheck}
          tone={summary.firstPassRate > 0.8 ? "success" : "warning"}
        />
        <KpiCard
          label="Milestones On-Time"
          value={`${summary.milestonesDone} / ${summary.totalMilestones}`}
          icon={CheckCircle2}
          tone={summary.milestonesAtRisk > 0 ? "warning" : "success"}
          hint={
            summary.milestonesAtRisk > 0
              ? `${summary.milestonesAtRisk} at risk`
              : "No at-risk items"
          }
        />
        <KpiCard
          label="Open Risks"
          value={`${summary.totalRisks}`}
          icon={AlertTriangle}
          tone={summary.highRisks > 0 ? "error" : "warning"}
          hint={`${summary.highRisks} high severity`}
        />
        <KpiCard
          label="Q-BOM Sync"
          value={`${Math.round(summary.syncPct * 100)}%`}
          icon={GitCompare}
          tone={summary.syncPct === 1 ? "success" : "warning"}
          hint={`${QBOM_SYNC_STATUS.outOfSync + QBOM_SYNC_STATUS.missing} gaps`}
        />
      </div>

      {/* Phase timeline */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            APQP Phase Timeline
          </h3>
          <span className="text-xs text-text-secondary">
            Current phase:{" "}
            <b className="text-text-primary">
              {APQP_PHASES.find((p) => p.status === "current")?.name}
            </b>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-sm">
          {APQP_PHASES.map((phase, i) => (
            <PhaseCard key={phase.id} phase={phase} index={i} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        {/* PPAP Progress table */}
        <section className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-md p-md border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              PPAP Progress by Item
            </h3>
            <div className="flex items-center gap-2xs rounded-md p-2xs bg-surface-container-secondary">
              <FilterBtn
                label="All"
                active={phaseFilter === "all"}
                onClick={() => setPhaseFilter("all")}
              />
              {APQP_PHASES.filter((p) => p.status !== "upcoming").map((p) => (
                <FilterBtn
                  key={p.id}
                  label={p.name.split(" ")[0]}
                  active={phaseFilter === p.id}
                  onClick={() => setPhaseFilter(p.id)}
                />
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-text-secondary border-b border-border">
                  <Th>Item</Th>
                  <Th>Supplier</Th>
                  <Th>Case</Th>
                  <Th>Elements</Th>
                  <Th>Status</Th>
                  <Th>Risk</Th>
                  <Th className="text-right">Updated</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {ppapRows.map((row) => {
                  const node = itemById[row.itemId];
                  if (!node) return null;
                  return (
                    <tr
                      key={row.itemId}
                      className="border-b border-border text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
                    >
                      <td className="px-md py-sm">
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
                      <td className="px-md py-sm text-sm">{row.supplier}</td>
                      <td className="px-md py-sm text-xs text-text-secondary">
                        {row.case}
                      </td>
                      <td className="px-md py-sm">
                        <ElementsBar elements={row.elements} />
                      </td>
                      <td className="px-md py-sm">
                        <StatusBadge status={row.overallStatus} />
                      </td>
                      <td className="px-md py-sm">
                        <RiskDot level={row.risk} />
                      </td>
                      <td className="px-md py-sm text-right text-xs text-text-secondary font-mono tabular-nums">
                        {row.lastUpdated}
                      </td>
                      <td className="px-md py-sm text-right">
                        <div className="inline-flex items-center gap-2xs">
                          <button
                            onClick={() => discussItem(row.itemId)}
                            className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
                            title="Discuss"
                          >
                            <MessageSquare size={13} />
                          </button>
                          <button
                            onClick={() => openItemDetail(node)}
                            className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
                            title="Open Item 360"
                          >
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Q-BOM Sync */}
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
            S-BOM ↔ Q-BOM Sync
          </h3>
          <div className="flex items-center justify-between">
            <SyncStat label="In sync" value={QBOM_SYNC_STATUS.inSync} tone="success" />
            <SyncStat label="Out of sync" value={QBOM_SYNC_STATUS.outOfSync} tone="warning" />
            <SyncStat label="Missing" value={QBOM_SYNC_STATUS.missing} tone="error" />
          </div>
          <ul className="mt-md space-y-sm">
            {[...QBOM_SYNC_STATUS.outOfSyncDetails, ...QBOM_SYNC_STATUS.missingDetails].map(
              (d, i) => {
                const node = itemById[d.itemId];
                return (
                  <li
                    key={i}
                    className="p-sm rounded-md border"
                    style={{
                      borderColor: "var(--color-border-primary)",
                      backgroundColor: "var(--color-bg-container-secondary)",
                    }}
                  >
                    <div className="flex items-center gap-xs">
                      <AlertCircle
                        size={12}
                        style={{ color: "var(--color-warning-main)" }}
                      />
                      <span className="font-mono text-xs text-text-secondary">
                        {node?.code ?? d.itemId}
                      </span>
                    </div>
                    <p className="text-xs mt-2xs">{d.reason}</p>
                  </li>
                );
              },
            )}
          </ul>
        </section>
      </div>

      {/* Milestones + Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Milestones
            </h3>
          </div>
          <ul className="divide-y divide-border max-h-96 overflow-y-auto">
            {MILESTONES.map((m) => (
              <MilestoneRow key={m.id} milestone={m} />
            ))}
          </ul>
        </section>

        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Open Risks
            </h3>
          </div>
          <ul className="divide-y divide-border">
            {OPEN_RISKS.map((r) => (
              <RiskRow
                key={r.id}
                risk={r}
                item={itemById[r.itemId]}
                onDiscuss={() => discussItem(r.itemId)}
              />
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

function PhaseCard({ phase, index }) {
  const isCurrent = phase.status === "current";
  const isDone = phase.status === "done";
  const tone = isDone
    ? "var(--color-success-main)"
    : isCurrent
      ? "var(--color-primary-main)"
      : "var(--color-text-disabled)";
  const bg = isDone
    ? "rgba(0, 153, 85, 0.06)"
    : isCurrent
      ? "var(--color-primary-light)"
      : "var(--color-bg-container-secondary)";
  const pct = phase.milestones > 0
    ? phase.completedMilestones / phase.milestones
    : 0;
  return (
    <div
      className="rounded-lg p-md border"
      style={{
        borderColor: isCurrent ? tone : "var(--color-border-primary)",
        backgroundColor: bg,
        boxShadow: isCurrent ? "0 0 0 3px var(--color-primary-focus)" : "none",
      }}
    >
      <div className="flex items-center gap-xs">
        <span
          className="text-[10px] font-bold uppercase tracking-wide"
          style={{ color: tone }}
        >
          Phase {index + 1}
        </span>
        {isDone && (
          <CheckCircle2 size={12} style={{ color: tone }} />
        )}
        {isCurrent && (
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-xs rounded-sm text-text-inverse"
            style={{ backgroundColor: tone }}
          >
            Current
          </span>
        )}
      </div>
      <p className="text-sm font-semibold mt-2xs">{phase.name}</p>
      <p className="text-xs text-text-secondary mt-2xs">{phase.description}</p>
      <div className="mt-sm">
        <div className="flex items-center justify-between text-[10px] font-semibold">
          <span className="text-text-secondary">
            {phase.completedMilestones}/{phase.milestones} milestones
          </span>
          <span style={{ color: tone }}>{Math.round(pct * 100)}%</span>
        </div>
        <div
          className="h-1 mt-2xs rounded-full"
          style={{ backgroundColor: "var(--color-border-secondary)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-normal"
            style={{ width: `${pct * 100}%`, backgroundColor: tone }}
          />
        </div>
      </div>
    </div>
  );
}

function ElementsBar({ elements }) {
  const total = elements.total || 1;
  return (
    <div className="min-w-[120px]">
      <div className="flex h-1.5 rounded-full overflow-hidden">
        <div
          style={{
            width: `${(elements.approved / total) * 100}%`,
            backgroundColor: "var(--color-success-main)",
          }}
        />
        <div
          style={{
            width: `${(elements.inprogress / total) * 100}%`,
            backgroundColor: "var(--color-warning-main)",
          }}
        />
        <div
          style={{
            width: `${(elements.notstarted / total) * 100}%`,
            backgroundColor: "var(--color-border-primary)",
          }}
        />
      </div>
      <p className="text-xs text-text-secondary mt-2xs font-mono tabular-nums">
        {elements.approved}/{total} approved
      </p>
    </div>
  );
}

function SyncStat({ label, value, tone }) {
  const color =
    tone === "success"
      ? "var(--color-success-main)"
      : tone === "warning"
        ? "var(--color-warning-main)"
        : tone === "error"
          ? "var(--color-error-main)"
          : "var(--color-text-primary)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p
        className="text-h3 mt-2xs font-bold"
        style={{ color, letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
    </div>
  );
}

function MilestoneRow({ milestone: m }) {
  const icon =
    m.status === "done" ? CheckCircle2 : m.status === "atrisk" ? AlertTriangle : Clock;
  const Icon = icon;
  const color = {
    done: "var(--color-success-main)",
    inprogress: "var(--color-info-main)",
    atrisk: "var(--color-error-main)",
    upcoming: "var(--color-text-disabled)",
  }[m.status];
  return (
    <li className="flex items-center gap-md px-lg py-sm">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{m.label}</p>
        <p className="text-xs text-text-secondary mt-2xs inline-flex items-center gap-xs">
          <Calendar size={11} /> {m.due}
          <span>·</span>
          {
            APQP_PHASES.find((p) => p.id === m.phase)?.name ?? m.phase
          }
        </p>
      </div>
      {m.status === "atrisk" && (
        <span
          className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
          style={{
            color: "var(--color-error-dark)",
            backgroundColor: "rgba(211, 47, 47, 0.12)",
          }}
        >
          At risk
        </span>
      )}
    </li>
  );
}

function RiskRow({ risk: r, item, onDiscuss }) {
  const color = {
    high: "var(--color-error-main)",
    medium: "var(--color-warning-main)",
    low: "var(--color-success-main)",
  }[r.severity];
  return (
    <li className="px-lg py-md flex items-start gap-md">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <AlertCircle size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-xs">
          <span className="font-mono text-[10px] text-text-secondary">
            {r.id}
          </span>
          <span
            className="text-[10px] uppercase tracking-wide font-bold"
            style={{ color }}
          >
            {r.severity}
          </span>
        </div>
        <p className="text-sm font-semibold mt-2xs">{r.title}</p>
        <p className="text-xs text-text-secondary mt-2xs">
          {r.owner} · Opened {r.openedAt}
          {item && ` · ${item.code}`}
        </p>
        <p className="text-xs mt-2xs">{r.action}</p>
      </div>
      <button
        onClick={onDiscuss}
        title="Discuss"
        className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast shrink-0"
      >
        <MessageSquare size={13} />
      </button>
    </li>
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

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-sm py-2xs rounded-sm text-xs font-semibold transition-colors duration-fast ${
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
