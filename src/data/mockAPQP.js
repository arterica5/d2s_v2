/**
 * Mock APQP data — phases, milestones, per-item PPAP element status,
 * S-BOM ↔ Q-BOM sync gaps, and open quality risks for the QM persona.
 * Per 03_bom-product-definition.md, APQP is project-scoped and drives
 * the PPAP gate that blocks release to production.
 */

export const APQP_PHASES = [
  {
    id: "plan",
    name: "Plan & Define",
    description: "Voice of the customer, program deliverables.",
    status: "done",
    milestones: 3,
    completedMilestones: 3,
  },
  {
    id: "design",
    name: "Product Design & Dev",
    description: "DFMEA, drawings, prototypes, design verification.",
    status: "done",
    milestones: 4,
    completedMilestones: 4,
  },
  {
    id: "process",
    name: "Process Design & Dev",
    description: "Process flow, PFMEA, control plan drafts.",
    status: "current",
    milestones: 4,
    completedMilestones: 2,
  },
  {
    id: "validation",
    name: "Product & Process Validation",
    description: "Run-at-rate, PPAP submission, first production lot.",
    status: "upcoming",
    milestones: 3,
    completedMilestones: 0,
  },
  {
    id: "feedback",
    name: "Feedback & Corrective Action",
    description: "Post-launch defect review, continual improvement.",
    status: "upcoming",
    milestones: 1,
    completedMilestones: 0,
  },
];

export const MILESTONES = [
  {
    id: "m-1",
    phase: "plan",
    label: "Program charter approved",
    status: "done",
    due: "2025-11-15",
  },
  {
    id: "m-2",
    phase: "plan",
    label: "Design goals & reliability targets",
    status: "done",
    due: "2025-12-10",
  },
  {
    id: "m-3",
    phase: "plan",
    label: "Preliminary Bill of Characteristics",
    status: "done",
    due: "2026-01-08",
  },
  {
    id: "m-4",
    phase: "design",
    label: "DFMEA for BMS",
    status: "done",
    due: "2026-02-20",
  },
  {
    id: "m-5",
    phase: "design",
    label: "Prototype build (Module + BMS)",
    status: "done",
    due: "2026-03-05",
  },
  {
    id: "m-6",
    phase: "design",
    label: "Design verification — thermal run",
    status: "done",
    due: "2026-03-28",
  },
  {
    id: "m-7",
    phase: "design",
    label: "Drawing release Rev. B (A-121)",
    status: "done",
    due: "2026-04-10",
  },
  {
    id: "m-8",
    phase: "process",
    label: "PFMEA for Cooling Plate (new)",
    status: "inprogress",
    due: "2026-05-02",
  },
  {
    id: "m-9",
    phase: "process",
    label: "Control Plan drafts — all buy items",
    status: "inprogress",
    due: "2026-05-15",
  },
  {
    id: "m-10",
    phase: "process",
    label: "Process flow review with LG ES",
    status: "done",
    due: "2026-04-18",
  },
  {
    id: "m-11",
    phase: "process",
    label: "Mobis Controller process sign-off",
    status: "atrisk",
    due: "2026-05-10",
  },
  {
    id: "m-12",
    phase: "validation",
    label: "Run-at-Rate",
    status: "upcoming",
    due: "2026-06-20",
  },
  {
    id: "m-13",
    phase: "validation",
    label: "PPAP submission pack (all)",
    status: "upcoming",
    due: "2026-07-15",
  },
  {
    id: "m-14",
    phase: "validation",
    label: "First production lot",
    status: "upcoming",
    due: "2026-08-05",
  },
  {
    id: "m-15",
    phase: "feedback",
    label: "Post-launch defect review",
    status: "upcoming",
    due: "2026-11-01",
  },
];

/**
 * Per-BOM-item PPAP tracking. Uses item IDs that already exist in
 * mockBOM so the QM sees the same universe as the CM and the SM.
 */
export const PPAP_PROGRESS = [
  {
    itemId: "A-111",
    supplier: "LG Energy Solution",
    case: "Case 1",
    phase: "validation",
    elements: { approved: 5, inprogress: 0, notstarted: 0, total: 5 },
    overallStatus: "approved",
    lastUpdated: "2026-04-15",
    risk: "low",
  },
  {
    itemId: "A-112",
    supplier: "Hanwha Precision",
    case: "Case 1",
    phase: "validation",
    elements: { approved: 4, inprogress: 1, notstarted: 0, total: 5 },
    overallStatus: "review",
    lastUpdated: "2026-04-18",
    risk: "low",
  },
  {
    itemId: "A-113",
    supplier: "Doowon Climate Control",
    case: "Case 3",
    phase: "process",
    elements: { approved: 0, inprogress: 1, notstarted: 4, total: 5 },
    overallStatus: "pending",
    lastUpdated: "2026-04-23",
    risk: "high",
  },
  {
    itemId: "A-120",
    supplier: "Hyundai Mobis",
    case: "Case 2",
    phase: "process",
    elements: { approved: 3, inprogress: 2, notstarted: 1, total: 6 },
    overallStatus: "review",
    lastUpdated: "2026-04-20",
    risk: "medium",
  },
  {
    itemId: "A-121",
    supplier: "Hyundai Mobis",
    case: "Case 2",
    phase: "process",
    elements: { approved: 2, inprogress: 2, notstarted: 3, total: 7 },
    overallStatus: "review",
    lastUpdated: "2026-04-22",
    risk: "high",
  },
  {
    itemId: "A-122",
    supplier: "Analog Devices",
    case: "Case 1",
    phase: "validation",
    elements: { approved: 5, inprogress: 0, notstarted: 0, total: 5 },
    overallStatus: "approved",
    lastUpdated: "2026-03-28",
    risk: "low",
  },
  {
    itemId: "A-130",
    supplier: "POSCO Steel",
    case: "Case 1",
    phase: "process",
    elements: { approved: 3, inprogress: 2, notstarted: 0, total: 5 },
    overallStatus: "pending",
    lastUpdated: "2026-04-19",
    risk: "medium",
  },
  {
    itemId: "A-131",
    supplier: "POSCO Steel",
    case: "Case 1",
    phase: "process",
    elements: { approved: 2, inprogress: 3, notstarted: 0, total: 5 },
    overallStatus: "pending",
    lastUpdated: "2026-04-19",
    risk: "medium",
  },
  {
    itemId: "A-132",
    supplier: "POSCO Steel",
    case: "Case 1",
    phase: "process",
    elements: { approved: 2, inprogress: 3, notstarted: 0, total: 5 },
    overallStatus: "pending",
    lastUpdated: "2026-04-19",
    risk: "medium",
  },
  {
    itemId: "A-133",
    supplier: "Nok Corporation",
    case: "Case 1",
    phase: "validation",
    elements: { approved: 5, inprogress: 0, notstarted: 0, total: 5 },
    overallStatus: "approved",
    lastUpdated: "2026-03-10",
    risk: "low",
  },
];

/**
 * Items present in Sourcing BOM that don't yet have a Q-BOM record
 * (or whose Q-BOM is out of sync with the current S-BOM revision).
 */
export const QBOM_SYNC_STATUS = {
  sBomItems: 12,
  qBomItems: 10,
  inSync: 9,
  outOfSync: 1,
  missing: 2,
  outOfSyncDetails: [
    {
      itemId: "A-121",
      reason: "Q-BOM still on Rev. A; S-BOM updated to Rev. B.",
    },
  ],
  missingDetails: [
    {
      itemId: "A-113",
      reason: "Newly added in v1.2 — Q-BOM record not yet created.",
    },
    {
      itemId: "A-133",
      reason: "Gasket material certificate not linked in Q-BOM.",
    },
  ],
};

export const OPEN_RISKS = [
  {
    id: "QR-2026-011",
    title: "A-113 Cooling Plate supplier has no PPAP history",
    itemId: "A-113",
    severity: "high",
    phase: "process",
    owner: "Mikyung Choi",
    openedAt: "2026-04-23",
    action: "Trigger Pre-PPAP assessment — see RFX-2026-055.",
  },
  {
    id: "QR-2026-009",
    title: "A-121 BMS process sign-off trending late",
    itemId: "A-121",
    severity: "high",
    phase: "process",
    owner: "Mikyung Choi",
    openedAt: "2026-04-18",
    action: "Escalate with Mobis — tie decision to program gate.",
  },
  {
    id: "QR-2026-014",
    title: "Q-BOM out of sync for A-121 (Rev. A vs B)",
    itemId: "A-121",
    severity: "medium",
    phase: "process",
    owner: "Mikyung Choi",
    openedAt: "2026-04-22",
    action: "Re-issue Q-BOM record after Rev. B approval.",
  },
  {
    id: "QR-2026-006",
    title: "4M change pending for POSCO Steel housing line",
    itemId: "A-130",
    severity: "medium",
    phase: "process",
    owner: "Mikyung Choi",
    openedAt: "2026-04-15",
    action: "Awaiting supplier 4M change documentation.",
  },
];

export function summarizeAPQP() {
  const ppapApproved = PPAP_PROGRESS.filter(
    (p) => p.overallStatus === "approved",
  ).length;
  const firstPassRate = ppapApproved / PPAP_PROGRESS.length;
  const milestonesDone = MILESTONES.filter((m) => m.status === "done").length;
  const milestonesAtRisk = MILESTONES.filter(
    (m) => m.status === "atrisk",
  ).length;
  const syncPct =
    QBOM_SYNC_STATUS.sBomItems > 0
      ? QBOM_SYNC_STATUS.inSync / QBOM_SYNC_STATUS.sBomItems
      : 0;
  const highRisks = OPEN_RISKS.filter((r) => r.severity === "high").length;
  return {
    firstPassRate,
    milestonesDone,
    totalMilestones: MILESTONES.length,
    milestonesAtRisk,
    syncPct,
    totalRisks: OPEN_RISKS.length,
    highRisks,
  };
}
