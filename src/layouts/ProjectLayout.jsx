import { useMemo } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import {
  MessageSquare,
  FilePlus,
  ChevronRight,
} from "lucide-react";
import { PhaseStepper } from "../components/PhaseStepper.jsx";
import {
  PROJECTS,
  PROJECT_TYPES,
  PHASES,
  RISK_LEVELS,
} from "../data/mockProjects.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";

/**
 * Layout shared across every tab inside a single project.
 *
 * Renders the project identity (name, type, status, phase progression)
 * once and exposes a tab bar for the modules. Child routes plug into
 * the <Outlet /> so the project header stays sticky as the user moves
 * between BOM / Design / Cost / Sourcing / Quality / etc.
 */
const PROJECT_TABS = [
  { id: "overview", to: ".", end: true, label: "Overview" },
  { id: "bom", to: "bom", end: false, label: "BOM" },
  { id: "design", to: "design", end: false, label: "Design" },
  { id: "cost", to: "cost", end: false, label: "Cost" },
  { id: "sourcing", to: "sourcing", end: false, label: "Sourcing" },
  { id: "quality", to: "quality", end: false, label: "Quality" },
  { id: "files", to: "files", end: false, label: "Files" },
  { id: "members", to: "members", end: false, label: "Members" },
  { id: "activity", to: "activity", end: false, label: "Activity" },
];

export function ProjectLayout() {
  const { projectId } = useParams();
  const project = useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId],
  );
  const typeMeta = PROJECT_TYPES.find((t) => t.id === project.type);
  const phaseMeta = PHASES.find((p) => p.id === project.phase);
  const riskMeta = RISK_LEVELS[project.risk];
  const { open: openCollab } = useCollaboration();

  const daysToSop = useMemo(() => {
    return Math.ceil(
      (new Date(project.sopDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
  }, [project.sopDate]);

  return (
    <>
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 mb-xl overflow-hidden">
        <div className="p-lg">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2xs text-sm mb-sm"
          >
            <Link
              to="/projects"
              className="text-text-secondary hover:text-primary-main hover:underline underline-offset-4 decoration-primary-main transition-colors duration-fast"
            >
              Projects
            </Link>
            <ChevronRight size={12} className="text-text-disabled" />
            <span className="text-text-primary font-semibold">
              {project.name}
            </span>
          </nav>

          {/* Title + actions */}
          <div className="flex flex-wrap items-start justify-between gap-lg">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-sm flex-wrap">
                <h1 className="text-h2 text-text-primary">{project.name}</h1>
                <span
                  className="text-[10px] uppercase tracking-wide font-bold px-sm py-2xs rounded-sm"
                  style={{
                    color: typeMeta?.color,
                    backgroundColor: `${typeMeta?.color}15`,
                  }}
                >
                  {typeMeta?.label}
                </span>
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
              <div className="flex items-center gap-md mt-sm text-xs text-text-secondary flex-wrap">
                <span className="font-mono">{project.code}</span>
                <span className="opacity-50">·</span>
                <span>
                  <b className="text-text-primary font-semibold">
                    {phaseMeta?.label}
                  </b>{" "}
                  phase ·{" "}
                  {Math.round(project.phaseProgress * 100)}%
                </span>
                <span className="opacity-50">·</span>
                <span>SOP {project.sopDate}</span>
                <span className="opacity-50">·</span>
                <span
                  style={{
                    color:
                      daysToSop < 0
                        ? "var(--color-error-main)"
                        : daysToSop < 30
                          ? "var(--color-warning-main)"
                          : "var(--color-text-secondary)",
                  }}
                >
                  {daysToSop > 0
                    ? `${daysToSop}d to SOP`
                    : daysToSop === 0
                      ? "SOP today"
                      : `${Math.abs(daysToSop)}d past`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-sm">
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
            </div>
          </div>

          {/* Phase stepper */}
          <div className="mt-lg pt-lg border-t border-border">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                Phase Progression
              </span>
              <span className="text-xs text-text-secondary">
                Currently in{" "}
                <b className="text-text-primary">{phaseMeta?.label}</b>
              </span>
            </div>
            <PhaseStepper currentPhase={project.phase} size="md" />
          </div>
        </div>

        {/* Tabs */}
        <nav
          aria-label="Project sections"
          className="flex border-t border-border overflow-x-auto bg-surface-container-secondary"
        >
          {PROJECT_TABS.map((t) => (
            <NavLink
              key={t.id}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `relative px-lg py-sm text-sm font-semibold whitespace-nowrap transition-colors duration-fast ${
                  isActive
                    ? "text-primary-main bg-surface-paper"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-paper"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { boxShadow: "inset 0 -2px 0 var(--color-primary-main)" }
                  : undefined
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </section>

      <Outlet />
    </>
  );
}
