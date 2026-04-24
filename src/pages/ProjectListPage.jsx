import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  LayoutGrid,
  Rows3,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { PhaseStepper } from "../components/PhaseStepper.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import { Th } from "../components/Th.jsx";
import { FilterSelect } from "../components/FilterSelect.jsx";
import {
  PHASES,
  PROJECT_TYPES,
  PROJECTS,
  RISK_LEVELS,
  summarize,
} from "../data/mockProjects.js";

const KRW = new Intl.NumberFormat("en-US");

const DEFAULT_FILTER = {
  phase: "all",
  type: "all",
  risk: "all",
};

export function ProjectListPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTER);
  const [layout, setLayout] = useState("table");

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.code.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.phase !== "all" && p.phase !== filters.phase) return false;
      if (filters.type !== "all" && p.type !== filters.type) return false;
      if (filters.risk !== "all" && p.risk !== filters.risk) return false;
      return true;
    });
  }, [query, filters]);

  const summary = useMemo(() => summarize(PROJECTS), []);

  return (
    <>
      <PageHeader
        breadcrumbs={["Projects"]}
        title="Projects"
        description="NPI portfolio — phase, cost, and readiness at a glance."
        actions={
          <button
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Plus size={16} /> New Project
          </button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Total" value={`${summary.total}`} />
        <KpiCard
          label="On Track"
          value={`${summary.byRisk.ontrack}`}
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="At Risk"
          value={`${summary.byRisk.atrisk + summary.byRisk.blocked}`}
          icon={AlertTriangle}
          tone="warning"
          hint={
            summary.byRisk.blocked > 0
              ? `${summary.byRisk.blocked} blocked`
              : "Needs attention"
          }
        />
        <KpiCard
          label="Avg. Design Readiness"
          value={`${Math.round(summary.avgReadiness * 100)}%`}
        />
      </div>

      {/* Filters */}
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
                placeholder="Search name, code, description"
                className="pl-xl pr-md py-xs rounded-md text-sm border border-border bg-surface-paper w-64 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
              />
            </div>
            <FilterSelect
              label="Phase"
              value={filters.phase}
              onChange={(v) => setFilters({ ...filters, phase: v })}
              options={[
                { value: "all", label: "All phases" },
                ...PHASES.map((p) => ({ value: p.id, label: p.label })),
              ]}
            />
            <FilterSelect
              label="Type"
              value={filters.type}
              onChange={(v) => setFilters({ ...filters, type: v })}
              options={[
                { value: "all", label: "All types" },
                ...PROJECT_TYPES.map((t) => ({ value: t.id, label: t.label })),
              ]}
            />
            <FilterSelect
              label="Risk"
              value={filters.risk}
              onChange={(v) => setFilters({ ...filters, risk: v })}
              options={[
                { value: "all", label: "All risk" },
                { value: "ontrack", label: "On Track" },
                { value: "atrisk", label: "At Risk" },
                { value: "blocked", label: "Blocked" },
              ]}
            />
            {(filters.phase !== "all" ||
              filters.type !== "all" ||
              filters.risk !== "all" ||
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
          <div className="flex items-center gap-2xs rounded-md p-2xs bg-surface-container-secondary">
            <LayoutToggleBtn
              icon={Rows3}
              active={layout === "table"}
              onClick={() => setLayout("table")}
              label="Table"
            />
            <LayoutToggleBtn
              icon={LayoutGrid}
              active={layout === "grid"}
              onClick={() => setLayout("grid")}
              label="Grid"
            />
          </div>
        </div>

        {/* Result bar */}
        <div className="px-md py-sm text-xs text-text-secondary bg-surface-container-secondary border-b border-border">
          Showing <b className="text-text-primary">{filtered.length}</b> of{" "}
          {PROJECTS.length} projects
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-2xl text-sm text-text-secondary">
            No projects match the current filters.
          </div>
        ) : layout === "table" ? (
          <ProjectTable projects={filtered} />
        ) : (
          <ProjectGrid projects={filtered} />
        )}
      </div>
    </>
  );
}

/* ───────────────────── Table layout ───────────────────── */

function ProjectTable({ projects }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-text-secondary border-b border-border">
            <Th>Project</Th>
            <Th>Phase</Th>
            <Th className="text-right">Cost Gap</Th>
            <Th>Design</Th>
            <Th>PPAP</Th>
            <Th>Team</Th>
            <Th>Risk</Th>
            <Th className="text-right">SOP</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectRow({ project: p }) {
  const typeMeta = PROJECT_TYPES.find((t) => t.id === p.type);
  const costGap =
    p.currentCost != null ? p.currentCost - p.targetCost : null;
  const costGapPct =
    costGap != null && p.targetCost ? (costGap / p.targetCost) * 100 : null;

  return (
    <tr className="border-b border-border text-sm group hover:bg-surface-container-secondary transition-colors duration-fast">
      <td className="px-md py-md min-w-[260px]">
        <div className="flex items-center gap-sm">
          <div
            className="w-1 self-stretch rounded-full shrink-0"
            style={{ backgroundColor: typeMeta?.color }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-xs">
              <span className="font-mono text-xs text-text-secondary">
                {p.code}
              </span>
              <span
                className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
                style={{
                  color: typeMeta?.color,
                  backgroundColor: `${typeMeta?.color}15`,
                }}
              >
                {typeMeta?.label}
              </span>
            </div>
            <Link
              to={`/projects/${p.id}`}
              className="block font-semibold text-text-primary mt-2xs hover:underline hover:decoration-primary-main hover:underline-offset-4"
            >
              {p.name}
            </Link>
            <p className="text-xs text-text-secondary mt-2xs truncate max-w-[360px]">
              {p.description}
            </p>
          </div>
        </div>
      </td>
      <td className="px-md py-md">
        <PhaseStepper currentPhase={p.phase} />
        <p className="text-xs text-text-secondary mt-xs font-semibold">
          {PHASES.find((x) => x.id === p.phase)?.label}
        </p>
      </td>
      <td className="px-md py-md text-right">
        {costGap == null ? (
          <span className="text-xs text-text-disabled italic">—</span>
        ) : (
          <CostGap gap={costGap} pct={costGapPct} />
        )}
      </td>
      <td className="px-md py-md">
        <ProgressMeter value={p.designReadiness} />
      </td>
      <td className="px-md py-md">
        <ProgressMeter value={p.ppapCompletion} muted />
      </td>
      <td className="px-md py-md">
        <TeamStack owner={p.owner} members={p.members} />
      </td>
      <td className="px-md py-md">
        <RiskPill risk={p.risk} />
      </td>
      <td className="px-md py-md text-right">
        <span className="inline-flex items-center gap-xs text-xs text-text-secondary font-mono tabular-nums whitespace-nowrap">
          <Calendar size={11} /> {p.sopDate}
        </span>
      </td>
      <td className="px-md py-md text-right">
        <Link
          to={`/projects/${p.id}`}
          className="inline-flex items-center justify-center w-7 h-7 rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
          aria-label={`Open ${p.name}`}
        >
          <ArrowRight size={14} />
        </Link>
      </td>
    </tr>
  );
}

/* ───────────────────── Grid layout ───────────────────── */

function ProjectGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg p-md">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}

function ProjectCard({ project: p }) {
  const typeMeta = PROJECT_TYPES.find((t) => t.id === p.type);
  const costGap =
    p.currentCost != null ? p.currentCost - p.targetCost : null;
  const costGapPct =
    costGap != null && p.targetCost ? (costGap / p.targetCost) * 100 : null;

  return (
    <Link
      to={`/projects/${p.id}`}
      className="group block rounded-xl bg-surface-paper border border-border shadow-elevation-2 hover:shadow-elevation-16 transition-shadow duration-normal overflow-hidden"
    >
      <div
        className="h-1"
        style={{ backgroundColor: typeMeta?.color }}
      />
      <div className="p-lg">
        <div className="flex items-center justify-between gap-sm">
          <span className="font-mono text-xs text-text-secondary">
            {p.code}
          </span>
          <RiskPill risk={p.risk} />
        </div>
        <h3 className="text-h5 mt-2xs">{p.name}</h3>
        <p className="text-sm text-text-secondary mt-2xs line-clamp-2">
          {p.description}
        </p>

        <div className="mt-md">
          <PhaseStepper currentPhase={p.phase} />
          <p className="text-xs text-text-secondary mt-xs font-semibold">
            {PHASES.find((x) => x.id === p.phase)?.label} ·{" "}
            {Math.round(p.phaseProgress * 100)}% complete
          </p>
        </div>

        <div className="grid grid-cols-3 gap-sm mt-md">
          <MiniMeter
            label="Design"
            value={p.designReadiness}
          />
          <MiniMeter
            label="PPAP"
            value={p.ppapCompletion}
            muted
          />
          <MiniCost gap={costGap} pct={costGapPct} />
        </div>

        <div className="flex items-center justify-between mt-md pt-md border-t border-border">
          <TeamStack owner={p.owner} members={p.members} />
          <span className="text-xs text-text-secondary">
            {p.itemCount} items · {p.openChanges} open
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ───────────────────── Atoms ───────────────────── */

function LayoutToggleBtn({ icon: Icon, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-7 h-7 inline-flex items-center justify-center rounded-sm transition-colors duration-fast ${
        active
          ? "bg-surface-paper text-text-primary shadow-elevation-2"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      <Icon size={14} />
    </button>
  );
}

function CostGap({ gap, pct }) {
  if (gap === 0) {
    return (
      <span className="font-mono text-xs text-text-secondary">On target</span>
    );
  }
  const isOver = gap > 0;
  const color = isOver ? "var(--color-error-main)" : "var(--color-success-main)";
  const Icon = isOver ? TrendingUp : TrendingDown;
  return (
    <span
      className="inline-flex items-center gap-2xs text-sm font-bold font-mono tabular-nums"
      style={{ color }}
    >
      <Icon size={12} />
      {gap >= 0 ? "+" : ""}₩{KRW.format(gap)}
      <span
        className="text-[10px] font-semibold"
        style={{ color, opacity: 0.8 }}
      >
        ({pct >= 0 ? "+" : ""}{pct.toFixed(1)}%)
      </span>
    </span>
  );
}

function ProgressMeter({ value, muted }) {
  const pct = Math.round((value ?? 0) * 100);
  const color = muted
    ? "var(--color-secondary-main)"
    : "var(--color-primary-main)";
  return (
    <div className="flex items-center gap-xs min-w-[80px]">
      <div
        className="h-1.5 flex-1 rounded-full"
        style={{ backgroundColor: "var(--color-border-secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-normal"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums text-text-primary w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

function MiniMeter({ label, value, muted }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p className="text-sm font-bold font-mono mt-2xs">{pct}%</p>
      <ProgressMeter value={value} muted={muted} />
    </div>
  );
}

function MiniCost({ gap, pct }) {
  if (gap == null) {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
          Gap
        </p>
        <p className="text-sm text-text-disabled italic mt-2xs">—</p>
      </div>
    );
  }
  const isOver = gap > 0;
  const color = isOver
    ? "var(--color-error-main)"
    : gap < 0
      ? "var(--color-success-main)"
      : "var(--color-text-secondary)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        Cost Gap
      </p>
      <p
        className="text-sm font-bold font-mono mt-2xs"
        style={{ color }}
      >
        {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
      </p>
    </div>
  );
}

function RiskPill({ risk }) {
  const meta = RISK_LEVELS[risk];
  const Icon =
    risk === "ontrack" ? CheckCircle2 : risk === "blocked" ? XCircle : AlertTriangle;
  return (
    <span
      className="inline-flex items-center gap-xs text-xs font-semibold px-sm py-2xs rounded-sm whitespace-nowrap"
      style={{
        color: meta.color,
        backgroundColor: `${meta.color}15`,
      }}
    >
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

function TeamStack({ owner, members = [] }) {
  const extras = members.length;
  return (
    <div className="flex items-center gap-xs">
      <div
        title={`${owner.name} (${owner.role})`}
        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-text-inverse border-2 border-surface-paper"
        style={{ backgroundColor: owner.color }}
      >
        {owner.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
      </div>
      {extras > 0 && (
        <div
          className="text-xs font-semibold rounded-full w-7 h-7 flex items-center justify-center border-2 border-surface-paper"
          style={{
            backgroundColor: "var(--color-surface-paper)",
            color: "var(--color-text-secondary)",
            boxShadow: "inset 0 0 0 1px var(--color-border-primary)",
          }}
        >
          +{extras}
        </div>
      )}
    </div>
  );
}
