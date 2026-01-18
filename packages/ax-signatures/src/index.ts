/**
 * @spiralsafe/ax-signatures
 *
 * Ax/DSPy signatures for coherence optimization.
 * Based on DSPy tutorials: https://dspy.ai/tutorials/optimize_ai_program/
 */

import { AxAI, AxSignature, AxChainOfThought } from '@ax-llm/ax';

/**
 * Coherence Interpreter Signature
 * Interprets wave analysis metrics and provides actionable insights.
 * 
 * Note: All metrics should be normalized to 0-1 scale:
 * - curl, divergence, potential: Already in 0-1 scale from wave-toolkit
 * - coherence_score: Must be normalized from 0-100 to 0-1 (divide by 100)
 */
export const coherenceInterpreter = new AxSignature({
  name: 'CoherenceInterpreter',
  description: 'Interprets wave analysis metrics and provides actionable insights',
  input: {
    curl: 'number: Repetition metric (0-1)',
    divergence: 'number: Expansion metric (0-1)',
    potential: 'number: Undeveloped ideas metric (0-1)',
    coherence_score: 'number: Overall coherence normalized to 0-1 scale (divide wave-toolkit score by 100)',
    context: 'string: The analyzed text or document reference'
  },
  output: {
    interpretation: 'string: Clear explanation of what the metrics mean',
    recommendations: 'array<string>: Specific actions to improve coherence',
    priority: 'string: HIGH | MEDIUM | LOW - urgency of action',
    reasoning: 'string: Why these recommendations matter'
  }
});

/**
 * Gate Transition Validator Signature
 * Validates readiness for phase transitions (AWI → ATOM → SAIF).
 */
export const gateTransitionValidator = new AxSignature({
  name: 'GateTransitionValidator',
  description: 'Validates readiness for phase transitions with detailed reasoning',
  input: {
    current_phase: 'string: Current workflow phase (AWI, ATOM, SAIF)',
    target_phase: 'string: Target workflow phase',
    context_yaml: 'string: Content of .context.yaml file',
    atom_decisions: 'array<object>: Recent ATOM trail decisions',
    wave_scores: 'array<number>: Recent coherence scores',
    intent_scaffolding: 'string: AWI intent documentation'
  },
  output: {
    ready: 'boolean: Whether transition is approved',
    confidence: 'number: Confidence in decision (0-1)',
    blockers: 'array<string>: Issues preventing transition (if not ready)',
    recommendations: 'array<string>: Steps to prepare for transition',
    reasoning: 'string: Chain of thought explaining the decision'
  }
});

/**
 * Context Packer Signature
 * Optimizes .context.yaml for AI consumption.
 */
export const contextPacker = new AxSignature({
  name: 'ContextPacker',
  description: 'Optimizes context.yaml packing for efficient AI processing',
  input: {
    files: 'array<string>: List of relevant files',
    intent: 'string: What the AI needs to accomplish',
    constraints: 'array<string>: Resource or time constraints'
  },
  output: {
    packed_context: 'string: Optimized context.yaml content',
    priority_files: 'array<string>: Most important files to include',
    excluded_rationale: 'string: Why certain files were excluded'
  }
});

/**
 * Wave Analyzer Signature
 * Deep analysis of text coherence patterns.
 */
export const waveAnalyzer = new AxSignature({
  name: 'WaveAnalyzer',
  description: 'Performs deep wave analysis on text with pattern detection',
  input: {
    text: 'string: Text to analyze',
    prior_scores: 'array<number>: Previous coherence scores for trend analysis',
    domain: 'string: Domain context (technical, creative, business)'
  },
  output: {
    curl_analysis: 'string: Detailed analysis of circular reasoning patterns',
    divergence_analysis: 'string: Analysis of expansion/resolution balance',
    potential_analysis: 'string: Latent structure and development opportunities',
    trend: 'string: IMPROVING | STABLE | DECLINING',
    suggested_edits: 'array<string>: Specific text improvements'
  }
});

/**
 * Create optimized program for coherence interpretation
 * 
 * @param ai - The AI instance to use for generation
 * @param waveResults - Wave analysis results with normalized metrics
 * @param waveResults.coherence_score - Must be normalized to 0-1 scale (not 0-100)
 * 
 * Note: If using wave-toolkit's analyzeWave(), divide coherence_score by 100
 * before passing to this function to match the expected 0-1 scale.
 */
export async function interpretCoherence(
  ai: AxAI,
  waveResults: {
    curl: number;
    divergence: number;
    potential: number;
    coherence_score: number;
    context: string;
  }
) {
  const cot = new AxChainOfThought(coherenceInterpreter);
  return await ai.generate(cot, waveResults);
}

/**
 * Create optimized program for gate validation
 */
export async function validateGateTransition(
  ai: AxAI,
  input: {
    current_phase: string;
    target_phase: string;
    context_yaml: string;
    atom_decisions: object[];
    wave_scores: number[];
    intent_scaffolding: string;
  }
) {
  const cot = new AxChainOfThought(gateTransitionValidator);
  return await ai.generate(cot, input);
}

// Re-export signatures for customization
export {
  coherenceInterpreter,
  gateTransitionValidator,
  contextPacker,
  waveAnalyzer
};
