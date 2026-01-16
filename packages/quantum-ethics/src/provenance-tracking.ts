/**
 * Enhanced Provenance Tracking for Quantum Operations
 * 
 * Provides comprehensive tracking of quantum circuit execution,
 * resource allocation, and ethical compliance history.
 */

import { createDecision, createTrailEntry, type AtomDecision, type TrailEntry } from '@spiralsafe/atom-trail';
import type { QuantumCircuit, QuantumGate, MeasurementResult } from './quantum-simulator';
import type { WaveAnalysisResult } from '@spiralsafe/wave-toolkit';
import { randomBytes } from 'crypto';

/**
 * Generate secure random ID
 */
function generateProvenanceId(prefix: string): string {
  const timestamp = Date.now();
  const randomId = randomBytes(8).toString('hex');
  return `${prefix}_${timestamp}_${randomId}`;
}

export interface ProvenanceMetadata {
  timestamp: string;
  userId: string;
  operationType: 'circuit_execution' | 'resource_allocation' | 'ai_integration' | 'privacy_access';
  contextId: string;
  parameters: Record<string, any>;
}

export interface CircuitProvenance {
  provenanceId: string;
  circuitId: string;
  userId: string;
  executionId: string;
  timestamp: string;
  gates: QuantumGate[];
  gateCount: number;
  depth: number;
  qubits: number;
  backend: string;
  executionTimeMs: number;
  results?: MeasurementResult[];
  coherenceScore?: number;
  waveAnalysis?: WaveAnalysisResult;
  atomDecision: AtomDecision;
  parameters: {
    shots?: number;
    noise_model?: string;
    optimization_level?: number;
  };
  metadata: Record<string, any>;
}

export interface ResourceProvenance {
  provenanceId: string;
  userId: string;
  allocationId: string;
  timestamp: string;
  resourceType: 'quantum_compute' | 'quantum_data' | 'ai_integration';
  resourceAmount: {
    qubits?: number;
    gateDepth?: number;
    timeMs?: number;
  };
  fairnessScore: number;
  coherenceScore: number;
  purpose: string;
  atomDecision: AtomDecision;
  approved: boolean;
  metadata: Record<string, any>;
}

export interface AuditEntry {
  auditId: string;
  timestamp: string;
  operationType: string;
  userId: string;
  resourceId: string;
  action: string;
  result: 'success' | 'failure' | 'denied';
  reason?: string;
  coherenceScore?: number;
  provenanceChain: string[];
  metadata: Record<string, any>;
}

/**
 * Provenance Tracking Manager
 */
export class ProvenanceTracker {
  private circuitProvenance: Map<string, CircuitProvenance> = new Map();
  private resourceProvenance: Map<string, ResourceProvenance> = new Map();
  private auditTrail: AuditEntry[] = [];
  private provenanceChain: string[] = [];

  /**
   * Track quantum circuit execution
   */
  trackCircuitExecution(
    userId: string,
    circuit: QuantumCircuit,
    executionData: {
      backend: string;
      executionTimeMs: number;
      results?: MeasurementResult[];
      coherenceScore?: number;
      waveAnalysis?: WaveAnalysisResult;
      parameters?: Record<string, any>;
    }
  ): CircuitProvenance {
    const provenanceId = generateProvenanceId('prov_circuit');
    const executionId = `exec_${Date.now()}`;
    
    // Create ATOM decision for circuit execution
    const decision = createDecision(
      'COMPLETE',
      `Quantum circuit execution: ${circuit.qubits} qubits, ${circuit.gates.length} gates`,
      [`circuit:${circuit.circuitId}`, `backend:${executionData.backend}`]
    );

    const provenance: CircuitProvenance = {
      provenanceId,
      circuitId: circuit.circuitId,
      userId,
      executionId,
      timestamp: new Date().toISOString(),
      gates: circuit.gates,
      gateCount: circuit.gates.length,
      depth: circuit.depth,
      qubits: circuit.qubits,
      backend: executionData.backend,
      executionTimeMs: executionData.executionTimeMs,
      results: executionData.results,
      coherenceScore: executionData.coherenceScore,
      waveAnalysis: executionData.waveAnalysis,
      atomDecision: decision,
      parameters: executionData.parameters || {},
      metadata: {
        createdAt: circuit.createdAt,
        completedAt: new Date().toISOString()
      }
    };

    this.circuitProvenance.set(provenanceId, provenance);
    this.provenanceChain.push(provenanceId);

    // Create audit entry
    this.auditTrail.push({
      auditId: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      operationType: 'circuit_execution',
      userId,
      resourceId: circuit.circuitId,
      action: 'execute',
      result: 'success',
      coherenceScore: executionData.coherenceScore,
      provenanceChain: [...this.provenanceChain],
      metadata: {
        backend: executionData.backend,
        executionTimeMs: executionData.executionTimeMs
      }
    });

    return provenance;
  }

  /**
   * Track resource allocation
   */
  trackResourceAllocation(
    userId: string,
    allocationId: string,
    resourceData: {
      resourceType: 'quantum_compute' | 'quantum_data' | 'ai_integration';
      resourceAmount: Record<string, number>;
      fairnessScore: number;
      coherenceScore: number;
      purpose: string;
      approved: boolean;
      reason?: string;
    }
  ): ResourceProvenance {
    const provenanceId = generateProvenanceId('prov_resource');
    
    // Create ATOM decision for resource allocation
    const decision = createDecision(
      resourceData.approved ? 'APPROVE' : 'DENY',
      `Resource allocation: ${resourceData.resourceType}`,
      [`user:${userId}`, `allocation:${allocationId}`]
    );

    const provenance: ResourceProvenance = {
      provenanceId,
      userId,
      allocationId,
      timestamp: new Date().toISOString(),
      resourceType: resourceData.resourceType,
      resourceAmount: resourceData.resourceAmount,
      fairnessScore: resourceData.fairnessScore,
      coherenceScore: resourceData.coherenceScore,
      purpose: resourceData.purpose,
      atomDecision: decision,
      approved: resourceData.approved,
      metadata: {}
    };

    this.resourceProvenance.set(provenanceId, provenance);
    this.provenanceChain.push(provenanceId);

    // Create audit entry
    this.auditTrail.push({
      auditId: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      operationType: 'resource_allocation',
      userId,
      resourceId: allocationId,
      action: 'allocate',
      result: resourceData.approved ? 'success' : 'denied',
      reason: resourceData.reason,
      coherenceScore: resourceData.coherenceScore,
      provenanceChain: [...this.provenanceChain],
      metadata: {
        fairnessScore: resourceData.fairnessScore,
        resourceType: resourceData.resourceType
      }
    });

    return provenance;
  }

  /**
   * Get circuit provenance by ID
   */
  getCircuitProvenance(provenanceId: string): CircuitProvenance | undefined {
    return this.circuitProvenance.get(provenanceId);
  }

  /**
   * Get resource provenance by ID
   */
  getResourceProvenance(provenanceId: string): ResourceProvenance | undefined {
    return this.resourceProvenance.get(provenanceId);
  }

  /**
   * Get all circuit provenance for a user
   */
  getCircuitProvenanceByUser(userId: string): CircuitProvenance[] {
    return Array.from(this.circuitProvenance.values())
      .filter(p => p.userId === userId);
  }

  /**
   * Get all resource provenance for a user
   */
  getResourceProvenanceByUser(userId: string): ResourceProvenance[] {
    return Array.from(this.resourceProvenance.values())
      .filter(p => p.userId === userId);
  }

  /**
   * Get audit trail
   */
  getAuditTrail(filter?: {
    userId?: string;
    operationType?: string;
    startDate?: Date;
    endDate?: Date;
  }): AuditEntry[] {
    let entries = [...this.auditTrail];

    if (filter) {
      if (filter.userId) {
        entries = entries.filter(e => e.userId === filter.userId);
      }
      if (filter.operationType) {
        entries = entries.filter(e => e.operationType === filter.operationType);
      }
      if (filter.startDate) {
        entries = entries.filter(e => new Date(e.timestamp) >= filter.startDate!);
      }
      if (filter.endDate) {
        entries = entries.filter(e => new Date(e.timestamp) <= filter.endDate!);
      }
    }

    return entries;
  }

  /**
   * Get provenance chain
   */
  getProvenanceChain(): string[] {
    return [...this.provenanceChain];
  }

  /**
   * Verify provenance integrity
   */
  verifyProvenanceIntegrity(): {
    valid: boolean;
    issues: string[];
    totalEntries: number;
    chainLength: number;
  } {
    const issues: string[] = [];
    
    // Check for missing provenance entries in chain
    for (const provenanceId of this.provenanceChain) {
      if (!this.circuitProvenance.has(provenanceId) && !this.resourceProvenance.has(provenanceId)) {
        issues.push(`Missing provenance entry: ${provenanceId}`);
      }
    }

    // Check for orphaned provenance entries
    const chainSet = new Set(this.provenanceChain);
    for (const [provenanceId] of this.circuitProvenance) {
      if (!chainSet.has(provenanceId)) {
        issues.push(`Orphaned circuit provenance: ${provenanceId}`);
      }
    }
    for (const [provenanceId] of this.resourceProvenance) {
      if (!chainSet.has(provenanceId)) {
        issues.push(`Orphaned resource provenance: ${provenanceId}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      totalEntries: this.circuitProvenance.size + this.resourceProvenance.size,
      chainLength: this.provenanceChain.length
    };
  }

  /**
   * Export provenance data
   */
  exportProvenance(): {
    circuits: CircuitProvenance[];
    resources: ResourceProvenance[];
    audit: AuditEntry[];
    chain: string[];
    exported: string;
  } {
    return {
      circuits: Array.from(this.circuitProvenance.values()),
      resources: Array.from(this.resourceProvenance.values()),
      audit: this.auditTrail,
      chain: this.provenanceChain,
      exported: new Date().toISOString()
    };
  }

  /**
   * Clear all provenance data
   */
  clear(): void {
    this.circuitProvenance.clear();
    this.resourceProvenance.clear();
    this.auditTrail = [];
    this.provenanceChain = [];
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalCircuits: number;
    totalResources: number;
    totalAudits: number;
    chainLength: number;
    averageCoherence: number;
    successRate: number;
  } {
    const circuits = Array.from(this.circuitProvenance.values());
    const avgCoherence = circuits.reduce((sum, c) => sum + (c.coherenceScore || 0), 0) / circuits.length || 0;
    
    const successCount = this.auditTrail.filter(a => a.result === 'success').length;
    const successRate = this.auditTrail.length > 0 ? successCount / this.auditTrail.length : 0;

    return {
      totalCircuits: this.circuitProvenance.size,
      totalResources: this.resourceProvenance.size,
      totalAudits: this.auditTrail.length,
      chainLength: this.provenanceChain.length,
      averageCoherence: avgCoherence,
      successRate
    };
  }
}

/**
 * Create provenance tracker instance
 */
export function createProvenanceTracker(): ProvenanceTracker {
  return new ProvenanceTracker();
}
