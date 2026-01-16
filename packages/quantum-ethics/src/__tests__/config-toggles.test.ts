/**
 * Tests for Configuration Toggles
 */

import { describe, test, expect } from 'bun:test';
import {
  ConfigurationManager,
  parseConfigFromJSON,
  type QuantumEthicsConfiguration
} from '../config-toggles';

describe('ConfigurationManager', () => {
  test('should initialize with default config', () => {
    const manager = new ConfigurationManager();
    const config = manager.getConfig();
    
    expect(config.filters.coherenceBaseline).toBe(0.8);
    expect(config.filters.timezoneParity).toBe(true);
    expect(config.filters.noiseScrub).toBe('high');
    expect(config.toggles.encryptPii).toBe(true);
    expect(config.toggles.simulateDecoherence).toBe(false);
    expect(config.toggles.fairnessAudit).toBe(true);
  });
  
  test('should apply custom initial config', () => {
    const manager = new ConfigurationManager({
      filters: { coherenceBaseline: 0.7 }
    });
    
    const config = manager.getConfig();
    expect(config.filters.coherenceBaseline).toBe(0.7);
    expect(config.filters.timezoneParity).toBe(true); // Default preserved
  });
  
  test('should update filters', () => {
    const manager = new ConfigurationManager();
    
    manager.updateFilters({ coherenceBaseline: 0.9 }, 'Test update');
    
    const config = manager.getConfig();
    expect(config.filters.coherenceBaseline).toBe(0.9);
  });
  
  test('should update toggles', () => {
    const manager = new ConfigurationManager();
    
    manager.updateToggles({ simulateDecoherence: true }, 'Enable decoherence');
    
    const config = manager.getConfig();
    expect(config.toggles.simulateDecoherence).toBe(true);
  });
  
  test('should handle JSON import/export', () => {
    const manager = new ConfigurationManager();
    
    const json = manager.exportConfigToJSON();
    expect(json).toContain('coherenceBaseline');
    expect(json).toContain('encryptPii');
    
    // Parse and verify
    const parsed = JSON.parse(json);
    expect(parsed.filters.coherenceBaseline).toBe(0.8);
  });
  
  test('should validate configuration', () => {
    const manager = new ConfigurationManager();
    
    const validation = manager.validateConfiguration();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
  
  test('should warn about low coherence baseline', () => {
    const manager = new ConfigurationManager({
      filters: { coherenceBaseline: 0.6 }
    });
    
    const validation = manager.validateConfiguration();
    expect(validation.warnings.length).toBeGreaterThan(0);
    expect(validation.warnings[0]).toContain('below recommended');
  });
  
  test('should track configuration history', () => {
    const manager = new ConfigurationManager();
    
    manager.updateFilters({ coherenceBaseline: 0.9 });
    manager.updateToggles({ simulateDecoherence: true });
    
    const history = manager.getConfigHistory();
    expect(history.length).toBeGreaterThanOrEqual(3); // Initial + 2 updates
  });
  
  test('should get specific filter values', () => {
    const manager = new ConfigurationManager();
    
    expect(manager.getFilter('coherenceBaseline')).toBe(0.8);
    expect(manager.getFilter('noiseScrub')).toBe('high');
  });
  
  test('should get specific toggle values', () => {
    const manager = new ConfigurationManager();
    
    expect(manager.getToggle('encryptPii')).toBe(true);
    expect(manager.getToggle('fairnessAudit')).toBe(true);
  });
  
  test('should reset to default', () => {
    const manager = new ConfigurationManager();
    
    manager.updateFilters({ coherenceBaseline: 0.5 });
    manager.resetToDefault();
    
    const config = manager.getConfig();
    expect(config.filters.coherenceBaseline).toBe(0.8);
  });
});

describe('Recommended Configurations', () => {
  test('should provide research config', () => {
    const config = ConfigurationManager.getRecommendedConfig('research');
    
    expect(config.filters.coherenceBaseline).toBe(0.7);
    expect(config.toggles.simulateDecoherence).toBe(true);
  });
  
  test('should provide education config', () => {
    const config = ConfigurationManager.getRecommendedConfig('education');
    
    expect(config.filters.coherenceBaseline).toBe(0.6);
    expect(config.toggles.encryptPii).toBe(false); // Simplified for education
  });
  
  test('should provide production config', () => {
    const config = ConfigurationManager.getRecommendedConfig('production');
    
    expect(config.filters.coherenceBaseline).toBe(0.8);
    expect(config.filters.noiseScrub).toBe('high');
    expect(config.toggles.encryptPii).toBe(true);
  });
  
  test('should provide testing config', () => {
    const config = ConfigurationManager.getRecommendedConfig('testing');
    
    expect(config.filters.coherenceBaseline).toBe(0.5);
    expect(config.toggles.fairnessAudit).toBe(false);
  });
});

describe('JSON Configuration Parsing', () => {
  test('should parse valid JSON config', () => {
    const json = JSON.stringify({
      filters: {
        coherenceBaseline: 0.7,
        timezoneParity: true,
        noiseScrub: 'medium'
      },
      toggles: {
        encryptPii: false,
        simulateDecoherence: true,
        fairnessAudit: true
      }
    });
    
    const config = parseConfigFromJSON(json);
    expect(config.filters.coherenceBaseline).toBe(0.7);
    expect(config.toggles.simulateDecoherence).toBe(true);
  });
  
  test('should throw error on invalid JSON', () => {
    expect(() => parseConfigFromJSON('invalid json')).toThrow();
  });
  
  test('should throw error on missing required fields', () => {
    const json = JSON.stringify({
      filters: { coherenceBaseline: 0.7 }
      // Missing toggles
    });
    
    expect(() => parseConfigFromJSON(json)).toThrow();
  });
});

describe('Issue-Specific Configuration', () => {
  test('should apply JSON config from issue description', () => {
    const issueConfig = {
      filters: {
        coherenceBaseline: 0.8,
        timezoneParity: true,
        noiseScrub: 'high' as const
      },
      toggles: {
        encryptPii: true,
        simulateDecoherence: false,
        fairnessAudit: true
      }
    };
    
    const manager = new ConfigurationManager(issueConfig);
    const config = manager.getConfig();
    
    expect(config.filters.coherenceBaseline).toBe(0.8);
    expect(config.filters.timezoneParity).toBe(true);
    expect(config.filters.noiseScrub).toBe('high');
    expect(config.toggles.encryptPii).toBe(true);
    expect(config.toggles.simulateDecoherence).toBe(false);
    expect(config.toggles.fairnessAudit).toBe(true);
  });
  
  test('should validate issue configuration', () => {
    const manager = new ConfigurationManager({
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
    
    const validation = manager.validateConfiguration();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
