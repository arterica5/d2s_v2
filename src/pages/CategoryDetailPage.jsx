import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Package,
  Building2,
  Shield,
  Check,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import {
  findCategory,
  STRATEGY_GROUPS,
} from "../data/mockCategories.js";
import { findSupplier } from "../data/mockSuppliers.js";
import { BOM_NODES } from "../data/mockBOM.js";
import { flattenAll } from "../data/costAnalysis.js";

const KRW = new Intl.NumberFormat("en-US");

export function CategoryDetailPage() {
  const { slug } = useParams();
  const category = useMemo(() => findCategory(slug), [slug]);

  if (!category) {
    return (
      <div className="text-center py-2xl text-text-secondary">
        Category not found.
      </div>
    );
  }

  const group = STRATEGY_GROUPS[category.group];
  const suppliers = category.suppliers
    .map((id) => findSupplier(id))
    .filter(Boolean);
  const items = flattenAll().filter((it) => category.items.includes(it.id));

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Categories", to: "/categories" },
          { label: category.name },
        ]}
        title={category.name}
        description={category.description}
        actions={
          <Link
            to="/categories"
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        }
      />

      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <div className="flex flex-wrap items-start justify-between gap-lg">
          <div className="flex items-center gap-md">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${group.color}15` }}
            >
              <Shield size={22} style={{ color: group.color }} />
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-wide font-bold"
                style={{ color: group.color }}
              >
                {group.label}
              </p>
              <p className="text-h5 mt-2xs">{group.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            <HeroStat
              icon={Package}
              label="Items"
              value={`${category.itemCount}`}
            />
            <HeroStat
              icon={Building2}
              label="Suppliers"
              value={`${category.supplierCount}`}
            />
            <HeroStat
              icon={TrendingUp}
              label="2025 Spend"
              value={`₩${KRW.format(Math.round(category.spendKRW2025 / 1_000_000))}M`}
            />
            <HeroStat
              icon={ShieldCheck}
              label="On-Time"
              value={`${Math.round(category.onTimeRate * 100)}%`}
              tone={category.onTimeRate > 0.93 ? "success" : "warning"}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <SectionTitle>Sourcing Strategy</SectionTitle>
          <p className="text-sm mt-sm">{category.sourcingStrategy}</p>

          <SectionTitle className="mt-lg">Rules</SectionTitle>
          <ul className="mt-sm divide-y divide-border border border-border rounded-lg">
            {category.rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-sm px-md py-sm">
                {rule.type === "mandatory" ? (
                  <AlertCircle
                    size={14}
                    className="shrink-0 mt-2xs"
                    style={{ color: "var(--color-error-main)" }}
                  />
                ) : (
                  <Check
                    size={14}
                    className="shrink-0 mt-2xs"
                    style={{ color: "var(--color-info-main)" }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm">{rule.label}</p>
                  <p
                    className="text-[10px] uppercase tracking-wide font-semibold mt-2xs"
                    style={{
                      color:
                        rule.type === "mandatory"
                          ? "var(--color-error-main)"
                          : "var(--color-info-main)",
                    }}
                  >
                    {rule.type === "mandatory" ? "Must apply" : "Guideline"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <SectionTitle>Onboarding Requirements</SectionTitle>
          <ul className="mt-sm flex flex-wrap gap-xs">
            {category.onboardingRequirements.map((r) => (
              <li
                key={r}
                className="inline-flex items-center gap-xs text-xs font-semibold px-sm py-2xs rounded-sm border"
                style={{ borderColor: "var(--color-border-primary)" }}
              >
                <Check size={11} style={{ color: "var(--color-success-main)" }} />
                {r}
              </li>
            ))}
          </ul>

          <SectionTitle className="mt-lg">Downstream Process Impact</SectionTitle>
          <ul className="mt-sm space-y-sm">
            {category.downstreamImpact.map((d, i) => (
              <li key={i} className="flex items-start gap-sm text-sm">
                <ArrowRight
                  size={12}
                  className="shrink-0 mt-2xs text-text-secondary"
                />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
          <SectionTitle>Position</SectionTitle>
          <div className="mt-md">
            <PositionBar
              label="Buyer Power"
              value={category.position.buyerPower}
              color="var(--color-primary-main)"
            />
            <PositionBar
              label="Supplier Power"
              value={category.position.supplierPower}
              color="var(--color-error-main)"
            />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border">
            <SectionTitle className="!mb-0">Active Suppliers</SectionTitle>
          </div>
          <ul className="divide-y divide-border">
            {suppliers.length === 0 ? (
              <li className="px-lg py-md text-sm text-text-secondary italic">
                No suppliers linked yet.
              </li>
            ) : (
              suppliers.map((s) => (
                <li key={s.id}>
                  <Link
                    to={`/suppliers/${s.id}`}
                    className="flex items-center gap-sm px-lg py-md hover:bg-surface-container-secondary transition-colors duration-fast group"
                  >
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-text-inverse text-xs font-bold shrink-0"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.logo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-2xs">
                        {s.region} · PPAP {Math.round(s.ppapPassRate * 100)}% ·
                        On-Time {Math.round(s.onTimeRate * 100)}%
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
                    />
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
          <div className="p-lg border-b border-border">
            <SectionTitle className="!mb-0">Related Items</SectionTitle>
          </div>
          <ul className="divide-y divide-border">
            {items.length === 0 ? (
              <li className="px-lg py-md text-sm text-text-secondary italic">
                No items linked yet.
              </li>
            ) : (
              items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-sm px-lg py-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-text-secondary">
                      {it.code}
                    </p>
                    <p className="text-sm font-semibold mt-2xs truncate">
                      {it.name}
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary font-mono tabular-nums whitespace-nowrap">
                    ₩{KRW.format(it.unitPrice ?? 0)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </>
  );
}

function PositionBar({ label, value, color }) {
  return (
    <div className="mb-sm">
      <div className="flex items-center justify-between text-xs mb-2xs">
        <span className="font-semibold">{label}</span>
        <span className="font-mono tabular-nums text-text-secondary">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ backgroundColor: "var(--color-border-secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-normal"
          style={{ width: `${value * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function HeroStat({ label, value, icon: Icon, tone }) {
  const color =
    tone === "success"
      ? "var(--color-success-main)"
      : tone === "warning"
        ? "var(--color-warning-main)"
        : "var(--color-text-primary)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold inline-flex items-center gap-2xs">
        {Icon && <Icon size={11} />} {label}
      </p>
      <p
        className="text-h4 mt-2xs font-bold"
        style={{ color, letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm ${className}`}
    >
      {children}
    </h3>
  );
}
