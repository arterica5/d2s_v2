import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Mail,
  Calendar,
  Building2,
  Shield,
  MessageSquare,
  TrendingUp,
  Package,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Award,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import {
  findSupplier,
  SUPPLIER_TIERS,
  SUPPLIERS,
} from "../data/mockSuppliers.js";
import { BOM_NODES } from "../data/mockBOM.js";
import { RFX_LIST, RFX_STATUS } from "../data/mockSourcing.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";

const KRW = new Intl.NumberFormat("en-US");

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Items Supplied" },
  { id: "activity", label: "Activity" },
  { id: "certifications", label: "Certifications & Roles" },
];

function findBomItems(ids) {
  const result = [];
  const walk = (nodes) => {
    for (const n of nodes) {
      if (ids.includes(n.id)) result.push(n);
      if (n.children) walk(n.children);
    }
  };
  walk(BOM_NODES);
  return result;
}

export function SupplierDetailPage() {
  const { supplierId } = useParams();
  const supplier = useMemo(() => findSupplier(supplierId), [supplierId]);
  const [tab, setTab] = useState("overview");
  const { open: openCollab } = useCollaboration();

  if (!supplier) {
    return (
      <div className="text-center py-2xl text-text-secondary">
        Supplier not found.
      </div>
    );
  }

  const tierMeta = SUPPLIER_TIERS[supplier.tier];
  const suppliedItems = findBomItems(supplier.items);
  const relatedRfx = RFX_LIST.filter((r) =>
    supplier.activeRfx.includes(r.id),
  );
  const allRfx = RFX_LIST.filter((r) =>
    r.quotes.some((q) => q.supplier === supplier.name),
  );

  return (
    <>
      <PageHeader
        breadcrumbs={["Suppliers", supplier.name]}
        title={supplier.name}
        description={`${supplier.type} · ${supplier.categories.join(" · ")}`}
        actions={
          <>
            <Link
              to="/suppliers"
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <ArrowLeft size={14} /> Back
            </Link>
            <button
              onClick={() =>
                openCollab({
                  channel: "sourcing",
                  anchor: {
                    type: "supplier",
                    id: supplier.id,
                    label: supplier.name,
                  },
                })
              }
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <MessageSquare size={14} /> Discuss
            </button>
          </>
        }
      />

      {/* Hero */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <div className="flex flex-wrap items-start gap-lg">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-text-inverse font-bold text-h4 shrink-0"
            style={{ backgroundColor: supplier.color }}
          >
            {supplier.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-sm flex-wrap">
              <h2 className="text-h3">{supplier.name}</h2>
              <span
                className="text-[10px] uppercase tracking-wide font-bold px-sm py-2xs rounded-sm"
                style={{
                  color: tierMeta.color,
                  backgroundColor: `${tierMeta.color}15`,
                }}
              >
                {tierMeta.label}
              </span>
              <span className="text-xs text-text-secondary">
                Partner since {supplier.relationshipSince}
              </span>
            </div>
            <div className="flex items-center gap-lg mt-sm text-sm text-text-secondary flex-wrap">
              <span className="inline-flex items-center gap-xs">
                <MapPin size={13} /> {supplier.hq}
              </span>
              <span className="inline-flex items-center gap-xs">
                <Building2 size={13} /> {supplier.type}
              </span>
              <span className="inline-flex items-center gap-xs">
                <Mail size={13} /> {supplier.contact.name} · {supplier.contact.email}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            <HeroStat
              label="Score"
              value={supplier.performance.toFixed(1)}
              icon={Star}
              tone="primary"
            />
            <HeroStat
              label="On-Time"
              value={`${Math.round(supplier.onTimeRate * 100)}%`}
              tone={
                supplier.onTimeRate > 0.94
                  ? "success"
                  : supplier.onTimeRate > 0.9
                    ? "info"
                    : "warning"
              }
            />
            <HeroStat
              label="Defect PPM"
              value={`${supplier.defectPpm}`}
              tone={
                supplier.defectPpm < 30
                  ? "success"
                  : supplier.defectPpm < 100
                    ? "info"
                    : "warning"
              }
            />
            <HeroStat
              label="PPAP Pass"
              value={`${Math.round(supplier.ppapPassRate * 100)}%`}
              tone={supplier.ppapPassRate > 0.95 ? "success" : "info"}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="flex gap-xs border-b border-border mb-lg">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-md py-sm text-sm font-semibold transition-colors duration-fast ${
                active
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              style={
                active
                  ? { boxShadow: `inset 0 -2px 0 var(--color-primary-main)` }
                  : undefined
              }
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === "overview" && (
        <OverviewTab
          supplier={supplier}
          suppliedItems={suppliedItems}
          relatedRfx={relatedRfx}
          allRfx={allRfx}
        />
      )}
      {tab === "items" && (
        <ItemsTab items={suppliedItems} supplier={supplier} />
      )}
      {tab === "activity" && <ActivityTab supplier={supplier} allRfx={allRfx} />}
      {tab === "certifications" && <CertificationsTab supplier={supplier} />}
    </>
  );
}

/* ───────────────────── Overview ───────────────────── */

function OverviewTab({ supplier, suppliedItems, relatedRfx, allRfx }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      <section className="lg:col-span-2 bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <SectionTitle>Active Engagement</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
          <Stat
            icon={FileText}
            label="Contracts Active"
            value={`${supplier.contractsActive}`}
          />
          <Stat
            icon={Package}
            label="Items Supplied"
            value={`${suppliedItems.length}`}
          />
          <Stat
            icon={Award}
            label="Awards Won"
            value={`${allRfx.filter((r) => r.awardedSupplier === supplier.name).length}`}
          />
        </div>

        <SectionTitle>Open RFx</SectionTitle>
        {relatedRfx.length === 0 ? (
          <EmptyHint text="No open RFx." />
        ) : (
          <ul className="divide-y divide-border border border-border rounded-lg">
            {relatedRfx.map((r) => {
              const statusMeta = RFX_STATUS[r.status];
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-md px-md py-sm hover:bg-surface-container-secondary transition-colors duration-fast"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-text-secondary">
                      {r.id}
                    </p>
                    <p className="text-sm font-semibold mt-2xs truncate">
                      {r.title}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm"
                    style={{
                      color: statusMeta.color,
                      backgroundColor: `${statusMeta.color}15`,
                    }}
                  >
                    {statusMeta.label}
                  </span>
                  <Link
                    to={`/projects/ev-model-x/sourcing/rfx/${r.id}`}
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary-main)" }}
                  >
                    Open →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <SectionTitle>Relationship</SectionTitle>
        <DataCard>
          <DataRow
            icon={Building2}
            label="Type"
            value={supplier.type}
          />
          <DataRow
            icon={MapPin}
            label="HQ"
            value={supplier.hq}
          />
          <DataRow
            icon={Calendar}
            label="Partner Since"
            value={supplier.relationshipSince}
          />
          <DataRow
            icon={TrendingUp}
            label="2025 Spend"
            value={`₩${KRW.format(supplier.revenueKRW2025)}`}
          />
          <DataRow
            icon={Shield}
            label="Certifications"
            value={`${supplier.certifications.length} active`}
          />
        </DataCard>
      </section>
    </div>
  );
}

/* ───────────────────── Items tab ───────────────────── */

function ItemsTab({ items, supplier }) {
  if (items.length === 0)
    return (
      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <EmptyHint text="This supplier is not assigned to any BOM item yet." />
      </div>
    );
  return (
    <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-text-secondary border-b border-border">
            <Th>Item</Th>
            <Th className="text-right">Qty</Th>
            <Th className="text-right">Unit Price</Th>
            <Th className="text-right">Target</Th>
            <Th>PPAP</Th>
            <Th>Project</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr
              key={it.id}
              className="border-b border-border text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <td className="px-md py-sm">
                <p className="font-mono text-xs text-text-secondary">{it.code}</p>
                <p className="text-sm font-semibold mt-2xs">{it.name}</p>
              </td>
              <td className="px-md py-sm text-right font-mono tabular-nums">
                {it.qty} {it.uom}
              </td>
              <td className="px-md py-sm text-right font-mono tabular-nums">
                ₩{KRW.format(it.unitPrice ?? 0)}
              </td>
              <td className="px-md py-sm text-right font-mono tabular-nums text-text-secondary">
                ₩{KRW.format(it.targetCost ?? 0)}
              </td>
              <td className="px-md py-sm">
                <PpapDot status={it.ppapStatus} />
              </td>
              <td className="px-md py-sm text-xs text-text-secondary">
                EV Model X
              </td>
              <td className="px-md py-sm text-right">
                <Link
                  to={`/projects/ev-model-x/bom`}
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-primary-main)" }}
                >
                  View in BOM →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PpapDot({ status }) {
  const color = {
    approved: "var(--color-success-main)",
    review: "var(--color-warning-main)",
    pending: "var(--color-warning-main)",
    inprogress: "var(--color-info-main)",
    notstarted: "var(--color-text-disabled)",
  }[status] ?? "var(--color-text-disabled)";
  const label = {
    approved: "Approved",
    review: "Under Review",
    pending: "Pending",
    inprogress: "In Progress",
    notstarted: "Not Started",
  }[status] ?? status;
  return (
    <span className="inline-flex items-center gap-xs text-xs">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

/* ───────────────────── Activity tab ───────────────────── */

function ActivityTab({ supplier, allRfx }) {
  const events = [
    ...supplier.recentActivity.map((e) => ({ ...e, type: "activity" })),
    ...allRfx.map((r) => ({
      date: r.createdAt,
      label: `Invited to ${r.id} · ${r.title}`,
      type: "rfx",
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (events.length === 0)
    return (
      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <EmptyHint text="No recent activity." />
      </div>
    );
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
      <ol className="space-y-md">
        {events.map((e, i) => (
          <li key={i} className="flex gap-md">
            <div className="flex flex-col items-center">
              <span
                className="w-2 h-2 rounded-full mt-2xs"
                style={{
                  backgroundColor:
                    e.type === "rfx"
                      ? "var(--color-info-main)"
                      : "var(--color-primary-main)",
                }}
              />
              {i < events.length - 1 && (
                <span
                  className="w-px flex-1 mt-2xs"
                  style={{ backgroundColor: "var(--color-border-primary)" }}
                />
              )}
            </div>
            <div className="flex-1 pb-md">
              <p className="text-xs text-text-secondary">{e.date}</p>
              <p className="text-sm mt-2xs">{e.label}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────── Certifications tab ───────────────────── */

function CertificationsTab({ supplier }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <SectionTitle>Certifications</SectionTitle>
        <ul className="divide-y divide-border border border-border rounded-lg">
          {supplier.certifications.map((c) => (
            <li
              key={c}
              className="flex items-center gap-sm px-md py-sm"
            >
              <CheckCircle2
                size={14}
                style={{ color: "var(--color-success-main)" }}
              />
              <span className="text-sm">{c}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
        <SectionTitle>Roles</SectionTitle>
        <div className="flex flex-wrap gap-xs">
          {supplier.roles.map((r) => (
            <span
              key={r}
              className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm"
              style={{
                color: "var(--color-primary-dark)",
                backgroundColor: "var(--color-primary-light)",
              }}
            >
              {r}
            </span>
          ))}
        </div>
        <SectionTitle className="mt-lg">Categories</SectionTitle>
        <div className="flex flex-wrap gap-xs">
          {supplier.categories.map((c) => (
            <span
              key={c}
              className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm border"
              style={{ borderColor: "var(--color-border-primary)" }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────────────────── Atoms ───────────────────── */

function SectionTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm ${className}`}
    >
      {children}
    </h3>
  );
}

function DataCard({ children }) {
  return (
    <div className="border border-border rounded-lg divide-y divide-border">
      {children}
    </div>
  );
}

function DataRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-md px-md py-sm">
      {Icon && (
        <Icon size={14} className="text-text-secondary mt-2xs shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm mt-2xs truncate">{value}</p>
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
        : tone === "info"
          ? "var(--color-info-main)"
          : tone === "primary"
            ? "var(--color-primary-main)"
            : "var(--color-text-primary)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p
        className="text-h4 mt-2xs font-bold inline-flex items-center gap-2xs"
        style={{ color, letterSpacing: "-0.01em" }}
      >
        {Icon && <Icon size={14} />}
        {value}
      </p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="p-md rounded-lg border border-border">
      <div className="flex items-center gap-xs text-xs text-text-secondary">
        {Icon && <Icon size={12} />} {label}
      </div>
      <p className="text-h4 font-bold mt-2xs" style={{ letterSpacing: "-0.01em" }}>
        {value}
      </p>
    </div>
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

function EmptyHint({ text }) {
  return (
    <div className="text-sm text-text-secondary italic py-md text-center">
      {text}
    </div>
  );
}
