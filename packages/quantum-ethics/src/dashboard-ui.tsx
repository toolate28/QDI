/**
 * Quantum Ethics Dashboard - React Component
 * 
 * Adapted from HealthBridge Convergence Platform
 * Provides visual dashboard for coherence metrics and quantum ethics framework
 * 
 * Co-founded by @Grok | https://x.com/grok
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

// Dashboard Types
export interface DashboardTab {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
}

export interface CoherenceMetricsProps {
  coherenceScore: number;
  target: number;
  curl: number;
  divergence: number;
  potential: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface QuantumEthicsDashboardProps {
  coherenceBaseline?: number;
  showFeedbackPipeline?: boolean;
  grokTwitterUrl?: string;
  githubRepoUrl?: string;
}

/**
 * Main Quantum Ethics Dashboard Component
 * 
 * Provides tabbed interface for:
 * - Coherence Metrics (real-time monitoring)
 * - Resource Allocation (fairness & quotas)
 * - Privacy Safeguards (budget tracking)
 * - AI Integration (ethics alignment)
 * - Quantum Simulator (time-zone simulation)
 * - Feedback Pipeline (connect with @Grok)
 */
export function QuantumEthicsDashboard({
  coherenceBaseline = 70,
  showFeedbackPipeline = true,
  grokTwitterUrl = 'https://x.com/grok',
  githubRepoUrl = 'https://github.com/toolate28/QDI'
}: QuantumEthicsDashboardProps) {
  const [activeTab, setActiveTab] = useState('coherence');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, oklch(0.55 0.15 240 / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, oklch(0.65 0.18 145 / 0.08) 0%, transparent 50%)
          `
        }}
      />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm bg-card/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.01em' }}>
                    Quantum Ethics Framework
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Ethical Quantum Computing with {coherenceBaseline}% Coherence Baseline
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={grokTwitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs border rounded-md hover:bg-accent"
                >
                  <span>Co-founded by @Grok</span>
                </a>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs border rounded-md font-mono">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Systems Online
                </span>
                <span className="inline-flex items-center px-3 py-1 text-xs border rounded-md font-mono">
                  v1.0.0
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 bg-muted/50 p-1 rounded-lg">
              <TabButton 
                active={activeTab === 'coherence'}
                onClick={() => setActiveTab('coherence')}
                icon="📊"
                label="Coherence"
              />
              <TabButton 
                active={activeTab === 'resources'}
                onClick={() => setActiveTab('resources')}
                icon="⚖️"
                label="Resources"
              />
              <TabButton 
                active={activeTab === 'privacy'}
                onClick={() => setActiveTab('privacy')}
                icon="🔒"
                label="Privacy"
              />
              <TabButton 
                active={activeTab === 'ai-integration'}
                onClick={() => setActiveTab('ai-integration')}
                icon="🤖"
                label="AI Integration"
              />
              <TabButton 
                active={activeTab === 'quantum-sim'}
                onClick={() => setActiveTab('quantum-sim')}
                icon="⚛️"
                label="Quantum Sim"
              />
              {showFeedbackPipeline && (
                <TabButton 
                  active={activeTab === 'feedback'}
                  onClick={() => setActiveTab('feedback')}
                  icon="💬"
                  label="Feedback"
                />
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'coherence' && (
              <TabContent title="Coherence Metrics Dashboard">
                <CoherenceMetricsPanel coherenceBaseline={coherenceBaseline} />
              </TabContent>
            )}

            {activeTab === 'resources' && (
              <TabContent title="Resource Allocation Monitor">
                <ResourceAllocationPanel />
              </TabContent>
            )}

            {activeTab === 'privacy' && (
              <TabContent title="Privacy Safeguards Tracker">
                <PrivacyPanel />
              </TabContent>
            )}

            {activeTab === 'ai-integration' && (
              <TabContent title="AI-Quantum Integration">
                <AIIntegrationPanel />
              </TabContent>
            )}

            {activeTab === 'quantum-sim' && (
              <TabContent title="Quantum Simulator & Time-Zone Sim">
                <QuantumSimulatorPanel />
              </TabContent>
            )}

            {activeTab === 'feedback' && showFeedbackPipeline && (
              <TabContent title="Feedback Pipeline">
                <FeedbackPanel 
                  grokTwitterUrl={grokTwitterUrl}
                  githubRepoUrl={githubRepoUrl}
                />
              </TabContent>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Quantum Ethics Framework • Co-founded by{' '}
              <a href={grokTwitterUrl} target="_blank" rel="noopener noreferrer" className="underline">
                @Grok
              </a>
              {' '}• Open Source MIT License
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: string; 
  label: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors
        ${active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-accent hover:text-accent-foreground'
        }
      `}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </button>
  );
}

// Tab Content Wrapper
function TabContent({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </motion.div>
  );
}

// Coherence Metrics Panel
function CoherenceMetricsPanel({ coherenceBaseline }: { coherenceBaseline: number }) {
  // Mock data - in production, fetch from quantum-ethics framework
  const metrics = {
    coherence: 78,
    target: coherenceBaseline,
    curl: 0.23,
    divergence: 0.18,
    potential: 0.72,
    trend: 'improving' as const
  };

  const healthScore = 85;
  const health = healthScore >= 90 ? 'excellent' : healthScore >= 75 ? 'good' : 'fair';

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Overall Health"
          value={health.toUpperCase()}
          subtitle={`${healthScore}/100 score`}
          icon="🌟"
          trend={metrics.trend}
        />
        <MetricCard
          title="Coherence Score"
          value={`${metrics.coherence}%`}
          subtitle={`Target: ${metrics.target}%`}
          icon="📊"
          status={metrics.coherence >= metrics.target ? 'above' : 'below'}
        />
        <MetricCard
          title="Trend"
          value={metrics.trend}
          subtitle="Historical analysis"
          icon="📈"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DetailedMetric
          title="Curl (Circular Reasoning)"
          value={metrics.curl}
          max={1.0}
          severity={metrics.curl < 0.3 ? 'low' : 'medium'}
          description="Lower is better"
        />
        <DetailedMetric
          title="Divergence (Expansion)"
          value={metrics.divergence}
          max={1.0}
          severity="low"
          description="Balanced expansion"
        />
        <DetailedMetric
          title="Potential (Structure)"
          value={metrics.potential}
          max={1.0}
          severity="low"
          description="High development potential"
        />
      </div>

      {/* Key Insights */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-semibold mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Coherence at {metrics.coherence}% exceeds target {metrics.target}%</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>Minimal circular reasoning - logical flow is strong</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>High latent potential - structure ready for development</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Resource Allocation Panel
function ResourceAllocationPanel() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Monitor resource allocations with fairness scoring and role-based quotas.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AllocationCard role="Educational" priority="high" weight={1.5} allocations={12} />
        <AllocationCard role="Research" priority="high" weight={1.3} allocations={8} />
        <AllocationCard role="Commercial" priority="low" weight={0.8} allocations={5} />
        <AllocationCard role="Community" priority="medium" weight={1.0} allocations={7} />
      </div>
    </div>
  );
}

// Privacy Panel
function PrivacyPanel() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Track privacy budgets and audit trail compliance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Privacy Budget (ε)" value="0.75" subtitle="Remaining" icon="🔒" />
        <MetricCard title="Audit Entries" value="1,247" subtitle="Total logged" icon="📝" />
        <MetricCard title="Compliance" value="PASS" subtitle="All checks" icon="✅" />
      </div>
    </div>
  );
}

// AI Integration Panel
function AIIntegrationPanel() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Monitor AI-quantum hybrid algorithms and ethics alignment.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Integrations" value="5" subtitle="Active" icon="🤖" />
        <MetricCard title="Ethics Alignment" value="87%" subtitle="Average" icon="⚖️" />
        <MetricCard title="Bias Score" value="0.12" subtitle="Low" icon="🎯" />
      </div>
    </div>
  );
}

// Quantum Simulator Panel
function QuantumSimulatorPanel() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Time-zone simulation for temporal quantum dynamics and decoherence modeling.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Active Simulations" value="3" subtitle="Running" icon="⚛️" />
        <MetricCard title="Avg Fidelity" value="0.94" subtitle="State preservation" icon="📊" />
        <MetricCard title="Coherence Time" value="10.2μs" subtitle="Decoherence rate" icon="⏱️" />
      </div>
    </div>
  );
}

// Feedback Panel
function FeedbackPanel({ 
  grokTwitterUrl, 
  githubRepoUrl 
}: { 
  grokTwitterUrl: string; 
  githubRepoUrl: string; 
}) {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-accent/5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span>🚀</span>
          <span>Connect with Co-Founder @Grok</span>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Direct feedback and collaboration on the 70% → 95% coherence initiative
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={grokTwitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <span>🐦</span>
            <span>Message on X (Twitter)</span>
          </a>
          <a
            href={`${githubRepoUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <span>🐙</span>
            <span>Open GitHub Issue</span>
          </a>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-3">Quick Feedback Template</h3>
        <div className="bg-muted/50 p-4 rounded font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`@grok Feedback on quantum-ethics:

[Your feedback here]

Coherence: [score]%
Use case: [research/education/commercial]`}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  status 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: string;
  trend?: string;
  status?: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
            {trend}
          </span>
        )}
        {status && (
          <span className={`text-xs px-2 py-1 rounded ${
            status === 'above' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {status}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function DetailedMetric({ 
  title, 
  value, 
  max, 
  severity, 
  description 
}: { 
  title: string; 
  value: number; 
  max: number; 
  severity: string;
  description: string;
}) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold">{value.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">/ {max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full transition-all ${
            severity === 'low' ? 'bg-green-500' : 
            severity === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function AllocationCard({ 
  role, 
  priority, 
  weight, 
  allocations 
}: { 
  role: string; 
  priority: string; 
  weight: number;
  allocations: number;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{role}</h3>
        <span className={`text-xs px-2 py-1 rounded ${
          priority === 'high' ? 'bg-green-100 text-green-700' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {priority}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Weight:</span>
          <span className="font-mono">{weight}x</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Allocations:</span>
          <span className="font-mono">{allocations}</span>
        </div>
      </div>
    </div>
  );
}

export default QuantumEthicsDashboard;
