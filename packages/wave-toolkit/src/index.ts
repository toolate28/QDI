/**
 * @spiralsafe/wave-toolkit
 *
 * Coherence detection treating text as vector fields.
 * Detects curl (circular reasoning), divergence (expansion), potential (latent structure).
 * Integrates Chaos/Fibonacci scoring with golden ratio optimization.
 */

// Constants
export const PHI = 1.618033988749895; // Golden ratio
export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const;

// Types
export interface WaveMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  lexicalDiversity: number;
  readabilityScore: number;
}

export interface CoherenceMetrics {
  curl: number;       // Circular reasoning (0-1, lower is better)
  divergence: number; // Expansion/contraction (0-1, ~0.2 is ideal)
  potential: number;  // Latent structure (0-1, higher is better)
  entropy: number;    // Information density (0-1)
}

export interface WaveAnalysisResult {
  input_preview: string;
  metrics: WaveMetrics;
  coherence: CoherenceMetrics;
  coherence_score: number;
  chaos_score: number;
  warnings: string[];
  timestamp: string;
}

/**
 * Calculate lexical diversity (Type-Token Ratio)
 */
function lexicalDiversity(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  if (!words.length) return 0;
  return new Set(words).size / words.length;
}

/**
 * Detect curl (circular reasoning) via repeated patterns
 */
function detectCurl(sentences: string[]): number {
  const sequences = new Map<string, number>();

  for (const sentence of sentences) {
    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    for (let i = 0; i < words.length - 2; i++) {
      const seq = words.slice(i, i + 3).join(' ');
      sequences.set(seq, (sequences.get(seq) || 0) + 1);
    }
  }

  let repetition = 0;
  for (const count of sequences.values()) {
    if (count > 1) repetition += (count - 1) * 0.2;
  }

  return sequences.size ? Math.min(1, repetition / sequences.size) : 0;
}

/**
 * Detect divergence (unresolved expansion)
 */
function detectDivergence(sentences: string[]): number {
  if (sentences.length < 3) return 0;

  const complexities = sentences.map(s => (s.match(/\b\w+\b/g) || []).length);
  let expansion = 0;

  for (let i = 1; i < complexities.length; i++) {
    if (complexities[i] - complexities[i - 1] > 5) expansion += 0.1;
  }

  // Check for resolution in final third
  const lastThird = complexities.slice(-Math.floor(sentences.length / 3));
  const hasResolution = lastThird.some((c, i) => i > 0 && c < lastThird[i - 1]);

  if (!hasResolution && expansion > 0) expansion += 0.2;

  return Math.min(1, expansion);
}

/**
 * Calculate potential (latent structure)
 */
function calculatePotential(text: string, lexDiv: number): number {
  const connectives = ['therefore', 'however', 'moreover', 'furthermore',
                       'consequently', 'nevertheless', 'specifically'];
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const connectiveRatio = words.filter(w => connectives.includes(w)).length / (words.length || 1);

  return Math.min(1, lexDiv * 0.6 + connectiveRatio * 20 * 0.4);
}

/**
 * Calculate entropy (information density)
 */
function calculateEntropy(text: string): number {
  const freq = new Map<string, number>();
  for (const char of text) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / text.length;
    entropy -= p * Math.log2(p);
  }

  return Math.min(1, entropy / 8); // Normalized
}

/**
 * Chaos/Fibonacci scoring with golden ratio
 */
export function calculateChaosScore(metrics: CoherenceMetrics): number {
  const base = metrics.curl * PHI + metrics.divergence / PHI;
  const fibIndex = Math.min(Math.floor(metrics.potential * 10), FIBONACCI.length - 1);
  const fibWeight = FIBONACCI[fibIndex];
  return (base * fibWeight) / 100; // Normalized 0-1
}

/**
 * Analyze text for WAVE patterns
 */
export function analyzeWave(input: string): WaveAnalysisResult {
  const warnings: string[] = [];

  // Segment
  const sentences = input.split(/[.!?]+/).filter(s => s.trim());
  const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim());
  const words = input.match(/\b\w+\b/g) || [];

  // Metrics
  const lexDiv = lexicalDiversity(input);
  const metrics: WaveMetrics = {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    lexicalDiversity: lexDiv,
    readabilityScore: Math.max(0, 100 - (words.length / (sentences.length || 1)) * 2)
  };

  // Coherence
  const curl = detectCurl(sentences);
  const divergence = detectDivergence(sentences);
  const potential = calculatePotential(input, lexDiv);
  const entropy = calculateEntropy(input);

  const coherence: CoherenceMetrics = { curl, divergence, potential, entropy };

  // Warnings
  if (curl > 0.6) warnings.push('CRITICAL: High curl (circular reasoning)');
  else if (curl > 0.3) warnings.push('WARNING: Moderate curl');

  if (divergence > 0.7) warnings.push('CRITICAL: High divergence (unresolved expansion)');
  else if (divergence > 0.4) warnings.push('WARNING: Moderate divergence');

  if (potential > 0.7) warnings.push('NOTE: High potential (develop further)');

  // Scores
  const coherence_score = Math.round(
    (1 - curl * 0.4 - Math.abs(divergence - 0.2) * 0.3 - (1 - potential) * 0.2 - (1 - entropy) * 0.1) * 100
  );

  const chaos_score = calculateChaosScore(coherence);

  return {
    input_preview: input.slice(0, 200) + (input.length > 200 ? '...' : ''),
    metrics,
    coherence,
    coherence_score: Math.max(0, Math.min(100, coherence_score)),
    chaos_score,
    warnings,
    timestamp: new Date().toISOString()
  };
}

// Re-export for convenience
export type { WaveMetrics, CoherenceMetrics, WaveAnalysisResult };
