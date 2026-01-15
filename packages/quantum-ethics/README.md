# @spiralsafe/quantum-ethics

Open-source framework for ethical quantum computing with focus on equitable access, privacy safeguards, and AI integration. Integrates with SpiralSafe's coherence detection for emergent ethics alignment (70% baseline).

## Features

### 🎯 Equitable Resource Allocation
- Priority scheduling with fairness scoring
- Role-based quotas (educational, research, commercial, community)
- Coherence-based access validation (70% threshold)
- Public verifiability of resource distribution

### 🔒 Privacy Safeguards
- Differential privacy for quantum measurements
- Privacy budget tracking (epsilon, delta)
- k-anonymity verification
- Secure multi-party computation (MPC) protocols
- Comprehensive audit trails

### 🤖 AI Integration
- Emergent ethics alignment validation
- Quantum-AI hybrid algorithm creation
- Bias detection and mitigation
- Explainability analysis
- Golden ratio (Φ) compliance checking

### ⚛️ Quantum Simulator
- Basic quantum operations (H, X, Y, Z, CNOT, Rx, Ry, Rz)
- Superposition and entanglement support
- Measurement and state collapse
- Circuit visualization
- Pre-built circuits (Bell state, GHZ state, QFT)

## Installation

```bash
bun install @spiralsafe/quantum-ethics
```

## Quick Start

```typescript
import { QuantumEthicsFramework } from '@spiralsafe/quantum-ethics';

// Initialize framework
const framework = new QuantumEthicsFramework({
  coherenceBaseline: 70, // 70% minimum coherence
  publicVerification: true,
  scalabilityEnabled: true
});

// Request resources
const { allocation, decision, waveAnalysis } = framework.requestResources(
  'user-123',
  {
    qubits: 10,
    gateDepth: 50,
    estimatedTimeMs: 5000,
    purpose: 'Quantum machine learning research for drug discovery optimization'
  },
  'research'
);

console.log(`Allocation: ${allocation?.allocationId}`);
console.log(`Coherence: ${waveAnalysis.coherence_score}%`);
console.log(`Decision: ${decision.atom_tag}`);
```

## Resource Allocation

### Role-Based Quotas

```typescript
import { createResourceQuota } from '@spiralsafe/quantum-ethics';

// Educational users get priority
const eduQuota = createResourceQuota('student-456', 'educational');
// { maxQubits: 75, maxGateDepth: 150, priority: 'high' }

// Commercial users get lower priority
const comQuota = createResourceQuota('company-789', 'commercial');
// { maxQubits: 40, maxGateDepth: 80, priority: 'low' }
```

### Priority Scheduling

```typescript
import { ResourceScheduler } from '@spiralsafe/quantum-ethics';

const scheduler = new ResourceScheduler();

// Higher priority weight for educational use
scheduler.enqueue(eduAllocation, 1.5);
scheduler.enqueue(comAllocation, 0.8);

const next = scheduler.dequeue(); // Educational allocation comes first
```

### Coherence Validation

All resource requests are validated against a 70% coherence baseline using SpiralSafe's wave analysis:

```typescript
const waveAnalysis = analyzeWave(request.purpose);

if (waveAnalysis.coherence_score < 70) {
  // Request rejected: purpose lacks coherence
  // Warnings may include:
  // - High curl (circular reasoning)
  // - High divergence (unresolved expansion)
  // - Low potential (underdeveloped ideas)
}
```

## Privacy Safeguards

### Differential Privacy

```typescript
import { applyDifferentialPrivacy } from '@spiralsafe/quantum-ethics';

const measurements = [0.8, 0.6, 0.9, 0.7];
const epsilon = 1.0; // Privacy budget
const delta = 1e-5; // Privacy loss probability

const { noised, privacyBudgetUsed } = applyDifferentialPrivacy(
  measurements,
  epsilon,
  delta
);
```

### Privacy Budget Tracking

```typescript
import { PrivacyBudgetTracker } from '@spiralsafe/quantum-ethics';

const tracker = new PrivacyBudgetTracker(1.0); // epsilon = 1.0

tracker.initializeUser('user-123');
tracker.consumeBudget('user-123', 0.1); // Use 10% of budget

const remaining = tracker.getRemainingBudget('user-123'); // 0.9
```

### Secure Access

```typescript
const { access, decision } = framework.requestSecureAccess(
  'user-123',
  'dataset-456',
  'measure' // Operations: read, write, execute, measure
);

if (access) {
  console.log(`Privacy budget used: ${access.privacyBudgetUsed.toFixed(3)}`);
  console.log(`Encrypted: ${access.encrypted}`);
  console.log(`Anonymized: ${access.anonymized}`);
}
```

### Audit Trail

```typescript
import { PrivacyAuditTrail } from '@spiralsafe/quantum-ethics';

const auditTrail = new PrivacyAuditTrail();

// Automatic logging of all privacy-sensitive operations
const compliance = auditTrail.verifyCompliance(privacyPolicy);

console.log(`Compliant: ${compliance.compliant}`);
console.log(`Violations: ${compliance.violations.join(', ')}`);
```

## AI Integration

### Validate AI-Quantum Integration

```typescript
import { validateAIQuantumIntegration } from '@spiralsafe/quantum-ethics';

const { integration, alignment, decision } = validateAIQuantumIntegration(
  'Use quantum neural network to optimize drug molecule binding affinity predictions',
  'neural-network-v2',
  '10Q-50D' // 10 qubits, depth 50
);

if (integration) {
  console.log(`Coherence: ${integration.coherenceScore}%`);
  console.log(`Ethics alignment: ${(integration.ethicsAlignment * 100).toFixed(1)}%`);
  console.log(`Explainability: ${(integration.explainabilityScore * 100).toFixed(1)}%`);
  console.log(`Bias score: ${(integration.biasScore * 100).toFixed(1)}%`);
}

// Check alignment
console.log(`Aligned: ${alignment.aligned}`);
console.log(`Recommendations: ${alignment.recommendations.join(', ')}`);
```

### Create Quantum-AI Hybrid Algorithm

```typescript
import { createQuantumAIHybrid } from '@spiralsafe/quantum-ethics';

const { algorithm, validation, decision } = createQuantumAIHybrid(
  'Quantum-Enhanced Drug Discovery',
  'Combines quantum variational eigensolver with classical neural network for molecular property prediction',
  {
    qubits: 12,
    gates: ['H', 'RY', 'CNOT', 'RZ'],
    depth: 40
  },
  {
    model: 'neural-network',
    parameters: { layers: 3, neurons: [64, 32, 16] }
  }
);

console.log(`Verified: ${algorithm.verified}`);
console.log(`Safety score: ${algorithm.safetyScore.toFixed(2)}`);
```

### Bias Detection

```typescript
import { detectBias } from '@spiralsafe/quantum-ethics';

const biasAnalysis = detectBias(algorithm, testData);

if (biasAnalysis.detected) {
  console.log(`Bias score: ${biasAnalysis.biasScore.toFixed(2)}`);
  console.log('Sources:', biasAnalysis.sources);
  console.log('Mitigation:', biasAnalysis.mitigation);
}
```

### Explainability Analysis

```typescript
import { analyzeExplainability } from '@spiralsafe/quantum-ethics';

const explainability = analyzeExplainability(
  algorithm,
  'Detailed documentation of the algorithm...'
);

console.log(`Explainable: ${explainability.explainable}`);
console.log(`Score: ${explainability.score.toFixed(2)}`);
console.log(`Quantum transparency: ${explainability.factors.quantumTransparency.toFixed(2)}`);
console.log(`AI interpretability: ${explainability.factors.aiInterpretability.toFixed(2)}`);
console.log(`Documentation quality: ${explainability.factors.documentationQuality.toFixed(2)}`);
```

## Quantum Simulator

### Basic Operations

```typescript
import { QuantumSimulator } from '@spiralsafe/quantum-ethics';

const sim = new QuantumSimulator(2); // 2 qubits

// Create superposition
sim.hadamard(0);

// Create entanglement
sim.cnot(0, 1);

// Measure
const result = sim.measure();
console.log(`Outcomes: ${result.outcomes}`); // e.g., [0, 0] or [1, 1]
console.log(`Probability: ${result.probability.toFixed(3)}`);
```

### Circuit Execution

```typescript
import { createQuantumCircuit, executeCircuit, visualizeCircuit } from '@spiralsafe/quantum-ethics';

const circuit = createQuantumCircuit(2, [
  { type: 'H', target: 0 },
  { type: 'CNOT', target: 1, control: 0 },
  { type: 'MEASURE', target: 0 },
  { type: 'MEASURE', target: 1 }
]);

console.log(visualizeCircuit(circuit));
// q0: |0⟩─[H]─●─[MEASURE]─
// q1: |0⟩─────[CNOT]─[MEASURE]─

const results = executeCircuit(circuit, 100); // 100 shots
console.log(`Measured ${results.length} times`);
```

### Pre-Built Circuits

```typescript
import { createBellState, createGHZState, createQFT } from '@spiralsafe/quantum-ethics';

// Bell state (2-qubit entanglement)
const bell = createBellState();

// GHZ state (multi-qubit entanglement)
const ghz = createGHZState(4);

// Quantum Fourier Transform
const qft = createQFT(3);
```

## Framework Integration

### Complete Workflow

```typescript
import { QuantumEthicsFramework, createQuantumCircuit } from '@spiralsafe/quantum-ethics';

const framework = new QuantumEthicsFramework();

// 1. Request resources
const { allocation } = framework.requestResources(
  'user-123',
  { qubits: 5, gateDepth: 20, estimatedTimeMs: 1000, purpose: 'Quantum optimization research' },
  'research'
);

// 2. Request secure access
const { access } = framework.requestSecureAccess('user-123', 'dataset-789', 'execute');

// 3. Register AI integration
const { integration } = framework.registerAIIntegration(
  'variational-quantum-eigensolver',
  '5Q-20D',
  'Optimize molecular ground state energy using hybrid quantum-classical approach'
);

// 4. Execute quantum circuit
const circuit = createQuantumCircuit(5, [
  { type: 'H', target: 0 },
  { type: 'CNOT', target: 1, control: 0 },
  { type: 'RY', target: 2, parameter: Math.PI / 4 }
]);

const { results } = framework.executeQuantumCircuit('user-123', circuit, 10);

// 5. Public verification
const audit = framework.verifyPublicAudit();
console.log(`Verified: ${audit.verified}`);
console.log(`Details: ${audit.details.join('\n')}`);
```

### Status Monitoring

```typescript
const status = framework.getStatus();

console.log(`Total allocations: ${status.totalAllocations}`);
console.log(`Active allocations: ${status.activeAllocations}`);
console.log(`Total integrations: ${status.totalIntegrations}`);
console.log(`Valid integrations: ${status.validIntegrations}`);
console.log(`Average coherence: ${status.averageCoherence.toFixed(1)}%`);
console.log(`Privacy compliance: ${status.privacyCompliance.compliant ? 'PASS' : 'FAIL'}`);
console.log(`Trail entries: ${status.trailEntries}`);
```

### Provenance Trail

```typescript
const trail = framework.getProvenanceTrail();

for (const entry of trail) {
  console.log(`${entry.decision.atom_tag}: ${entry.decision.description}`);
  console.log(`  Tags: ${entry.decision.tags?.join(', ')}`);
  console.log(`  Timestamp: ${entry.decision.timestamp}`);
}
```

## Configuration

### Custom Configuration

```typescript
const framework = new QuantumEthicsFramework({
  resourcePolicy: {
    name: 'Custom Policy',
    description: 'Prioritizes community access',
    minFairnessScore: 0.8,
    priorityWeights: {
      educational: 1.2,
      research: 1.1,
      commercial: 0.7,
      community: 1.5
    },
    coherenceThreshold: 75 // Stricter than default 70%
  },
  privacyPolicy: {
    name: 'Enhanced Privacy',
    epsilon: 0.5, // Stricter than default 1.0
    delta: 1e-6,
    minAnonymitySet: 10,
    encryptionRequired: true,
    auditRequired: true
  },
  coherenceBaseline: 75,
  scalabilityEnabled: true,
  publicVerification: true
});
```

## Scalability

The framework is designed for scalability:

- **Resource scheduling**: Priority queue with O(log n) insertion
- **Privacy tracking**: In-memory with support for distributed storage
- **Coherence validation**: Lightweight wave analysis (~100ms for 1000 words)
- **Audit trails**: Append-only for high-throughput logging

## Public Verifiability

All operations are publicly verifiable:

1. **Coherence alignment**: All AI integrations must meet 70% baseline
2. **Privacy compliance**: Audit trail verification against policy
3. **Resource fairness**: Average fairness score validation
4. **Provenance tracking**: ATOM trail for all decisions

## Emergent Ethics (70% Coherence Baseline)

The framework aligns with emergent ethics principles:

- **Coherence detection**: Uses SpiralSafe wave analysis (curl, divergence, potential)
- **Golden ratio compliance**: Checks alignment with Φ (1.618...)
- **Gate validation**: KENL → AWI → ATOM → SAIF phase transitions
- **Adaptive thresholds**: Ethics emerge from coherence patterns, not fixed rules

## Integration with SpiralSafe

This package integrates with SpiralSafe's coherence engine:

```typescript
import { analyzeWave } from '@spiralsafe/wave-toolkit';
import { createDecision, validateGate } from '@spiralsafe/atom-trail';

// Wave analysis for coherence
const wave = analyzeWave(text);
console.log(`Coherence: ${wave.coherence_score}%`);

// ATOM provenance
const decision = createDecision('COMPLETE', 'Quantum operation completed');
console.log(`Tag: ${decision.atom_tag}`);

// Gate validation
const gate = validateGate('awi-to-atom', { plan: { steps: [...], rollback: '...' }});
console.log(`Passed: ${gate.passed}`);
```

## License

MIT

## Contributing

Contributions welcome! Please ensure:

1. All code maintains 70%+ coherence score
2. Privacy safeguards are preserved
3. Tests cover ethical constraints
4. Documentation is comprehensive

## Citation

If you use this framework in your research, please cite:

```
@software{spiralsafe_quantum_ethics,
  title = {Quantum Ethics Framework},
  author = {SpiralSafe Team},
  year = {2024},
  url = {https://github.com/toolate28/QDI}
}
```
