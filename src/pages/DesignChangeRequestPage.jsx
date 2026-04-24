import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  FilePlus2,
  AlertTriangle,
  Package,
  Building2,
  ShieldCheck,
  Calendar,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  Paperclip,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { BOM_META, BOM_NODES } from "../data/mockBOM.js";
import { getItemDetail } from "../data/itemDetails.js";
import {
  APPROVAL_PATHS,
  CHANGE_TYPES,
  PAST_CHANGES,
  URGENCY_LEVELS,
} from "../data/mockChangeRequests.js";

const KRW = new Intl.NumberFormat("en-US");

function findItemById(id, nodes = BOM_NODES) {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findItemById(id, n.children);
      if (found) return found;
    }
  }
  return null;
}

export function DesignChangeRequestPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefilledItemId = searchParams.get("item");

  const [itemId, setItemId] = useState(prefilledItemId ?? "A-121");
  const [type, setType] = useState("supplier");
  const [urgency, setUrgency] = useState("normal");
  const [reason, setReason] = useState("");
  const [proposedSupplier, setProposedSupplier] = useState(null);
  const [proposedQty, setProposedQty] = useState(null);
  const [proposedTarget, setProposedTarget] = useState(null);

  const item = useMemo(() => findItemById(itemId), [itemId]);
  const detail = useMemo(() => (item ? getItemDetail(item) : null), [item]);
  const alternates = detail?.alternateSuppliers ?? [];
  const selectedAlternate = alternates.find(
    (s) => s.name === proposedSupplier,
  );

  const impact = useMemo(() => {
    return computeImpact({
      type,
      item,
      detail,
      proposedSupplier: selectedAlternate,
      proposedQty,
      proposedTarget,
    });
  }, [type, item, detail, selectedAlternate, proposedQty, proposedTarget]);

  const approvers = APPROVAL_PATHS[type] ?? [];

  if (!item) {
    return (
      <div className="text-center py-2xl text-text-secondary">
        Item not found.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Projects", to: "/projects" },
          { label: BOM_META.projectName, to: `/projects/${BOM_META.projectId}` },
          { label: "BOM", to: `/projects/${BOM_META.projectId}/bom` },
          { label: "Request Change" },
        ]}
        title="Design Change Request"
        description={`New request for ${item.code} · ${item.name}`}
        actions={
          <>
            <button
              onClick={() => navigate(`/projects/${projectId}/bom`)}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <ArrowLeft size={14} /> Back to BOM
            </button>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Save size={14} /> Save Draft
            </button>
            <button
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <Send size={14} /> Submit for Review
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
        {/* Left: change details form (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-lg">
          <FormCard title="1. Change Type">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
              {CHANGE_TYPES.map((t) => (
                <TypeOption
                  key={t.id}
                  active={type === t.id}
                  onClick={() => setType(t.id)}
                  label={t.label}
                  description={t.description}
                />
              ))}
            </div>
          </FormCard>

          <FormCard title="2. Affected Item">
            <ItemSummary item={item} detail={detail} />
          </FormCard>

          <FormCard title="3. Proposed Change">
            {type === "supplier" && (
              <SupplierChangeForm
                item={item}
                alternates={alternates}
                selected={proposedSupplier}
                onSelect={setProposedSupplier}
              />
            )}
            {type === "qty" && (
              <QtyChangeForm
                item={item}
                value={proposedQty}
                onChange={setProposedQty}
              />
            )}
            {type === "cost" && (
              <CostChangeForm
                item={item}
                value={proposedTarget}
                onChange={setProposedTarget}
              />
            )}
            {type === "spec" && <SpecChangeForm item={item} />}
            {type === "add" && <AddItemForm />}
            {type === "remove" && <RemoveItemForm item={item} />}
          </FormCard>

          <FormCard title="4. Reason and Justification">
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this change needed? Reference simulations, quality issues, or cost pressure."
              className="w-full px-md py-sm rounded-md text-sm border border-border bg-surface-paper resize-none focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
            />
            <div className="flex items-center gap-md mt-sm">
              <button className="inline-flex items-center gap-xs text-xs text-text-secondary hover:text-text-primary transition-colors duration-fast">
                <Paperclip size={12} /> Attach documents
              </button>
              <span className="text-xs text-text-disabled">
                Drawings, sim reports, quality findings
              </span>
            </div>
          </FormCard>

          <FormCard title="5. Urgency">
            <div className="flex gap-sm flex-wrap">
              {URGENCY_LEVELS.map((u) => (
                <UrgencyChip
                  key={u.id}
                  urgency={u}
                  active={urgency === u.id}
                  onClick={() => setUrgency(u.id)}
                />
              ))}
            </div>
          </FormCard>
        </div>

        {/* Right: Impact Analysis (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <ImpactPanel impact={impact} />
          <ApprovalCard approvers={approvers} />
          <RecentChanges itemId={itemId} />
        </div>
      </div>
    </>
  );
}

/* ───────────────────── Impact Computation ───────────────────── */

function computeImpact({
  type,
  item,
  detail,
  proposedSupplier,
  proposedQty,
  proposedTarget,
}) {
  const qty = item.qty ?? 1;

  // Cost impact
  let costDelta = 0;
  let costNote = "No cost change";
  if (type === "supplier" && proposedSupplier) {
    costDelta = (proposedSupplier.price - item.unitPrice) * qty;
    costNote = `${proposedSupplier.name} @ ₩${KRW.format(proposedSupplier.price)} × ${qty}`;
  } else if (type === "qty" && proposedQty != null) {
    costDelta = item.unitPrice * (proposedQty - qty);
    costNote = `qty ${qty} → ${proposedQty} @ ₩${KRW.format(item.unitPrice)}`;
  } else if (type === "cost" && proposedTarget != null) {
    const gapNow = item.unitPrice - item.targetCost;
    const gapNew = item.unitPrice - proposedTarget;
    costDelta = gapNew - gapNow; // positive means wider gap
    costNote = `Target ₩${KRW.format(item.targetCost)} → ₩${KRW.format(proposedTarget)}`;
  } else if (type === "remove") {
    costDelta = -item.unitPrice * qty;
    costNote = `Remove from BOM saves ₩${KRW.format(item.unitPrice * qty)}`;
  } else if (type === "add") {
    costDelta = 0;
    costNote = "Enter unit price after supplier is chosen";
  } else if (type === "spec") {
    costDelta = 0;
    costNote = "Spec change may trigger requote";
  }

  // Sourcing
  let sourcingNote = "No sourcing impact";
  let sourcingSeverity = "info";
  if (type === "supplier") {
    if (proposedSupplier) {
      const isNewSupplier = proposedSupplier.name !== item.supplier;
      if (isNewSupplier) {
        sourcingNote = `New supplier requires contract + RFx reissue. Lead time: ${proposedSupplier.lead}.`;
        sourcingSeverity = "warning";
      } else {
        sourcingNote = "Supplier unchanged — no sourcing impact.";
      }
    } else {
      sourcingNote = "Select an alternate supplier to see impact.";
    }
  } else if (type === "add") {
    sourcingNote = "New item needs supplier selection and RFx.";
    sourcingSeverity = "warning";
  } else if (type === "remove") {
    sourcingNote = "Cancel open RFx / PO if any, notify current supplier.";
    sourcingSeverity = "warning";
  } else if (type === "spec") {
    sourcingNote = "Requote likely required from current supplier.";
    sourcingSeverity = "warning";
  }

  // Quality
  let qualityNote = "No PPAP resubmission";
  let qualitySeverity = "success";
  if (type === "supplier" && proposedSupplier) {
    if (proposedSupplier.ppap?.toLowerCase().includes("approved")) {
      qualityNote = `${proposedSupplier.name} carries approved PPAP — no new submission.`;
      qualitySeverity = "success";
    } else {
      qualityNote = `${proposedSupplier.name} requires Pre-PPAP + full PPAP.`;
      qualitySeverity = "error";
    }
  } else if (type === "spec") {
    qualityNote = "Spec change triggers PPAP element re-validation.";
    qualitySeverity = "warning";
  } else if (type === "add") {
    qualityNote = "New item requires full PPAP pack.";
    qualitySeverity = "warning";
  } else if (type === "qty") {
    qualityNote = "Qty change may require re-sampling plan.";
    qualitySeverity = "warning";
  }

  // Timeline
  let timelineNote = "No impact on phase gates";
  let timelineSeverity = "success";
  if (type === "supplier" && proposedSupplier) {
    if (proposedSupplier.name !== item.supplier) {
      const lead = parseInt(proposedSupplier.lead) || 0;
      timelineNote = `+${lead} wk lead time may delay Dev→SOP gate by 2 wks.`;
      timelineSeverity = "warning";
    }
  } else if (type === "add") {
    timelineNote = "Adds ~4 wk to design freeze and PPAP critical path.";
    timelineSeverity = "warning";
  } else if (type === "spec") {
    timelineNote = "Revalidation may add 1–2 wks to Dev phase.";
    timelineSeverity = "warning";
  }

  return {
    cost: {
      delta: costDelta,
      note: costNote,
      severity:
        costDelta > 0
          ? "error"
          : costDelta < 0
            ? "success"
            : "info",
    },
    sourcing: { note: sourcingNote, severity: sourcingSeverity },
    quality: { note: qualityNote, severity: qualitySeverity },
    timeline: { note: timelineNote, severity: timelineSeverity },
  };
}

/* ───────────────────── Form cards ───────────────────── */

function FormCard({ title, children }) {
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
      <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
        {title}
      </h3>
      {children}
    </section>
  );
}

function TypeOption({ active, onClick, label, description }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-md rounded-lg border transition-colors duration-fast"
      style={{
        borderColor: active
          ? "var(--color-primary-main)"
          : "var(--color-border-primary)",
        backgroundColor: active
          ? "var(--color-primary-light)"
          : "var(--color-bg-paper)",
        boxShadow: active ? "0 0 0 3px var(--color-primary-focus)" : "none",
      }}
    >
      <p
        className="text-sm font-semibold"
        style={{
          color: active ? "var(--color-primary-dark)" : "var(--color-text-primary)",
        }}
      >
        {label}
      </p>
      <p className="text-xs text-text-secondary mt-2xs">{description}</p>
    </button>
  );
}

function ItemSummary({ item, detail }) {
  return (
    <div className="flex items-start justify-between gap-lg">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-xs">
          <span className="font-mono text-xs text-text-secondary">{item.code}</span>
          <span className="text-[10px] text-text-secondary">·</span>
          <span className="text-xs text-text-secondary">
            {detail?.revision ?? "Rev. A"}
          </span>
        </div>
        <p className="text-h5 mt-2xs">{item.name}</p>
        <p className="text-sm text-text-secondary mt-2xs">{detail?.spec}</p>
        <div className="flex items-center gap-md mt-sm flex-wrap">
          <InfoBit icon={Package} text={`${item.qty} ${item.uom}`} />
          <InfoBit
            icon={Building2}
            text={item.supplier ?? "In-house"}
          />
          <InfoBit
            icon={DollarSign}
            text={`₩${KRW.format(item.unitPrice ?? 0)}`}
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2xs">
        <StatusBadge status={item.designStatus} label={`Design · ${labelOf(item.designStatus)}`} />
        <StatusBadge status={item.sourcingStatus} label={`Sourcing · ${labelOf(item.sourcingStatus)}`} />
        <StatusBadge status={item.ppapStatus} label={`PPAP · ${labelOf(item.ppapStatus)}`} />
      </div>
    </div>
  );
}

function InfoBit({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2xs text-xs text-text-secondary">
      <Icon size={12} /> {text}
    </span>
  );
}

/* ───────────────────── Proposed-change subforms ───────────────────── */

function SupplierChangeForm({ item, alternates, selected, onSelect }) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-sm">
        Current supplier: <b className="text-text-primary">{item.supplier ?? "In-house"}</b>. Pick an alternate below.
      </p>
      {alternates.length === 0 ? (
        <p className="text-sm text-text-disabled italic">
          No alternate suppliers on record — go to Sourcing to add candidates first.
        </p>
      ) : (
        <div className="flex flex-col gap-sm">
          {alternates
            .filter((s) => s.name !== item.supplier)
            .map((s) => (
              <SupplierOption
                key={s.name}
                supplier={s}
                selected={selected === s.name}
                onClick={() => onSelect(s.name)}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function SupplierOption({ supplier, selected, onClick }) {
  const delta = supplier.price;
  return (
    <button
      onClick={onClick}
      className="text-left p-md rounded-lg border transition-colors duration-fast"
      style={{
        borderColor: selected
          ? "var(--color-primary-main)"
          : "var(--color-border-primary)",
        backgroundColor: selected
          ? "var(--color-primary-light)"
          : "var(--color-bg-paper)",
        boxShadow: selected ? "0 0 0 3px var(--color-primary-focus)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{supplier.name}</p>
          <p className="text-xs text-text-secondary mt-2xs">
            {supplier.region} · Lead {supplier.lead} · Score {supplier.score.toFixed(1)} · PPAP {supplier.ppap}
          </p>
        </div>
        <p className="text-sm font-bold font-mono tabular-nums whitespace-nowrap">
          ₩{KRW.format(delta)}
        </p>
      </div>
    </button>
  );
}

function QtyChangeForm({ item, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-sm">
        Current qty: <b className="text-text-primary">{item.qty} {item.uom}</b>. Propose a new value:
      </p>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value) || null)}
        placeholder={`${item.qty}`}
        className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper w-32 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
      />
      <span className="ml-sm text-sm text-text-secondary">{item.uom}</span>
    </div>
  );
}

function CostChangeForm({ item, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-sm">
        Current target: <b className="text-text-primary">₩{KRW.format(item.targetCost ?? 0)}</b>. Propose a new target:
      </p>
      <div className="inline-flex items-center gap-2xs">
        <span className="text-sm text-text-secondary">₩</span>
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value) || null)}
          placeholder={`${item.targetCost ?? 0}`}
          className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper w-40 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast"
        />
      </div>
    </div>
  );
}

function SpecChangeForm({ item }) {
  return (
    <div>
      <p className="text-sm text-text-secondary mb-sm">
        Describe the spec revision — update drawing, dimension, or material.
      </p>
      <textarea
        rows={3}
        placeholder={`e.g. Change plate thickness on ${item.code} from 3 mm to 2.5 mm`}
        className="w-full px-md py-sm rounded-md text-sm border border-border bg-surface-paper resize-none focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
      />
    </div>
  );
}

function AddItemForm() {
  return (
    <div className="flex flex-col gap-sm">
      <input
        placeholder="New item code (e.g. A-114)"
        className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
      />
      <input
        placeholder="New item name"
        className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
      />
      <div className="flex gap-sm">
        <input
          placeholder="Qty"
          className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper w-24 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
        />
        <input
          placeholder="UOM"
          className="px-md py-sm rounded-md text-sm border border-border bg-surface-paper w-24 focus:outline-none focus:border-border-focus focus:shadow-focus transition-shadow duration-fast placeholder:text-text-disabled"
        />
      </div>
    </div>
  );
}

function RemoveItemForm({ item }) {
  return (
    <div
      className="p-md rounded-md border flex gap-sm"
      style={{
        borderColor: "var(--color-error-main)",
        backgroundColor: "rgba(211, 47, 47, 0.06)",
      }}
    >
      <AlertTriangle
        size={16}
        style={{ color: "var(--color-error-main)" }}
        className="shrink-0 mt-2xs"
      />
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--color-error-dark)" }}>
          Remove {item.code} {item.name} from BOM
        </p>
        <p className="text-xs text-text-secondary mt-2xs">
          Downstream effects on Sourcing BOM and Q-BOM will be reassessed during review.
        </p>
      </div>
    </div>
  );
}

function UrgencyChip({ urgency, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold border transition-colors duration-fast"
      style={{
        borderColor: active ? urgency.color : "var(--color-border-primary)",
        backgroundColor: active ? `${urgency.color}15` : "var(--color-bg-paper)",
        color: active ? urgency.color : "var(--color-text-primary)",
        boxShadow: active ? `0 0 0 3px ${urgency.color}15` : "none",
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: urgency.color }}
      />
      {urgency.label}
    </button>
  );
}

/* ───────────────────── Impact Panel ───────────────────── */

function ImpactPanel({ impact }) {
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <div className="p-lg border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          Impact Analysis
        </h3>
        <p className="text-xs text-text-secondary mt-2xs">
          Live summary as you fill in the change details.
        </p>
      </div>
      <div className="divide-y divide-border">
        <ImpactRow
          icon={DollarSign}
          title="Cost"
          severity={impact.cost.severity}
          value={
            impact.cost.delta === 0
              ? "No change"
              : `${impact.cost.delta > 0 ? "+" : ""}₩${KRW.format(impact.cost.delta)}`
          }
          trendIcon={
            impact.cost.delta > 0
              ? TrendingUp
              : impact.cost.delta < 0
                ? TrendingDown
                : null
          }
          note={impact.cost.note}
        />
        <ImpactRow
          icon={FilePlus2}
          title="Sourcing"
          severity={impact.sourcing.severity}
          note={impact.sourcing.note}
        />
        <ImpactRow
          icon={ShieldCheck}
          title="Quality"
          severity={impact.quality.severity}
          note={impact.quality.note}
        />
        <ImpactRow
          icon={Calendar}
          title="Timeline"
          severity={impact.timeline.severity}
          note={impact.timeline.note}
        />
      </div>
    </section>
  );
}

function ImpactRow({ icon: Icon, title, severity, value, trendIcon: TrendIcon, note }) {
  const severityColor = {
    success: "var(--color-success-main)",
    warning: "var(--color-warning-main)",
    error: "var(--color-error-main)",
    info: "var(--color-info-main)",
  }[severity];

  return (
    <div className="flex items-start gap-md p-lg">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${severityColor}15` }}
      >
        <Icon size={16} style={{ color: severityColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-sm">
          <p className="text-sm font-semibold">{title}</p>
          {value && (
            <p
              className="text-sm font-bold font-mono tabular-nums inline-flex items-center gap-2xs"
              style={{ color: severityColor }}
            >
              {TrendIcon && <TrendIcon size={12} />} {value}
            </p>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-2xs">{note}</p>
      </div>
    </div>
  );
}

/* ───────────────────── Approval Path ───────────────────── */

function ApprovalCard({ approvers }) {
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg">
      <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-md">
        <UserCheck size={12} className="inline-block mr-2xs mb-2xs" />
        Approval Path
      </h3>
      <ol className="space-y-sm">
        {approvers.map((role, i) => (
          <li key={role} className="flex items-center gap-sm">
            <span
              className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-text-inverse shrink-0"
              style={{ backgroundColor: "var(--color-primary-main)", opacity: 1 - i * 0.12 }}
            >
              {i + 1}
            </span>
            <span className="text-sm">{role}</span>
            {i === 0 && (
              <span
                className="ml-auto text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
                style={{
                  color: "var(--color-info-dark)",
                  backgroundColor: "rgba(21, 101, 224, 0.12)",
                }}
              >
                First in line
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────── Recent Changes ───────────────────── */

function RecentChanges({ itemId }) {
  const related = PAST_CHANGES.filter((c) => c.itemId === itemId);
  const rest = PAST_CHANGES.filter((c) => c.itemId !== itemId).slice(0, 3);
  const show = [...related, ...rest].slice(0, 4);
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <div className="p-lg border-b border-border">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          Recent Changes
        </h3>
        <p className="text-xs text-text-secondary mt-2xs">
          Related requests for context and deduping.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {show.map((c) => (
          <li key={c.id} className="flex items-start gap-sm px-lg py-md">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-bg-container-secondary)" }}
            >
              {c.status === "approved" && (
                <CheckCircle2 size={12} style={{ color: "var(--color-success-main)" }} />
              )}
              {c.status === "review" && (
                <Clock size={12} style={{ color: "var(--color-warning-main)" }} />
              )}
              {c.status === "rejected" && (
                <AlertTriangle size={12} style={{ color: "var(--color-error-main)" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-xs">
                <span className="font-mono text-[10px] text-text-secondary">{c.id}</span>
                {c.itemId === itemId && (
                  <span
                    className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
                    style={{
                      color: "var(--color-primary-dark)",
                      backgroundColor: "var(--color-primary-light)",
                    }}
                  >
                    This item
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold mt-2xs truncate">{c.title}</p>
              <p className="text-xs text-text-secondary mt-2xs">
                {c.submittedBy} · {c.submittedAt} ·{" "}
                {c.costImpact === 0
                  ? "no cost impact"
                  : `${c.costImpact > 0 ? "+" : ""}₩${KRW.format(c.costImpact)}`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────── utility ───────────────────── */

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
