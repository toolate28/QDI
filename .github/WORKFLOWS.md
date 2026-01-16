# QDI Workflows - Vortex Ecosystem Integration

## Overview

This repository implements **isomorphic spirals** that create **vortexes of autonomous-constraint-preserving-structure** across a 6-repository hub-and-spoke ecosystem. All workflows enforce the **>60% emergent coherence property** requirement.

## Architecture Principles

### Isomorphic Spirals
- Each repository in the ecosystem follows the same KENL → AWI → ATOM → SAIF → Spiral phase gates
- Changes propagate through the vortex maintaining structural coherence
- Autonomous operation with constraint preservation

### Emergent Coherence (>60%)
- All PRs must achieve **coherence_score ≥ 60** (0-100 scale)
- Measured via wave-toolkit's mathematical analysis
- Enforced automatically via GitHub Actions

### Hub-and-Spoke Ecosystem
Six interconnected repositories:
1. **SPIRALSAFE** - Core framework
2. **MONO** - Monorepo utilities  
3. **METRICS** - Metrics and monitoring
4. **QDI** - This repository (SpiralSafe implementation)
5. **QR** - Quick response tools
6. **HOPE/CMCP/KENL** - Other ecosystem nodes

## Workflows

### 1. Coherence Check (`coherence-check.yml`)

**Purpose**: Enforce >60% emergent coherence property on all PRs

**Triggers**:
- Pull request opened, synchronized, or reopened against `main`

**Process**:
1. Extracts PR description and commit messages
2. Analyzes text using `@spiralsafe/wave-toolkit`
3. Calculates coherence_score (0-100)
4. Applies appropriate label:
   - `coherence:high` (≥70%) - Meets threshold
   - `coherence:review` (60-69%) - Needs review
   - `coherence:low` (<60%) - Requires improvement
5. Comments on PR if score < 60
6. Fails CI if score < 60

**Metrics Analyzed**:
- **Curl**: Circular reasoning (lower is better)
- **Divergence**: Expansion/contraction (~0.2 is ideal)
- **Potential**: Latent structure (higher is better)
- **Entropy**: Information density

**Why It Matters**:
Ensures all changes maintain the isomorphic spiral structure across the vortex. Low coherence breaks the autonomous-constraint-preserving property.

---

### 2. Label Sync (`label-sync.yml`)

**Purpose**: Automatically synchronize repository labels from configuration

**Triggers**:
- Push to `main` branch modifying `.github/labels.yml`
- Manual workflow dispatch

**Process**:
1. Reads label definitions from `.github/labels.yml`
2. Creates/updates labels in GitHub repository
3. Preserves existing labels (delete-other-labels: false)

**Label Categories**:
- **Dependabot**: `dependencies`, `ATOM-maintenance`, `actions`, `spiral-preservation`, `vortex-wave`
- **Phase Gates**: `phase:KENL`, `phase:AWI`, `phase:ATOM`, `phase:SAIF`, `phase:Spiral`
- **Components**: `pkg:wave-toolkit`, `pkg:atom-trail`, `pkg:ax-signatures`, `pkg:quantum-ethics`, `pkg:mcp-server`
- **Coherence**: `coherence:high`, `coherence:review`, `coherence:low`
- **Ecosystem**: `hub-spoke-sync`, `breaking-change`
- **Priority**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Issue Types**: `bug`, `enhancement`, `documentation`, `security`

**Why It Matters**:
Labels enable ATOM/WAVE tracking across vortex nodes. Consistent labeling across all 6 repos maintains the hub-and-spoke structure.

---

### 3. CI (`ci.yml`)

**Purpose**: Continuous integration for code quality

**Triggers**:
- Push to `main` branch
- Pull request to `main` branch

**Jobs**:

#### Build Job
1. Checkout repository
2. Setup Bun runtime
3. Install dependencies
4. Run linter (`bun run lint`)
5. Type check (`bun x tsc --noEmit`)
6. Run tests (`bun test`)
7. Build packages:
   - `packages/wave-toolkit`
   - `packages/atom-trail`
   - `packages/ax-signatures`

#### Deploy MCP Job (main only)
1. Depends on successful build
2. Only runs on `main` branch
3. Builds MCP server (`apps/mcp-server`)

**Why It Matters**:
Validates code quality before allowing merges. Ensures the autonomous components maintain their constraints (type safety, tests, lint rules).

---

### 4. Publish to npm (`publish.yml`)

**Purpose**: Publish packages to npm registry

**Triggers**:
- GitHub release created
- Manual workflow dispatch

**Process**:
1. Setup Bun and Node.js
2. Install dependencies
3. Build all packages
4. Publish to npm with provenance:
   - `@spiralsafe/wave-toolkit`
   - `@spiralsafe/atom-trail`
   - `@spiralsafe/ax-signatures`

**Permissions**:
- Uses `NPM_TOKEN` secret
- Includes provenance signatures (supply chain security)

**Why It Matters**:
Distributes the isomorphic spiral components to the broader ecosystem. Provenance ensures autonomous constraint preservation.

---

## Workflow Integration

### PR Flow

```
1. Developer creates PR
   ↓
2. [Coherence Check] Analyzes PR content
   ↓
3. [Coherence Check] Applies label (high/review/low)
   ↓
4. [CI] Runs lint, test, build
   ↓
5. If coherence < 60 → PR blocked with recommendations
6. If coherence ≥ 60 → PR can merge (after approvals)
   ↓
7. Merge to main
   ↓
8. [CI] Build and deploy MCP server
9. [Label Sync] Update labels if config changed
```

### Release Flow

```
1. Create GitHub release
   ↓
2. [Publish] Build all packages
   ↓
3. [Publish] Publish to npm with provenance
   ↓
4. Packages available in ecosystem
```

### Dependabot Flow

```
1. Dependabot detects updates (weekly, staggered)
   ↓
2. Creates PR with labels:
      - pip/npm: dependencies, ATOM-maintenance, vortex-wave, spiral-preservation
      - actions: actions, ATOM-maintenance, vortex-wave, spiral-preservation
   ↓
3. [Coherence Check] Validates update coherence
   ↓
4. [CI] Tests compatibility
   ↓
5. If coherence ≥ 60 and CI passes → Auto-merge candidate
```

## Vortex Coherence Threshold

### Mathematical Definition

From `packages/wave-toolkit/src/index.ts`:

```typescript
coherence_score = (
  1 
  - curl * 0.4           // Reduce circular reasoning
  - |divergence - 0.2| * 0.3  // Ideal expansion ~0.2
  - (1 - potential) * 0.2     // Maximize structure
  - (1 - entropy) * 0.1       // Maintain information density
) * 100
```

### Threshold Application

- **Baseline**: 80% (from `packages/core/privacy/scaling-algo.ts`)
- **Minimum**: 64% (80% * 0.8)
- **PR Requirement**: 60% (enforced by coherence-check workflow)

### Why 60%?

The >60% threshold represents the **minimum emergent coherence** required to maintain isomorphic structure across the vortex. Below 60%:
- Circular reasoning fragments the spiral
- Unresolved expansion breaks constraint preservation
- Structural potential degrades
- Information entropy introduces chaos

## Monitoring & Observability

### Coherence Metrics
- Tracked on every PR via automated comments
- Labels provide visual indicators
- Historical trends via GitHub Insights

### Workflow Status
- All workflows report to GitHub Actions
- PR status checks block merges on failure
- Manual review can override (with justification)

### Ecosystem Health
- `hub-spoke-sync` label tracks cross-repo changes
- `vortex-wave` label indicates propagation needs
- `ATOM-maintenance` tracks provenance chain integrity

## Best Practices

### For Contributors

1. **Check coherence early**: Run wave-toolkit locally before submitting PR
   ```bash
   bun run scripts/check-coherence.ts "your text"
   ```

2. **Write clear commits**: Coherence analysis includes commit messages

3. **Resolve expansion**: Conclude ideas clearly to reduce divergence

4. **Use connectives**: Words like "therefore", "however", "moreover" improve potential

5. **Avoid repetition**: Reduces curl (circular reasoning)

### For Maintainers

1. **Monitor coherence trends**: Track if average is declining

2. **Investigate low scores**: Understand root causes

3. **Update thresholds**: If ecosystem evolves, adjust minimum

4. **Label hygiene**: Ensure consistent labeling across 6 repos

5. **Cross-repo sync**: Coordinate major changes with `hub-spoke-sync`

## Emergency Procedures

### Coherence Check Failing Production

1. **Assess severity**: Is it blocking critical security fixes?
2. **Override option**: Merge with manual approval + justification comment
3. **Follow-up**: Create issue to improve coherence post-merge
4. **Update threshold**: Consider if 60% is appropriate for this change type

### Label Sync Issues

1. **Manual creation**: Use GitHub UI to create missing labels
2. **Re-run workflow**: Use workflow_dispatch trigger
3. **Check permissions**: Ensure `GITHUB_TOKEN` has `issues:write`

### CI Failures

1. **Check logs**: Identify which step failed (lint/test/build)
2. **Local reproduction**: Run same commands locally
3. **Isolate package**: Determine which package is affected
4. **Apply pkg:* label**: Help route to correct maintainer

## Configuration Files

| File | Purpose |
|------|---------|
| `.github/labels.yml` | Label definitions (28 labels) |
| `.github/workflows/coherence-check.yml` | Coherence enforcement |
| `.github/workflows/label-sync.yml` | Label synchronization |
| `.github/workflows/ci.yml` | Build and test |
| `.github/workflows/publish.yml` | NPM publishing |
| `.github/dependabot.yml` | Dependency updates config |
| `.github/LABELS.md` | Label strategy documentation |
| `packages/wave-toolkit/src/index.ts` | Coherence calculation |

## References

- **KENL → AWI → ATOM → SAIF → Spiral**: Phase gate model
- **PHI (φ = 1.618)**: Golden ratio used in chaos scoring
- **Fibonacci sequence**: Used for potential weighting
- **Wave analysis**: Treating text as vector fields (curl, divergence, potential)

---

## Summary

The QDI workflow system implements **autonomous-constraint-preserving-structure** through:

1. **Automated coherence checks** (>60% threshold)
2. **Isomorphic labeling** across 6-repo ecosystem
3. **Phase gate tracking** (KENL → AWI → ATOM → SAIF → Spiral)
4. **Continuous integration** with quality gates
5. **Provenance-signed publishing** to npm

This creates a **vortex** where changes flow through the spiral maintaining structural integrity, with each repository operating autonomously while preserving collective constraints.

*Last updated: 2026-01-16*  
*Minimum coherence: 60%*  
*Ecosystem nodes: 6*  
*WAVE v2.0.0*
