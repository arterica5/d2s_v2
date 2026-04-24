/**
 * Category master — Policy Container per 05_ux-key-points.md #6.
 * Each category carries a strategic position (buyer vs supplier power),
 * an overall strategy group (Strategic / Collaborative / Transactional),
 * applied rules, sourcing guidance, downstream process impact, and
 * aggregated spend + performance metrics.
 */

export const STRATEGY_GROUPS = {
  strategic: {
    label: "Strategic",
    description: "Critical supply, active risk management",
    color: "var(--color-primary-main)",
  },
  collaborative: {
    label: "Collaborative",
    description: "Joint development, long-term partnership",
    color: "var(--color-info-main)",
  },
  transactional: {
    label: "Transactional",
    description: "Competitive bidding, volume leverage",
    color: "var(--color-success-main)",
  },
};

export const CATEGORIES = [
  {
    slug: "battery-cells",
    name: "Battery Cells",
    description: "Prismatic / pouch / cylindrical cell procurement",
    group: "strategic",
    position: { buyerPower: 0.35, supplierPower: 0.85 },
    spendKRW2025: 2_400_000_000,
    supplierCount: 3,
    itemCount: 1,
    onTimeRate: 0.96,
    rules: [
      { type: "mandatory", label: "Dual-source policy required" },
      { type: "mandatory", label: "Multi-year volume agreement" },
      { type: "guideline", label: "Prefer domestic suppliers for logistics risk" },
    ],
    onboardingRequirements: ["IATF 16949", "ISO 14001", "Fire-safety audit"],
    sourcingStrategy: "Multi-year volume agreement, RFP preferred",
    downstreamImpact: [
      "Triggers full APQP cycle",
      "Spec change requires Pre-PPAP",
      "Custody-of-materials audit quarterly",
    ],
    suppliers: ["lg-energy"],
    items: ["A-111"],
  },
  {
    slug: "bms-controllers",
    name: "BMS / Controllers",
    description: "Battery management electronics and controllers",
    group: "strategic",
    position: { buyerPower: 0.45, supplierPower: 0.75 },
    spendKRW2025: 810_000_000,
    supplierCount: 4,
    itemCount: 2,
    onTimeRate: 0.94,
    rules: [
      { type: "mandatory", label: "ISO 26262 ASIL certification required" },
      { type: "mandatory", label: "Carry-over PPAP preferred" },
      { type: "guideline", label: "RFQ + technical review gating" },
    ],
    onboardingRequirements: ["ISO 26262", "IATF 16949", "Functional safety docs"],
    sourcingStrategy: "Technical-led RFQ with cost as secondary weight",
    downstreamImpact: [
      "ASIL review on every spec revision",
      "Firmware handoff protocol",
    ],
    suppliers: ["mobis", "bosch"],
    items: ["A-120", "A-121"],
  },
  {
    slug: "thermal",
    name: "Thermal Management",
    description: "Cooling plates, heat exchangers, liquid loops",
    group: "collaborative",
    position: { buyerPower: 0.55, supplierPower: 0.5 },
    spendKRW2025: 180_000_000,
    supplierCount: 3,
    itemCount: 1,
    onTimeRate: 0.9,
    rules: [
      { type: "guideline", label: "Joint DFM before freeze" },
      { type: "guideline", label: "Early supplier involvement" },
    ],
    onboardingRequirements: ["ISO 9001", "Thermal sim review"],
    sourcingStrategy: "Early collaboration · RFP with joint simulation review",
    downstreamImpact: [
      "Requires validation on Battery Module prototype",
      "Pre-PPAP when supplier is new",
    ],
    suppliers: ["doowon", "hanon"],
    items: ["A-113"],
  },
  {
    slug: "metals-housing",
    name: "Metals & Housings",
    description: "Stamped, cast, and machined metallic structures",
    group: "collaborative",
    position: { buyerPower: 0.65, supplierPower: 0.45 },
    spendKRW2025: 340_000_000,
    supplierCount: 2,
    itemCount: 3,
    onTimeRate: 0.91,
    rules: [
      { type: "guideline", label: "Localize near final assembly plant" },
      { type: "mandatory", label: "Material traceability certificate" },
    ],
    onboardingRequirements: ["IATF 16949", "Material origin traceability"],
    sourcingStrategy: "Localized dual-source with capacity guarantee",
    downstreamImpact: [
      "Tooling investment managed by buyer",
      "Logistics impact on plant JIT",
    ],
    suppliers: ["posco", "hanwha-precision"],
    items: ["A-130", "A-131", "A-132", "A-112"],
  },
  {
    slug: "connectors",
    name: "Connectors & Terminals",
    description: "High-voltage / signal connectors and terminals",
    group: "transactional",
    position: { buyerPower: 0.7, supplierPower: 0.35 },
    spendKRW2025: 96_000_000,
    supplierCount: 2,
    itemCount: 2,
    onTimeRate: 0.95,
    rules: [
      { type: "guideline", label: "Use approved catalogue first" },
      { type: "mandatory", label: "UL / ISO 6469 compliance" },
    ],
    onboardingRequirements: ["IATF 16949", "UL listing", "ISO 6469"],
    sourcingStrategy: "Catalogue first · RFQ for custom variants",
    downstreamImpact: ["Standardized across programs where possible"],
    suppliers: ["te-connectivity"],
    items: ["A-220", "A-112"],
  },
  {
    slug: "harness",
    name: "Wiring Harness",
    description: "HV and LV harnesses and cabling",
    group: "transactional",
    position: { buyerPower: 0.75, supplierPower: 0.4 },
    spendKRW2025: 128_000_000,
    supplierCount: 1,
    itemCount: 2,
    onTimeRate: 0.91,
    rules: [
      { type: "guideline", label: "Standard routing templates" },
      { type: "guideline", label: "Annual competitive bidding" },
    ],
    onboardingRequirements: ["IATF 16949"],
    sourcingStrategy: "Annual bidding · target 2–3 qualified suppliers",
    downstreamImpact: ["Route change requires full re-validation"],
    suppliers: ["yura"],
    items: ["A-200", "A-210"],
  },
];

export function findCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function summarizeCategories() {
  const total = CATEGORIES.length;
  const spend = CATEGORIES.reduce((s, c) => s + c.spendKRW2025, 0);
  const byGroup = CATEGORIES.reduce((acc, c) => {
    acc[c.group] = (acc[c.group] ?? 0) + 1;
    return acc;
  }, {});
  return { total, spend, byGroup };
}
