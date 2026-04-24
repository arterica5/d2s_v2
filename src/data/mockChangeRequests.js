/**
 * Change Request metadata — types, urgency levels, approval paths,
 * and a short history list the new-request page surfaces as
 * "Recent changes for this item."
 */

export const CHANGE_TYPES = [
  {
    id: "supplier",
    label: "Supplier Change",
    description: "Switch to another qualified supplier",
  },
  {
    id: "spec",
    label: "Spec Revision",
    description: "Revise dimensional, material, or functional spec",
  },
  {
    id: "cost",
    label: "Cost Target Update",
    description: "Change the target or should-cost for this item",
  },
  {
    id: "qty",
    label: "Quantity Change",
    description: "Change the qty used per parent assembly",
  },
  {
    id: "add",
    label: "Add Item",
    description: "Introduce a new child item to this assembly",
  },
  {
    id: "remove",
    label: "Remove Item",
    description: "Remove this item from the BOM",
  },
];

export const URGENCY_LEVELS = [
  { id: "normal", label: "Normal", color: "var(--color-info-main)" },
  { id: "high", label: "High", color: "var(--color-warning-main)" },
  {
    id: "emergency",
    label: "Emergency",
    color: "var(--color-error-main)",
  },
];

/**
 * Who has to approve each change type, in order. Drives the
 * "Approval Path" card on the impact panel.
 */
export const APPROVAL_PATHS = {
  supplier: [
    "Design Engineer Lead",
    "Sourcing Manager",
    "Cost Manager",
    "Quality Manager",
    "Project Manager",
  ],
  spec: [
    "Design Engineer Lead",
    "Quality Manager",
    "Project Manager",
  ],
  cost: [
    "Cost Manager",
    "Project Manager",
  ],
  qty: [
    "Design Engineer Lead",
    "Cost Manager",
    "Sourcing Manager",
  ],
  add: [
    "Design Engineer Lead",
    "Sourcing Manager",
    "Quality Manager",
    "Project Manager",
  ],
  remove: [
    "Design Engineer Lead",
    "Project Manager",
  ],
};

export const PAST_CHANGES = [
  {
    id: "CR-2026-042",
    itemId: "A-121",
    type: "supplier",
    title: "Switch BMS supplier to Hyundai Mobis",
    submittedBy: "Doyoon Kim",
    submittedAt: "2026-04-18",
    status: "approved",
    costImpact: 2_000,
  },
  {
    id: "CR-2026-051",
    itemId: "A-113",
    type: "add",
    title: "Add Cooling Plate assembly to Battery Module",
    submittedBy: "Doyoon Kim",
    submittedAt: "2026-04-22",
    status: "review",
    costImpact: 16_800,
  },
  {
    id: "CR-2026-039",
    itemId: "A-110",
    type: "qty",
    title: "Increase Battery Module qty 6 → 8",
    submittedBy: "Suho Jung",
    submittedAt: "2026-04-15",
    status: "approved",
    costImpact: 840_000,
  },
  {
    id: "CR-2026-047",
    itemId: "A-131",
    type: "spec",
    title: "Top Cover material change to Al 6061-T6",
    submittedBy: "Doyoon Kim",
    submittedAt: "2026-04-11",
    status: "rejected",
    costImpact: -3_500,
  },
  {
    id: "CR-2026-055",
    itemId: "A-121",
    type: "cost",
    title: "Raise BMS target cost to ₩110k",
    submittedBy: "Jieun Park",
    submittedAt: "2026-04-20",
    status: "approved",
    costImpact: 0,
  },
];
