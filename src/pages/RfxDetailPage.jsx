import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Download,
  Users,
  Calendar,
  Target,
  Award,
  Check,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Package,
  Star,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { BOM_META } from "../data/mockBOM.js";
import { findRfx, RFX_STATUS, RFX_TYPES } from "../data/mockSourcing.js";
import { useCollaboration } from "../context/CollaborationContext.jsx";

const KRW = new Intl.NumberFormat("en-US");

export function RfxDetailPage() {
  const { projectId, rfxId } = useParams();
  const rfx = useMemo(() => findRfx(rfxId), [rfxId]);
  const { open: openCollab } = useCollaboration();

  if (!rfx) {
    return (
      <div className="text-center py-2xl text-text-secondary">
        RFx not found.
      </div>
    );
  }

  const statusMeta = RFX_STATUS[rfx.status];
  const typeMeta = RFX_TYPES[rfx.type];
  const sortedQuotes = [...rfx.quotes].sort((a, b) => a.price - b.price);
  const bestPrice = sortedQuotes[0]?.price ?? null;
  const awardedQuote = rfx.quotes.find((q) => q.awarded);

  return (
    <>
      <PageHeader
        breadcrumbs={["Projects", BOM_META.projectName, "Sourcing", rfx.id]}
        title={rfx.title}
        description={rfx.scope}
        actions={
          <>
            <Link
              to={`/projects/${projectId}/sourcing`}
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-secondary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast"
            >
              <ArrowLeft size={14} /> Back
            </Link>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={14} /> Export
            </button>
            {rfx.status !== "awarded" && rfx.status !== "cancelled" && (
              <button
                className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
                style={{ backgroundColor: "var(--color-primary-main)" }}
              >
                <Award size={14} /> Award
              </button>
            )}
          </>
        }
      />

      {/* RFx meta card */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 p-lg mb-xl">
        <div className="flex flex-wrap items-start justify-between gap-lg">
          <div className="flex flex-wrap items-center gap-md">
            <span
              className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm"
              style={{
                color: statusMeta.color,
                backgroundColor: `${statusMeta.color}15`,
              }}
            >
              {statusMeta.label}
            </span>
            <span
              className="text-[10px] uppercase tracking-wide font-bold px-xs rounded-sm"
              style={{
                color: "var(--color-primary-dark)",
                backgroundColor: "var(--color-primary-light)",
              }}
            >
              {typeMeta.label}
            </span>
            <MetaPair
              icon={Package}
              label="Item"
              value={`${rfx.itemCode} · ${rfx.itemName}`}
            />
            <MetaPair icon={Users} label="Owner" value={rfx.owner} />
            <MetaPair
              icon={Users}
              label="Responses"
              value={`${rfx.responses} / ${rfx.invitees}`}
            />
            <MetaPair
              icon={Calendar}
              label="Due"
              value={rfx.dueDate}
            />
            <MetaPair
              icon={Target}
              label="Target"
              value={`₩${KRW.format(rfx.targetCost)}`}
            />
          </div>
        </div>
      </section>

      {/* Award banner if applicable */}
      {awardedQuote && (
        <section
          className="rounded-xl p-lg mb-xl flex items-center gap-md"
          style={{
            backgroundColor: "rgba(0, 153, 85, 0.08)",
            border: `1px solid var(--color-success-main)`,
          }}
        >
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--color-success-main)" }}
          >
            <Award size={20} style={{ color: "var(--color-primary-contrast)" }} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--color-success-dark)" }}>
              Awarded
            </p>
            <p className="text-h5 mt-2xs">
              {awardedQuote.supplier} — ₩{KRW.format(awardedQuote.price)}
            </p>
            {rfx.awardedAt && (
              <p className="text-xs text-text-secondary mt-2xs">
                Awarded on {rfx.awardedAt}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Quote comparison table */}
      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <div className="p-md border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
            Quote Comparison ({sortedQuotes.length})
          </h3>
          <span className="text-xs text-text-secondary">
            Sorted by price (ascending) · Best in green
          </span>
        </div>

        {sortedQuotes.length === 0 ? (
          <div className="text-center py-2xl text-sm text-text-secondary">
            No quotes received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-text-secondary border-b border-border">
                  <Th>Supplier</Th>
                  <Th className="text-right">Unit Price</Th>
                  <Th className="text-right">vs Target</Th>
                  <Th>Lead</Th>
                  <Th className="text-right">MOQ</Th>
                  <Th>PPAP</Th>
                  <Th>Score</Th>
                  <Th>Payment</Th>
                  <Th>Valid Until</Th>
                  <Th>Notes</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {sortedQuotes.map((q) => (
                  <QuoteRow
                    key={q.supplier}
                    quote={q}
                    targetCost={rfx.targetCost}
                    isBest={q.price === bestPrice}
                    isAwarded={q.awarded}
                    onDiscuss={() =>
                      openCollab({
                        channel: "sourcing",
                        anchor: {
                          type: "bom-item",
                          id: rfx.itemId,
                          label: `${rfx.id} · ${q.supplier}`,
                        },
                      })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-md py-sm text-xs text-text-secondary border-t border-border bg-surface-container-secondary">
          <span className="font-semibold mr-md">Legend:</span>
          <span className="inline-flex items-center gap-xs mr-md">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--color-success-main)" }}
            />
            Lowest price
          </span>
          <span className="inline-flex items-center gap-xs mr-md">
            <Check size={11} style={{ color: "var(--color-primary-main)" }} />
            Recommended
          </span>
          <span className="inline-flex items-center gap-xs">
            <Award size={11} style={{ color: "var(--color-success-main)" }} />
            Awarded
          </span>
        </div>
      </section>
    </>
  );
}

function QuoteRow({ quote, targetCost, isBest, isAwarded, onDiscuss }) {
  const vsTarget = quote.price - targetCost;
  const vsPct = targetCost ? (vsTarget / targetCost) * 100 : 0;
  const leaderStyle = isAwarded
    ? {
        backgroundColor: "rgba(0, 153, 85, 0.06)",
        borderLeft: `3px solid var(--color-success-main)`,
      }
    : isBest
      ? {
          borderLeft: `3px solid var(--color-success-main)`,
        }
      : undefined;
  return (
    <tr
      className="border-b border-border text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
      style={leaderStyle}
    >
      <td className="px-md py-md min-w-[200px]">
        <div className="flex items-center gap-sm">
          <div className="min-w-0">
            <div className="flex items-center gap-xs">
              <span className="font-semibold">{quote.supplier}</span>
              {isAwarded && (
                <Award
                  size={13}
                  style={{ color: "var(--color-success-main)" }}
                />
              )}
              {quote.recommended && !isAwarded && (
                <Check size={13} style={{ color: "var(--color-primary-main)" }} />
              )}
            </div>
            <p className="text-xs text-text-secondary mt-2xs inline-flex items-center gap-xs">
              <MapPin size={11} /> {quote.region}
              <span className="mx-2xs">·</span>
              <Star size={11} /> {quote.score.toFixed(1)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-md py-md text-right font-mono tabular-nums">
        <span
          className={isBest ? "font-bold" : ""}
          style={
            isBest ? { color: "var(--color-success-dark)" } : undefined
          }
        >
          ₩{KRW.format(quote.price)}
        </span>
      </td>
      <td className="px-md py-md text-right">
        <span
          className="inline-flex flex-col items-end font-mono tabular-nums"
          style={{
            color:
              vsTarget > 0
                ? "var(--color-error-main)"
                : vsTarget < 0
                  ? "var(--color-success-main)"
                  : "var(--color-text-secondary)",
          }}
        >
          <span className="text-sm font-bold inline-flex items-center gap-2xs">
            {vsTarget > 0 ? <TrendingUp size={11} /> : vsTarget < 0 ? <TrendingDown size={11} /> : null}
            {vsTarget >= 0 ? "+" : ""}₩{KRW.format(vsTarget)}
          </span>
          <span className="text-[10px] font-semibold" style={{ opacity: 0.8 }}>
            {vsPct >= 0 ? "+" : ""}{vsPct.toFixed(1)}%
          </span>
        </span>
      </td>
      <td className="px-md py-md">
        <span className="inline-flex items-center gap-xs text-sm text-text-primary">
          <Clock size={12} className="text-text-secondary" />
          {quote.lead}
        </span>
      </td>
      <td className="px-md py-md text-right font-mono tabular-nums text-text-secondary">
        {quote.moq.toLocaleString()}
      </td>
      <td className="px-md py-md">
        <PpapChip ppap={quote.ppap} />
      </td>
      <td className="px-md py-md">
        <ScoreChip score={quote.score} />
      </td>
      <td className="px-md py-md text-xs text-text-secondary">
        {quote.paymentTerms}
      </td>
      <td className="px-md py-md text-xs text-text-secondary font-mono tabular-nums">
        {quote.validUntil}
      </td>
      <td className="px-md py-md text-xs text-text-secondary max-w-[260px]">
        {quote.notes ?? "—"}
      </td>
      <td className="px-md py-md text-right">
        <div className="inline-flex items-center gap-2xs">
          <button
            onClick={onDiscuss}
            aria-label="Discuss"
            title="Discuss quote"
            className="w-7 h-7 inline-flex items-center justify-center rounded-sm text-text-secondary hover:bg-surface-container-tertiary hover:text-text-primary transition-colors duration-fast"
          >
            <MessageSquare size={13} />
          </button>
          {!isAwarded && (
            <button
              title="Award this quote"
              className="inline-flex items-center gap-xs px-sm py-2xs rounded-sm text-xs font-semibold transition-colors duration-fast"
              style={{
                color: "var(--color-primary-main)",
                backgroundColor: "var(--color-primary-light)",
              }}
            >
              Award
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function PpapChip({ ppap }) {
  const p = ppap.toLowerCase();
  const color = p.includes("approved")
    ? "var(--color-success-main)"
    : p.includes("review")
      ? "var(--color-warning-main)"
      : p.includes("pending")
        ? "var(--color-warning-main)"
        : "var(--color-text-secondary)";
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm whitespace-nowrap"
      style={{ color, backgroundColor: `${color}15` }}
    >
      {ppap}
    </span>
  );
}

function ScoreChip({ score }) {
  const color =
    score >= 4.5
      ? "var(--color-success-main)"
      : score >= 4.0
        ? "var(--color-info-main)"
        : "var(--color-warning-main)";
  return (
    <span
      className="inline-flex items-center gap-xs text-xs font-semibold"
      style={{ color }}
    >
      <Star size={12} />
      {score.toFixed(1)}
    </span>
  );
}

function MetaPair({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-sm">
      <Icon size={14} className="text-text-secondary" />
      <div>
        <p className="text-[10px] uppercase tracking-wide text-text-secondary font-semibold">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
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
