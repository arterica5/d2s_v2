import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MessageSquare,
  FilePlus,
  Calendar,
  Users,
  ArrowRight,
  GitBranch,
  Package,
  DollarSign,
  Send,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  FileText,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { PhaseStepper } from "../components/PhaseStepper.jsx";
import {
  PROJECTS,
  PROJECT_TYPES,
  PHASES,
  RISK_LEVELS,
} from "../data/mockProjects.js";
import { BOM_META, BOM_NODES } from "../data/mockBOM.js";
import {
  computeTopLevelTotals,
  flattenAll,
  countOverTarget,
} from "../data/costAnalysis.js";
import {
  PPAP_PROGRESS,
  OPEN_RISKS,
  QBOM_SYNC_STATUS,
  MILESTONES,
  summarizeAPQP,
} from "../data/mockAPQP.js";
import { PAST_CHANGES } from "../data/mockChangeRequests.js";
import { RFX_LIST, summarizeRfx } from "../data/mockSourcing.js";
import { TOTAL_UNREAD, COLLAB_CHANNELS } from "../data/mockCollaboration.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";

const KRW = new Intl.NumberFormat("en-US");

export function ProjectWorkplacePage() {
  const { projectId } = useParams();
  const project = useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId],
  );
  const typeMeta = PROJECT_TYPES.find((t) => t.id === project.type);
  const phaseMeta = PHASES.find((p) => p.id === project.phase);
  const riskMeta = RISK_LEVELS[project.risk];

  const costTotals = useMemo(() => computeTopLevelTotals(), []);
  const apqpSummary = useMemo(() => summarizeAPQP(), []);
  const rfxSummary = useMemo(() => summarizeRfx(), []);
  const allItems = useMemo(() => flattenAll(), []);
  const overTarget = useMemo(() => countOverTarget(), []);
  const openChanges = useMemo(
    () => PAST_CHANGES.filter((c) => c.status === "review").length,
    [],
  );
  const activeRfx = useMemo(
    () =>
      RFX_LIST.filter((r) =>
        ["sent", "responded", "comparing"].includes(r.status),
      ),
    [],
  );
  const upcomingMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.status === "inprogress" || m.status === "atrisk") ??
      MILESTONES.find((m) => m.status === "upcoming");
  }, []);

  const { open: openCollab } = useCollaboration();

  const recentActivity = useMemo(() => buildActivityFeed(), []);

  return (
    <>
      <PageHeader
        breadcrumbs={["Projects", project.name]}
        title={project.name}
        description={project.description}
        actions={
          <>
            <button
              onClick={() => openCollab({ channel: "general" })}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <MessageSquare size={14} /> Discuss
            </button>
            <Link
              to={`/projects/${project.id}/changes/new`}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <FilePlus size={14} /> Request Change
            </Link>
          </>
        }
      />

      {/* Project meta strip */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <div className="flex flex-wrap items-start justify-between gap-lg mb-lg">
          <div className="flex items-center gap-md flex-wrap">
            <span
              className="text-[10px] uppercase tracking-wide font-bold px-sm py-2xs rounded-sm"
              style={{
                color: typeMeta?.color,
                backgroundColor: `${typeMeta?.color}15`,
              }}
            >
              {typeMeta?.label}
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {project.code}
            </span>
            <Meta icon={Calendar} label="Start" value={project.startDate} />
            <Meta icon={Calendar} label="SOP" value={project.sopDate} />
            <Meta
              icon={Users}
              label="Team"
              value={`${project.owner.name} +${project.members.length}`}
            />
            <span
              className="inline-flex items-center gap-xs text-xs font-semibold px-sm py-2xs rounded-sm"
              style={{
                color: riskMeta.color,
                backgroundColor: `${riskMeta.color}15`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: riskMeta.color }}
              />
              {riskMeta.label}
            </span>
          </div>
        </div>

        {/* Phase stepper */}
        <div>
          <div className="flex items-center justify-between mb-sm">
            <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Phase Progression
            </span>
            <span className="text-xs text-text-secondary">
              Current:{" "}
              <b className="text-text-primary">{phaseMeta?.label}</b> ·{" "}
              {Math.round(project.phaseProgress * 100)}% complete
            </span>
          </div>
          <PhaseStepper currentPhase={project.phase} size="md" />
        </div>
      </section>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="Cost Gap vs Target"
          value={`${costTotals.gap >= 0 ? "+" : ""}₩${KRW.format(costTotals.gap)}`}
          tone={
            costTotals.gap > 0 ? "error" : costTotals.gap < 0 ? "success" : undefined
          }
          icon={costTotals.gap > 0 ? TrendingUp : TrendingDown}
          hint={`${overTarget} items over · Current ₩${KRW.format(costTotals.current)}`}
        />
        <KpiCard
          label="Design Readiness"
          value={`${Math.round(project.designReadiness * 100)}%`}
          icon={CheckCircle2}
          tone={project.designReadiness > 0.85 ? "success" : "info"}
        />
        <KpiCard
          label="PPAP First-Pass"
          value={`${Math.round(apqpSummary.firstPassRate * 100)}%`}
          icon={ShieldCheck}
          tone={apqpSummary.firstPassRate > 0.8 ? "success" : "warning"}
          hint={`${PPAP_PROGRESS.length} items tracked`}
        />
        <KpiCard
          label="Open Risks"
          value={`${apqpSummary.totalRisks}`}
          icon={AlertTriangle}
          tone={apqpSummary.highRisks > 0 ? "error" : "warning"}
          hint={`${apqpSummary.highRisks} high severity`}
        />
      </div>

      {/* Module cards */}
      <section className="mb-xl">
        <div className="flex items-center justify-between mb-md">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            Modules
          </h3>
          <span className="text-xs text-text-secondary">
            Each module links into its full workspace
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
          <ModuleCard
            to={`/projects/${project.id}/bom`}
            name="BOM Workspace"
            icon={GitBranch}
            headline={`${allItems.length} items · ${BOM_META.currentVersion}`}
            stats={[
              {
                label: "Current roll-up",
                value: `₩${KRW.format(costTotals.current)}`,
              },
              { label: "Latest diff", value: `${BOM_META.previousVersion} → ${BOM_META.currentVersion}` },
            ]}
            tone="primary"
          />
          <ModuleCard
            to={`/projects/${project.id}/design`}
            name="Design Workspace"
            icon={Package}
            headline={`${Math.round(project.designReadiness * 100)}% ready`}
            stats={[
              {
                label: "Open changes",
                value: `${openChanges}`,
                tone: openChanges > 0 ? "warning" : undefined,
              },
              { label: "Freeze gate", value: "Dev phase" },
            ]}
            tone="info"
          />
          <ModuleCard
            to={`/projects/${project.id}/cost`}
            name="Cost Workspace"
            icon={DollarSign}
            headline={
              costTotals.gap > 0
                ? `+₩${KRW.format(costTotals.gap)} over target`
                : `₩${KRW.format(costTotals.gap * -1)} under target`
            }
            stats={[
              {
                label: "Items over",
                value: `${overTarget}`,
                tone: overTarget > 0 ? "error" : undefined,
              },
              {
                label: "Target",
                value: `₩${KRW.format(costTotals.target)}`,
              },
            ]}
            tone={costTotals.gap > 0 ? "error" : "success"}
          />
          <ModuleCard
            to={`/projects/${project.id}/sourcing`}
            name="Sourcing"
            icon={Send}
            headline={`${rfxSummary.active} active · ${rfxSummary.awarded} awarded`}
            stats={[
              {
                label: "Pending responses",
                value: `${rfxSummary.pendingResponses}`,
                tone: rfxSummary.pendingResponses > 0 ? "warning" : undefined,
              },
              { label: "Total RFx", value: `${rfxSummary.total}` },
            ]}
            tone="info"
          />
          <ModuleCard
            to={`/projects/${project.id}/quality`}
            name="APQP / Quality"
            icon={ShieldCheck}
            headline={`Risks: ${apqpSummary.totalRisks} · Sync ${Math.round(apqpSummary.syncPct * 100)}%`}
            stats={[
              {
                label: "High severity",
                value: `${apqpSummary.highRisks}`,
                tone: apqpSummary.highRisks > 0 ? "error" : undefined,
              },
              {
                label: "Q-BOM gaps",
                value: `${QBOM_SYNC_STATUS.outOfSync + QBOM_SYNC_STATUS.missing}`,
                tone:
                  QBOM_SYNC_STATUS.outOfSync + QBOM_SYNC_STATUS.missing > 0
                    ? "warning"
                    : undefined,
              },
            ]}
            tone="warning"
          />
          <ModuleCard
            onClick={() => openCollab({ channel: "general" })}
            name="Collaboration"
            icon={MessageSquare}
            headline={`${TOTAL_UNREAD} unread across ${COLLAB_CHANNELS.length} channels`}
            stats={[
              {
                label: "Most active",
                value: `#${[...COLLAB_CHANNELS].sort((a, b) => b.unread - a.unread)[0].name}`,
              },
              {
                label: "Sync window",
                value: "live",
              },
            ]}
            tone="secondary"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Decisions / open items */}
        <section className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Decisions Needed
            </h3>
            <span className="text-xs text-text-secondary">
              {openChanges + apqpSummary.highRisks + (activeRfx.find((r) => r.status === "comparing") ? 1 : 0)}{" "}
              items awaiting action
            </span>
          </div>
          <ul className="divide-y divide-border">
            {openChanges > 0 && (
              <DecisionRow
                icon={FilePlus}
                tone="info"
                title={`${openChanges} change request${openChanges > 1 ? "s" : ""} awaiting review`}
                detail="Design / sourcing approvals pending."
                cta="Open Design Workspace"
                href={`/projects/${project.id}/design`}
              />
            )}
            {activeRfx
              .filter((r) => r.status === "comparing")
              .slice(0, 2)
              .map((r) => (
                <DecisionRow
                  key={r.id}
                  icon={Award}
                  tone="primary"
                  title={`Award ${r.id} — ${r.title}`}
                  detail={`${r.responses}/${r.invitees} quotes received. Best ₩${KRW.format(Math.min(...r.quotes.map((q) => q.price)))}.`}
                  cta="Compare quotes"
                  href={`/projects/${project.id}/sourcing/rfx/${r.id}`}
                />
              ))}
            {OPEN_RISKS.filter((r) => r.severity === "high")
              .slice(0, 2)
              .map((r) => (
                <DecisionRow
                  key={r.id}
                  icon={AlertTriangle}
                  tone="error"
                  title={r.title}
                  detail={r.action}
                  cta="Open APQP Workspace"
                  href={`/projects/${project.id}/quality`}
                />
              ))}
            {upcomingMilestone && (
              <DecisionRow
                icon={Clock}
                tone={upcomingMilestone.status === "atrisk" ? "error" : "warning"}
                title={`Upcoming milestone: ${upcomingMilestone.label}`}
                detail={`Due ${upcomingMilestone.due}. Phase ${upcomingMilestone.phase}.`}
                cta="Open APQP Workspace"
                href={`/projects/${project.id}/quality`}
              />
            )}
          </ul>
        </section>

        {/* Recent activity */}
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Recent Activity
            </h3>
          </div>
          <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
            {recentActivity.map((a, i) => (
              <ActivityRow key={i} activity={a} />
            ))}
          </ul>
        </section>
      </div>

      {/* AI hint */}
      <section
        className="rounded-xl p-lg mt-xl border"
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
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-primary-dark)" }}>
              Ask the workspace
            </p>
            <p className="text-sm mt-2xs">
              Need to move faster? Let an AI agent draft the next RFQ, simulate a
              supplier swap, or summarise the Dev-gate risk.
            </p>
          </div>
          <Link
            to="/ai"
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Sparkles size={14} /> Open AI Workspace
          </Link>
        </div>
      </section>
    </>
  );
}

/* ───────────────────── Subcomponents ───────────────────── */

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-sm">
      <Icon size={14} className="text-text-secondary" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, tone, icon: Icon, hint }) {
  const color =
    tone === "error"
      ? "var(--color-error-main)"
      : tone === "warning"
        ? "var(--color-warning-main)"
        : tone === "success"
          ? "var(--color-success-main)"
          : tone === "info"
            ? "var(--color-info-main)"
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

function ModuleCard({ to, onClick, name, icon: Icon, headline, stats, tone }) {
  const toneColor =
    tone === "primary"
      ? "var(--color-primary-main)"
      : tone === "info"
        ? "var(--color-info-main)"
        : tone === "error"
          ? "var(--color-error-main)"
          : tone === "warning"
            ? "var(--color-warning-main)"
            : tone === "success"
              ? "var(--color-success-main)"
              : "var(--color-secondary-main)";

  const inner = (
    <div className="group p-lg rounded-xl bg-surface-paper border border-border shadow-elevation-2 hover:shadow-elevation-16 transition-shadow duration-normal h-full flex flex-col">
      <div className="flex items-start justify-between mb-md">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${toneColor}15` }}
        >
          <Icon size={20} style={{ color: toneColor }} />
        </div>
        <ArrowRight
          size={16}
          className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
        />
      </div>
      <h3 className="text-h5">{name}</h3>
      <p className="text-sm mt-2xs font-semibold" style={{ color: toneColor }}>
        {headline}
      </p>
      <dl className="mt-md pt-md border-t border-border grid grid-cols-2 gap-sm">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
              {s.label}
            </dt>
            <dd
              className="text-sm font-bold font-mono mt-2xs"
              style={
                s.tone
                  ? {
                      color:
                        s.tone === "error"
                          ? "var(--color-error-main)"
                          : s.tone === "warning"
                            ? "var(--color-warning-main)"
                            : "var(--color-text-primary)",
                    }
                  : undefined
              }
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {inner}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="text-left block w-full h-full">
      {inner}
    </button>
  );
}

function DecisionRow({ icon: Icon, tone, title, detail, cta, href }) {
  const color = {
    info: "var(--color-info-main)",
    primary: "var(--color-primary-main)",
    error: "var(--color-error-main)",
    warning: "var(--color-warning-main)",
  }[tone];
  return (
    <li className="flex items-start gap-md px-lg py-md">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-text-secondary mt-2xs">{detail}</p>
      </div>
      {href && (
        <Link
          to={href}
          className="inline-flex items-center gap-xs text-xs font-semibold shrink-0"
          style={{ color }}
        >
          {cta}
          <ArrowRight size={12} />
        </Link>
      )}
    </li>
  );
}

function buildActivityFeed() {
  const items = [];
  PAST_CHANGES.forEach((c) => {
    items.push({
      kind: "change",
      date: c.submittedAt,
      text: c.title,
      meta: `${c.id} · ${c.submittedBy} · ${c.status}`,
      status: c.status,
    });
  });
  RFX_LIST.forEach((r) => {
    items.push({
      kind: "rfx",
      date: r.createdAt,
      text: `${r.type.toUpperCase()} created — ${r.title}`,
      meta: `${r.id} · ${r.owner} · ${r.status}`,
      status: r.status,
    });
    if (r.awardedAt) {
      items.push({
        kind: "award",
        date: r.awardedAt,
        text: `Awarded ${r.awardedSupplier} — ${r.title}`,
        meta: `${r.id}`,
        status: "awarded",
      });
    }
  });
  return items
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 10);
}

function ActivityRow({ activity: a }) {
  const iconMap = {
    change: FileText,
    rfx: Send,
    award: Award,
  };
  const toneMap = {
    approved: "var(--color-success-main)",
    awarded: "var(--color-success-main)",
    comparing: "var(--color-primary-main)",
    responded: "var(--color-info-main)",
    sent: "var(--color-info-main)",
    review: "var(--color-warning-main)",
    rejected: "var(--color-error-main)",
    draft: "var(--color-secondary-main)",
  };
  const Icon = iconMap[a.kind] ?? FileText;
  const color = toneMap[a.status] ?? "var(--color-text-secondary)";
  return (
    <li className="flex items-start gap-sm px-lg py-sm">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{a.text}</p>
        <p className="text-xs text-text-secondary mt-2xs truncate">{a.meta}</p>
      </div>
      <span className="text-[10px] font-mono text-text-secondary whitespace-nowrap">
        {a.date}
      </span>
    </li>
  );
}
