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
    desc: "BOM 트리 + View 전환 (E-BOM / Sourcing / Q-BOM)",
    icon: GitBranch,
    status: "inprogress",
  },
  {
    to: "/projects/ev-model-x/design",
    name: "Design",
    desc: "설계 협업 — 스펙, 유사 부품, Feasibility",
    icon: Package,
    status: "pending",
  },
  {
    to: "/projects/ev-model-x/cost",
    name: "Cost",
    desc: "Should Cost · 견적 비교 · Cost Delta",
    icon: DollarSign,
    status: "notstarted",
  },
  {
    to: "/projects/ev-model-x/quality",
    name: "Quality",
    desc: "APQP · PPAP · Q-BOM Sync",
    icon: ShieldCheck,
    status: "notstarted",
  },
  {
    to: "/ai",
    name: "AI Workspace",
    desc: "자연어 지시 · 문서 생성 · 워크플로우",
    icon: Sparkles,
    status: "review",
  },
];

export function DashboardPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={["Dashboard"]}
        title="오늘의 작업"
        description="BOM 중심 협업의 진입점입니다. 모듈을 선택해 시작하세요."
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
