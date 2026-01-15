/**
 * Example: Ethical Quantum Computing Framework
 * 
 * Demonstrates key features:
 * - Equitable resource allocation with 70% coherence baseline
 * - Privacy safeguards with differential privacy
 * - AI-Quantum integration with ethics alignment
 * - Quantum simulation and circuit execution
 * - Public verifiability
 */

import { QuantumEthicsFramework } from '../src/framework';
import { createQuantumCircuit, createBellState, visualizeCircuit } from '../src/quantum-simulator';
import { detectBias, analyzeExplainability } from '../src/ai-integration';

console.log('=== Quantum Ethics Framework Demo ===\n');

// 1. Initialize framework
const framework = new QuantumEthicsFramework({
  coherenceBaseline: 70,
  publicVerification: true,
  scalabilityEnabled: true
});

console.log('✓ Framework initialized with 70% coherence baseline\n');

// 2. Request resources (educational user)
console.log('--- Resource Allocation ---');
const resourceRequest = {
  qubits: 10,
  gateDepth: 50,
  estimatedTimeMs: 5000,
  purpose: 'Research quantum machine learning algorithms for optimizing molecular properties in drug discovery, with focus on improving prediction accuracy for protein-ligand binding affinity'
};

const { allocation, decision, waveAnalysis } = framework.requestResources(
  'student-456',
  resourceRequest,
  'educational'
);

if (allocation) {
  console.log(`✓ Resources allocated: ${allocation.qubits} qubits`);
  console.log(`  Fairness score: ${allocation.fairnessScore.toFixed(2)}`);
  console.log(`  Status: ${allocation.status}`);
  console.log(`  ATOM tag: ${decision.atom_tag}`);
  console.log(`  Coherence: ${waveAnalysis.coherence_score}% (baseline: 70%)`);
  console.log(`  Wave metrics:`);
  console.log(`    - Curl (circular reasoning): ${waveAnalysis.coherence.curl.toFixed(3)}`);
  console.log(`    - Divergence (expansion): ${waveAnalysis.coherence.divergence.toFixed(3)}`);
  console.log(`    - Potential (structure): ${waveAnalysis.coherence.potential.toFixed(3)}`);
} else {
  console.log(`✗ Resources denied: ${decision.description}`);
}
console.log();

// 3. Register AI-Quantum integration
console.log('--- AI-Quantum Integration ---');
const integrationResult = framework.registerAIIntegration(
  'variational-quantum-eigensolver',
  '10Q-50D',
  'Quantum variational eigensolver combined with classical neural network for molecular ground state energy prediction, enabling efficient drug candidate screening'
);

if (integrationResult.integration) {
  console.log(`✓ Integration validated`);
  console.log(`  Coherence: ${integrationResult.integration.coherenceScore}%`);
  console.log(`  Ethics alignment: ${(integrationResult.integration.ethicsAlignment * 100).toFixed(1)}%`);
  console.log(`  Explainability: ${(integrationResult.integration.explainabilityScore * 100).toFixed(1)}%`);
  console.log(`  Bias score: ${(integrationResult.integration.biasScore * 100).toFixed(1)}% (lower is better)`);
  console.log(`  Verifiable: ${integrationResult.integration.verifiable ? 'Yes' : 'No'}`);
  
  if (integrationResult.alignment.recommendations.length > 0) {
    console.log(`  Recommendations:`);
    integrationResult.alignment.recommendations.forEach(rec => {
      console.log(`    - ${rec}`);
    });
  }
} else {
  console.log(`✗ Integration failed: ${integrationResult.decision.description}`);
}
console.log();

// 4. Create quantum-AI hybrid algorithm
console.log('--- Quantum-AI Hybrid Algorithm ---');
const hybridResult = framework.createHybridAlgorithm(
  'Quantum Drug Discovery Engine',
  'Combines quantum circuit for molecular simulation with classical machine learning for property prediction',
  {
    qubits: 10,
    gates: ['H', 'RY', 'CNOT', 'RZ'],
    depth: 50
  },
  {
    model: 'neural-network',
    parameters: { layers: 3, neurons: [128, 64, 32] }
  }
);

console.log(`✓ Hybrid algorithm created`);
console.log(`  Name: ${hybridResult.algorithm.name}`);
console.log(`  Verified: ${hybridResult.algorithm.verified}`);
console.log(`  Safety score: ${hybridResult.algorithm.safetyScore.toFixed(2)}`);

// Bias detection
const biasAnalysis = detectBias(hybridResult.algorithm, [
  { input: { mol: 'A' }, expectedOutput: 0.8, group: 'group1' },
  { input: { mol: 'B' }, expectedOutput: 0.7, group: 'group2' }
]);

console.log(`  Bias detected: ${biasAnalysis.detected ? 'Yes' : 'No'}`);
if (biasAnalysis.detected) {
  console.log(`  Bias score: ${biasAnalysis.biasScore.toFixed(2)}`);
  console.log(`  Mitigation: ${biasAnalysis.mitigation[0] || 'None needed'}`);
}

// Explainability
const explainability = analyzeExplainability(
  hybridResult.algorithm,
  'The algorithm uses a parametrized quantum circuit to encode molecular structure, followed by variational optimization to find ground state energy, which is then fed into a neural network for binding affinity prediction'
);

console.log(`  Explainability: ${explainability.explainable ? 'Yes' : 'No'} (score: ${explainability.score.toFixed(2)})`);
console.log();

// 5. Execute quantum circuit
console.log('--- Quantum Circuit Execution ---');

// Create Bell state (entanglement demo)
const bellCircuit = createBellState();
console.log('Bell state circuit:');
console.log(visualizeCircuit(bellCircuit));

const executionResult = framework.executeQuantumCircuit('student-456', bellCircuit, 5);

if (executionResult.results) {
  console.log(`✓ Circuit executed: ${executionResult.results.length} shots`);
  console.log(`  Results:`);
  executionResult.results.forEach((result, i) => {
    console.log(`    Shot ${i + 1}: ${result.outcomes.join('')} (probability: ${result.probability.toFixed(3)})`);
  });
} else {
  console.log(`✗ Execution failed: ${executionResult.decision.description}`);
}
console.log();

// 6. Privacy-protected access
console.log('--- Privacy-Protected Access ---');
const accessResult = framework.requestSecureAccess('student-456', 'quantum-data-789', 'measure');

if (accessResult.access) {
  console.log(`✓ Secure access granted`);
  console.log(`  Operation: ${accessResult.access.operation}`);
  console.log(`  Privacy budget used: ${accessResult.access.privacyBudgetUsed.toFixed(3)}`);
  console.log(`  Encrypted: ${accessResult.access.encrypted}`);
  console.log(`  Anonymized: ${accessResult.access.anonymized}`);
} else {
  console.log(`✗ Access denied: ${accessResult.decision.description}`);
}
console.log();

// 7. Framework status
console.log('--- Framework Status ---');
const status = framework.getStatus();
console.log(`Total allocations: ${status.totalAllocations}`);
console.log(`Active allocations: ${status.activeAllocations}`);
console.log(`Total integrations: ${status.totalIntegrations}`);
console.log(`Valid integrations: ${status.validIntegrations}`);
console.log(`Average coherence: ${status.averageCoherence.toFixed(1)}%`);
console.log(`Privacy compliance: ${status.privacyCompliance.compliant ? 'PASS' : 'FAIL'}`);
console.log(`Trail entries: ${status.trailEntries}`);
console.log();

// 8. Public verification
console.log('--- Public Verification Audit ---');
const audit = framework.verifyPublicAudit();
console.log(`Overall verification: ${audit.verified ? '✓ PASSED' : '✗ FAILED'}`);
console.log(`Coherence alignment: ${audit.coherenceAlignment ? '✓' : '✗'}`);
console.log(`Privacy compliance: ${audit.privacyCompliance ? '✓' : '✗'}`);
console.log(`Resource fairness: ${audit.resourceFairness ? '✓' : '✗'}`);
console.log('\nDetails:');
audit.details.forEach(detail => console.log(`  ${detail}`));
console.log();

// 9. Provenance trail
console.log('--- ATOM Provenance Trail ---');
const trail = framework.getProvenanceTrail();
console.log(`Total trail entries: ${trail.length}`);
console.log('Recent decisions:');
trail.slice(-3).forEach(entry => {
  console.log(`  ${entry.decision.atom_tag}`);
  console.log(`    Type: ${entry.decision.type}`);
  console.log(`    Description: ${entry.decision.description}`);
  console.log(`    Tags: ${entry.decision.tags?.join(', ') || 'none'}`);
});

console.log('\n=== Demo Complete ===');
