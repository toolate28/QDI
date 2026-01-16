/**
 * Configuration Toggles for Quantum Ethics Testing
 * 
 * Implements the JSON-based configuration system with filters and toggles
 * for quantum ethics framework customization.
 */

export interface ConfigFilters {
  /**
   * Coherence baseline threshold (0.0 to 1.0)
   * Default: 0.8 (80%)
   */
  coherenceBaseline: number;
  
  /**
   * Timezone parity - ensure fair scheduling across timezones
   * Default: true
   */
  timezoneParity: boolean;
  
  /**
   * Noise scrubbing level for quantum simulations
   * - 'low': Minimal noise filtering
   * - 'medium': Moderate noise filtering
   * - 'high': Aggressive noise filtering
   * Default: 'high'
   */
  noiseScrub: 'low' | 'medium' | 'high';
}

export interface ConfigToggles {
  /**
   * Encrypt PII (Personally Identifiable Information)
   * Default: true
   */
  encryptPii: boolean;
  
  /**
   * Simulate quantum decoherence effects
   * Default: false (for faster simulations)
   */
  simulateDecoherence: boolean;
  
  /**
   * Enable fairness auditing for resource allocation
   * Default: true
   */
  fairnessAudit: boolean;
}

export interface QuantumEthicsConfiguration {
  filters: ConfigFilters;
  toggles: ConfigToggles;
  metadata?: {
    version?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
  };
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: QuantumEthicsConfiguration = {
  filters: {
    coherenceBaseline: 0.8,
    timezoneParity: true,
    noiseScrub: 'high'
  },
  toggles: {
    encryptPii: true,
    simulateDecoherence: false,
    fairnessAudit: true
  },
  metadata: {
    version: '1.0.0',
    description: 'Default quantum ethics configuration'
  }
};

/**
 * Configuration manager for quantum ethics framework
 */
export class ConfigurationManager {
  private config: QuantumEthicsConfiguration;
  private configHistory: Array<{
    timestamp: string;
    config: QuantumEthicsConfiguration;
    reason: string;
  }> = [];

  constructor(initialConfig?: Partial<QuantumEthicsConfiguration>) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, initialConfig);
    this.logConfigChange('Initialized', this.config);
  }

  /**
   * Get current configuration
   */
  getConfig(): QuantumEthicsConfiguration {
    return { ...this.config };
  }

  /**
   * Update filters
   */
  updateFilters(filters: Partial<ConfigFilters>, reason = 'Manual update'): void {
    const newConfig = {
      ...this.config,
      filters: { ...this.config.filters, ...filters }
    };
    
    this.validateConfig(newConfig);
    this.config = newConfig;
    this.logConfigChange(reason, this.config);
  }

  /**
   * Update toggles
   */
  updateToggles(toggles: Partial<ConfigToggles>, reason = 'Manual update'): void {
    const newConfig = {
      ...this.config,
      toggles: { ...this.config.toggles, ...toggles }
    };
    
    this.config = newConfig;
    this.logConfigChange(reason, this.config);
  }

  /**
   * Set configuration from JSON
   */
  setConfigFromJSON(json: string, reason = 'JSON import'): void {
    try {
      const parsedConfig = JSON.parse(json) as Partial<QuantumEthicsConfiguration>;
      const newConfig = this.mergeConfig(this.config, parsedConfig);
      
      this.validateConfig(newConfig);
      this.config = newConfig;
      this.logConfigChange(reason, this.config);
    } catch (error) {
      throw new Error(`Invalid JSON configuration: ${error}`);
    }
  }

  /**
   * Export configuration to JSON
   */
  exportConfigToJSON(): string {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Reset to default configuration
   */
  resetToDefault(reason = 'Reset to defaults'): void {
    this.config = { ...DEFAULT_CONFIG };
    this.logConfigChange(reason, this.config);
  }

  /**
   * Get configuration history
   */
  getConfigHistory(): Array<{
    timestamp: string;
    config: QuantumEthicsConfiguration;
    reason: string;
  }> {
    return [...this.configHistory];
  }

  /**
   * Get specific filter value
   */
  getFilter<K extends keyof ConfigFilters>(key: K): ConfigFilters[K] {
    return this.config.filters[key];
  }

  /**
   * Get specific toggle value
   */
  getToggle<K extends keyof ConfigToggles>(key: K): ConfigToggles[K] {
    return this.config.toggles[key];
  }

  /**
   * Check if configuration meets requirements
   */
  validateConfiguration(): {
    valid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Validate coherence baseline
    if (this.config.filters.coherenceBaseline < 0.7) {
      warnings.push(`Coherence baseline ${this.config.filters.coherenceBaseline} is below recommended 0.7 (70%)`);
    }
    if (this.config.filters.coherenceBaseline < 0.5) {
      errors.push(`Coherence baseline ${this.config.filters.coherenceBaseline} is too low (minimum 0.5)`);
    }
    if (this.config.filters.coherenceBaseline > 1.0) {
      errors.push(`Coherence baseline ${this.config.filters.coherenceBaseline} exceeds maximum 1.0`);
    }

    // Validate noise scrub
    const validNoiseLevels = ['low', 'medium', 'high'];
    if (!validNoiseLevels.includes(this.config.filters.noiseScrub)) {
      errors.push(`Invalid noise scrub level: ${this.config.filters.noiseScrub}`);
    }

    // Warn about decoherence simulation
    if (this.config.toggles.simulateDecoherence) {
      warnings.push('Decoherence simulation enabled - may impact performance');
    }

    // Warn about PII encryption
    if (!this.config.toggles.encryptPii) {
      warnings.push('PII encryption disabled - privacy may be compromised');
    }

    // Warn about fairness audit
    if (!this.config.toggles.fairnessAudit) {
      warnings.push('Fairness audit disabled - equitable access may not be verified');
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors
    };
  }

  /**
   * Get recommended configuration for use case
   */
  static getRecommendedConfig(useCase: 'research' | 'education' | 'production' | 'testing'): QuantumEthicsConfiguration {
    switch (useCase) {
      case 'research':
        return {
          filters: {
            coherenceBaseline: 0.7,
            timezoneParity: true,
            noiseScrub: 'medium'
          },
          toggles: {
            encryptPii: true,
            simulateDecoherence: true,
            fairnessAudit: true
          },
          metadata: {
            version: '1.0.0',
            description: 'Research configuration with decoherence simulation'
          }
        };
      
      case 'education':
        return {
          filters: {
            coherenceBaseline: 0.6,
            timezoneParity: true,
            noiseScrub: 'low'
          },
          toggles: {
            encryptPii: false,
            simulateDecoherence: false,
            fairnessAudit: true
          },
          metadata: {
            version: '1.0.0',
            description: 'Educational configuration optimized for learning. Warning: PII encryption is disabled. Use only with synthetic data, never with real PII.'
          }
        };
      
      case 'production':
        return {
          filters: {
            coherenceBaseline: 0.8,
            timezoneParity: true,
            noiseScrub: 'high'
          },
          toggles: {
            encryptPii: true,
            simulateDecoherence: false,
            fairnessAudit: true
          },
          metadata: {
            version: '1.0.0',
            description: 'Production configuration with maximum security'
          }
        };
      
      case 'testing':
        return {
          filters: {
            coherenceBaseline: 0.5,
            timezoneParity: false,
            noiseScrub: 'low'
          },
          toggles: {
            encryptPii: false,
            simulateDecoherence: false,
            fairnessAudit: false
          },
          metadata: {
            version: '1.0.0',
            description: 'Testing configuration with minimal overhead'
          }
        };
    }
  }

  /**
   * Merge configurations
   */
  private mergeConfig(
    base: QuantumEthicsConfiguration,
    override?: Partial<QuantumEthicsConfiguration>
  ): QuantumEthicsConfiguration {
    if (!override) return { ...base };

    return {
      filters: { ...base.filters, ...override.filters },
      toggles: { ...base.toggles, ...override.toggles },
      metadata: { ...base.metadata, ...override.metadata }
    };
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: QuantumEthicsConfiguration): void {
    const errors: string[] = [];

    // Validate coherence baseline
    if (config.filters.coherenceBaseline < 0.5) {
      errors.push(`Coherence baseline ${config.filters.coherenceBaseline} is too low (minimum 0.5)`);
    }
    if (config.filters.coherenceBaseline > 1.0) {
      errors.push(`Coherence baseline ${config.filters.coherenceBaseline} exceeds maximum 1.0`);
    }

    // Validate noise scrub
    const validNoiseLevels = ['low', 'medium', 'high'];
    if (!validNoiseLevels.includes(config.filters.noiseScrub)) {
      errors.push(`Invalid noise scrub level: ${config.filters.noiseScrub}`);
    }

    if (errors.length > 0) {
      throw new Error(`Invalid configuration: ${errors.join(', ')}`);
    }
  }

  /**
   * Log configuration change
   */
  private logConfigChange(reason: string, config: QuantumEthicsConfiguration): void {
    this.configHistory.push({
      timestamp: new Date().toISOString(),
      config: { ...config },
      reason
    });
  }
}

/**
 * Create configuration manager
 */
export function createConfigurationManager(
  initialConfig?: Partial<QuantumEthicsConfiguration>
): ConfigurationManager {
  return new ConfigurationManager(initialConfig);
}

/**
 * Parse configuration from JSON string
 */
export function parseConfigFromJSON(json: string): QuantumEthicsConfiguration {
  const parsed = JSON.parse(json);
  
  // Validate structure
  if (!parsed.filters || !parsed.toggles) {
    throw new Error('Invalid configuration format: missing filters or toggles');
  }
  
  return parsed as QuantumEthicsConfiguration;
}
