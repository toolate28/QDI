/**
 * Simple test/example for quantum ethics framework
 * 
 * Run this with: bun test
 */

import { describe, test, expect } from 'bun:test';
import { QuantumSimulator, createQuantumCircuit, executeCircuit } from '../quantum-simulator';

describe('Quantum Simulator', () => {
  test('should initialize qubits in |0⟩ state', () => {
    const sim = new QuantumSimulator(2);
    const states = sim.getStates();
    
    expect(states[0]).toEqual([1, 0]);
    expect(states[1]).toEqual([1, 0]);
  });
  
  test('should apply Hadamard gate', () => {
    const sim = new QuantumSimulator(1);
    sim.hadamard(0);
    
    const states = sim.getStates();
    const [alpha, beta] = states[0];
    
    // After H gate: |0⟩ -> (|0⟩ + |1⟩)/√2
    const expected = 1 / Math.sqrt(2);
    expect(Math.abs(alpha - expected)).toBeLessThan(0.001);
    expect(Math.abs(beta - expected)).toBeLessThan(0.001);
  });
  
  test('should apply Pauli-X gate', () => {
    const sim = new QuantumSimulator(1);
    sim.pauliX(0);
    
    const states = sim.getStates();
    expect(states[0]).toEqual([0, 1]); // |0⟩ -> |1⟩
  });
  
  test('should measure qubits', () => {
    const sim = new QuantumSimulator(2);
    const result = sim.measure();
    
    expect(result.qubits).toEqual([0, 1]);
    expect(result.outcomes).toHaveLength(2);
    expect(result.outcomes[0]).toBeGreaterThanOrEqual(0);
    expect(result.outcomes[0]).toBeLessThanOrEqual(1);
  });
  
  test('should create and execute circuit', () => {
    const circuit = createQuantumCircuit(2, [
      { type: 'H', target: 0 },
      { type: 'X', target: 1 }
    ]);
    
    expect(circuit.qubits).toBe(2);
    expect(circuit.gates).toHaveLength(2);
    expect(circuit.depth).toBe(2);
    
    const results = executeCircuit(circuit, 1);
    expect(results).toHaveLength(1);
  });
  
  test('should handle rotation gates', () => {
    const sim = new QuantumSimulator(1);
    sim.rotateX(0, Math.PI / 2);
    
    const states = sim.getStates();
    // Just verify it executed without error
    expect(states).toHaveLength(1);
  });
});

describe('Quantum Simulator - Advanced', () => {
  test('should apply CNOT gate', () => {
    const sim = new QuantumSimulator(2);
    
    // Prepare control qubit in |1⟩
    sim.pauliX(0);
    
    // Apply CNOT
    sim.cnot(0, 1);
    
    const history = sim.getCircuitHistory();
    expect(history.some(g => g.type === 'CNOT')).toBe(true);
  });
  
  test('should reset simulator', () => {
    const sim = new QuantumSimulator(2);
    
    sim.hadamard(0);
    sim.pauliX(1);
    
    sim.reset();
    
    const states = sim.getStates();
    expect(states[0]).toEqual([1, 0]);
    expect(states[1]).toEqual([1, 0]);
    
    const history = sim.getCircuitHistory();
    expect(history).toHaveLength(0);
  });
});
