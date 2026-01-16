/**
 * Tests for Enhanced Provenance Tracking
 */

import { describe, test, expect } from 'bun:test';
import {
  ProvenanceTracker,
  createProvenanceTracker,
  type CircuitProvenance,
  type ResourceProvenance
} from '../provenance-tracking';
import { createQuantumCircuit } from '../quantum-simulator';

describe('ProvenanceTracker', () => {
  test('should create tracker instance', () => {
    const tracker = createProvenanceTracker();
    expect(tracker).toBeDefined();
  });
  
  test('should track circuit execution', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(2, [
      { type: 'H', target: 0 },
      { type: 'CNOT', target: 1, control: 0 }
    ]);
    
    const provenance = tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'aer_simulator',
      executionTimeMs: 42,
      coherenceScore: 85
    });
    
    expect(provenance.userId).toBe('user-123');
    expect(provenance.circuitId).toBe(circuit.circuitId);
    expect(provenance.backend).toBe('aer_simulator');
    expect(provenance.executionTimeMs).toBe(42);
    expect(provenance.coherenceScore).toBe(85);
    expect(provenance.gates).toHaveLength(2);
  });
  
  test('should track resource allocation', () => {
    const tracker = new ProvenanceTracker();
    
    const provenance = tracker.trackResourceAllocation('user-456', 'alloc-789', {
      resourceType: 'quantum_compute',
      resourceAmount: { qubits: 10, gateDepth: 50 },
      fairnessScore: 0.92,
      coherenceScore: 78,
      purpose: 'Quantum ML research',
      approved: true
    });
    
    expect(provenance.userId).toBe('user-456');
    expect(provenance.allocationId).toBe('alloc-789');
    expect(provenance.resourceType).toBe('quantum_compute');
    expect(provenance.fairnessScore).toBe(0.92);
    expect(provenance.approved).toBe(true);
  });
  
  test('should retrieve circuit provenance by ID', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    const prov = tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    const retrieved = tracker.getCircuitProvenance(prov.provenanceId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.circuitId).toBe(circuit.circuitId);
  });
  
  test('should get circuit provenance by user', () => {
    const tracker = new ProvenanceTracker();
    const circuit1 = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    const circuit2 = createQuantumCircuit(2, [{ type: 'CNOT', target: 1, control: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit1, {
      backend: 'test',
      executionTimeMs: 10
    });
    tracker.trackCircuitExecution('user-123', circuit2, {
      backend: 'test',
      executionTimeMs: 20
    });
    tracker.trackCircuitExecution('user-456', circuit1, {
      backend: 'test',
      executionTimeMs: 15
    });
    
    const userProvenance = tracker.getCircuitProvenanceByUser('user-123');
    expect(userProvenance).toHaveLength(2);
    expect(userProvenance.every(p => p.userId === 'user-123')).toBe(true);
  });
  
  test('should maintain audit trail', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    const audit = tracker.getAuditTrail();
    expect(audit.length).toBeGreaterThan(0);
    expect(audit[0].operationType).toBe('circuit_execution');
    expect(audit[0].result).toBe('success');
  });
  
  test('should filter audit trail', () => {
    const tracker = new ProvenanceTracker();
    
    tracker.trackResourceAllocation('user-123', 'alloc-1', {
      resourceType: 'quantum_compute',
      resourceAmount: {},
      fairnessScore: 0.8,
      coherenceScore: 75,
      purpose: 'Test',
      approved: true
    });
    
    tracker.trackResourceAllocation('user-456', 'alloc-2', {
      resourceType: 'quantum_data',
      resourceAmount: {},
      fairnessScore: 0.7,
      coherenceScore: 70,
      purpose: 'Test',
      approved: false
    });
    
    const filtered = tracker.getAuditTrail({ userId: 'user-123' });
    expect(filtered.every(e => e.userId === 'user-123')).toBe(true);
  });
  
  test('should verify provenance integrity', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    const integrity = tracker.verifyProvenanceIntegrity();
    expect(integrity.valid).toBe(true);
    expect(integrity.issues).toHaveLength(0);
    expect(integrity.totalEntries).toBe(1);
  });
  
  test('should export provenance data', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    const exported = tracker.exportProvenance();
    expect(exported.circuits).toHaveLength(1);
    expect(exported.audit.length).toBeGreaterThan(0);
    expect(exported.chain.length).toBeGreaterThan(0);
    expect(exported.exported).toBeDefined();
  });
  
  test('should calculate statistics', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10,
      coherenceScore: 85
    });
    
    tracker.trackResourceAllocation('user-456', 'alloc-1', {
      resourceType: 'quantum_compute',
      resourceAmount: {},
      fairnessScore: 0.9,
      coherenceScore: 80,
      purpose: 'Test',
      approved: true
    });
    
    const stats = tracker.getStatistics();
    expect(stats.totalCircuits).toBe(1);
    expect(stats.totalResources).toBe(1);
    expect(stats.totalAudits).toBe(2);
    expect(stats.averageCoherence).toBeGreaterThan(0);
    expect(stats.successRate).toBe(1.0); // Both succeeded
  });
  
  test('should maintain provenance chain', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    tracker.trackResourceAllocation('user-456', 'alloc-1', {
      resourceType: 'quantum_compute',
      resourceAmount: {},
      fairnessScore: 0.9,
      coherenceScore: 80,
      purpose: 'Test',
      approved: true
    });
    
    const chain = tracker.getProvenanceChain();
    expect(chain).toHaveLength(2);
  });
  
  test('should clear all data', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(1, [{ type: 'H', target: 0 }]);
    
    tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'test',
      executionTimeMs: 10
    });
    
    tracker.clear();
    
    const stats = tracker.getStatistics();
    expect(stats.totalCircuits).toBe(0);
    expect(stats.totalResources).toBe(0);
    expect(stats.totalAudits).toBe(0);
  });
});

describe('ATOM Integration', () => {
  test('should create ATOM decision for circuit execution', () => {
    const tracker = new ProvenanceTracker();
    const circuit = createQuantumCircuit(2, [
      { type: 'H', target: 0 },
      { type: 'CNOT', target: 1, control: 0 }
    ]);
    
    const provenance = tracker.trackCircuitExecution('user-123', circuit, {
      backend: 'aer_simulator',
      executionTimeMs: 42
    });
    
    expect(provenance.atomDecision).toBeDefined();
    expect(provenance.atomDecision.type).toBe('COMPLETE');
    expect(provenance.atomDecision.atom_tag).toContain('ATOM-');
  });
  
  test('should create ATOM decision for resource allocation', () => {
    const tracker = new ProvenanceTracker();
    
    const provenance = tracker.trackResourceAllocation('user-456', 'alloc-789', {
      resourceType: 'quantum_compute',
      resourceAmount: { qubits: 10 },
      fairnessScore: 0.92,
      coherenceScore: 78,
      purpose: 'Test',
      approved: true
    });
    
    expect(provenance.atomDecision).toBeDefined();
    expect(provenance.atomDecision.type).toBe('APPROVE');
  });
});
