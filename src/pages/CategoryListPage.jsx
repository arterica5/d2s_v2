import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Package,
  Building2,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { KpiCard } from "../components/KpiCard.jsx";
import {
  CATEGORIES,
  STRATEGY_GROUPS,
  summarizeCategories,
} from "../data/mockCategories.js";

const KRW = new Intl.NumberFormat("en-US");

export function CategoryListPage() {
  const summary = useMemo(() => summarizeCategories(), []);

  return (
    <>
      <PageHeader
        breadcrumbs={["Categories"]}
        title="Categories"
        description="Policy containers — strategy, rules, suppliers, and downstream process impact."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-xl">
        <KpiCard label="Total" value={`${summary.total}`} />
        <KpiCard
          label="Strategic"
          value={`${summary.byGroup.strategic ?? 0}`}
          tone="primary"
        />
        <KpiCard
          label="Collaborative"
          value={`${summary.byGroup.collaborative ?? 0}`}
          tone="info"
        />
        <KpiCard
          label="2025 Spend"
          value={`₩${KRW.format(Math.round(summary.spend / 1_000_000))}M`}
          icon={TrendingUp}
        />
      </div>

      {/* Quadrant */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm">
          Strategic Position
        </h3>
        <p className="text-sm text-text-secondary mb-lg">
          Buyer power (x-axis) vs. Supplier power (y-axis). Quadrant drives the
          recommended sourcing approach.
        </p>
        <Quadrant />
      </section>

      {/* Category list grouped */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {Object.entries(STRATEGY_GROUPS).map(([id, group]) => {
          const inGroup = CATEGORIES.filter((c) => c.group === id);
          return (
            <GroupColumn
              key={id}
              group={group}
              categories={inGroup}
            />
          );
        })}
      </div>
    </>
  );
}

function Quadrant() {
  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-container-secondary)",
        aspectRatio: "2 / 1",
        minHeight: "360px",
      }}
    >
      {/* Axes */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-px"
        style={{ backgroundColor: "var(--color-border-primary)" }}
      />
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-px h-px"
        style={{ backgroundColor: "var(--color-border-primary)" }}
      />

      {/* Axis labels */}
      <span className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        Buyer Power →
      </span>
      <span
        className="absolute top-2 left-2 text-[10px] uppercase tracking-wide text-text-secondary font-semibold"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Supplier Power →
      </span>

      {/* Quadrant labels */}
      <QuadrantLabel text="Strategic" x="15%" y="15%" color="var(--color-primary-main)" />
      <QuadrantLabel text="Bottleneck" x="15%" y="85%" color="var(--color-warning-main)" />
      <QuadrantLabel text="Leverage" x="85%" y="15%" color="var(--color-info-main)" />
      <QuadrantLabel text="Non-critical" x="85%" y="85%" color="var(--color-success-main)" />

      {/* Dots */}
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          to={`/categories/${c.slug}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
          style={{
            left: `${c.position.buyerPower * 100}%`,
            top: `${(1 - c.position.supplierPower) * 100}%`,
          }}
          title={c.name}
        >
          <span
            className="block w-4 h-4 rounded-full border-2 border-surface-paper shadow-elevation-2 transition-transform duration-fast group-hover:scale-125"
            style={{
              backgroundColor:
                STRATEGY_GROUPS[c.group]?.color ?? "var(--color-primary-main)",
            }}
          />
          <span
            className="absolute top-full mt-2xs left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap px-sm py-2xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none"
            style={{
              backgroundColor: "var(--color-bg-paper)",
              border: "1px solid var(--color-border-primary)",
            }}
          >
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

function QuadrantLabel({ text, x, y, color }) {
  return (
    <span
      className="absolute text-[10px] font-bold uppercase tracking-wide opacity-60"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        color,
      }}
    >
      {text}
    </span>
  );
}

function GroupColumn({ group, categories }) {
  return (
    <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <div
        className="p-lg border-b border-border"
        style={{
          borderTop: `3px solid ${group.color}`,
        }}
      >
        <p className="text-h4 font-bold" style={{ color: group.color }}>
          {group.label}
        </p>
        <p className="text-xs text-text-secondary mt-2xs">{group.description}</p>
        <p className="text-[10px] uppercase tracking-wide font-semibold text-text-secondary mt-sm">
          {categories.length} categories
        </p>
      </div>
      <ul className="divide-y divide-border">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              to={`/categories/${c.slug}`}
              className="flex items-center gap-md px-lg py-md hover:bg-surface-container-secondary transition-colors duration-fast group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{c.name}</p>
                <div className="flex items-center gap-sm text-xs text-text-secondary mt-2xs">
                  <span className="inline-flex items-center gap-2xs">
                    <Package size={10} /> {c.itemCount}
                  </span>
                  <span className="inline-flex items-center gap-2xs">
                    <Building2 size={10} /> {c.supplierCount}
                  </span>
                  <span className="font-mono tabular-nums">
                    ₩{KRW.format(Math.round(c.spendKRW2025 / 1_000_000))}M
                  </span>
                </div>
              </div>
              <ArrowRight
                size={14}
                className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
