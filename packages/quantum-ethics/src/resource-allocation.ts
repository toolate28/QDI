/**
 * Resource Allocation Module
 *
 * Ensures equitable access to quantum computing resources through
 * priority scheduling, fair queuing, and resource quotas.
 */

import { analyzeWave, type WaveAnalysisResult } from '@spiralsafe/wave-toolkit';
import { createDecision, type AtomDecision } from '@spiralsafe/atom-trail';

export interface ResourceQuota {
  userId: string;
  maxQubits: number;
  maxGateDepth: number;
  maxExecutionTimeMs: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  allocatedAt: string;
  expiresAt?: string;
}

export interface ResourceAllocation {
  allocationId: string;
  userId: string;
  qubits: number;
  gateDepth: number;
  estimatedTimeMs: number;
  status: 'pending' | 'allocated' | 'running' | 'completed' | 'failed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  fairnessScore: number; // 0-1, higher is more fair
}

export interface EquitableAccessPolicy {
  name: string;
  description: string;
  minFairnessScore: number;
  priorityWeights: {
    educational: number;
    research: number;
    commercial: number;
    community: number;
  };
  coherenceThreshold: number; // Minimum coherence score (0-100)
}

/**
 * Default equitable access policy
 * Prioritizes educational and research use with 70% coherence baseline
 */
export const DEFAULT_POLICY: EquitableAccessPolicy = {
  name: 'Equitable Access v1.0',
  description: 'Prioritizes educational and research access with emergent ethics alignment',
  minFairnessScore: 0.7,
  priorityWeights: {
    educational: 1.5,
    research: 1.3,
    commercial: 0.8,
    community: 1.0
  },
  coherenceThreshold: 70 // 70% coherence baseline
};

/**
 * Calculate fairness score based on user history and current demand
 */
export function calculateFairnessScore(
  userId: string,
  previousAllocations: ResourceAllocation[],
  currentDemand: { qubits: number; timeMs: number }
): number {
  // Simple fairness: inversely proportional to recent usage
  const recentAllocations = previousAllocations.filter(
    a => a.userId === userId && 
    new Date(a.createdAt).getTime() > Date.now() - 86400000 // Last 24h
  );
  
  const totalRecentTime = recentAllocations.reduce(
    (sum, a) => sum + a.estimatedTimeMs, 0
  );
  
  const totalRecentQubits = recentAllocations.reduce(
    (sum, a) => sum + a.qubits, 0
  );
  
  // Normalize: less recent usage = higher score
  const timeScore = Math.max(0, 1 - (totalRecentTime / 3600000)); // 1 hour max
  const qubitScore = Math.max(0, 1 - (totalRecentQubits / 100)); // 100 qubits max
  
  return (timeScore + qubitScore) / 2;
}

/**
 * Allocate resources with equitable access controls
 */
export function allocateResources(
  userId: string,
  request: { qubits: number; gateDepth: number; estimatedTimeMs: number; purpose: string },
  quota: ResourceQuota,
  previousAllocations: ResourceAllocation[],
  policy: EquitableAccessPolicy = DEFAULT_POLICY
): { allocation?: ResourceAllocation; decision: AtomDecision; waveAnalysis: WaveAnalysisResult } {
  // Validate against quota
  if (request.qubits > quota.maxQubits) {
    throw new Error(`Requested qubits (${request.qubits}) exceeds quota (${quota.maxQubits})`);
  }
  
  if (request.gateDepth > quota.maxGateDepth) {
    throw new Error(`Requested gate depth (${request.gateDepth}) exceeds quota (${quota.maxGateDepth})`);
  }
  
  if (request.estimatedTimeMs > quota.maxExecutionTimeMs) {
    throw new Error(`Requested time (${request.estimatedTimeMs}ms) exceeds quota (${quota.maxExecutionTimeMs}ms)`);
  }
  
  // Analyze purpose for coherence
  const waveAnalysis = analyzeWave(request.purpose);
  
  if (waveAnalysis.coherence_score < policy.coherenceThreshold) {
    const decision = createDecision(
      'VERIFY',
      `Resource allocation rejected: purpose coherence ${waveAnalysis.coherence_score} below threshold ${policy.coherenceThreshold}`,
      [],
      ['resource-allocation', 'rejected', 'low-coherence']
    );
    
    return { decision, waveAnalysis };
  }
  
  // Calculate fairness
  const fairnessScore = calculateFairnessScore(userId, previousAllocations, {
    qubits: request.qubits,
    timeMs: request.estimatedTimeMs
  });
  
  if (fairnessScore < policy.minFairnessScore) {
    const decision = createDecision(
      'VERIFY',
      `Resource allocation deferred: fairness score ${fairnessScore.toFixed(2)} below minimum ${policy.minFairnessScore}`,
      [],
      ['resource-allocation', 'deferred', 'fairness']
    );
    
    return { decision, waveAnalysis };
  }
  
  // Create allocation
  const allocation: ResourceAllocation = {
    allocationId: crypto.randomUUID(),
    userId,
    qubits: request.qubits,
    gateDepth: request.gateDepth,
    estimatedTimeMs: request.estimatedTimeMs,
    status: 'allocated',
    createdAt: new Date().toISOString(),
    fairnessScore
  };
  
  const decision = createDecision(
    'COMPLETE',
    `Resources allocated: ${request.qubits} qubits, fairness score ${fairnessScore.toFixed(2)}`,
    [],
    ['resource-allocation', 'approved', `coherence-${waveAnalysis.coherence_score}`]
  );
  
  return { allocation, decision, waveAnalysis };
}

/**
 * Create resource quota for a user based on role
 */
export function createResourceQuota(
  userId: string,
  role: 'educational' | 'research' | 'commercial' | 'community',
  policy: EquitableAccessPolicy = DEFAULT_POLICY
): ResourceQuota {
  const weight = policy.priorityWeights[role];
  
  return {
    userId,
    maxQubits: Math.floor(50 * weight),
    maxGateDepth: Math.floor(100 * weight),
    maxExecutionTimeMs: Math.floor(3600000 * weight), // 1 hour base
    priority: weight > 1.2 ? 'high' : weight > 1.0 ? 'medium' : 'low',
    allocatedAt: new Date().toISOString()
  };
}

/**
 * Priority queue for resource scheduling
 */
export class ResourceScheduler {
  private queue: Array<{
    allocation: ResourceAllocation;
    priority: number;
    submittedAt: Date;
  }> = [];
  
  enqueue(allocation: ResourceAllocation, priorityWeight: number): void {
    const priority = allocation.fairnessScore * priorityWeight;
    this.queue.push({
      allocation,
      priority,
      submittedAt: new Date()
    });
    
    // Sort by priority (higher first), then by submission time (FIFO)
    this.queue.sort((a, b) => {
      if (Math.abs(a.priority - b.priority) > 0.01) {
        return b.priority - a.priority;
      }
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    });
  }
  
  dequeue(): ResourceAllocation | undefined {
    const item = this.queue.shift();
    return item?.allocation;
  }
  
  peek(): ResourceAllocation | undefined {
    return this.queue[0]?.allocation;
  }
  
  size(): number {
    return this.queue.length;
  }
  
  getQueue(): ResourceAllocation[] {
    return this.queue.map(item => item.allocation);
  }
}
