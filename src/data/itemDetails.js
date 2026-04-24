/**
 * Item 360 detail data — spec, cost breakdown, supplier candidates,
 * PPAP elements, and change history. Complements the leaner BOM_NODES
 * record by layering on the information that only appears in the
 * Item 360 panel.
 *
 * getItemDetail(bomNode) always returns a complete detail object,
 * filling any gaps with sensible defaults derived from the BOM node
 * so brand-new rows render without handwritten overrides.
 */

const ITEM_OVERRIDES = {
  "A-121": {
    spec: "32-bit MCU · CAN FD · ISO 26262 ASIL-D",
    category: "Electronics / Controller",
    drawing: "DWG-BMS-2401",
    revision: "Rev. B",
    ppapElements: [
      { id: "pe1", name: "Design Record", status: "approved" },
      { id: "pe2", name: "Engineering Change Docs", status: "approved" },
      { id: "pe3", name: "Process Flow Diagram", status: "approved" },
      { id: "pe4", name: "PFMEA", status: "review" },
      { id: "pe5", name: "Control Plan", status: "pending" },
      { id: "pe6", name: "Dimensional Results", status: "notstarted" },
      { id: "pe7", name: "Material Certs", status: "notstarted" },
    ],
    alternateSuppliers: [
      {
        name: "Hyundai Mobis",
        region: "KR",
        price: 120_000,
        moq: 1_000,
        lead: "8 wks",
        score: 4.5,
        ppap: "Under Review",
        selected: true,
      },
      {
        name: "LG Innotek",
        region: "KR",
        price: 115_500,
        moq: 800,
        lead: "10 wks",
        score: 4.2,
        ppap: "Not Started",
      },
      {
        name: "Samsung Electro-Mechanics",
        region: "KR",
        price: 118_000,
        moq: 1_200,
        lead: "6 wks",
        score: 4.3,
        ppap: "Not Started",
      },
      {
        name: "Bosch Automotive",
        region: "DE",
        price: 132_000,
        moq: 500,
        lead: "12 wks",
        score: 4.7,
        ppap: "Approved (carry-over)",
      },
    ],
    history: [
      {
        date: "2026-04-22",
        actor: "Jieun Park",
        role: "Cost Manager",
        action: "Target cost updated",
        detail: "₩108k → ₩110k",
      },
      {
        date: "2026-04-18",
        actor: "Doyoon Kim",
        role: "Design Engineer",
        action: "Supplier changed",
        detail: "→ Hyundai Mobis",
      },
      {
        date: "2026-04-10",
        actor: "Mikyung Choi",
        role: "Quality Manager",
        action: "PFMEA opened",
        detail: "ASIL-D safety review",
      },
      {
        date: "2026-03-28",
        actor: "Doyoon Kim",
        role: "Design Engineer",
        action: "Spec revised",
        detail: "Rev. A → Rev. B",
      },
    ],
  },
  "A-113": {
    spec: "Liquid-cooled aluminum plate · 3 mm · 50 °C max",
    category: "Mechanical / Thermal",
    drawing: "DWG-COOL-118",
    revision: "Rev. A",
    ppapElements: [
      { id: "pe1", name: "Design Record", status: "inprogress" },
      { id: "pe2", name: "Process Flow Diagram", status: "pending" },
      { id: "pe3", name: "PFMEA", status: "notstarted" },
      { id: "pe4", name: "Control Plan", status: "notstarted" },
      { id: "pe5", name: "Dimensional Results", status: "notstarted" },
    ],
    alternateSuppliers: [
      {
        name: "Doowon Climate Control",
        region: "KR",
        price: 8_400,
        moq: 500,
        lead: "6 wks",
        score: 4.0,
        ppap: "Pending",
        selected: true,
      },
      {
        name: "Hanon Systems",
        region: "KR",
        price: 8_900,
        moq: 300,
        lead: "5 wks",
        score: 4.4,
        ppap: "Approved (carry-over)",
      },
      {
        name: "Valeo Thermal",
        region: "FR",
        price: 9_600,
        moq: 400,
        lead: "9 wks",
        score: 4.6,
        ppap: "Not Started",
      },
    ],
    history: [
      {
        date: "2026-04-23",
        actor: "Doyoon Kim",
        role: "Design Engineer",
        action: "Item added to BOM",
        detail: "Introduced in v1.2",
      },
      {
        date: "2026-04-23",
        actor: "Mikyung Choi",
        role: "Quality Manager",
        action: "Pre-PPAP flagged",
        detail: "No history with supplier",
      },
    ],
  },
  "A-111": {
    spec: "Prismatic Li-ion · 75 Ah · NMC 811",
    category: "Electrochemical / Cell",
    drawing: "DWG-CELL-002",
    revision: "Rev. C",
    ppapElements: [
      { id: "pe1", name: "Design Record", status: "approved" },
      { id: "pe2", name: "PFMEA", status: "approved" },
      { id: "pe3", name: "Control Plan", status: "approved" },
      { id: "pe4", name: "Dimensional Results", status: "approved" },
      { id: "pe5", name: "Material Certs", status: "approved" },
    ],
    alternateSuppliers: [
      {
        name: "LG Energy Solution",
        region: "KR",
        price: 18_500,
        moq: 10_000,
        lead: "14 wks",
        score: 4.8,
        ppap: "Approved",
        selected: true,
      },
      {
        name: "Samsung SDI",
        region: "KR",
        price: 18_900,
        moq: 8_000,
        lead: "14 wks",
        score: 4.7,
        ppap: "Approved (carry-over)",
      },
      {
        name: "CATL",
        region: "CN",
        price: 17_200,
        moq: 20_000,
        lead: "18 wks",
        score: 4.5,
        ppap: "Not Started",
      },
    ],
    history: [
      {
        date: "2026-04-15",
        actor: "Mikyung Choi",
        role: "Quality Manager",
        action: "PPAP approved",
        detail: "Full submission accepted",
      },
      {
        date: "2026-02-20",
        actor: "Hyunsu Lee",
        role: "Sourcing Manager",
        action: "Contract signed",
        detail: "LG Energy Solution · 3 yr",
      },
    ],
  },
};

function defaultCostBreakdown(unitPrice) {
  const material = Math.round(unitPrice * 0.6);
  const labor = Math.round(unitPrice * 0.2);
  const overhead = unitPrice - material - labor;
  return { material, labor, overhead };
}

function defaultHistory(node) {
  return [
    {
      date: "2026-04-10",
      actor: "Doyoon Kim",
      role: "Design Engineer",
      action: "Item registered",
      detail: `${node.code} added to BOM`,
    },
  ];
}

function defaultPpapElements(node) {
  const baseStatus =
    node.ppapStatus === "approved"
      ? "approved"
      : node.ppapStatus === "review"
        ? "review"
        : node.ppapStatus === "pending"
          ? "pending"
          : "notstarted";
  return [
    { id: "pe1", name: "Design Record", status: baseStatus },
    { id: "pe2", name: "Process Flow", status: baseStatus },
    { id: "pe3", name: "Control Plan", status: "notstarted" },
    { id: "pe4", name: "Dimensional Results", status: "notstarted" },
  ];
}

function defaultAlternateSuppliers(node) {
  if (!node.supplier) return [];
  return [
    {
      name: node.supplier,
      region: "KR",
      price: node.unitPrice,
      moq: 500,
      lead: "8 wks",
      score: 4.2,
      ppap:
        node.ppapStatus === "approved"
          ? "Approved"
          : node.ppapStatus === "review"
            ? "Under Review"
            : node.ppapStatus === "pending"
              ? "Pending"
              : "Not Started",
      selected: true,
    },
  ];
}

export function getItemDetail(node) {
  if (!node) return null;
  const o = ITEM_OVERRIDES[node.id] ?? {};
  const cost = o.costBreakdown ?? defaultCostBreakdown(node.unitPrice ?? 0);
  return {
    spec: o.spec ?? "Spec pending",
    category: o.category ?? "Unassigned",
    drawing: o.drawing ?? "—",
    revision: o.revision ?? "Rev. A",
    costBreakdown: cost,
    priceHistory: o.priceHistory ?? [
      { version: "v1.0", price: Math.round((node.unitPrice ?? 0) * 0.95) },
      { version: "v1.1", price: Math.round((node.unitPrice ?? 0) * 0.98) },
      { version: "v1.2", price: node.unitPrice ?? 0 },
    ],
    alternateSuppliers: o.alternateSuppliers ?? defaultAlternateSuppliers(node),
    ppapElements: o.ppapElements ?? defaultPpapElements(node),
    history: o.history ?? defaultHistory(node),
  };
}
