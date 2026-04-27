import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  FileText,
  FilePlus,
  Send,
  Users,
} from "lucide-react";
import { KpiCard } from "../components/KpiCard.jsx";
import {
  PROJECTS,
  PHASES,
  RISK_LEVELS,
} from "../data/mockProjects.js";
import {
  computeTopLevelTotals,
  countOverTarget,
} from "../data/costAnalysis.js";
import {
  OPEN_RISKS,
  MILESTONES,
  summarizeAPQP,
} from "../data/mockAPQP.js";
import { PAST_CHANGES } from "../data/mockChangeRequests.js";
import { RFX_LIST } from "../data/mockSourcing.js";

const KRW = new Intl.NumberFormat("en-US");

/**
 * Overview tab — first tab the user lands on. Surfaces project-level
 * vital signs (KPIs), decisions waiting for action, and the recent
 * activity feed. Phase stepper / project header / tab nav are owned
 * by ProjectLayout so this view is purely "what's going on right now".
 */
export function ProjectOverviewPage() {
  const { projectId } = useParams();
  const project = useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId],
  );
  const phaseMeta = PHASES.find((p) => p.id === project.phase);
  const riskMeta = RISK_LEVELS[project.risk];

  const costTotals = useMemo(() => computeTopLevelTotals(), []);
  const apqpSummary = useMemo(() => summarizeAPQP(), []);
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
    return (
      MILESTONES.find(
        (m) => m.status === "inprogress" || m.status === "atrisk",
      ) ?? MILESTONES.find((m) => m.status === "upcoming")
    );
  }, []);

  const daysToSop = useMemo(() => {
    return Math.ceil(
      (new Date(project.sopDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
  }, [project.sopDate]);

  const decisions = useMemo(() => {
    const items = [];
    if (openChanges > 0) {
      items.push({
        icon: FilePlus,
        tone: "info",
        title: `${openChanges} change request${openChanges > 1 ? "s" : ""} awaiting review`,
        detail: "Design / sourcing approvals pending.",
        cta: "Open Design tab",
        href: `/projects/${project.id}/design`,
      });
    }
    activeRfx
      .filter((r) => r.status === "comparing")
      .slice(0, 2)
      .forEach((r) => {
        const best = Math.min(...r.quotes.map((q) => q.price));
        items.push({
          icon: Award,
          tone: "primary",
          title: `Award ${r.id} — ${r.title}`,
          detail: `${r.responses}/${r.invitees} quotes received. Best ₩${KRW.format(best)}.`,
          cta: "Compare quotes",
          href: `/projects/${project.id}/sourcing/rfx/${r.id}`,
        });
      });
    OPEN_RISKS.filter((r) => r.severity === "high")
      .slice(0, 2)
      .forEach((r) => {
        items.push({
          icon: AlertTriangle,
          tone: "error",
          title: r.title,
          detail: r.action,
          cta: "Open Quality tab",
          href: `/projects/${project.id}/quality`,
        });
      });
    if (upcomingMilestone) {
      items.push({
        icon: Clock,
        tone:
          upcomingMilestone.status === "atrisk" ? "error" : "warning",
        title: `Upcoming milestone: ${upcomingMilestone.label}`,
        detail: `Due ${upcomingMilestone.due}. Phase ${upcomingMilestone.phase}.`,
        cta: "Open Quality tab",
        href: `/projects/${project.id}/quality`,
      });
    }
    return items;
  }, [openChanges, activeRfx, upcomingMilestone, project.id]);

  const recentActivity = useMemo(() => buildActivityFeed(), []);

  return (
    <>
      {/* KPI strip — overview metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard
          label="Phase Progress"
          value={`${Math.round(project.phaseProgress * 100)}%`}
          icon={CheckCircle2}
          hint={`${phaseMeta?.label ?? "—"} phase`}
        />
        <KpiCard
          label="Days to SOP"
          value={
            daysToSop >= 0
              ? `${daysToSop.toLocaleString()}`
              : `${Math.abs(daysToSop).toLocaleString()} past`
          }
          icon={Clock}
          tone={
            daysToSop < 0
              ? "error"
              : daysToSop < 30
                ? "warning"
                : daysToSop < 90
                  ? "info"
                  : undefined
          }
          hint={`SOP ${project.sopDate}`}
        />
        <KpiCard
          label="Team"
          value={`${project.members.length + 1}`}
          icon={Users}
          hint={`Owned by ${project.owner.name}`}
        />
        <KpiCard
          label="Overall Status"
          value={riskMeta.label}
          tone={
            project.risk === "blocked"
              ? "error"
              : project.risk === "atrisk"
                ? "warning"
                : "success"
          }
          icon={
            project.risk === "blocked" || project.risk === "atrisk"
              ? AlertTriangle
              : CheckCircle2
          }
          hint={`${decisions.length} decision${decisions.length === 1 ? "" : "s"} needed`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        {/* Decisions */}
        <section className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Decisions Needed
            </h3>
            <span className="text-xs text-text-secondary">
              {decisions.length === 0
                ? "All caught up"
                : `${decisions.length} item${decisions.length === 1 ? "" : "s"} awaiting action`}
            </span>
          </div>
          {decisions.length === 0 ? (
            <div className="flex items-center justify-center gap-sm py-2xl text-sm text-text-secondary">
              <CheckCircle2
                size={16}
                style={{ color: "var(--color-success-main)" }}
              />
              No decisions pending — you're all caught up.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {decisions.map((d, i) => (
                <DecisionRow key={i} {...d} />
              ))}
            </ul>
          )}
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
            <Sparkles
              size={16}
              style={{ color: "var(--color-primary-contrast)" }}
            />
          </div>
          <div className="flex-1">
            <p
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Ask the workspace
            </p>
            <p className="text-sm mt-2xs">
              Need to move faster? Let an AI agent draft the next RFQ,
              simulate a supplier swap, or summarise the Dev-gate risk.
            </p>
          </div>
          <Link
            to="/ai"
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast shrink-0"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <Sparkles size={14} /> Open AI Workspace
          </Link>
        </div>
      </section>
    </>
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
  return items.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10);
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
        <p className="text-xs text-text-secondary mt-2xs truncate">
          {a.meta}
        </p>
      </div>
      <span className="text-[10px] font-mono text-text-secondary whitespace-nowrap">
        {a.date}
      </span>
    </li>
  );
}
