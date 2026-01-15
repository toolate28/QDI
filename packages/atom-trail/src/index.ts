/**
 * @spiralsafe/atom-trail
 *
 * ATOM (Atomic Task Orchestration Method) provenance tracking.
 * Gates: KENL → AWI → ATOM → SAIF → Safe Spiral
 */

// Types
export type AtomType = 'INIT' | 'DOC' | 'ENHANCE' | 'FIX' | 'VERIFY' | 'COMPLETE' | 'KENL' | 'EDIT';
export type Gate = 'kenl-to-awi' | 'awi-to-atom' | 'atom-to-saif' | 'saif-to-spiral';
export type Phase = 'KENL' | 'AWI' | 'ATOM' | 'SAIF';

export interface AtomDecision {
  atom_tag: string;
  type: AtomType;
  description: string;
  timestamp: string;
  files?: string[];
  tags?: string[];
  freshness: 'fresh' | 'stable' | 'frozen';
  verified?: boolean;
}

export interface GateResult {
  gate: Gate;
  from: Phase;
  to: Phase;
  passed: boolean;
  checks: Record<string, boolean>;
  failed_checks: string[];
  timestamp: string;
}

export interface TrailEntry {
  id: string;
  decision: AtomDecision;
  gate_results: GateResult[];
  created_at: string;
}

// Counter state (in-memory, should persist to .atom-trail/counters/)
const counters = new Map<string, number>();

/**
 * Generate ATOM tag: ATOM-TYPE-YYYYMMDD-NNN-description
 */
export function generateAtomTag(type: AtomType, description: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${type}-${date}`;
  const counter = (counters.get(key) || 0) + 1;
  counters.set(key, counter);

  const slug = description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  return `ATOM-${type}-${date}-${counter.toString().padStart(3, '0')}-${slug}`;
}

/**
 * Create a decision record
 */
export function createDecision(
  type: AtomType,
  description: string,
  files?: string[],
  tags?: string[]
): AtomDecision {
  return {
    atom_tag: generateAtomTag(type, description),
    type,
    description,
    timestamp: new Date().toISOString(),
    files,
    tags,
    freshness: 'fresh',
    verified: false
  };
}

/**
 * Gate validators
 */
const gateValidators: Record<Gate, (context: any) => GateResult> = {
  'kenl-to-awi': (context) => {
    const checks: Record<string, boolean> = {
      has_knowledge_base: !!context.knowledge,
      has_intent: !!context.intent,
      intent_has_scope: !!context.intent?.scope,
      intent_has_justification: !!context.intent?.justification
    };

    const failed = Object.entries(checks)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    return {
      gate: 'kenl-to-awi',
      from: 'KENL',
      to: 'AWI',
      passed: failed.length === 0,
      checks,
      failed_checks: failed,
      timestamp: new Date().toISOString()
    };
  },

  'awi-to-atom': (context) => {
    const checks: Record<string, boolean> = {
      has_intent_doc: !!context.intent_doc,
      has_execution_plan: !!context.plan,
      plan_is_atomic: Array.isArray(context.plan?.steps),
      has_rollback: !!context.plan?.rollback
    };

    const failed = Object.entries(checks)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    return {
      gate: 'awi-to-atom',
      from: 'AWI',
      to: 'ATOM',
      passed: failed.length === 0,
      checks,
      failed_checks: failed,
      timestamp: new Date().toISOString()
    };
  },

  'atom-to-saif': (context) => {
    const checks: Record<string, boolean> = {
      execution_complete: !!context.completed,
      tests_pass: context.tests_passed !== false,
      no_regressions: context.regressions?.length === 0,
      artifacts_verified: !!context.verified
    };

    const failed = Object.entries(checks)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    return {
      gate: 'atom-to-saif',
      from: 'ATOM',
      to: 'SAIF',
      passed: failed.length === 0,
      checks,
      failed_checks: failed,
      timestamp: new Date().toISOString()
    };
  },

  'saif-to-spiral': (context) => {
    const checks: Record<string, boolean> = {
      lesson_documented: !!context.lesson,
      knowledge_updated: !!context.knowledge_updated,
      ready_for_next_cycle: context.ready !== false
    };

    const failed = Object.entries(checks)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    return {
      gate: 'saif-to-spiral',
      from: 'SAIF',
      to: 'KENL', // Spiral back to knowledge
      passed: failed.length === 0,
      checks,
      failed_checks: failed,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Validate a gate transition
 */
export function validateGate(gate: Gate, context: any): GateResult {
  const validator = gateValidators[gate];
  if (!validator) {
    return {
      gate,
      from: 'KENL',
      to: 'AWI',
      passed: false,
      checks: {},
      failed_checks: ['unknown_gate'],
      timestamp: new Date().toISOString()
    };
  }
  return validator(context);
}

/**
 * Create a full trail entry
 */
export function createTrailEntry(
  decision: AtomDecision,
  gateResults: GateResult[] = []
): TrailEntry {
  return {
    id: crypto.randomUUID(),
    decision,
    gate_results: gateResults,
    created_at: new Date().toISOString()
  };
}

/**
 * Check if transition is ready
 */
export function isTransitionReady(from: Phase, to: Phase, context: any): boolean {
  const gateMap: Record<string, Gate> = {
    'KENL-AWI': 'kenl-to-awi',
    'AWI-ATOM': 'awi-to-atom',
    'ATOM-SAIF': 'atom-to-saif',
    'SAIF-KENL': 'saif-to-spiral'
  };

  const gate = gateMap[`${from}-${to}`];
  if (!gate) return false;

  const result = validateGate(gate, context);
  return result.passed;
}

// Re-exports
export type { AtomDecision, GateResult, TrailEntry };
