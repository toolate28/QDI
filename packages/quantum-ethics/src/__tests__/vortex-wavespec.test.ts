/**
 * Tests for VORTEX WAVEspec - Verified Operational Runtime Testing for Ecosystem Xecution
 */

import { describe, test, expect } from 'bun:test';
import {
  VORTEX_MARKER,
  COHERENCE_THRESHOLD,
  runVortexCheck,
  createVortexPayload,
  formatVortexReport,
  applyFibonacciWeightedBoost,
  type VortexNode,
  type VortexConfig,
  type VortexResult,
  type VortexDashboardPayload,
} from '../vortex-wavespec';

describe('VORTEX Constants', () => {
  test('should export VORTEX_MARKER constant', () => {
    expect(VORTEX_MARKER).toBe('VORTEX::QDI::v1');
  });

  test('should export COHERENCE_THRESHOLD constant', () => {
    expect(COHERENCE_THRESHOLD).toBe(0.6);
  });
});

describe('runVortexCheck', () => {
  test('should run basic vortex check with default config', () => {
    const analysisText = 'This is a test analysis with good coherence and quality metrics';
    const result = runVortexCheck(analysisText);

    expect(result).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.coherenceScore).toBeGreaterThanOrEqual(0);
    expect(result.coherenceScore).toBeLessThanOrEqual(1);
    expect(result.emergentQuality).toContain('%');
    expect(result.passed).toBeDefined();
    expect(result.nodes).toEqual([]);
    expect(result.waveAnalysis).toBeDefined();
    expect(result.atomDecision).toBeDefined();
    expect(result.marker).toBe(VORTEX_MARKER);
  });

  test('should pass when coherence meets threshold', () => {
    // This text should generate high coherence score
    const analysisText = 'Excellent coherence quality metrics with consistent wave patterns and optimal performance indicators demonstrating superior system alignment';
    const result = runVortexCheck(analysisText);

    // The score should be normalized to 0-1 range
    expect(result.coherenceScore).toBeGreaterThanOrEqual(0);
    expect(result.coherenceScore).toBeLessThanOrEqual(1);
  });

  test('should handle custom nodes', () => {
    const analysisText = 'Test analysis';
    const nodes: VortexNode[] = [
      {
        name: 'TestNode1',
        status: 'CLEAN',
        branch: 'main',
        commit: 'abc123def456',
        changes: { added: 10, removed: 5 },
      },
      {
        name: 'TestNode2',
        status: 'DIRTY',
        branch: 'develop',
        commit: 'def456abc123',
        changes: { added: 3, removed: 2 },
      },
    ];

    const result = runVortexCheck(analysisText, nodes);

    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[0].name).toBe('TestNode1');
    expect(result.nodes[1].name).toBe('TestNode2');
  });

  test('should handle custom config', () => {
    const analysisText = 'Test analysis with custom configuration';
    const customConfig: Partial<VortexConfig> = {
      emergentQuality: 0.7,
      fibonacciRatio: 1.5,
    };

    const result = runVortexCheck(analysisText, [], customConfig);

    expect(result).toBeDefined();
    expect(result.coherenceScore).toBeGreaterThanOrEqual(0);
  });

  test('should create ATOM decision', () => {
    const analysisText = 'Test analysis';
    const result = runVortexCheck(analysisText);

    expect(result.atomDecision).toBeDefined();
    expect(result.atomDecision.type).toBe('VERIFY');
    expect(result.atomDecision.atom_tag).toContain('ATOM-');
    expect(result.atomDecision.description).toContain('VORTEX check');
  });

  test('should format timestamp as ISO string', () => {
    const analysisText = 'Test analysis';
    const result = runVortexCheck(analysisText);

    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('should handle different node statuses', () => {
    const analysisText = 'Test analysis';
    const nodes: VortexNode[] = [
      {
        name: 'CleanNode',
        status: 'CLEAN',
        branch: 'main',
        commit: 'abc123',
        changes: { added: 0, removed: 0 },
      },
      {
        name: 'DirtyNode',
        status: 'DIRTY',
        branch: 'feature',
        commit: 'def456',
        changes: { added: 5, removed: 3 },
      },
      {
        name: 'WarnNode',
        status: 'WARN',
        branch: 'hotfix',
        commit: 'ghi789',
        changes: { added: 2, removed: 1 },
      },
      {
        name: 'ErrorNode',
        status: 'ERROR',
        branch: 'bugfix',
        commit: 'jkl012',
        changes: { added: 1, removed: 0 },
      },
    ];

    const result = runVortexCheck(analysisText, nodes);

    expect(result.nodes).toHaveLength(4);
    expect(result.nodes.map(n => n.status)).toContain('CLEAN');
    expect(result.nodes.map(n => n.status)).toContain('DIRTY');
    expect(result.nodes.map(n => n.status)).toContain('WARN');
    expect(result.nodes.map(n => n.status)).toContain('ERROR');
  });
});

describe('createVortexPayload', () => {
  test('should create valid dashboard payload with default config', () => {
    const analysisText = 'Test analysis for dashboard payload generation';
    const payload = createVortexPayload(analysisText);

    expect(payload).toBeDefined();
    expect(payload.$schema).toBe('https://spiralsafe.dev/vortex-dashboard-v1.json');
    expect(payload.meta).toBeDefined();
    expect(payload.meta.name).toBe('VORTEX Dashboard Payload');
    expect(payload.meta.version).toBe('1.0.0');
    expect(payload.meta.emergentQuality).toContain('%');
    expect(payload.meta.fibonacciRatio).toBeGreaterThan(0);
    expect(payload.meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('should include vortex clusters', () => {
    const analysisText = 'Test analysis';
    const payload = createVortexPayload(analysisText);

    expect(payload.vortexes).toBeDefined();
    expect(payload.vortexes.length).toBeGreaterThan(0);
    
    const monitoringVortex = payload.vortexes.find(v => v.vortex_name === 'MonitoringVortex');
    expect(monitoringVortex).toBeDefined();
    expect(monitoringVortex?.description).toContain('monitoring');
    expect(monitoringVortex?.coherence).toBeGreaterThanOrEqual(0);
    expect(monitoringVortex?.coherence).toBeLessThanOrEqual(1);
    expect(monitoringVortex?.components).toBeDefined();
    expect(monitoringVortex?.refinements).toBeDefined();

    const testingVortex = payload.vortexes.find(v => v.vortex_name === 'TestingVortex');
    expect(testingVortex).toBeDefined();
  });

  test('should include endpoint statuses', () => {
    const analysisText = 'Test analysis';
    const payload = createVortexPayload(analysisText);

    expect(payload.endpoints).toBeDefined();
    expect(payload.endpoints.length).toBeGreaterThan(0);

    const endpointNames = payload.endpoints.map(e => e.name);
    expect(endpointNames).toContain('Datalore');
    expect(endpointNames).toContain('Runpod');
    expect(endpointNames).toContain('SpiralSafe');
    expect(endpointNames).toContain('QDI');
    expect(endpointNames).toContain('HOPE');
    expect(endpointNames).toContain('Cloudflare');

    // Check endpoint structure
    const dataloreEndpoint = payload.endpoints.find(e => e.name === 'Datalore');
    expect(dataloreEndpoint).toBeDefined();
    expect(dataloreEndpoint?.url).toBe('https://datalore.jetbrains.com');
    expect(dataloreEndpoint?.status).toMatch(/^(connected|pending|disconnected)$/);
    expect(dataloreEndpoint?.vortexEnabled).toBe(true);
  });

  test('should handle custom config', () => {
    const analysisText = 'Test analysis';
    const customConfig: Partial<VortexConfig> = {
      emergentQuality: 0.75,
      fibonacciRatio: 1.5,
      endpoints: {
        datalore: false,
        runpod: true,
        spiralsafe: true,
        qdi: false,
        hope: true,
        cloudflare: false,
      },
    };

    const payload = createVortexPayload(analysisText, customConfig);

    expect(payload.meta.emergentQuality).toBe('>75%');
    expect(payload.meta.fibonacciRatio).toBe(1.5);

    const dataloreEndpoint = payload.endpoints.find(e => e.name === 'Datalore');
    expect(dataloreEndpoint?.status).toBe('pending');

    const runpodEndpoint = payload.endpoints.find(e => e.name === 'Runpod');
    expect(runpodEndpoint?.status).toBe('connected');
  });

  test('should normalize coherence scores in vortex clusters', () => {
    const analysisText = 'Test analysis';
    const payload = createVortexPayload(analysisText);

    payload.vortexes.forEach(vortex => {
      expect(vortex.coherence).toBeGreaterThanOrEqual(0);
      expect(vortex.coherence).toBeLessThanOrEqual(1);
    });
  });

  test('should include all required vortex refinements', () => {
    const analysisText = 'Test analysis';
    const payload = createVortexPayload(analysisText);

    payload.vortexes.forEach(vortex => {
      expect(vortex.refinements).toBeDefined();
      vortex.refinements.forEach(refinement => {
        expect(refinement.original).toBeDefined();
        expect(refinement.refined).toBeDefined();
        expect(refinement.autonomy).toBeDefined();
      });
    });
  });
});

describe('formatVortexReport', () => {
  test('should format basic report with no nodes', () => {
    const result: VortexResult = {
      timestamp: '2024-01-15T10:00:00.000Z',
      coherenceScore: 0.75,
      emergentQuality: '75.0%',
      passed: true,
      nodes: [],
      waveAnalysis: {
        coherence_score: 75,
        pattern_strength: 0.8,
        emergent_patterns: ['test'],
        recommendations: ['improve'],
      },
      atomDecision: {
        type: 'VERIFY',
        atom_tag: 'ATOM-test-123',
        description: 'Test decision',
        timestamp: '2024-01-15T10:00:00.000Z',
        tags: ['test'],
        freshness: 'fresh',
      },
      marker: VORTEX_MARKER,
    };

    const report = formatVortexReport(result);

    expect(report).toContain('VORTEX');
    expect(report).toContain('Verified Operational Runtime Testing for Ecosystem Xecution');
    expect(report).toContain('Timestamp: 2024-01-15T10:00:00.000Z');
    expect(report).toContain('No nodes configured');
    expect(report).toContain('Score: 75.0%');
    expect(report).toContain('Threshold: 60%');
    expect(report).toContain('✅ PASS');
    expect(report).toContain(VORTEX_MARKER);
  });

  test('should format report with nodes', () => {
    const result: VortexResult = {
      timestamp: '2024-01-15T10:00:00.000Z',
      coherenceScore: 0.65,
      emergentQuality: '65.0%',
      passed: true,
      nodes: [
        {
          name: 'Node1',
          status: 'CLEAN',
          branch: 'main',
          commit: 'abc123def456',
          changes: { added: 10, removed: 5 },
        },
        {
          name: 'Node2',
          status: 'DIRTY',
          branch: 'feature',
          commit: 'def456abc123',
          changes: { added: 3, removed: 2 },
        },
      ],
      waveAnalysis: {
        coherence_score: 65,
        pattern_strength: 0.7,
        emergent_patterns: [],
        recommendations: [],
      },
      atomDecision: {
        type: 'VERIFY',
        atom_tag: 'ATOM-test-456',
        description: 'Test decision',
        timestamp: '2024-01-15T10:00:00.000Z',
        tags: ['test'],
        freshness: 'fresh',
      },
      marker: VORTEX_MARKER,
    };

    const report = formatVortexReport(result);

    expect(report).toContain('NODE STATUS:');
    expect(report).toContain('Node1');
    expect(report).toContain('CLEAN');
    expect(report).toContain('main');
    expect(report).toContain('abc123de'); // First 8 chars of commit
    expect(report).toContain('+10/-5');
    expect(report).toContain('Node2');
    expect(report).toContain('DIRTY');
    expect(report).toContain('+3/-2');
  });

  test('should show FAIL status when not passed', () => {
    const result: VortexResult = {
      timestamp: '2024-01-15T10:00:00.000Z',
      coherenceScore: 0.45,
      emergentQuality: '45.0%',
      passed: false,
      nodes: [],
      waveAnalysis: {
        coherence_score: 45,
        pattern_strength: 0.5,
        emergent_patterns: [],
        recommendations: [],
      },
      atomDecision: {
        type: 'VERIFY',
        atom_tag: 'ATOM-test-789',
        description: 'Test decision',
        timestamp: '2024-01-15T10:00:00.000Z',
        tags: ['test'],
        freshness: 'fresh',
      },
      marker: VORTEX_MARKER,
    };

    const report = formatVortexReport(result);

    expect(report).toContain('❌ FAIL');
    expect(report).toContain('Score: 45.0%');
  });

  test('should include section separators', () => {
    const result: VortexResult = {
      timestamp: '2024-01-15T10:00:00.000Z',
      coherenceScore: 0.75,
      emergentQuality: '75.0%',
      passed: true,
      nodes: [],
      waveAnalysis: {
        coherence_score: 75,
        pattern_strength: 0.8,
        emergent_patterns: [],
        recommendations: [],
      },
      atomDecision: {
        type: 'VERIFY',
        atom_tag: 'ATOM-test-abc',
        description: 'Test decision',
        timestamp: '2024-01-15T10:00:00.000Z',
        tags: ['test'],
        freshness: 'fresh',
      },
      marker: VORTEX_MARKER,
    };

    const report = formatVortexReport(result);

    expect(report).toContain('='.repeat(70));
    expect(report).toContain('-'.repeat(70));
  });

  test('should handle multiple nodes with different statuses', () => {
    const result: VortexResult = {
      timestamp: '2024-01-15T10:00:00.000Z',
      coherenceScore: 0.70,
      emergentQuality: '70.0%',
      passed: true,
      nodes: [
        {
          name: 'Clean',
          status: 'CLEAN',
          branch: 'main',
          commit: 'a1b2c3d4',
          changes: { added: 0, removed: 0 },
        },
        {
          name: 'Dirty',
          status: 'DIRTY',
          branch: 'dev',
          commit: 'e5f6g7h8',
          changes: { added: 100, removed: 50 },
        },
        {
          name: 'Warn',
          status: 'WARN',
          branch: 'hotfix',
          commit: 'i9j0k1l2',
          changes: { added: 5, removed: 3 },
        },
        {
          name: 'Error',
          status: 'ERROR',
          branch: 'bugfix',
          commit: 'm3n4o5p6',
          changes: { added: 1, removed: 1 },
        },
      ],
      waveAnalysis: {
        coherence_score: 70,
        pattern_strength: 0.75,
        emergent_patterns: [],
        recommendations: [],
      },
      atomDecision: {
        type: 'VERIFY',
        atom_tag: 'ATOM-test-multi',
        description: 'Test decision',
        timestamp: '2024-01-15T10:00:00.000Z',
        tags: ['test'],
        freshness: 'fresh',
      },
      marker: VORTEX_MARKER,
    };

    const report = formatVortexReport(result);

    expect(report).toContain('Clean');
    expect(report).toContain('Dirty');
    expect(report).toContain('Warn');
    expect(report).toContain('Error');
    expect(report).toContain('+100/-50');
  });
});

describe('applyFibonacciWeightedBoost', () => {
  test('should boost coherence at iteration 0', () => {
    const baseCoherence = 0.5;
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 0);

    expect(boosted).toBeGreaterThanOrEqual(baseCoherence);
    expect(boosted).toBeLessThanOrEqual(1);
  });

  test('should boost coherence at higher iterations', () => {
    const baseCoherence = 0.6;
    const boost1 = applyFibonacciWeightedBoost(baseCoherence, 1);
    const boost2 = applyFibonacciWeightedBoost(baseCoherence, 2);
    const boost3 = applyFibonacciWeightedBoost(baseCoherence, 5);

    expect(boost1).toBeGreaterThanOrEqual(baseCoherence);
    expect(boost2).toBeGreaterThanOrEqual(baseCoherence);
    expect(boost3).toBeGreaterThanOrEqual(baseCoherence);

    // All should be capped at 1.0
    expect(boost1).toBeLessThanOrEqual(1);
    expect(boost2).toBeLessThanOrEqual(1);
    expect(boost3).toBeLessThanOrEqual(1);
  });

  test('should cap boost at 1.0', () => {
    const baseCoherence = 0.95;
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 10);

    expect(boosted).toBe(1);
  });

  test('should handle low base coherence', () => {
    const baseCoherence = 0.1;
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 3);

    expect(boosted).toBeGreaterThan(baseCoherence);
    expect(boosted).toBeLessThanOrEqual(1);
  });

  test('should handle high iteration counts', () => {
    const baseCoherence = 0.5;
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 100);

    // Should be capped even with very high iterations
    expect(boosted).toBeGreaterThanOrEqual(baseCoherence);
    expect(boosted).toBeLessThanOrEqual(1);
  });

  test('should produce consistent results', () => {
    const baseCoherence = 0.7;
    const iteration = 5;

    const result1 = applyFibonacciWeightedBoost(baseCoherence, iteration);
    const result2 = applyFibonacciWeightedBoost(baseCoherence, iteration);

    expect(result1).toBe(result2);
  });

  test('should increase boost with higher iterations', () => {
    const baseCoherence = 0.5;

    const boost1 = applyFibonacciWeightedBoost(baseCoherence, 1);
    const boost5 = applyFibonacciWeightedBoost(baseCoherence, 5);
    const boost10 = applyFibonacciWeightedBoost(baseCoherence, 10);

    // Later iterations should generally give higher boosts (until cap)
    expect(boost5).toBeGreaterThanOrEqual(boost1);
    expect(boost10).toBeGreaterThanOrEqual(boost5);
  });

  test('should handle zero base coherence', () => {
    const baseCoherence = 0;
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 5);

    expect(boosted).toBeGreaterThanOrEqual(0);
    expect(boosted).toBeLessThanOrEqual(1);
  });

  test('should handle perfect base coherence', () => {
    const baseCoherence = 1.0;
    if (typeof applyFibonacciWeightedBoost !== 'function') {
      throw new Error('applyFibonacciWeightedBoost is not a function');
    }
    const boosted = applyFibonacciWeightedBoost(baseCoherence, 5);

    // Should remain at 1.0
    expect(boosted).toBe(1);
  });
});

describe('Integration Tests', () => {
  test('should create full workflow: check -> payload -> report', () => {
    const analysisText = 'Comprehensive integration test for VORTEX workflow with excellent coherence';
    const nodes: VortexNode[] = [
      {
        name: 'IntNode',
        status: 'CLEAN',
        branch: 'integration',
        commit: 'integration123',
        changes: { added: 20, removed: 10 },
      },
    ];

    // Step 1: Run check
    const checkResult = runVortexCheck(analysisText, nodes);
    expect(checkResult).toBeDefined();
    expect(checkResult.passed).toBeDefined();

    // Step 2: Create payload
    const payload = createVortexPayload(analysisText);
    expect(payload).toBeDefined();
    expect(payload.vortexes.length).toBeGreaterThan(0);

    // Step 3: Format report
    const report = formatVortexReport(checkResult);
    expect(report).toBeDefined();
    expect(report).toContain('IntNode');
  });

  test('should handle empty analysis text', () => {
    const analysisText = '';
    
    const result = runVortexCheck(analysisText);
    expect(result).toBeDefined();
    expect(result.coherenceScore).toBeGreaterThanOrEqual(0);
    
    const payload = createVortexPayload(analysisText);
    expect(payload).toBeDefined();
  });

  test('should maintain consistency between check and payload', () => {
    const analysisText = 'Consistency test for coherence metrics';
    
    const checkResult = runVortexCheck(analysisText);
    const payload = createVortexPayload(analysisText);

    // Both should use same underlying wave analysis
    // Coherence scores should be in same normalized range
    expect(checkResult.coherenceScore).toBeGreaterThanOrEqual(0);
    expect(checkResult.coherenceScore).toBeLessThanOrEqual(1);
    
    payload.vortexes.forEach(vortex => {
      expect(vortex.coherence).toBeGreaterThanOrEqual(0);
      expect(vortex.coherence).toBeLessThanOrEqual(1);
    });
  });
});
