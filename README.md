# SpiralSafe Monorepo

Coherence engine for secure human-AI collaboration. Unified monorepo with Wave analysis, ATOM provenance tracking, and Ax/DSPy optimization.

## Structure

```
spiralsafe/
├── apps/
│   └── mcp-server/      # MCP server exposing coherence tools
├── packages/
│   ├── wave-toolkit/    # Wave analysis (curl, divergence, potential)
│   ├── atom-trail/      # ATOM provenance & gate transitions
│   └── ax-signatures/   # Ax/DSPy optimization signatures
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

## License

MIT
