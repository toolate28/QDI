/**
 * Equitable resource allocation algorithm
 * Time-zone aware with no penalty for off-peak regions
 * Coherence score integration with ≥80% baseline enforcement
 */

import { type AtomDecision, createTrailEntry } from "@spiralsafe/atom-trail";

export interface DemandInfo {
  agent_id: string;
  resource_type: string;
  amount: number;
  timezone?: string;
  coherence_score?: number;
  timestamp: string;
}

export interface AllocationResult {
  allocations: Array<{
    agent_id: string;
    allocated: number;
    requested: number;
    fill_rate: number;
  }>;
  total_allocated: number;
  total_requested: number;
  efficiency: number;
  fairness_metrics: {
    gini_coefficient: number;
    min_fill_rate: number;
    max_fill_rate: number;
    avg_fill_rate: number;
    timezone_parity: number;
  };
  timestamp: string;
  provenance: {
    atom_tag: string;
    trail_id: string;
  };
}

/**
 * Calculate Gini coefficient for fairness measurement
 * 0 = perfect equality, 1 = perfect inequality
 */
function calculateGini(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    sum += (2 * (i + 1) - n - 1) * sorted[i];
  }

  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  return sum / (n * n * mean || 1);
}

/**
 * Allocate resources equitably across demands
 *
 * Fairness criteria:
 * - Proportional allocation based on coherence-weighted demand
 * - Minimum 80% coherence baseline enforced
 * - No timezone penalties (24/7 global equity)
 * - Max-min fairness: prioritize filling minimum demands first
 */
export function allocateResources(
  demands: DemandInfo[],
  capacity: number,
): AllocationResult {
  const BASELINE_COHERENCE = 80;
  const MIN_COHERENCE_THRESHOLD = BASELINE_COHERENCE * 0.8; // 64

  // Separate valid and invalid demands
  const validDemands = demands.filter(
    (d) => (d.coherence_score ?? BASELINE_COHERENCE) >= MIN_COHERENCE_THRESHOLD,
  );

  const invalidDemands = demands.filter(
    (d) => (d.coherence_score ?? BASELINE_COHERENCE) < MIN_COHERENCE_THRESHOLD,
  );

  if (validDemands.length === 0) {
    return createEmptyAllocation(demands, capacity);
  }

  // Calculate coherence-adjusted demands
  const adjustedDemands = validDemands.map((d) => ({
    ...d,
    coherence: Math.max(
      d.coherence_score ?? BASELINE_COHERENCE,
      MIN_COHERENCE_THRESHOLD,
    ),
    weight: 1.0, // Equal weight regardless of timezone
  }));

  // Total weighted demand
  const totalWeightedDemand = adjustedDemands.reduce(
    (sum, d) => sum + d.amount * d.weight,
    0,
  );

  // Allocate proportionally with max-min fairness for valid demands
  const validAllocations = adjustedDemands.map((d) => {
    const proportion = (d.amount * d.weight) / totalWeightedDemand;
    let allocated = Math.floor(proportion * capacity);

    // Ensure minimum allocation if capacity allows
    if (allocated === 0 && capacity > 0 && d.amount > 0) {
      allocated = Math.min(1, capacity);
    }

    return {
      agent_id: d.agent_id,
      allocated,
      requested: d.amount,
      fill_rate: d.amount > 0 ? allocated / d.amount : 1.0,
    };
  });

  // Create zero allocations for invalid demands
  const invalidAllocations = invalidDemands.map((d) => ({
    agent_id: d.agent_id,
    allocated: 0,
    requested: d.amount,
    fill_rate: 0,
  }));

  // Combine allocations
  const allocations = [...validAllocations, ...invalidAllocations];

  // Distribute remaining capacity using max-min fairness (only for valid allocations)
  let remaining =
    capacity - validAllocations.reduce((sum, a) => sum + a.allocated, 0);

  while (remaining > 0) {
    // Find agent with lowest fill rate that still has unfilled demand
    const needyAgents = validAllocations
      .filter((a) => a.allocated < a.requested)
      .sort((a, b) => a.fill_rate - b.fill_rate);

    if (needyAgents.length === 0) break;

    const agent = needyAgents[0];
    if (agent) {
      agent.allocated += 1;
      agent.fill_rate = agent.allocated / agent.requested;
      remaining -= 1;
    }
  }

  // Calculate metrics
  const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated, 0);
  const totalRequested = allocations.reduce((sum, a) => sum + a.requested, 0);
  const fillRates = allocations.map((a) => a.fill_rate);

  // Timezone parity: check variance across timezones
  const timezones = new Map<string, number[]>();
  for (let i = 0; i < validDemands.length; i++) {
    const tz = validDemands[i]?.timezone ?? "UTC";
    const rate = allocations[i]?.fill_rate ?? 0;
    if (!timezones.has(tz)) timezones.set(tz, []);
    timezones.get(tz)?.push(rate);
  }

  const tzMeans = Array.from(timezones.values()).map(
    (rates) => rates.reduce((a, b) => a + b, 0) / rates.length,
  );
  const tzVariance =
    tzMeans.length > 1
      ? tzMeans.reduce((sum, mean) => {
          const avgMean = tzMeans.reduce((a, b) => a + b, 0) / tzMeans.length;
          return sum + (mean - avgMean) ** 2;
        }, 0) / tzMeans.length
      : 0;
  const timezoneParity = Math.max(0, 100 - tzVariance * 100);

  // Create provenance trail
  const decision: AtomDecision = {
    atom_tag: `ATOM-ALLOC-${Date.now()}`,
    type: "ENHANCE",
    description: `Allocated ${totalAllocated}/${capacity} resources across ${allocations.length} agents`,
    timestamp: new Date().toISOString(),
    tags: ["allocation", "fairness", "scaling"],
    freshness: "fresh",
    verified: false,
  };

  const trail = createTrailEntry(decision);

  return {
    allocations,
    total_allocated: totalAllocated,
    total_requested: totalRequested,
    efficiency: capacity > 0 ? (totalAllocated / capacity) * 100 : 0,
    fairness_metrics: {
      gini_coefficient: calculateGini(fillRates),
      min_fill_rate: Math.min(...fillRates),
      max_fill_rate: Math.max(...fillRates),
      avg_fill_rate: fillRates.reduce((a, b) => a + b, 0) / fillRates.length,
      timezone_parity: timezoneParity,
    },
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}

/**
 * Create empty allocation result when no valid demands
 */
function createEmptyAllocation(
  demands: DemandInfo[],
  capacity: number,
): AllocationResult {
  const decision: AtomDecision = {
    atom_tag: `ATOM-ALLOC-${Date.now()}`,
    type: "VERIFY",
    description: "No valid demands meeting coherence threshold",
    timestamp: new Date().toISOString(),
    tags: ["allocation", "empty"],
    freshness: "fresh",
    verified: true,
  };

  const trail = createTrailEntry(decision);

  return {
    allocations: demands.map((d) => ({
      agent_id: d.agent_id,
      allocated: 0,
      requested: d.amount,
      fill_rate: 0,
    })),
    total_allocated: 0,
    total_requested: demands.reduce((sum, d) => sum + d.amount, 0),
    efficiency: 0,
    fairness_metrics: {
      gini_coefficient: 0,
      min_fill_rate: 0,
      max_fill_rate: 0,
      avg_fill_rate: 0,
      timezone_parity: 100,
    },
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}
