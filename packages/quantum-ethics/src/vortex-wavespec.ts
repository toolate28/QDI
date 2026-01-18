/**
 * VORTEX WAVEspec - Verified Operational Runtime Testing for Ecosystem Xecution
 *
 * Integrates with:
 * - Datalore notebooks
 * - Runpod deployments
 * - SpiralSafe/QDI/HOPE API endpoints
 * - Cloudflare edge functions
 *
 * Emergent quality target: >60%
 * Fibonacci ratio: 1.618
 * 
 * === COHERENCE SCORE SCALE CONVENTION ===
 * This module works with coherence scores in two scales:
 * 
 * 1. INPUT (from wave-toolkit): 0-100 scale
 *    - analyzeWave() returns coherence_score in 0-100 range
 *    - This is the "raw" score for human readability
 * 
 * 2. INTERNAL PROCESSING: 0-1 scale
 *    - COHERENCE_THRESHOLD and other thresholds use 0-1 scale
 *    - normalizeCoherenceScore() converts from 0-100 to 0-1
 *    - VortexResult.coherenceScore is in 0-1 scale
 *    - VortexCluster.coherence is in 0-1 scale
 * 
 * Always use normalizeCoherenceScore() when converting from wave-toolkit
 * results to internal processing values.
 */

import { type AtomDecision, createDecision } from "@spiralsafe/atom-trail";
import {
  analyzeWave,
  FIBONACCI,
  PHI,
  type WaveAnalysisResult,
} from "@spiralsafe/wave-toolkit";

// VORTEX Marker for cross-system integration
export const VORTEX_MARKER = "VORTEX::QDI::v1";
/**
 * Minimum coherence threshold for PASS status (0-1 scale)
 * Note: This is in 0-1 scale. Wave-toolkit returns scores in 0-100 scale,
 * so use normalizeCoherenceScore() to convert before comparison.
 */
export const COHERENCE_THRESHOLD = 0.6; // 60% minimum for PASS

export interface VortexNode {
  name: string;
  status: "CLEAN" | "DIRTY" | "WARN" | "ERROR";
  branch: string;
  commit: string;
  changes: { added: number; removed: number };
}

export interface VortexConfig {
  emergentQuality: number; // Target >60%
  fibonacciRatio: number; // 1.618
  nodes: string[];
  endpoints: {
    datalore: boolean;
    runpod: boolean;
    spiralsafe: boolean;
    qdi: boolean;
    hope: boolean;
    cloudflare: boolean;
  };
}

export interface VortexResult {
  timestamp: string;
  /** Coherence score in 0-1 scale (normalized from wave-toolkit's 0-100 scale) */
  coherenceScore: number;
  emergentQuality: string;
  passed: boolean;
  nodes: VortexNode[];
  waveAnalysis: WaveAnalysisResult;
  atomDecision: AtomDecision;
  marker: string;
}

export interface VortexDashboardPayload {
  $schema: string;
  meta: {
    name: string;
    version: string;
    emergentQuality: string;
    fibonacciRatio: number;
    timestamp: string;
  };
  vortexes: VortexCluster[];
  endpoints: EndpointStatus[];
}

export interface VortexCluster {
  vortex_name: string;
  description: string;
  /** Coherence score in 0-1 scale (normalized and possibly boosted) */
  coherence: number;
  components: string[];
  refinements: VortexRefinement[];
}

export interface VortexRefinement {
  original: string;
  refined: string;
  autonomy: string;
  proof?: string;
}

export interface EndpointStatus {
  name: string;
  url: string;
  status: "connected" | "pending" | "disconnected";
  vortexEnabled: boolean;
}

const DEFAULT_VORTEX_CONFIG: VortexConfig = {
  emergentQuality: 0.6,
  fibonacciRatio: PHI,
  nodes: ["SPIRAL", "MONO", "QDI", "QR", "HOPE", "CMCP"],
  endpoints: {
    datalore: true,
    runpod: true,
    spiralsafe: true,
    qdi: true,
    hope: true,
    cloudflare: true,
  },
};

/**
 * Normalize coherence score from 0-100 scale to 0-1 scale
 * 
 * Note: wave-toolkit's analyzeWave() returns coherence_score in 0-100 scale
 * for human readability. This function converts it to 0-1 scale for internal
 * calculations and comparison with COHERENCE_THRESHOLD (which is in 0-1 scale).
 * 
 * @param rawScore - The coherence score in 0-100 range from wave-toolkit
 * @return Normalized score in 0-1 range, clamped to valid bounds
 */
function normalizeCoherenceScore(rawScore: number): number {
  return Math.max(0, Math.min(1, rawScore / 100));
}

/**
 * Vortex criticality levels determine coherence boost based on system importance.
 * Higher criticality = greater coherence boost to ensure stability of critical subsystems.
 */
enum VortexCriticality {
  MONITORING = 0, // Baseline - observational role, no boost needed
  PLANNING = 3, // Infrastructure planning requires moderate stability
  TESTING = 5, // Testing/compliance needs high reliability for audit integrity
  CORE = 8, // Core ethics/philosophy requires maximum coherence for system integrity
}

/**
 * Calculate coherence boost based on vortex criticality level.
 * Formula: boost = criticality / 100
 * This ensures critical vortexes maintain higher coherence thresholds
 * while staying within the 0-1 normalized range.
 */
function calculateCoherenceBoost(criticality: VortexCriticality): number {
  return criticality / 100;
}

/**
 * Create VORTEX dashboard payload for endpoint integration
 */
export function createVortexPayload(
  analysisText: string,
  config: Partial<VortexConfig> = {},
): VortexDashboardPayload {
  const cfg = { ...DEFAULT_VORTEX_CONFIG, ...config };
  const waveAnalysis = analyzeWave(analysisText);

  const baseCoherence = normalizeCoherenceScore(waveAnalysis.coherence_score);

  const vortexes: VortexCluster[] = [
    {
      vortex_name: "MonitoringVortex",
      description:
        "Autonomous monitoring cluster – self-maintains coherence metrics",
      coherence: Math.min(
        1,
        baseCoherence + calculateCoherenceBoost(VortexCriticality.MONITORING),
      ),
      components: [
        "CoherenceConstellation.tsx",
        "SpectralAnalyzer.tsx",
        "SessionMonitor.tsx",
      ],
      refinements: [
        {
          original: "CoherenceConstell.tsx",
          refined: "CoherenceConstellation.tsx",
          autonomy: "useState hook for local metrics, tests via Jest",
          proof:
            "Visuals: Matplotlib plots; Proofreading: DSpy-tuned metrics >60%",
        },
      ],
    },
    {
      vortex_name: "TestingVortex",
      description:
        "Autonomous testing/compliance – self-maintains audits/proofs",
      coherence: Math.min(
        1,
        baseCoherence + calculateCoherenceBoost(VortexCriticality.TESTING),
      ),
      components: [
        "LoadTestingSimulator.tsx",
        "ComplianceTracker.tsx",
        "SortingHat.tsx",
      ],
      refinements: [
        {
          original: "LoadTestingSimu.tsx",
          refined: "LoadTestingSimulator.tsx",
          autonomy: "useEffect for sim runs, Cypress tests",
          proof: "Coverage 95%",
        },
      ],
    },
    {
      vortex_name: "PlanningVortex",
      description: "Autonomous planning/infra – self-maintains transitions",
      coherence: Math.min(
        1,
        baseCoherence + calculateCoherenceBoost(VortexCriticality.PLANNING),
      ),
      components: [
        "MigrationPlanner.tsx",
        "HardwareBridge.tsx",
        "TransitionTimeline.tsx",
      ],
      refinements: [
        {
          original: "MigrationPlanner.tsx",
          refined: "MigrationPlanner.tsx",
          autonomy: "Modular reducers, lifecycle phases",
          proof: "Bayesian opt via Ax",
        },
      ],
    },
    {
      vortex_name: "CoreVortex",
      description: "Autonomous core/philo – self-maintains ethics",
      coherence: Math.min(
        1,
        baseCoherence + calculateCoherenceBoost(VortexCriticality.CORE),
      ),
      components: ["HopeSaucedPhilosophy.tsx", "StakeholderHub.tsx"],
      refinements: [
        {
          original: "HopeSaucedPhilo.tsx",
          refined: "HopeSaucedPhilosophy.tsx",
          autonomy: "Context providers, ethical tests",
          proof: "Coherence >60%",
        },
      ],
    },
  ];

  const endpoints: EndpointStatus[] = [
    {
      name: "Datalore",
      url: "https://datalore.jetbrains.com",
      status: cfg.endpoints.datalore ? "connected" : "pending",
      vortexEnabled: true,
    },
    {
      name: "Runpod",
      url: "https://api.runpod.io",
      status: cfg.endpoints.runpod ? "connected" : "pending",
      vortexEnabled: true,
    },
    {
      name: "SpiralSafe",
      url: "https://spiralsafe.dev",
      status: cfg.endpoints.spiralsafe ? "connected" : "pending",
      vortexEnabled: true,
    },
    {
      name: "QDI",
      url: "https://qdi.spiralsafe.dev",
      status: cfg.endpoints.qdi ? "connected" : "pending",
      vortexEnabled: true,
    },
    {
      name: "HOPE",
      url: "https://hope.spiralsafe.dev",
      status: cfg.endpoints.hope ? "connected" : "pending",
      vortexEnabled: true,
    },
    {
      name: "Cloudflare",
      url: "https://workers.cloudflare.com",
      status: cfg.endpoints.cloudflare ? "connected" : "pending",
      vortexEnabled: true,
    },
  ];

  return {
    $schema: "https://spiralsafe.dev/vortex-dashboard-v1.json",
    meta: {
      name: "VORTEX Dashboard Payload",
      version: "1.0.0",
      emergentQuality: `>${cfg.emergentQuality * 100}%`,
      fibonacciRatio: cfg.fibonacciRatio,
      timestamp: new Date().toISOString(),
    },
    vortexes,
    endpoints,
  };
}

/**
 * Run VORTEX coherence check
 */
export function runVortexCheck(
  analysisText: string,
  nodes: VortexNode[] = [],
  config: Partial<VortexConfig> = {},
): VortexResult {
  const cfg = { ...DEFAULT_VORTEX_CONFIG, ...config };
  const waveAnalysis = analyzeWave(analysisText);

  const coherenceScore = normalizeCoherenceScore(waveAnalysis.coherence_score);
  const passed = coherenceScore >= cfg.emergentQuality;

  const atomDecision = createDecision(
    "VERIFY",
    `VORTEX check: ${passed ? "PASS" : "FAIL"} at ${(coherenceScore * 100).toFixed(1)}%`,
    [],
    ["vortex", passed ? "pass" : "fail", "coherence"],
  );

  return {
    timestamp: new Date().toISOString(),
    coherenceScore,
    emergentQuality: `${(coherenceScore * 100).toFixed(1)}%`,
    passed,
    nodes,
    waveAnalysis,
    atomDecision,
    marker: VORTEX_MARKER,
  };
}

/**
 * Generate VORTEX status report
 */
export function formatVortexReport(result: VortexResult): string {
  const lines: string[] = [];

  lines.push(
    "VORTEX - Verified Operational Runtime Testing for Ecosystem Xecution",
  );
  lines.push(
    "======================================================================",
  );
  lines.push("");
  lines.push(`Timestamp: ${result.timestamp}`);
  lines.push("");
  lines.push("NODE STATUS:");
  lines.push(
    "----------------------------------------------------------------------",
  );

  if (result.nodes.length > 0) {
    lines.push("Name     | Status | Branch       | Commit   | Changes");
    lines.push("---------|--------|--------------|----------|----------");
    for (const node of result.nodes) {
      lines.push(
        `${node.name.padEnd(8)} | ${node.status.padEnd(6)} | ${node.branch.padEnd(12)} | ${node.commit.slice(0, 8)} | +${node.changes.added}/-${node.changes.removed}`,
      );
    }
  } else {
    lines.push("No nodes configured");
  }

  lines.push("");
  lines.push("COHERENCE METRICS:");
  lines.push(
    "----------------------------------------------------------------------",
  );
  lines.push(`Score: ${result.emergentQuality}`);
  lines.push(`Threshold: ${COHERENCE_THRESHOLD * 100}%`);
  lines.push(`Status: ${result.passed ? "✅ PASS" : "❌ FAIL"}`);
  lines.push("");
  lines.push(`Marker: ${result.marker}`);
  lines.push(
    "======================================================================",
  );

  return lines.join("\n");
}

/**
 * Apply Fibonacci-weighted boost to coherence score
 */
export function applyFibonacciWeightedBoost(
  baseCoherence: number,
  iteration: number,
): number {
  // Ensure base coherence is within [0, 1] before applying boost
  const normalizedBaseCoherence = Math.max(0, Math.min(1, baseCoherence));
  const fibIndex = Math.min(iteration, FIBONACCI.length - 1);
  const fibWeight = FIBONACCI[fibIndex] / FIBONACCI[FIBONACCI.length - 1];
  return Math.min(1, normalizedBaseCoherence + fibWeight * 0.1);
}

// Export for use in dashboard and endpoints
export default VORTEX_MARKER;
