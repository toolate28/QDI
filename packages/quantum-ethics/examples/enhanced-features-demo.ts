/**
 * Example: Qiskit Integration, Provenance Tracking, and Configuration Toggles
 * 
 * Demonstrates the enhanced quantum ethics framework with:
 * - Real Qiskit backend integration
 * - Comprehensive provenance tracking
 * - JSON-based configuration management
 */

import { QuantumEthicsFramework } from '../src/framework';
import { createQuantumCircuit } from '../src/quantum-simulator';
import { ProvenanceTracker } from '../src/provenance-tracking';
import { ConfigurationManager } from '../src/config-toggles';

console.log('=== Enhanced Quantum Ethics Framework Demo ===\n');

// 1. Configuration Management with JSON Toggles
console.log('--- Configuration Management ---');
const configManager = new ConfigurationManager({
  filters: {
    coherenceBaseline: 0.8,
    timezoneParity: true,
    noiseScrub: 'high'
  },
  toggles: {
    encryptPii: true,
    simulateDecoherence: false,
    fairnessAudit: true
  }
});

console.log('✓ Configuration loaded with JSON toggles');
console.log(`  Coherence baseline: ${configManager.getFilter('coherenceBaseline')}`);
console.log(`  Timezone parity: ${configManager.getFilter('timezoneParity')}`);
console.log(`  Noise scrubbing: ${configManager.getFilter('noiseScrub')}`);
console.log(`  Encrypt PII: ${configManager.getToggle('encryptPii')}`);
console.log(`  Fairness audit: ${configManager.getToggle('fairnessAudit')}`);

// Export configuration
const configJson = configManager.exportConfigToJSON();
console.log(`\n✓ Configuration exported to JSON (${configJson.length} bytes)\n`);

// 2. Initialize Framework with Configuration
console.log('--- Framework Initialization ---');
const framework = new QuantumEthicsFramework({
  coherenceBaseline: configManager.getFilter('coherenceBaseline') * 100, // Convert to percentage
  publicVerification: true,
  scalabilityEnabled: true
});

console.log('✓ Framework initialized with configured parameters\n');

// 3. Provenance Tracking Setup
console.log('--- Provenance Tracking ---');
const provenanceTracker = new ProvenanceTracker();
console.log('✓ Provenance tracker initialized\n');

// 4. Create and Execute Quantum Circuit
console.log('--- Quantum Circuit Execution ---');
const circuit = createQuantumCircuit(2, [
  { type: 'H', target: 0 },
  { type: 'CNOT', target: 1, control: 0 }
]);

console.log(`✓ Created circuit: ${circuit.circuitId}`);
console.log(`  Qubits: ${circuit.qubits}`);
console.log(`  Gates: ${circuit.gates.length}`);
console.log(`  Depth: ${circuit.depth}\n`);

// Track circuit execution with provenance
// NOTE: In this demo, circuit execution is simulated/mocked
// Real deployments would use actual quantum backends
const executionTimeMs = 42;

const circuitProvenance = provenanceTracker.trackCircuitExecution('user-123', circuit, {
  backend: 'mock_simulator',  // This is a mock - not calling real Qiskit
  executionTimeMs,
  coherenceScore: 85,
  parameters: {
    shots: 1024,
    noise_model: configManager.getFilter('noiseScrub'),
    optimization_level: 1
  }
});

console.log('✓ Circuit execution tracked');
console.log(`  Provenance ID: ${circuitProvenance.provenanceId}`);
console.log(`  Execution time: ${circuitProvenance.executionTimeMs}ms`);
console.log(`  Backend: ${circuitProvenance.backend}`);
console.log(`  Coherence score: ${circuitProvenance.coherenceScore}%`);
console.log(`  ATOM tag: ${circuitProvenance.atomDecision.atom_tag}\n`);

// 5. Qiskit Integration (async - would require real backend)
// NOTE: The following section demonstrates Qiskit integration configuration
// In this demo, actual Qiskit execution is NOT performed (mocked/simulated)
// Real deployments should use actual Qiskit backends or quantum hardware
console.log('--- Qiskit Integration ---');
console.log('✓ Qiskit integration available for real quantum backends');
console.log('  Supported backends:');
console.log('    - aer_simulator (local simulation)');
console.log('    - statevector_simulator (state vector)');
console.log('    - ibmq (IBM Quantum hardware)');
console.log('    - fake_backend (testing)');

// Example configuration
const qiskitConfig = {
  backend: 'aer_simulator' as const,
  shots: 1024,
  noise_model: 'high' as const,
  optimization_level: 1 as const
};

console.log(`\n  Example config: ${JSON.stringify(qiskitConfig)}`);
console.log('  Note: Requires Python3 and qiskit installation\n');

// 6. Resource Allocation with Provenance
console.log('--- Resource Allocation ---');
const { allocation, waveAnalysis } = framework.requestResources(
  'user-123',
  {
    qubits: 10,
    gateDepth: 50,
    estimatedTimeMs: 5000,
    purpose: 'Quantum machine learning research for drug discovery optimization with ethical constraints'
  },
  'research'
);

if (allocation) {
  // Track resource allocation
  const resourceProvenance = provenanceTracker.trackResourceAllocation(
    'user-123',
    allocation.allocationId,
    {
      resourceType: 'quantum_compute',
      resourceAmount: {
        qubits: allocation.qubits,
        gateDepth: allocation.maxGateDepth,
        timeMs: allocation.maxTimeMs
      },
      fairnessScore: allocation.fairnessScore,
      coherenceScore: waveAnalysis.coherence_score,
      purpose: allocation.purpose,
      approved: true
    }
  );

  console.log('✓ Resource allocation tracked');
  console.log(`  Provenance ID: ${resourceProvenance.provenanceId}`);
  console.log(`  Allocation ID: ${resourceProvenance.allocationId}`);
  console.log(`  Fairness score: ${resourceProvenance.fairnessScore.toFixed(2)}`);
  console.log(`  Coherence score: ${resourceProvenance.coherenceScore}%`);
  console.log(`  ATOM tag: ${resourceProvenance.atomDecision.atom_tag}\n`);
}

// 7. Provenance Audit Trail
console.log('--- Provenance Audit Trail ---');
const auditTrail = provenanceTracker.getAuditTrail();
console.log(`✓ Total audit entries: ${auditTrail.length}`);

for (const entry of auditTrail) {
  console.log(`\n  ${entry.auditId}`);
  console.log(`    Operation: ${entry.operationType}`);
  console.log(`    User: ${entry.userId}`);
  console.log(`    Result: ${entry.result}`);
  console.log(`    Timestamp: ${entry.timestamp}`);
  if (entry.coherenceScore) {
    console.log(`    Coherence: ${entry.coherenceScore}%`);
  }
}

// 8. Provenance Statistics
console.log('\n--- Provenance Statistics ---');
const stats = provenanceTracker.getStatistics();
console.log(`✓ Total circuits: ${stats.totalCircuits}`);
console.log(`  Total resources: ${stats.totalResources}`);
console.log(`  Total audits: ${stats.totalAudits}`);
console.log(`  Chain length: ${stats.chainLength}`);
console.log(`  Average coherence: ${stats.averageCoherence.toFixed(1)}%`);
console.log(`  Success rate: ${(stats.successRate * 100).toFixed(1)}%\n`);

// 9. Provenance Integrity Verification
console.log('--- Provenance Integrity ---');
const integrity = provenanceTracker.verifyProvenanceIntegrity();
console.log(`✓ Integrity check: ${integrity.valid ? 'PASSED' : 'FAILED'}`);
console.log(`  Total entries: ${integrity.totalEntries}`);
console.log(`  Chain length: ${integrity.chainLength}`);
if (integrity.issues.length > 0) {
  console.log(`  Issues found: ${integrity.issues.length}`);
  integrity.issues.forEach(issue => console.log(`    - ${issue}`));
} else {
  console.log(`  No issues found ✓`);
}

// 10. Export Provenance Data
console.log('\n--- Provenance Export ---');
const exportedData = provenanceTracker.exportProvenance();
console.log(`✓ Provenance data exported`);
console.log(`  Circuits: ${exportedData.circuits.length}`);
console.log(`  Resources: ${exportedData.resources.length}`);
console.log(`  Audit entries: ${exportedData.audit.length}`);
console.log(`  Chain entries: ${exportedData.chain.length}`);
console.log(`  Exported at: ${exportedData.exported}\n`);

// 11. Configuration Validation
console.log('--- Configuration Validation ---');
const validation = configManager.validateConfiguration();
console.log(`✓ Configuration valid: ${validation.valid}`);
if (validation.warnings.length > 0) {
  console.log(`  Warnings (${validation.warnings.length}):`);
  validation.warnings.forEach(w => console.log(`    ⚠ ${w}`));
}
if (validation.errors.length > 0) {
  console.log(`  Errors (${validation.errors.length}):`);
  validation.errors.forEach(e => console.log(`    ✗ ${e}`));
}

// 12. Recommended Configurations
console.log('\n--- Recommended Configurations ---');
const useCases = ['research', 'education', 'production', 'testing'] as const;
for (const useCase of useCases) {
  const config = ConfigurationManager.getRecommendedConfig(useCase);
  console.log(`\n  ${useCase.toUpperCase()}:`);
  console.log(`    Coherence: ${config.filters.coherenceBaseline}`);
  console.log(`    Noise scrub: ${config.filters.noiseScrub}`);
  console.log(`    Decoherence: ${config.toggles.simulateDecoherence}`);
}

console.log('\n=== Demo Complete ===');
console.log('\nNote: In this demo, Qiskit/quantum execution is mocked or simulated.');
console.log('Real deployments should replace the mocked async calls with actual Qiskit backends or quantum hardware integrations.');
console.log('\nKey Features Demonstrated:');
console.log('  ✓ JSON-based configuration management');
console.log('  ✓ Comprehensive provenance tracking');
console.log('  ✓ ATOM decision integration');
console.log('  ✓ Audit trail verification');
console.log('  ✓ Qiskit backend support (mocked in this demo)');
console.log('  ✓ Coherence-based validation');
console.log('  ✓ Thread-safe execution tracking');
