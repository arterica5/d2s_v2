import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  ExternalLink,
  MessageSquare,
  FilePlus,
  Building2,
  FileText,
  Check,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Package,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { useItemDetail } from "../../context/ItemDetailContext.jsx";
import { useCollaboration } from "../../context/CollaborationContext.jsx";
import { getItemDetail } from "../../data/itemDetails.js";
import { BOM_META } from "../../data/mockBOM.js";
import { StatusBadge } from "../StatusBadge.jsx";

const KRW = new Intl.NumberFormat("en-US");

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "cost", label: "Cost" },
  { id: "sourcing", label: "Sourcing" },
  { id: "quality", label: "Quality" },
  { id: "history", label: "History" },
];

export function ItemDetailPanel() {
  const { activeItem, isOpen, close } = useItemDetail();
  const { open: openCollab } = useCollaboration();
  const closeOnNav = () => close();
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (activeItem) setTab("overview");
  }, [activeItem?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const detail = activeItem ? getItemDetail(activeItem) : null;

  return (
    <aside
      aria-label="Item 360"
      aria-hidden={!isOpen}
      className={`fixed top-gnb-h right-0 bottom-0 bg-surface-paper border-l border-border shadow-elevation-24 flex flex-col transition-transform duration-normal ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        width: "min(520px, 100vw)",
        zIndex: "calc(var(--z-drawer) - 1)",
      }}
    >
      {activeItem && detail && (
        <>
          <PanelHeader item={activeItem} onClose={close} />
          <PanelTabs tab={tab} onChange={setTab} />
          <div className="flex-1 overflow-y-auto">
            {tab === "overview" && (
              <OverviewTab
                item={activeItem}
                detail={detail}
                onDiscuss={() =>
                  openCollab({
                    channel: "design",
                    anchor: {
                      type: "bom-item",
                      id: activeItem.id,
                      label: `${activeItem.code} ${activeItem.name}`,
                    },
                  })
                }
                onNavigate={closeOnNav}
              />
            )}
            {tab === "cost" && <CostTab item={activeItem} detail={detail} />}
            {tab === "sourcing" && (
              <SourcingTab item={activeItem} detail={detail} />
            )}
            {tab === "quality" && (
              <QualityTab item={activeItem} detail={detail} />
            )}
            {tab === "history" && <HistoryTab detail={detail} />}
          </div>
        </>
      )}
    </aside>
  );
}

function PanelHeader({ item, onClose }) {
  return (
    <header className="p-lg border-b border-border">
      <div className="flex items-start justify-between gap-sm">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-secondary font-mono">{item.code}</p>
          <h2 className="text-h4 mt-2xs truncate">{item.name}</h2>
        </div>
        <div className="flex items-center gap-2xs">
          <button
            title="Open full page"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-text-secondary hover:bg-surface-container-secondary hover:text-text-primary transition-colors duration-fast"
          >
            <ExternalLink size={16} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 inline-flex items-center justify-center rounded-md text-text-secondary hover:bg-surface-container-secondary hover:text-text-primary transition-colors duration-fast"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function PanelTabs({ tab, onChange }) {
  return (
    <nav className="flex border-b border-border overflow-x-auto">
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative px-md py-sm text-sm font-semibold whitespace-nowrap transition-colors duration-fast ${
              active
                ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
            style={
              active
                ? {
                    boxShadow: `inset 0 -2px 0 var(--color-primary-main)`,
                  }
                : undefined
            }
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ───────────────────── Overview ───────────────────── */

function OverviewTab({ item, detail, onDiscuss, onNavigate }) {
  const costGap = (item.unitPrice ?? 0) - (item.targetCost ?? 0);
  return (
    <div className="p-lg space-y-lg">
      {/* Status row */}
      <div className="flex flex-wrap items-center gap-xs">
        <StatusBadge status={item.designStatus} label={`Design · ${labelOf(item.designStatus)}`} />
        <StatusBadge status={item.sourcingStatus} label={`Sourcing · ${labelOf(item.sourcingStatus)}`} />
        <StatusBadge status={item.ppapStatus} label={`PPAP · ${labelOf(item.ppapStatus)}`} />
        <RiskChip level={item.riskLevel} />
      </div>

      {/* Spec card */}
      <DataCard>
        <DataRow icon={FileText} label="Spec" value={detail.spec} />
        <DataRow icon={Package} label="Category" value={detail.category} />
        <DataRow
          icon={FileText}
          label="Drawing"
          value={`${detail.drawing} · ${detail.revision}`}
        />
      </DataCard>

      {/* Quantity + supplier */}
      <DataCard>
        <DataRow
          icon={Package}
          label="Quantity"
          value={`${item.qty} ${item.uom}`}
        />
        <DataRow
          icon={Building2}
          label="Current Supplier"
          value={item.supplier ?? "In-house"}
        />
        <DataRow
          icon={FileText}
          label="Buy Mode"
          value={item.buyMode ?? "—"}
        />
      </DataCard>

      {/* Cost snapshot */}
      <div className="grid grid-cols-3 gap-sm">
        <MiniStat label="Current" value={`₩${KRW.format(item.unitPrice ?? 0)}`} />
        <MiniStat label="Target" value={`₩${KRW.format(item.targetCost ?? 0)}`} muted />
        <MiniStat
          label="Gap"
          value={`${costGap >= 0 ? "+" : ""}₩${KRW.format(costGap)}`}
          tone={costGap > 0 ? "error" : costGap < 0 ? "success" : undefined}
          icon={costGap > 0 ? TrendingUp : costGap < 0 ? TrendingDown : Minus}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-sm">
        <button
          onClick={onDiscuss}
          className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
        >
          <MessageSquare size={14} /> Discuss
        </button>
        <Link
          to={`/projects/${BOM_META.projectId}/changes/new?item=${item.id}`}
          onClick={onNavigate}
          className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
          style={{ backgroundColor: "var(--color-primary-main)" }}
        >
          <FilePlus size={14} /> Request Change
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────── Cost ───────────────────── */

function CostTab({ item, detail }) {
  const breakdown = detail.costBreakdown;
  const total = breakdown.material + breakdown.labor + breakdown.overhead;
  const parts = [
    { key: "material", label: "Material", value: breakdown.material, color: "var(--color-primary-main)" },
    { key: "labor", label: "Labor", value: breakdown.labor, color: "var(--color-info-main)" },
    { key: "overhead", label: "Overhead", value: breakdown.overhead, color: "var(--color-warning-main)" },
  ];

  const maxHistory = Math.max(...detail.priceHistory.map((p) => p.price));

  return (
    <div className="p-lg space-y-xl">
      <section>
        <SectionTitle>Cost Breakdown</SectionTitle>
        <div className="bg-surface-container-secondary rounded-lg p-md">
          <div className="flex h-6 rounded-sm overflow-hidden">
            {parts.map((p) => (
              <div
                key={p.key}
                style={{
                  backgroundColor: p.color,
                  width: `${(p.value / total) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-sm mt-md">
            {parts.map((p) => (
              <div key={p.key}>
                <div className="flex items-center gap-xs">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-xs text-text-secondary">{p.label}</span>
                </div>
                <p className="text-sm font-bold font-mono mt-2xs">
                  ₩{KRW.format(p.value)}
                </p>
                <p className="text-xs text-text-secondary">
                  {Math.round((p.value / total) * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Price Trend</SectionTitle>
        <div className="bg-surface-container-secondary rounded-lg p-md">
          <div className="flex items-end justify-between gap-sm h-28">
            {detail.priceHistory.map((p) => {
              const h = Math.max(12, (p.price / maxHistory) * 100);
              return (
                <div key={p.version} className="flex-1 flex flex-col items-center gap-xs">
                  <div
                    className="w-full rounded-sm transition-all duration-normal"
                    style={{
                      height: `${h}%`,
                      backgroundColor: "var(--color-primary-main)",
                      opacity:
                        p.version === detail.priceHistory.at(-1).version
                          ? 1
                          : 0.4,
                    }}
                    title={`₩${KRW.format(p.price)}`}
                  />
                  <span className="text-xs text-text-secondary font-mono">
                    {p.version}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle>Should-Cost Reference</SectionTitle>
        <DataCard>
          <DataRow
            label="Current"
            value={`₩${KRW.format(item.unitPrice ?? 0)}`}
          />
          <DataRow
            label="Target"
            value={`₩${KRW.format(item.targetCost ?? 0)}`}
            muted
          />
          <DataRow
            label="Should Cost (clean-sheet)"
            value={`₩${KRW.format(total)}`}
            muted
          />
        </DataCard>
      </section>
    </div>
  );
}

/* ───────────────────── Sourcing ───────────────────── */

function SourcingTab({ detail }) {
  return (
    <div className="p-lg space-y-lg">
      <section>
        <SectionTitle>Supplier Candidates</SectionTitle>
        {detail.alternateSuppliers.length === 0 ? (
          <EmptyHint text="No supplier candidates yet." />
        ) : (
          <div className="flex flex-col gap-sm">
            {detail.alternateSuppliers.map((s) => (
              <SupplierCard key={s.name} supplier={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SupplierCard({ supplier }) {
  return (
    <div
      className="bg-surface-paper border rounded-lg p-md"
      style={{
        borderColor: supplier.selected
          ? "var(--color-primary-main)"
          : "var(--color-border-primary)",
        boxShadow: supplier.selected
          ? "0 0 0 3px var(--color-primary-focus)"
          : "none",
      }}
    >
      <div className="flex items-start justify-between gap-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-xs">
            <h4 className="text-sm font-semibold truncate">{supplier.name}</h4>
            {supplier.selected && (
              <span
                className="text-[10px] font-bold uppercase tracking-wide px-xs rounded-sm text-text-inverse"
                style={{ backgroundColor: "var(--color-primary-main)" }}
              >
                Selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-md mt-2xs text-xs text-text-secondary">
            <span className="inline-flex items-center gap-2xs">
              <MapPin size={11} /> {supplier.region}
            </span>
            <span className="inline-flex items-center gap-2xs">
              <Clock size={11} /> {supplier.lead}
            </span>
            <span className="inline-flex items-center gap-2xs">
              <Star size={11} /> {supplier.score.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold font-mono tabular-nums">
            ₩{KRW.format(supplier.price)}
          </p>
          <p className="text-xs text-text-secondary">MOQ {supplier.moq.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-sm pt-sm border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-secondary">PPAP: {supplier.ppap}</span>
        <button className="text-xs font-semibold text-primary-main hover:underline">
          Request quote
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── Quality ───────────────────── */

function QualityTab({ detail }) {
  return (
    <div className="p-lg space-y-lg">
      <section>
        <SectionTitle>PPAP Elements</SectionTitle>
        <div className="bg-surface-paper border border-border rounded-lg divide-y divide-border">
          {detail.ppapElements.map((el) => (
            <div
              key={el.id}
              className="flex items-center justify-between px-md py-sm"
            >
              <div className="flex items-center gap-sm min-w-0">
                <PpapIcon status={el.status} />
                <span className="text-sm truncate">{el.name}</span>
              </div>
              <StatusBadge status={el.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PpapIcon({ status }) {
  if (status === "approved")
    return (
      <Check
        size={16}
        className="shrink-0"
        style={{ color: "var(--color-success-main)" }}
      />
    );
  if (status === "review" || status === "pending" || status === "inprogress")
    return (
      <AlertCircle
        size={16}
        className="shrink-0"
        style={{ color: "var(--color-warning-main)" }}
      />
    );
  return (
    <AlertCircle
      size={16}
      className="shrink-0"
      style={{ color: "var(--color-text-disabled)" }}
    />
  );
}

/* ───────────────────── History ───────────────────── */

function HistoryTab({ detail }) {
  if (!detail.history.length) {
    return (
      <div className="p-lg">
        <EmptyHint text="No history yet." />
      </div>
    );
  }
  return (
    <ol className="p-lg space-y-md">
      {detail.history.map((h, idx) => (
        <li key={idx} className="flex gap-md">
          <div className="flex flex-col items-center">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            />
            {idx < detail.history.length - 1 && (
              <span
                className="w-px flex-1 mt-2xs"
                style={{ backgroundColor: "var(--color-border-primary)" }}
              />
            )}
          </div>
          <div className="flex-1 pb-md">
            <p className="text-xs text-text-secondary">{h.date}</p>
            <p className="text-sm font-semibold mt-2xs">{h.action}</p>
            <p className="text-xs text-text-secondary mt-2xs">
              {h.actor} · {h.role}
            </p>
            <p className="text-sm mt-xs">{h.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────── Shared bits ───────────────────── */

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-sm">
      {children}
    </h3>
  );
}

function DataCard({ children }) {
  return (
    <div className="bg-surface-paper border border-border rounded-lg divide-y divide-border">
      {children}
    </div>
  );
}

function DataRow({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-md px-md py-sm">
      {Icon && (
        <Icon
          size={14}
          className="text-text-secondary mt-2xs shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p
          className={`text-sm mt-2xs truncate ${muted ? "text-text-secondary" : "text-text-primary"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone, muted, icon: Icon }) {
  const color =
    tone === "error"
      ? "var(--color-error-main)"
      : tone === "success"
        ? "var(--color-success-main)"
        : muted
          ? "var(--color-text-secondary)"
          : "var(--color-text-primary)";
  return (
    <div className="bg-surface-container-secondary rounded-md p-sm">
      <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
        {label}
      </p>
      <p
        className="text-sm font-bold font-mono mt-2xs inline-flex items-center gap-2xs"
        style={{ color }}
      >
        {Icon && <Icon size={12} />}
        {value}
      </p>
    </div>
  );
}

function RiskChip({ level }) {
  const colors = {
    high: "var(--color-error-main)",
    medium: "var(--color-warning-main)",
    low: "var(--color-success-main)",
  };
  const color = colors[level] ?? "var(--color-text-secondary)";
  return (
    <span
      className="inline-flex items-center gap-xs text-xs font-semibold uppercase tracking-wide px-sm py-2xs rounded-sm"
      style={{ color, backgroundColor: `${color}15` }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      Risk {level}
    </span>
  );
}

function EmptyHint({ text }) {
  return (
    <div className="text-sm text-text-secondary italic py-md">{text}</div>
  );
}

function labelOf(status) {
  const MAP = {
    inprogress: "In Progress",
    completed: "Completed",
    blocked: "Blocked",
    pending: "Pending",
    notstarted: "Not Started",
    review: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
  };
  return MAP[status] ?? status;
}
