# QDI Coding Agent Instructions

## Overview

This document provides instructions for GitHub coding agents (e.g., Copilot, custom workflows) in the QDI repository. The framework follows Fibonacci-structured emergence patterns for ethical quantum computing integration.

Emergent quality is maintained at >60% via isomorphic Fibonacci patterns:
- 1 seed task → 2 growth commands → 3 escalation reviews → 5 maintenance loops

## Agent Setup

1. **Install Dependencies**:
   ```bash
   # Clone repo and install
   bun install
   
   # For Python quantum simulations
   pip install qiskit
   ```

2. **Configure**: Set `GITHUB_TOKEN` in environment for Actions.

3. **Verify Setup**:
   ```bash
   bun test          # Run all tests
   bun run lint      # Check code style
   ```

## Receiving PR Bodies

### Original PR (Qiskit Circuits)
Auto-simulate quantum circuits with the agent skills script:
```bash
python agent_skills.py simulate --circuit "h(0); cx(0,1)"
```
Verify coherence >60% before merge.

### 2nd PR (Cascades)
Run cascade integration:
```bash
python agent_skills.py cascade --pr-body "integrate provenance"
```
Low resistance: History is dealt-with (tests passing).

### Ethical Toggles

Ethical and provenance-aware behavior (e.g., fairness metrics and ATOM trail tracking) is handled by the cascade command and the VORTEX marker system. Use the `cascade` command with PR body text to detect ethical keywords automatically.

## Commands (Fibonacci Escalation)

| Command | Description |
|---------|-------------|
| `simulate` | Run Qiskit circuit simulation, output measurement counts |
| `check_coherence` | Measure coherence >60%, negate decoherence |
| `review_pr` | Parse PR body, auto-generate review comments |
| `cascade` | Integrate provenance with cascading PRs |

## Maintenance Loops

- **Feedback**: On merge, tag provenance via ATOM trail
- **Question Infinitely**: If doubt exists, push to classical sims (they suffice)
- **Coherence Check**: All PRs must maintain >60% emergent quality

## Phase Gates

The system follows these phase transitions:
```
KENL → AWI → ATOM → SAIF → Spiral
```

- **KENL**: Knowledge patterns
- **AWI**: Intent scaffolding  
- **ATOM**: Atomic execution
- **SAIF**: Safe integration
- **Spiral**: Back to knowledge

## Integration with Existing Packages

### @spiralsafe/quantum-ethics
```typescript
import { QuantumEthicsFramework, createQuantumCircuit } from '@spiralsafe/quantum-ethics';

const framework = new QuantumEthicsFramework();
const circuit = createQuantumCircuit(2, [
  { type: 'H', target: 0 },
  { type: 'CNOT', target: 1, control: 0 }
]);
```

### @spiralsafe/atom-trail
```typescript
import { createDecision, validateGate } from '@spiralsafe/atom-trail';

const decision = createDecision('DOC', 'Agent review complete', ['docs/instructions.md']);
```

## Ready to Iterate

Spirals sustain quantum coherence. For questions, open an issue or reach out to [@Grok](https://x.com/grok).
