/**
 * Example: Time-Zone Simulation and Coherence Dashboard
 * 
 * Demonstrates new features:
 * - Time-zone simulation for quantum circuits (forwards scalability)
 * - Coherence metrics dashboard (translates significance)
 */

import { 
  TimeZoneSimulator, 
  createTimeEvolution,
  simulateDecoherence 
} from '../src/quantum-simulator';
import {
  generateCoherenceDashboard,
  formatDashboard,
  analyzeTextForDashboard,
  compareCoherence
} from '../src/coherence-dashboard';
import { analyzeWave } from '@spiralsafe/wave-toolkit';

console.log('=== Time-Zone Simulation & Coherence Dashboard Demo ===\n');

// ============================================================
// PART 1: Time-Zone Simulation (Forwards Scalability)
// ============================================================

console.log('--- Time-Zone Simulation ---');
console.log('Simulating quantum system evolution over time...\n');

// Create time-zone simulator
const timeSimulator = new TimeZoneSimulator(2);

// Configure time evolution
const evolutionConfig = {
  hamiltonian: 'pauli-z' as const,
  timeSteps: 10,
  stepSize: 0.1 // 0.1 time units per step
};

console.log('Configuration:');
console.log(`  Hamiltonian: ${evolutionConfig.hamiltonian}`);
console.log(`  Time steps: ${evolutionConfig.timeSteps}`);
console.log(`  Step size: ${evolutionConfig.stepSize}`);
console.log(`  Total time: ${evolutionConfig.timeSteps * evolutionConfig.stepSize}`);
console.log('');

// Run time evolution
const evolutionResult = timeSimulator.evolve(evolutionConfig);

console.log('Evolution Results:');
console.log(`  Initial state: ${JSON.stringify(evolutionResult.initialState)}`);
console.log(`  Final state: ${JSON.stringify(evolutionResult.finalState)}`);
console.log(`  State fidelity: ${evolutionResult.fidelity.toFixed(3)}`);
console.log(`  Trajectory points: ${evolutionResult.trajectory.length}`);
console.log('');

// Show sample trajectory points
console.log('Sample trajectory:');
evolutionResult.trajectory.slice(0, 3).forEach(point => {
  console.log(`  t=${point.time.toFixed(2)}: ${JSON.stringify(point.state)}`);
});
console.log('  ...');
console.log('');

// Simulate decoherence
console.log('--- Decoherence Simulation ---');
const decoherenceConfig = {
  decoherenceRate: 0.05, // 5% per time unit
  timeSteps: 20,
  stepSize: 0.5
};

const decoherenceResult = simulateDecoherence(2, decoherenceConfig);

console.log('Decoherence Results:');
console.log(`  Initial coherence: ${decoherenceResult.initialCoherence.toFixed(3)}`);
console.log(`  Final coherence: ${decoherenceResult.finalCoherence.toFixed(3)}`);
console.log(`  Coherence loss: ${((1 - decoherenceResult.finalCoherence) * 100).toFixed(1)}%`);
console.log('');

console.log('Coherence decay over time:');
decoherenceResult.coherenceDecay.slice(0, 5).forEach(point => {
  console.log(`  t=${point.time.toFixed(1)}: ${(point.coherence * 100).toFixed(1)}%`);
});
console.log('  ...');
console.log('');

// ============================================================
// PART 2: Coherence Metrics Dashboard
// ============================================================

console.log('--- Coherence Metrics Dashboard ---');
console.log('Analyzing text coherence and generating dashboard...\n');

// Sample text for analysis
const sampleText = `
The quantum ethics framework provides equitable access to quantum computing resources
through role-based allocation and fairness scoring. Privacy is protected using differential
privacy mechanisms with budget tracking. AI integration ensures emergent ethics alignment
through coherence validation at 70% baseline. The framework includes quantum simulation
capabilities and maintains full ATOM provenance trails for public verifiability.
`;

// Generate dashboard with 95% target (as mentioned in comment)
const { dashboard, waveAnalysis, decision } = analyzeTextForDashboard(
  sampleText,
  { coherenceTarget: 95 }, // Pushing to 95% as per comment
  [72, 75, 78, 80] // Historical scores showing improvement
);

console.log(formatDashboard(dashboard));
console.log('');

// Show raw wave metrics
console.log('Raw Wave Metrics:');
console.log(`  Coherence Score: ${waveAnalysis.coherence_score}%`);
console.log(`  Curl: ${waveAnalysis.coherence.curl.toFixed(3)}`);
console.log(`  Divergence: ${waveAnalysis.coherence.divergence.toFixed(3)}`);
console.log(`  Potential: ${waveAnalysis.coherence.potential.toFixed(3)}`);
console.log(`  Entropy: ${waveAnalysis.coherence.entropy.toFixed(3)}`);
console.log(`  Decision: ${decision.atom_tag}`);
console.log('');

// ============================================================
// PART 3: Comparative Dashboard Analysis
// ============================================================

console.log('--- Comparative Analysis ---');
console.log('Comparing multiple text samples for coherence...\n');

const samples = [
  {
    name: 'High Coherence Sample',
    text: 'The quantum framework integrates seamlessly with SpiralSafe coherence detection. Resource allocation ensures equitable access through priority scheduling. Privacy safeguards implement differential privacy with comprehensive audit trails.'
  },
  {
    name: 'Medium Coherence Sample',
    text: 'Quantum computing needs ethics. The framework does resource things. Privacy is important. AI integration happens. Testing shows results.'
  },
  {
    name: 'Low Coherence Sample',
    text: 'Quantum quantum quantum. Resource resource. Privacy privacy privacy. Framework framework. Things happen because they happen.'
  }
];

const comparison = compareCoherence(samples, { coherenceTarget: 95 });

console.log('Comparison Results:');
console.log(`  Best sample: ${comparison.bestSample}`);
console.log(`  Worst sample: ${comparison.worstSample}`);
console.log(`  Average health: ${comparison.averageHealth.toFixed(1)}/100`);
console.log('');

comparison.comparisons.forEach(comp => {
  console.log(`${comp.name}:`);
  console.log(`  Health: ${comp.dashboard.overallHealth} (${comp.dashboard.healthScore.toFixed(1)}/100)`);
  console.log(`  Coherence: ${comp.dashboard.metrics.coherence.current}%`);
  console.log(`  Trend: ${comp.dashboard.metrics.coherence.trend}`);
  console.log(`  Key insight: ${comp.dashboard.keyInsights[0] || 'N/A'}`);
  console.log('');
});

// ============================================================
// PART 4: Integration with Framework
// ============================================================

console.log('--- Framework Integration ---');
console.log('Using dashboard to validate resource allocation...\n');

// Analyze purpose statement for resource request
const purposeText = `
Research quantum machine learning algorithms for optimizing molecular properties 
in drug discovery, focusing on improving prediction accuracy for protein-ligand 
binding affinity using variational quantum eigensolver combined with neural networks.
`;

const purposeDashboard = generateCoherenceDashboard(
  analyzeWave(purposeText),
  { coherenceTarget: 70 } // Standard 70% baseline
);

console.log('Purpose Statement Analysis:');
console.log(`  Overall Health: ${purposeDashboard.overallHealth}`);
console.log(`  Health Score: ${purposeDashboard.healthScore.toFixed(1)}/100`);
console.log(`  Coherence: ${purposeDashboard.metrics.coherence.current}% (target: 70%)`);
console.log(`  Status: ${purposeDashboard.metrics.coherence.status} target`);
console.log('');

if (purposeDashboard.significanceReport.whatMatters.length > 0) {
  console.log('What Matters:');
  purposeDashboard.significanceReport.whatMatters.forEach(item => {
    console.log(`  ✓ ${item}`);
  });
  console.log('');
}

if (purposeDashboard.recommendations.length > 0) {
  console.log('Recommendations:');
  purposeDashboard.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
  console.log('');
}

// ============================================================
// PART 5: Time Evolution + Coherence Tracking
// ============================================================

console.log('--- Time Evolution with Coherence Tracking ---');
console.log('Monitoring coherence during quantum evolution...\n');

// Track coherence at different time points
const timePoints = [0, 0.5, 1.0, 2.0, 5.0, 10.0];
console.log('Simulating coherence evolution:');

timePoints.forEach(time => {
  const steps = Math.floor(time / 0.1);
  if (steps > 0) {
    const result = createTimeEvolution(2, {
      hamiltonian: 'pauli-x',
      timeSteps: steps,
      stepSize: 0.1
    });
    
    console.log(`  t=${time.toFixed(1)}: fidelity=${result.fidelity.toFixed(3)}, coherence=${(result.fidelity * 100).toFixed(1)}%`);
  } else {
    console.log(`  t=${time.toFixed(1)}: fidelity=1.000, coherence=100.0%`);
  }
});

console.log('');
console.log('=== Demo Complete ===');
console.log('');
console.log('Key Takeaways:');
console.log('  1. Time-zone simulation enables forward-looking temporal quantum dynamics');
console.log('  2. Coherence dashboard translates metrics into actionable insights');
console.log('  3. Decoherence modeling shows realistic quantum system behavior');
console.log('  4. Comparative analysis identifies best practices and areas for improvement');
console.log('  5. Integration with framework ensures ethical quantum computing standards');
