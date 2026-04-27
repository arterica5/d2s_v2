import { useMemo } from "react";
import {
  FileText,
  Send,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { PAST_CHANGES } from "../data/mockChangeRequests.js";
import { RFX_LIST } from "../data/mockSourcing.js";
import { OPEN_RISKS, MILESTONES } from "../data/mockAPQP.js";
import { BOM_META } from "../data/mockBOM.js";

const ICON_MAP = {
  change: FileText,
  rfx: Send,
  award: Award,
  risk: AlertTriangle,
  milestone: Clock,
  bom: GitBranch,
};

const TONE_MAP = {
  change: "var(--color-info-main)",
  rfx: "var(--color-info-main)",
  award: "var(--color-success-main)",
  risk: "var(--color-error-main)",
  milestone: "var(--color-warning-main)",
  bom: "var(--color-primary-main)",
};

function buildFullFeed() {
  const items = [];
  PAST_CHANGES.forEach((c) => {
    items.push({
      kind: "change",
      date: c.submittedAt,
      title: c.title,
      meta: `${c.id} · ${c.submittedBy} · ${c.status}`,
    });
  });
  RFX_LIST.forEach((r) => {
    items.push({
      kind: "rfx",
      date: r.createdAt,
      title: `${r.type.toUpperCase()} created — ${r.title}`,
      meta: `${r.id} · ${r.owner} · ${r.status}`,
    });
    if (r.awardedAt) {
      items.push({
        kind: "award",
        date: r.awardedAt,
        title: `Awarded ${r.awardedSupplier} — ${r.title}`,
        meta: r.id,
      });
    }
  });
  OPEN_RISKS.forEach((r) => {
    items.push({
      kind: "risk",
      date: r.openedAt,
      title: r.title,
      meta: `${r.id} · severity ${r.severity} · ${r.owner}`,
    });
  });
  MILESTONES.filter((m) => m.status === "done").forEach((m) => {
    items.push({
      kind: "milestone",
      date: m.due,
      title: `Milestone done — ${m.label}`,
      meta: `Phase ${m.phase}`,
    });
  });
  items.push({
    kind: "bom",
    date: "2026-04-22",
    title: `BOM ${BOM_META.currentVersion} published`,
    meta: `Diff vs ${BOM_META.previousVersion}`,
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function ProjectActivityPage() {
  const feed = useMemo(() => buildFullFeed(), []);

  return (
    <>
      <PageHeader
        title="Activity"
        description="Everything that's moved on this project — change requests, RFx, awards, risks, milestones, and BOM revisions."
      />

      <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <ol className="divide-y divide-border">
          {feed.map((item, i) => {
            const Icon = ICON_MAP[item.kind] ?? FileText;
            const color = TONE_MAP[item.kind] ?? "var(--color-text-secondary)";
            return (
              <li key={i} className="flex items-start gap-md px-lg py-md">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-text-secondary mt-2xs">
                    {item.meta}
                  </p>
                </div>
                <span className="text-xs text-text-secondary font-mono whitespace-nowrap">
                  {item.date}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
