/**
 * Quantum Simulator Stubs
 *
 * Simplified quantum computing simulator for testing and demonstration.
 * Provides basic quantum operations: superposition, entanglement, measurement.
 */

export type QubitState = [number, number]; // [alpha, beta] where |alpha|^2 + |beta|^2 = 1

/**
 * CNOT probabilistic threshold for simplified implementation
 */
const CNOT_THRESHOLD = 0.5;

export interface QuantumCircuit {
  circuitId: string;
  qubits: number;
  gates: QuantumGate[];
  depth: number;
  createdAt: string;
}

export interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'RX' | 'RY' | 'RZ' | 'MEASURE';
  target: number;
  control?: number; // For CNOT
  parameter?: number; // For rotation gates
}

export interface MeasurementResult {
  qubits: number[];
  outcomes: number[]; // 0 or 1 for each qubit
  probability: number;
  timestamp: string;
}

/**
 * Simple quantum state representation
 * In production, use proper state vector or density matrix
 */
export class QuantumSimulator {
  private qubits: QubitState[] = [];
  private circuitHistory: QuantumGate[] = [];
  
  constructor(numQubits: number) {
    // Initialize all qubits to |0⟩ state
    for (let i = 0; i < numQubits; i++) {
      this.qubits.push([1, 0]); // |0⟩ = [1, 0], |1⟩ = [0, 1]
    }
  }
  
  /**
   * Apply Hadamard gate (creates superposition)
   */
  hadamard(target: number): void {
    if (target >= this.qubits.length) {
      throw new Error(`Invalid qubit index: ${target}`);
    }
    
    const [alpha, beta] = this.qubits[target];
    const sqrt2 = Math.sqrt(2);
    
    this.qubits[target] = [
      (alpha + beta) / sqrt2,
      (alpha - beta) / sqrt2
    ];
    
    this.circuitHistory.push({ type: 'H', target });
  }
  
  /**
   * Apply Pauli-X gate (bit flip)
   */
  pauliX(target: number): void {
    if (target >= this.qubits.length) {
      throw new Error(`Invalid qubit index: ${target}`);
    }
    
    const [alpha, beta] = this.qubits[target];
    this.qubits[target] = [beta, alpha];
    
    this.circuitHistory.push({ type: 'X', target });
  }
  
  /**
   * Apply Pauli-Y gate
   * NOTE: Simplified implementation - ignores imaginary factor (i)
   * For production use, implement proper complex number arithmetic
   */
  pauliY(target: number): void {
    if (target >= this.qubits.length) {
      throw new Error(`Invalid qubit index: ${target}`);
    }
    
    const [alpha, beta] = this.qubits[target];
    this.qubits[target] = [-beta, alpha]; // Simplified (ignoring i factor)
    
    this.circuitHistory.push({ type: 'Y', target });
  }
  
  /**
   * Apply Pauli-Z gate (phase flip)
   */
  pauliZ(target: number): void {
    if (target >= this.qubits.length) {
      throw new Error(`Invalid qubit index: ${target}`);
    }
    
    const [alpha, beta] = this.qubits[target];
    this.qubits[target] = [alpha, -beta];
    
    this.circuitHistory.push({ type: 'Z', target });
  }
  
  /**
   * Apply rotation around X axis
   */
  rotateX(target: number, theta: number): void {
    if (target >= this.qubits.length) {
      throw new Error(`Invalid qubit index: ${target}`);
    }
    
    const [alpha, beta] = this.qubits[target];
    const cos = Math.cos(theta / 2);
    const sin = Math.sin(theta / 2);
    
    this.qubits[target] = [
      cos * alpha - sin * beta,
      cos * beta - sin * alpha
    ];
    
    this.circuitHistory.push({ type: 'RX', target, parameter: theta });
  }
  
  /**
   * Apply CNOT gate (entanglement)
   * NOTE: Simplified implementation using probabilistic check
   * For production use, implement proper tensor product and controlled operations
   */
  cnot(control: number, target: number): void {
    if (control >= this.qubits.length || target >= this.qubits.length) {
      throw new Error(`Invalid qubit indices: control=${control}, target=${target}`);
    }
    
    // Simplified CNOT: if control qubit has |1⟩ component, flip target
    const [controlAlpha, controlBeta] = this.qubits[control];
    
    if (Math.abs(controlBeta) > CNOT_THRESHOLD) { // Probabilistic check
      this.pauliX(target);
    }
    
    this.circuitHistory.push({ type: 'CNOT', target, control });
  }
  
  /**
   * Measure qubit(s)
   */
  measure(targets?: number[]): MeasurementResult {
    const qubitsToMeasure = targets || Array.from({ length: this.qubits.length }, (_, i) => i);
    const outcomes: number[] = [];
    let totalProbability = 1.0;
    
    for (const target of qubitsToMeasure) {
      if (target >= this.qubits.length) {
        throw new Error(`Invalid qubit index: ${target}`);
      }
      
      const [alpha, beta] = this.qubits[target];
      const prob0 = alpha * alpha;
      const prob1 = beta * beta;
      
      // Collapse to |0⟩ or |1⟩ based on probability
      const outcome = Math.random() < (prob0 / (prob0 + prob1)) ? 0 : 1;
      outcomes.push(outcome);
      
      // Collapse state
      this.qubits[target] = outcome === 0 ? [1, 0] : [0, 1];
      
      totalProbability *= outcome === 0 ? prob0 : prob1;
      
      this.circuitHistory.push({ type: 'MEASURE', target });
    }
    
    return {
      qubits: qubitsToMeasure,
      outcomes,
      probability: totalProbability,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Get current qubit states (for debugging)
   */
  getStates(): QubitState[] {
    return this.qubits.map(q => [...q] as QubitState);
  }
  
  /**
   * Get circuit history
   */
  getCircuitHistory(): QuantumGate[] {
    return [...this.circuitHistory];
  }
  
  /**
   * Reset simulator
   */
  reset(): void {
    for (let i = 0; i < this.qubits.length; i++) {
      this.qubits[i] = [1, 0];
    }
    this.circuitHistory = [];
  }
}

/**
 * Create a quantum circuit
 */
export function createQuantumCircuit(
  qubits: number,
  gates: QuantumGate[]
): QuantumCircuit {
  const depth = Math.max(1, gates.length);
  
  return {
    circuitId: crypto.randomUUID(),
    qubits,
    gates,
    depth,
    createdAt: new Date().toISOString()
  };
}

/**
 * Execute a quantum circuit
 */
export function executeCircuit(
  circuit: QuantumCircuit,
  shots: number = 1
): MeasurementResult[] {
  const results: MeasurementResult[] = [];
  
  for (let shot = 0; shot < shots; shot++) {
    const simulator = new QuantumSimulator(circuit.qubits);
    
    for (const gate of circuit.gates) {
      switch (gate.type) {
        case 'H':
          simulator.hadamard(gate.target);
          break;
        case 'X':
          simulator.pauliX(gate.target);
          break;
        case 'Y':
          simulator.pauliY(gate.target);
          break;
        case 'Z':
          simulator.pauliZ(gate.target);
          break;
        case 'RX':
          if (gate.parameter !== undefined) {
            simulator.rotateX(gate.target, gate.parameter);
          }
          break;
        case 'CNOT':
          if (gate.control !== undefined) {
            simulator.cnot(gate.control, gate.target);
          }
          break;
        case 'MEASURE':
          results.push(simulator.measure([gate.target]));
          break;
      }
    }
    
    // Final measurement if not already measured
    if (circuit.gates[circuit.gates.length - 1]?.type !== 'MEASURE') {
      results.push(simulator.measure());
    }
  }
  
  return results;
}

/**
 * Create Bell state (entangled pair)
 */
export function createBellState(): QuantumCircuit {
  return createQuantumCircuit(2, [
    { type: 'H', target: 0 },
    { type: 'CNOT', target: 1, control: 0 }
  ]);
}

/**
 * Create GHZ state (multi-qubit entanglement)
 */
export function createGHZState(qubits: number): QuantumCircuit {
  if (qubits < 2) {
    throw new Error('GHZ state requires at least 2 qubits');
  }
  
  const gates: QuantumGate[] = [
    { type: 'H', target: 0 }
  ];
  
  for (let i = 1; i < qubits; i++) {
    gates.push({ type: 'CNOT', target: i, control: 0 });
  }
  
  return createQuantumCircuit(qubits, gates);
}

/**
 * Create quantum Fourier transform circuit
 */
export function createQFT(qubits: number): QuantumCircuit {
  const gates: QuantumGate[] = [];
  
  for (let i = 0; i < qubits; i++) {
    gates.push({ type: 'H', target: i });
    
    for (let j = i + 1; j < qubits; j++) {
      const angle = Math.PI / Math.pow(2, j - i);
      gates.push({ type: 'RX', target: j, parameter: angle });
    }
  }
  
  return createQuantumCircuit(qubits, gates);
}

/**
 * Visualize quantum circuit (simple text representation)
 */
export function visualizeCircuit(circuit: QuantumCircuit): string {
  const lines: string[] = [];
  
  for (let q = 0; q < circuit.qubits; q++) {
    lines.push(`q${q}: |0⟩─`);
  }
  
  for (const gate of circuit.gates) {
    const gateStr = gate.parameter 
      ? `${gate.type}(${gate.parameter.toFixed(2)})`
      : gate.type;
    
    for (let q = 0; q < circuit.qubits; q++) {
      if (q === gate.target) {
        lines[q] += `[${gateStr}]─`;
      } else if (gate.control !== undefined && q === gate.control) {
        lines[q] += `●─`;
      } else {
        lines[q] += `─────`;
      }
    }
  }
  
  return lines.join('\n');
}
