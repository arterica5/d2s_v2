/**
 * Mock BOM for EV Battery Pack Assembly (EV-Model-X, v1.2)
 *
 * Hierarchy: 4 top-level assemblies, 3~4 levels deep.
 * Each node carries enough metadata to render the multi-view BOM:
 *   - ebom: tree / level / qty / uom  (Engineering BOM)
 *   - sourcing: unitPrice / supplier / buyMode  (Sourcing BOM)
 *   - quality: ppap / riskLevel  (Q-BOM)
 *
 * Deltas are captured relative to v1.1 so the compare view can highlight
 * added / removed / modified rows.
 */

export const BOM_META = {
  projectId: "ev-model-x",
  projectName: "EV-Model-X",
  phase: "Dev",
  currentVersion: "v1.2",
  previousVersion: "v1.1",
  versions: ["v1.0", "v1.1", "v1.2"],
};

export const BOM_NODES = [
  // ─────────────────── Assembly: Battery Pack ───────────────────
  {
    id: "A-100",
    level: 1,
    code: "A-100",
    name: "Battery Pack Assembly",
    qty: 1,
    uom: "EA",
    unitPrice: 4_250_000,
    targetCost: 4_000_000,
    supplier: null,
    buyMode: "INHOUSE",
    designStatus: "inprogress",
    sourcingStatus: "pending",
    ppapStatus: "notstarted",
    riskLevel: "medium",
    delta: null,
    children: [
      {
        id: "A-110",
        level: 2,
        code: "A-110",
        name: "Battery Module × 8",
        qty: 8,
        uom: "EA",
        unitPrice: 420_000,
        targetCost: 400_000,
        supplier: "LG Energy Solution",
        buyMode: "BUY",
        designStatus: "completed",
        sourcingStatus: "inprogress",
        ppapStatus: "review",
        riskLevel: "high",
        delta: "modified", // qty 6 → 8
        children: [
          {
            id: "A-111",
            level: 3,
            code: "A-111",
            name: "Prismatic Cell",
            qty: 12,
            uom: "EA",
            unitPrice: 18_500,
            targetCost: 18_000,
            supplier: "LG Energy Solution",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "completed",
            ppapStatus: "approved",
            riskLevel: "low",
            delta: null,
          },
          {
            id: "A-112",
            level: 3,
            code: "A-112",
            name: "Cell Tab Connector",
            qty: 24,
            uom: "EA",
            unitPrice: 320,
            targetCost: 300,
            supplier: "Hanwha Precision",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "completed",
            ppapStatus: "approved",
            riskLevel: "low",
            delta: null,
          },
          {
            id: "A-113",
            level: 3,
            code: "A-113",
            name: "Cooling Plate",
            qty: 2,
            uom: "EA",
            unitPrice: 8_400,
            targetCost: 7_500,
            supplier: "Doowon Climate Control",
            buyMode: "BUY",
            designStatus: "inprogress",
            sourcingStatus: "inprogress",
            ppapStatus: "pending",
            riskLevel: "medium",
            delta: "added",
          },
        ],
      },
      {
        id: "A-120",
        level: 2,
        code: "A-120",
        name: "Battery Management System (BMS)",
        qty: 1,
        uom: "EA",
        unitPrice: 180_000,
        targetCost: 165_000,
        supplier: "Hyundai Mobis",
        buyMode: "BUY",
        designStatus: "inprogress",
        sourcingStatus: "pending",
        ppapStatus: "review",
        riskLevel: "high",
        delta: null,
        children: [
          {
            id: "A-121",
            level: 3,
            code: "A-121",
            name: "BMS Controller Board",
            qty: 1,
            uom: "EA",
            unitPrice: 120_000,
            targetCost: 110_000,
            supplier: "Hyundai Mobis",
            buyMode: "BUY",
            designStatus: "inprogress",
            sourcingStatus: "pending",
            ppapStatus: "review",
            riskLevel: "high",
            delta: "modified", // supplier changed
          },
          {
            id: "A-122",
            level: 3,
            code: "A-122",
            name: "Voltage Sensor IC",
            qty: 16,
            uom: "EA",
            unitPrice: 3_200,
            targetCost: 3_000,
            supplier: "Analog Devices",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "completed",
            ppapStatus: "approved",
            riskLevel: "low",
            delta: null,
          },
        ],
      },
      {
        id: "A-130",
        level: 2,
        code: "A-130",
        name: "Enclosure",
        qty: 1,
        uom: "EA",
        unitPrice: 90_000,
        targetCost: 82_000,
        supplier: "POSCO Steel",
        buyMode: "BUY",
        designStatus: "completed",
        sourcingStatus: "inprogress",
        ppapStatus: "pending",
        riskLevel: "medium",
        delta: null,
        children: [
          {
            id: "A-131",
            level: 3,
            code: "A-131",
            name: "Top Cover (Aluminum)",
            qty: 1,
            uom: "EA",
            unitPrice: 42_000,
            targetCost: 38_000,
            supplier: "POSCO Steel",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "inprogress",
            ppapStatus: "pending",
            riskLevel: "medium",
            delta: null,
          },
          {
            id: "A-132",
            level: 3,
            code: "A-132",
            name: "Bottom Shell",
            qty: 1,
            uom: "EA",
            unitPrice: 38_000,
            targetCost: 34_000,
            supplier: "POSCO Steel",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "inprogress",
            ppapStatus: "pending",
            riskLevel: "medium",
            delta: null,
          },
          {
            id: "A-133",
            level: 3,
            code: "A-133",
            name: "Seal Gasket (EPDM)",
            qty: 4,
            uom: "M",
            unitPrice: 2_500,
            targetCost: 2_500,
            supplier: "Nok Corporation",
            buyMode: "BUY",
            designStatus: "completed",
            sourcingStatus: "completed",
            ppapStatus: "approved",
            riskLevel: "low",
            delta: null,
          },
        ],
      },
    ],
  },

  // ─────────────────── Assembly: Wiring Harness ───────────────────
  {
    id: "A-200",
    level: 1,
    code: "A-200",
    name: "HV Wiring Harness",
    qty: 1,
    uom: "EA",
    unitPrice: 62_000,
    targetCost: 58_000,
    supplier: "Yura Corporation",
    buyMode: "BUY",
    designStatus: "inprogress",
    sourcingStatus: "inprogress",
    ppapStatus: "pending",
    riskLevel: "medium",
    delta: null,
    children: [
      {
        id: "A-210",
        level: 2,
        code: "A-210",
        name: "Main Power Cable",
        qty: 2,
        uom: "M",
        unitPrice: 14_500,
        targetCost: 13_500,
        supplier: "Yura Corporation",
        buyMode: "BUY",
        designStatus: "completed",
        sourcingStatus: "inprogress",
        ppapStatus: "pending",
        riskLevel: "medium",
        delta: null,
      },
      {
        id: "A-220",
        level: 2,
        code: "A-220",
        name: "HV Connector (400A)",
        qty: 4,
        uom: "EA",
        unitPrice: 6_800,
        targetCost: 6_500,
        supplier: "TE Connectivity",
        buyMode: "BUY",
        designStatus: "completed",
        sourcingStatus: "completed",
        ppapStatus: "approved",
        riskLevel: "low",
        delta: null,
      },
    ],
  },
];

/**
 * Flatten a tree with depth info and a stable path so rows can be rendered
 * in a single table. Children visibility is controlled by expandedIds.
 */
export function flattenBOM(nodes, expandedIds, depth = 0, out = []) {
  for (const node of nodes) {
    out.push({ ...node, depth, hasChildren: !!node.children?.length });
    if (node.children && expandedIds.has(node.id)) {
      flattenBOM(node.children, expandedIds, depth + 1, out);
    }
  }
  return out;
}

export function collectAllIds(nodes, out = new Set()) {
  for (const node of nodes) {
    out.add(node.id);
    if (node.children) collectAllIds(node.children, out);
  }
  return out;
}
