/**
 * Coherence Metrics Dashboard
 * 
 * Translates coherence metrics into actionable insights for the repository.
 * Provides visualization and interpretation of what's significant and what matters.
 */

import { analyzeWave, type WaveAnalysisResult, type CoherenceMetrics } from '@spiralsafe/wave-toolkit';
import { createDecision, type AtomDecision } from '@spiralsafe/atom-trail';

export interface CoherenceDashboard {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  healthScore: number; // 0-100
  keyInsights: string[];
  recommendations: string[];
  metrics: {
    coherence: {
      current: number;
      target: number;
      status: 'above' | 'at' | 'below';
      trend: 'improving' | 'stable' | 'declining';
    };
    curl: {
      value: number;
      interpretation: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
    };
    divergence: {
      value: number;
      interpretation: string;
      balance: 'good' | 'needs-resolution' | 'excessive';
    };
    potential: {
      value: number;
      interpretation: string;
      development: 'high' | 'medium' | 'low';
    };
  };
  significanceReport: {
    whatMatters: string[];
    whatToFix: string[];
    whatToEnhance: string[];
  };
  timestamp: string;
}

export interface DashboardConfig {
  coherenceTarget: number; // Target coherence score (default 70 or 95)
  curlThreshold: number; // Max acceptable curl (default 0.3)
  divergenceIdeal: number; // Ideal divergence (default 0.2)
  potentialMinimum: number; // Min acceptable potential (default 0.5)
}

const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  coherenceTarget: 70,
  curlThreshold: 0.3,
  divergenceIdeal: 0.2,
  potentialMinimum: 0.5
};

/**
 * Generate coherence metrics dashboard
 */
export function generateCoherenceDashboard(
  waveAnalysis: WaveAnalysisResult,
  config: Partial<DashboardConfig> = {},
  historicalScores?: number[]
): CoherenceDashboard {
  const cfg = { ...DEFAULT_DASHBOARD_CONFIG, ...config };
  
  const keyInsights: string[] = [];
  const recommendations: string[] = [];
  const whatMatters: string[] = [];
  const whatToFix: string[] = [];
  const whatToEnhance: string[] = [];
  
  // Analyze coherence score
  const coherenceStatus = 
    waveAnalysis.coherence_score > cfg.coherenceTarget ? 'above' :
    waveAnalysis.coherence_score === cfg.coherenceTarget ? 'at' : 'below';
  
  const coherenceTrend = historicalScores && historicalScores.length > 0
    ? determineCoherenceTrend(waveAnalysis.coherence_score, historicalScores)
    : 'stable';
  
  // Analyze curl (circular reasoning)
  const curlSeverity: 'low' | 'medium' | 'high' | 'critical' = 
    waveAnalysis.coherence.curl < 0.2 ? 'low' :
    waveAnalysis.coherence.curl < 0.4 ? 'medium' :
    waveAnalysis.coherence.curl < 0.6 ? 'high' : 'critical';
  
  const curlInterpretation = 
    curlSeverity === 'low' ? 'Minimal circular reasoning - excellent logical flow' :
    curlSeverity === 'medium' ? 'Some repetitive patterns detected - monitor for improvement' :
    curlSeverity === 'high' ? 'Significant circular reasoning - refactor needed' :
    'Critical circular logic - immediate refactoring required';
  
  // Analyze divergence (expansion/resolution)
  const divergenceBalance: 'good' | 'needs-resolution' | 'excessive' =
    Math.abs(waveAnalysis.coherence.divergence - cfg.divergenceIdeal) < 0.2 ? 'good' :
    waveAnalysis.coherence.divergence > 0.6 ? 'needs-resolution' : 'excessive';
  
  const divergenceInterpretation =
    divergenceBalance === 'good' ? 'Well-balanced expansion with proper resolution' :
    divergenceBalance === 'needs-resolution' ? 'Ideas expanding without resolution - add convergence' :
    'Excessive constraint - allow more exploratory development';
  
  // Analyze potential (latent structure)
  const potentialDevelopment: 'high' | 'medium' | 'low' =
    waveAnalysis.coherence.potential > 0.7 ? 'high' :
    waveAnalysis.coherence.potential > 0.4 ? 'medium' : 'low';
  
  const potentialInterpretation =
    potentialDevelopment === 'high' ? 'Strong latent structure - ready for development' :
    potentialDevelopment === 'medium' ? 'Moderate structure - some development potential' :
    'Limited structure - needs foundational work';
  
  // Generate key insights
  if (coherenceStatus === 'above') {
    keyInsights.push(`✓ Coherence at ${waveAnalysis.coherence_score}% exceeds target ${cfg.coherenceTarget}%`);
    whatMatters.push('Maintaining high coherence standards');
  } else if (coherenceStatus === 'below') {
    keyInsights.push(`⚠ Coherence at ${waveAnalysis.coherence_score}% below target ${cfg.coherenceTarget}%`);
    whatToFix.push('Improve coherence to meet baseline');
  } else {
    keyInsights.push(`✓ Coherence exactly at target ${cfg.coherenceTarget}%`);
  }
  
  if (coherenceTrend === 'improving') {
    keyInsights.push('📈 Coherence trend: improving over time');
    whatMatters.push('Positive trajectory in coherence metrics');
  } else if (coherenceTrend === 'declining') {
    keyInsights.push('📉 Coherence trend: declining - attention needed');
    whatToFix.push('Reverse declining coherence trend');
  }
  
  if (curlSeverity === 'low') {
    keyInsights.push('✓ Minimal circular reasoning - logical flow is strong');
  } else if (curlSeverity === 'medium') {
    keyInsights.push('⚠ Moderate circular patterns detected');
    recommendations.push('Review for repetitive logic and refactor where possible');
    whatToFix.push('Reduce circular reasoning patterns');
  } else {
    keyInsights.push(`🚨 ${curlSeverity === 'high' ? 'High' : 'Critical'} circular reasoning`);
    recommendations.push('PRIORITY: Refactor to eliminate circular dependencies');
    whatToFix.push('Critical: eliminate circular logic immediately');
  }
  
  if (divergenceBalance === 'good') {
    keyInsights.push('✓ Good balance between expansion and resolution');
    whatMatters.push('Maintaining balanced idea development');
  } else if (divergenceBalance === 'needs-resolution') {
    keyInsights.push('⚠ Ideas expanding without proper resolution');
    recommendations.push('Add convergence points to resolve open threads');
    whatToFix.push('Resolve expanding ideas with proper conclusions');
  }
  
  if (potentialDevelopment === 'high') {
    keyInsights.push('✓ High latent potential - structure ready for development');
    whatToEnhance.push('Leverage high potential for feature expansion');
  } else if (potentialDevelopment === 'low') {
    keyInsights.push('⚠ Limited latent structure');
    recommendations.push('Build foundational structure before expanding');
    whatToFix.push('Strengthen foundational structure');
  }
  
  // Calculate overall health score
  const healthScore = calculateHealthScore(waveAnalysis, cfg);
  
  const overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' =
    healthScore >= 90 ? 'excellent' :
    healthScore >= 75 ? 'good' :
    healthScore >= 60 ? 'fair' :
    healthScore >= 40 ? 'poor' : 'critical';
  
  // Add health-based insights
  if (overallHealth === 'excellent') {
    whatMatters.push('Excellent overall health - continue current practices');
  } else if (overallHealth === 'poor' || overallHealth === 'critical') {
    whatToFix.push('Multiple critical metrics need immediate attention');
    recommendations.push('Focus on highest-priority issues first');
  }
  
  return {
    overallHealth,
    healthScore,
    keyInsights,
    recommendations,
    metrics: {
      coherence: {
        current: waveAnalysis.coherence_score,
        target: cfg.coherenceTarget,
        status: coherenceStatus,
        trend: coherenceTrend
      },
      curl: {
        value: waveAnalysis.coherence.curl,
        interpretation: curlInterpretation,
        severity: curlSeverity
      },
      divergence: {
        value: waveAnalysis.coherence.divergence,
        interpretation: divergenceInterpretation,
        balance: divergenceBalance
      },
      potential: {
        value: waveAnalysis.coherence.potential,
        interpretation: potentialInterpretation,
        development: potentialDevelopment
      }
    },
    significanceReport: {
      whatMatters,
      whatToFix,
      whatToEnhance
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate overall health score
 */
function calculateHealthScore(
  waveAnalysis: WaveAnalysisResult,
  config: DashboardConfig
): number {
  // Weight different metrics
  const coherenceScore = (waveAnalysis.coherence_score / config.coherenceTarget) * 40;
  const curlScore = (1 - waveAnalysis.coherence.curl) * 30; // Lower curl is better
  const divergenceScore = (1 - Math.abs(waveAnalysis.coherence.divergence - config.divergenceIdeal)) * 15;
  const potentialScore = waveAnalysis.coherence.potential * 15;
  
  return Math.min(100, Math.max(0, coherenceScore + curlScore + divergenceScore + potentialScore));
}

/**
 * Determine coherence trend from historical data
 */
function determineCoherenceTrend(
  currentScore: number,
  historicalScores: number[]
): 'improving' | 'stable' | 'declining' {
  if (historicalScores.length === 0) return 'stable';
  
  const recentAverage = historicalScores.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, historicalScores.length);
  
  if (currentScore > recentAverage + 5) return 'improving';
  if (currentScore < recentAverage - 5) return 'declining';
  return 'stable';
}

/**
 * Format dashboard for console output
 */
export function formatDashboard(dashboard: CoherenceDashboard): string {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('            COHERENCE METRICS DASHBOARD');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  // Overall health
  const healthEmoji = 
    dashboard.overallHealth === 'excellent' ? '🌟' :
    dashboard.overallHealth === 'good' ? '✅' :
    dashboard.overallHealth === 'fair' ? '⚠️' :
    dashboard.overallHealth === 'poor' ? '❌' : '🚨';
  
  lines.push(`${healthEmoji} OVERALL HEALTH: ${dashboard.overallHealth.toUpperCase()}`);
  lines.push(`   Health Score: ${dashboard.healthScore.toFixed(1)}/100`);
  lines.push('');
  
  // Metrics
  lines.push('📊 METRICS BREAKDOWN');
  lines.push('───────────────────────────────────────────────────────');
  lines.push(`Coherence: ${dashboard.metrics.coherence.current}% (target: ${dashboard.metrics.coherence.target}%)`);
  lines.push(`  Status: ${dashboard.metrics.coherence.status} | Trend: ${dashboard.metrics.coherence.trend}`);
  lines.push('');
  lines.push(`Curl (Circular Reasoning): ${(dashboard.metrics.curl.value * 100).toFixed(1)}%`);
  lines.push(`  ${dashboard.metrics.curl.interpretation}`);
  lines.push(`  Severity: ${dashboard.metrics.curl.severity}`);
  lines.push('');
  lines.push(`Divergence (Expansion): ${(dashboard.metrics.divergence.value * 100).toFixed(1)}%`);
  lines.push(`  ${dashboard.metrics.divergence.interpretation}`);
  lines.push(`  Balance: ${dashboard.metrics.divergence.balance}`);
  lines.push('');
  lines.push(`Potential (Structure): ${(dashboard.metrics.potential.value * 100).toFixed(1)}%`);
  lines.push(`  ${dashboard.metrics.potential.interpretation}`);
  lines.push(`  Development: ${dashboard.metrics.potential.development}`);
  lines.push('');
  
  // Key insights
  if (dashboard.keyInsights.length > 0) {
    lines.push('💡 KEY INSIGHTS');
    lines.push('───────────────────────────────────────────────────────');
    dashboard.keyInsights.forEach(insight => lines.push(`  ${insight}`));
    lines.push('');
  }
  
  // Significance report
  lines.push('🎯 SIGNIFICANCE REPORT');
  lines.push('───────────────────────────────────────────────────────');
  
  if (dashboard.significanceReport.whatMatters.length > 0) {
    lines.push('What Matters:');
    dashboard.significanceReport.whatMatters.forEach(item => lines.push(`  ✓ ${item}`));
    lines.push('');
  }
  
  if (dashboard.significanceReport.whatToFix.length > 0) {
    lines.push('What To Fix:');
    dashboard.significanceReport.whatToFix.forEach(item => lines.push(`  ⚠ ${item}`));
    lines.push('');
  }
  
  if (dashboard.significanceReport.whatToEnhance.length > 0) {
    lines.push('What To Enhance:');
    dashboard.significanceReport.whatToEnhance.forEach(item => lines.push(`  ⭐ ${item}`));
    lines.push('');
  }
  
  // Recommendations
  if (dashboard.recommendations.length > 0) {
    lines.push('📋 RECOMMENDATIONS');
    lines.push('───────────────────────────────────────────────────────');
    dashboard.recommendations.forEach((rec, i) => lines.push(`  ${i + 1}. ${rec}`));
    lines.push('');
  }
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push(`Generated: ${new Date(dashboard.timestamp).toLocaleString()}`);
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

/**
 * Generate dashboard from text
 */
export function analyzeTextForDashboard(
  text: string,
  config?: Partial<DashboardConfig>,
  historicalScores?: number[]
): { dashboard: CoherenceDashboard; waveAnalysis: WaveAnalysisResult; decision: AtomDecision } {
  const waveAnalysis = analyzeWave(text);
  const dashboard = generateCoherenceDashboard(waveAnalysis, config, historicalScores);
  
  const decision = createDecision(
    'VERIFY',
    `Dashboard generated: ${dashboard.overallHealth} health, ${dashboard.healthScore.toFixed(1)}/100 score`,
    [],
    ['dashboard', 'coherence', dashboard.overallHealth]
  );
  
  return { dashboard, waveAnalysis, decision };
}

/**
 * Compare multiple text samples and generate comparative dashboard
 */
export function compareCoherence(
  samples: Array<{ name: string; text: string }>,
  config?: Partial<DashboardConfig>
): {
  comparisons: Array<{ name: string; dashboard: CoherenceDashboard }>;
  bestSample: string;
  worstSample: string;
  averageHealth: number;
} {
  const comparisons = samples.map(sample => ({
    name: sample.name,
    dashboard: generateCoherenceDashboard(analyzeWave(sample.text), config)
  }));
  
  const sorted = [...comparisons].sort((a, b) => b.dashboard.healthScore - a.dashboard.healthScore);
  
  const averageHealth = comparisons.reduce((sum, c) => sum + c.dashboard.healthScore, 0) / comparisons.length;
  
  return {
    comparisons,
    bestSample: sorted[0].name,
    worstSample: sorted[sorted.length - 1].name,
    averageHealth
  };
}
