import { GitBranch, Package, DollarSign, ShieldCheck, Sparkles } from "lucide-react";

const MODULES = [
  { name: "BOM Workspace", desc: "BOM 트리 + View 전환 (E-BOM / Sourcing / Q-BOM)", icon: GitBranch, status: "inprogress" },
  { name: "Design", desc: "설계 협업 — 스펙, 유사 부품, Feasibility", icon: Package, status: "pending" },
  { name: "Cost", desc: "Should Cost · 견적 비교 · Cost Delta", icon: DollarSign, status: "notstarted" },
  { name: "Quality", desc: "APQP · PPAP · Q-BOM Sync", icon: ShieldCheck, status: "notstarted" },
  { name: "AI Workspace", desc: "자연어 지시 · 문서 생성 · 워크플로우", icon: Sparkles, status: "review" },
];

const STATUS_LABEL = {
  inprogress: "진행중",
  pending: "대기",
  notstarted: "미시작",
  review: "검토중",
};

export default function App() {
  return (
    <div className="min-h-screen bg-surface-default">
      {/* GNB */}
      <header className="h-gnb-h border-b border-border bg-surface-paper flex items-center px-xl sticky top-0 z-gnb">
        <div className="flex items-center gap-sm">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-inverse font-bold"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            C
          </div>
          <span className="text-lg font-semibold">Caidentia D2S</span>
        </div>
      </header>

      <div className="flex">
        {/* LNB */}
        <aside className="w-lnb-w border-r border-border bg-surface-paper min-h-[calc(100vh-64px)] p-md hidden md:block">
          <nav className="flex flex-col gap-2xs">
            <NavItem label="Dashboard" active />
            <NavItem label="Projects" />
            <NavItem label="Items" />
            <NavItem label="Suppliers" />
            <NavItem label="Categories" />
            <NavItem label="AI Workspace" />
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-xl">
          <div className="mb-xl">
            <p className="text-sm text-text-secondary mb-2xs">Dashboard</p>
            <h1 className="text-h2 text-text-primary">스캐폴딩 확인</h1>
            <p className="text-md text-text-secondary mt-sm">
              Caidentia 2.0 디자인 토큰, Tailwind 매핑, MUI v6 테마가 정상 로드되면 아래 카드가 정렬되어 보입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {MODULES.map((m) => (
              <ModuleCard key={m.name} {...m} />
            ))}
          </div>

          <div className="mt-2xl p-lg rounded-xl bg-surface-paper border border-border shadow-elevation-2">
            <h3 className="text-h4 mb-md">토큰 샘플</h3>
            <div className="flex flex-wrap gap-sm">
              {Object.keys(STATUS_LABEL).map((k) => (
                <StatusBadge key={k} status={k} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active }) {
  return (
    <button
      className={`text-left px-md py-sm rounded-md text-md transition-colors duration-fast ${
        active
          ? "text-primary-main font-semibold"
          : "text-text-secondary hover:bg-surface-container-secondary hover:text-text-primary"
      }`}
      style={active ? { backgroundColor: "var(--color-primary-light)" } : undefined}
    >
      {label}
    </button>
  );
}

function ModuleCard({ name, desc, icon: Icon, status }) {
  return (
    <div className="p-lg rounded-xl bg-surface-paper border border-border shadow-elevation-2 hover:shadow-elevation-16 transition-shadow duration-normal">
      <div className="flex items-start justify-between mb-md">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--color-primary-light)" }}
        >
          <Icon size={20} style={{ color: "var(--color-primary-main)" }} />
        </div>
        <StatusBadge status={status} />
      </div>
      <h3 className="text-h5 mb-2xs">{name}</h3>
      <p className="text-sm text-text-secondary">{desc}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-semibold px-sm py-2xs rounded-sm`}
      style={{
        backgroundColor: `var(--color-status-${status}-bg)`,
        color: `var(--color-status-${status}-fg)`,
      }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
