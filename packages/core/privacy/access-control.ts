/**
 * Equitable access control and resource scheduling
 * No exclusion by geography, agent type, or time zone
 * Fair scheduling with coherence-weighted priority
 */

import { type AtomDecision, createTrailEntry } from "@spiralsafe/atom-trail";
import { analyzeWave } from "@spiralsafe/wave-toolkit";

export interface AgentInfo {
  id: string;
  type: string;
  location?: string;
  timezone?: string;
  coherence_score?: number;
  priority?: number;
}

export interface ResourceInfo {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
}

export interface AccessResult {
  granted: boolean;
  reason: string;
  timestamp: string;
  provenance: {
    atom_tag: string;
    trail_id: string;
  };
}

export interface ScheduleResult {
  schedule: Array<{
    agent: AgentInfo;
    slot: number;
    weight: number;
  }>;
  fairness_score: number;
  timestamp: string;
  provenance: {
    atom_tag: string;
    trail_id: string;
  };
}

/**
 * Check access for an agent to a resource
 * No exclusion by geography, agent type, or time zone
 */
export function checkAccess(
  agent: AgentInfo,
  resource: ResourceInfo,
): AccessResult {
  // Equitable access: grant if resource is available
  // No discrimination by location, type, or timezone
  const granted = resource.available;
  const reason = granted
    ? "Access granted - resource available"
    : "Access denied - resource at capacity";

  // Create provenance trail
  const decision: AtomDecision = {
    atom_tag: `ATOM-ACCESS-${Date.now()}`,
    type: "VERIFY",
    description: `Access check for agent ${agent.id} to resource ${resource.name}`,
    timestamp: new Date().toISOString(),
    tags: ["access-control", "fairness", "audit"],
    freshness: "fresh",
    verified: true,
  };

  const trail = createTrailEntry(decision);

  return {
    granted,
    reason,
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}

/**
 * Schedule resources fairly across agents
 * Coherence-weighted priority, no geographic/timezone bias
 */
export function scheduleResource(
  agents: AgentInfo[],
  resource: ResourceInfo,
): ScheduleResult {
  // Calculate weights based on coherence scores
  // If no coherence score provided, use baseline of 80
  const BASELINE_COHERENCE = 80;

  const weightedAgents = agents.map((agent) => {
    const coherence = agent.coherence_score ?? BASELINE_COHERENCE;
    // Ensure minimum 80% baseline is met
    const adjustedCoherence = Math.max(coherence, BASELINE_COHERENCE * 0.8);

    // Weight calculation: coherence + priority (if any)
    // No penalty for timezone or location
    const weight = adjustedCoherence + (agent.priority ?? 0);

    return { agent, weight };
  });

  // Sort by weight (higher is better)
  weightedAgents.sort((a, b) => b.weight - a.weight);

  // Allocate slots up to capacity
  const schedule = weightedAgents
    .slice(0, resource.capacity)
    .map((item, index) => ({
      agent: item.agent,
      slot: index,
      weight: item.weight,
    }));

  // Calculate fairness score (variance-based)
  const weights = schedule.map((s) => s.weight);
  const mean = weights.reduce((a, b) => a + b, 0) / weights.length;
  const variance =
    weights.reduce((sum, w) => sum + (w - mean) ** 2, 0) / weights.length;
  const fairness_score = Math.max(0, 100 - variance); // Lower variance = higher fairness

  // Create provenance trail
  const decision: AtomDecision = {
    atom_tag: `ATOM-SCHED-${Date.now()}`,
    type: "ENHANCE",
    description: `Scheduled ${schedule.length} agents for resource ${resource.name}`,
    timestamp: new Date().toISOString(),
    tags: ["scheduling", "fairness", "coherence"],
    freshness: "fresh",
    verified: false,
  };

  const trail = createTrailEntry(decision);

  return {
    schedule,
    fairness_score,
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}
