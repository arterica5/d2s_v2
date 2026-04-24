import { Link } from "react-router-dom";
import {
  GitBranch,
  Package,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";

const MODULES = [
  {
    to: "/projects/ev-model-x/bom",
    name: "BOM Workspace",
    desc: "BOM tree with E-BOM / Sourcing / Q-BOM view switching",
    icon: GitBranch,
    status: "inprogress",
  },
  {
    to: "/projects/ev-model-x/design",
    name: "Design",
    desc: "Design collaboration — specs, similar parts, feasibility",
    icon: Package,
    status: "pending",
  },
  {
    to: "/projects/ev-model-x/cost",
    name: "Cost",
    desc: "Should Cost, quote comparison, cost delta",
    icon: DollarSign,
    status: "notstarted",
  },
  {
    to: "/projects/ev-model-x/quality",
    name: "Quality",
    desc: "APQP, PPAP, Q-BOM sync",
    icon: ShieldCheck,
    status: "notstarted",
  },
  {
    to: "/ai",
    name: "AI Workspace",
    desc: "Natural-language commands, document generation, workflows",
    icon: Sparkles,
    status: "review",
  },
];

export function DashboardPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={["Dashboard"]}
        title="Today's Work"
        description="Entry point for BOM-centric collaboration. Pick a module to start."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {MODULES.map((m) => (
          <ModuleCard key={m.name} {...m} />
        ))}
      </div>
    </>
  );
}

function ModuleCard({ to, name, desc, icon: Icon, status }) {
  return (
    <Link
      to={to}
      className="group block p-lg rounded-xl bg-surface-paper border border-border shadow-elevation-2 hover:shadow-elevation-16 transition-shadow duration-normal"
    >
      <div className="flex items-start justify-between mb-md">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          <Icon size={20} style={{ color: "var(--color-primary-main)" }} />
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-h5">{name}</h3>
        <ArrowRight
          size={16}
          className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
        />
      </div>
      <p className="text-sm text-text-secondary mt-2xs">{desc}</p>
    </Link>
  );
}
