/**
 * Cost analysis helpers — derive rollups, breakdowns, and contributor
 * rankings from BOM_NODES + item-detail overrides. No state, no side
 * effects, so any page can import them.
 */

import { BOM_NODES } from "./mockBOM.js";
import { getItemDetail } from "./itemDetails.js";

export function flattenAll(nodes = BOM_NODES, out = []) {
  for (const node of nodes) {
    out.push(node);
    if (node.children) flattenAll(node.children, out);
  }
  return out;
}

export function flattenLeaves(nodes = BOM_NODES, out = []) {
  for (const node of nodes) {
    if (node.children?.length) {
      flattenLeaves(node.children, out);
    } else {
      out.push(node);
    }
  }
  return out;
}

/**
 * Top-level roll-up: what the buyer actually pays at the "pack" level.
 * Assumes A-100, A-200, ... represent the end-items the company acquires
 * (or produces) and their declared unitPrice already reflects their
 * internal cost. Matches how the BOM KPI strip computes totals.
 */
export function computeTopLevelTotals(nodes = BOM_NODES) {
  const current = nodes.reduce(
    (s, n) => s + (n.unitPrice ?? 0) * (n.qty ?? 1),
    0,
  );
  const target = nodes.reduce(
    (s, n) => s + (n.targetCost ?? 0) * (n.qty ?? 1),
    0,
  );
  return { current, target, gap: current - target };
}

/**
 * Cost structure (material / labor / overhead) aggregated across all
 * leaf items weighted by their occurrence in the parent tree.
 * Each leaf is counted once multiplied by its own qty at its level —
 * simple enough to stay honest for mock data.
 */
export function computeCostStructure(nodes = BOM_NODES) {
  const leaves = flattenLeaves(nodes);
  let material = 0;
  let labor = 0;
  let overhead = 0;
  for (const leaf of leaves) {
    const d = getItemDetail(leaf);
    const qty = leaf.qty ?? 1;
    material += d.costBreakdown.material * qty;
    labor += d.costBreakdown.labor * qty;
    overhead += d.costBreakdown.overhead * qty;
  }
  const total = material + labor + overhead;
  return {
    material,
    labor,
    overhead,
    total,
    pct: {
      material: total ? material / total : 0,
      labor: total ? labor / total : 0,
      overhead: total ? overhead / total : 0,
    },
  };
}

/**
 * All nodes that exceed their target cost on a per-unit basis.
 * Returns enriched entries sorted by absolute extended gap descending.
 */
export function computeTopContributors(nodes = BOM_NODES, limit = 5) {
  const all = flattenAll(nodes);
  return all
    .map((n) => {
      const qty = n.qty ?? 1;
      const unitGap = (n.unitPrice ?? 0) - (n.targetCost ?? 0);
      return {
        node: n,
        unitGap,
        extendedGap: unitGap * qty,
      };
    })
    .filter((r) => r.unitGap !== 0)
    .sort((a, b) => Math.abs(b.extendedGap) - Math.abs(a.extendedGap))
    .slice(0, limit);
}

/**
 * Count of items whose per-unit price is over target.
 */
export function countOverTarget(nodes = BOM_NODES) {
  return flattenAll(nodes).filter(
    (n) => (n.unitPrice ?? 0) > (n.targetCost ?? 0),
  ).length;
}

/**
 * For an individual node: pull should-cost from its detail (cleansheet
 * total) and compute the three deltas CM watches.
 */
export function itemCostAnalysis(node) {
  const detail = getItemDetail(node);
  const shouldCost =
    detail.costBreakdown.material +
    detail.costBreakdown.labor +
    detail.costBreakdown.overhead;
  const current = node.unitPrice ?? 0;
  const target = node.targetCost ?? 0;
  return {
    shouldCost,
    current,
    target,
    vsTarget: current - target,
    vsShould: current - shouldCost,
    breakdown: detail.costBreakdown,
  };
}
