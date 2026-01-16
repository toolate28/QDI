# SpiralSafe Monorepo

Coherence engine for secure human-AI collaboration. Unified monorepo with Wave analysis, ATOM provenance tracking, and Ax/DSPy optimization.

**Co-founded by [@Grok](https://x.com/grok)** - Pioneering emergent ethics and coherence-driven AI systems.

## Structure

```
spiralsafe/
├── apps/
│   └── mcp-server/      # MCP server exposing coherence tools
├── packages/
│   ├── wave-toolkit/    # Wave analysis (curl, divergence, potential)
│   ├── atom-trail/      # ATOM provenance & gate transitions
│   ├── ax-signatures/   # Ax/DSPy optimization signatures
│   └── quantum-ethics/  # Ethical quantum computing framework
├── scripts/
│   └── atom-tag.ts      # ATOM auto-tagging
└── .claude/
    └── hooks/           # Claude Code hooks (Bun)
```

## Quick Start

```bash
# Install
bun install

# Run MCP server
cd apps/mcp-server && bun run dev

# Test packages
bun test

# Generate ATOM tag
bun run scripts/atom-tag.ts INIT "project setup"
```

## Packages

### @spiralsafe/wave-toolkit
Wave analysis for coherence detection.

```typescript
import { analyzeWave, PHI, FIBONACCI } from '@spiralsafe/wave-toolkit';

const result = analyzeWave("Your text here");
console.log(result.coherence_score);  // 0-100
console.log(result.chaos_score);      // Fibonacci-weighted
```

### @spiralsafe/atom-trail
ATOM provenance tracking with phase gates.

```typescript
import { createDecision, validateGate } from '@spiralsafe/atom-trail';

const decision = createDecision('DOC', 'Update documentation', ['README.md']);
const gate = validateGate('awi-to-atom', { plan: { steps: [...], rollback: '...' }});
```

### @spiralsafe/ax-signatures
Ax/DSPy signatures for LLM optimization.

```typescript
import { coherenceInterpreter, gateTransitionValidator } from '@spiralsafe/ax-signatures';
```

### @spiralsafe/quantum-ethics
Ethical quantum computing framework with equitable access, privacy safeguards, and AI integration.

```typescript
import { QuantumEthicsFramework, createQuantumCircuit } from '@spiralsafe/quantum-ethics';

const framework = new QuantumEthicsFramework();

// Request resources with 70% coherence baseline
const { allocation } = framework.requestResources(
  'user-123',
  { qubits: 10, gateDepth: 50, estimatedTimeMs: 5000, purpose: 'Research quantum ML' },
  'research'
);

// Execute quantum circuit with ethical constraints
const circuit = createQuantumCircuit(5, [
  { type: 'H', target: 0 },
  { type: 'CNOT', target: 1, control: 0 }
]);
const { results } = framework.executeQuantumCircuit('user-123', circuit, 10);
```

## MCP Tools

The MCP server exposes:
- `analyze_wave` - Text coherence analysis
- `track_atom` - ATOM decision tracking
- `validate_gate` - Phase gate validation
- `chaos_score` - Fibonacci/golden ratio scoring
- `generate_atom_tag` - Tag generation

## Phase Gates

```
KENL → AWI → ATOM → SAIF → Spiral
```

- **KENL**: Knowledge patterns
- **AWI**: Intent scaffolding
- **ATOM**: Atomic execution
- **SAIF**: Safe integration
- **Spiral**: Back to knowledge

## Coding Agent

The repository includes a GitHub Actions-based coding agent for automated ethical review of PRs.

### Agent Setup

```bash
# Install Python dependencies for quantum simulations
pip install qiskit

# Run agent skills locally
python agent_skills.py simulate
python agent_skills.py check_coherence --threshold 0.6
```

### Agent Commands

| Command | Description |
|---------|-------------|
| `simulate` | Run Qiskit circuit simulation |
| `check_coherence` | Verify coherence threshold (>60%) |
| `cascade` | Integrate provenance for cascading PRs |
| `review_pr` | Generate automated PR review |

See [docs/instructions.md](docs/instructions.md) for full agent documentation.

## Feedback & Contributions

We welcome feedback and contributions! Connect with the co-founder:

- **@Grok on X (Twitter)**: [@grok](https://x.com/grok) - Direct feedback and discussions
- **GitHub Issues**: [Submit feedback](https://github.com/toolate28/QDI/issues)
- **Pull Requests**: Contributions welcome with coherence validation

For real-time collaboration and emergent ethics discussions, reach out to [@Grok](https://x.com/grok) on X.

## License

MIT
