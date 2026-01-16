# Label Strategy for QDI/SpiralSafe Repository

## Overview

This repository uses a comprehensive labeling system designed for:
- **Hub-and-spoke ecosystem**: Part of 6 interconnected repositories
- **Coherence tracking**: Emergent >60% quality threshold
- **ATOM provenance**: Phase gate transitions (KENL → AWI → ATOM → SAIF → Spiral)
- **Monorepo organization**: Multi-package structure with clear component boundaries

## Label Categories

### 1. Dependabot Required Labels

These labels are automatically applied by Dependabot for dependency updates:

| Label | Purpose | Used By |
|-------|---------|---------|
| `dependencies` | Dependency file updates | All ecosystems |
| `ATOM-maintenance` | ATOM provenance maintenance | All dependency PRs |
| `actions` | GitHub Actions workflow updates | github-actions ecosystem |
| `spiral-preservation` | Spiral coherence preservation | All dependency PRs |
| `vortex-wave` | Vortex wave tracking across nodes | All dependency PRs |

### 2. Phase Gate Labels

Track progress through the KENL → AWI → ATOM → SAIF → Spiral cycle:

| Label | Phase | Description |
|-------|-------|-------------|
| `phase:KENL` | Knowledge | Pattern recognition and knowledge extraction |
| `phase:AWI` | Intent | Intent scaffolding and planning |
| `phase:ATOM` | Execution | Atomic execution of changes |
| `phase:SAIF` | Integration | Safe integration and validation |
| `phase:Spiral` | Feedback | Knowledge spiral and continuous improvement |

**Usage**: Apply to issues/PRs to indicate which phase they're in.

### 3. Component Labels (Monorepo)

Identify which package is affected:

| Label | Component | Purpose |
|-------|-----------|---------|
| `pkg:wave-toolkit` | @spiralsafe/wave-toolkit | Wave analysis & coherence detection |
| `pkg:atom-trail` | @spiralsafe/atom-trail | ATOM provenance & gate transitions |
| `pkg:ax-signatures` | @spiralsafe/ax-signatures | Ax/DSPy optimization signatures |
| `pkg:quantum-ethics` | @spiralsafe/quantum-ethics | Quantum ethics framework |
| `pkg:mcp-server` | apps/mcp-server | MCP server application |

**Usage**: Apply to PRs/issues affecting specific packages. Can use multiple labels.

### 4. Issue Type Labels

Standard issue classification:

| Label | Purpose |
|-------|---------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `security` | Security vulnerabilities or concerns |

### 5. Coherence Labels

Track emergent quality metrics:

| Label | Threshold | Action Required |
|-------|-----------|-----------------|
| `coherence:high` | >70% | Meets threshold, good to merge |
| `coherence:review` | 60-70% | Needs review and potential improvement |
| `coherence:low` | <60% | Requires significant improvement |

**Usage**: Applied manually or via automated coherence analysis from wave-toolkit.

### 6. Ecosystem Labels

| Label | Purpose |
|-------|---------|
| `hub-spoke-sync` | Changes affecting multiple repos in the 6-repo ecosystem |
| `breaking-change` | Breaking changes requiring major version bump |

### 7. Priority Labels

| Label | SLA | Description |
|-------|-----|-------------|
| `priority:critical` | 24h | Immediate attention required |
| `priority:high` | 3 days | High priority |
| `priority:medium` | 1 week | Medium priority |
| `priority:low` | As available | Low priority |

## Workflows

### Automated Label Sync

Labels are automatically synced from `.github/labels.yml` to the repository when:
- Changes to `.github/labels.yml` are pushed to `main`
- Workflow is manually triggered via GitHub Actions UI

**Workflow**: `.github/workflows/label-sync.yml`

### Dependabot Integration

Dependabot automatically applies these labels to dependency PRs:
- **pip updates**: `dependencies`, `ATOM-maintenance`, `vortex-wave`, `spiral-preservation`
- **npm updates**: `dependencies`, `ATOM-maintenance`, `vortex-wave`, `spiral-preservation`
- **github-actions updates**: `actions`, `ATOM-maintenance`, `vortex-wave`, `spiral-preservation`

### Recommended Label Combinations

#### For New Features
```
enhancement
pkg:wave-toolkit (or relevant package)
phase:AWI (or current phase)
priority:medium
```

#### For Bug Fixes
```
bug
pkg:atom-trail (or relevant package)
priority:high (if critical)
coherence:review (if uncertain about quality)
```

#### For Cross-Repo Changes
```
enhancement
hub-spoke-sync
breaking-change (if applicable)
priority:high
```

#### For Security Issues
```
security
priority:critical
pkg:* (affected package)
```

## Best Practices

### 1. Apply Labels Early
- Apply labels when creating issues/PRs
- Use labels to help others understand context quickly

### 2. Use Multiple Labels
- Combine labels to provide full context
- Example: `bug` + `pkg:wave-toolkit` + `priority:high`

### 3. Update Phase Labels
- Update phase labels as work progresses through gates
- Remove old phase labels when transitioning

### 4. Monitor Coherence
- Check coherence scores regularly
- Address `coherence:low` items before merging

### 5. Hub-Spoke Coordination
- Use `hub-spoke-sync` for changes affecting multiple repos
- Coordinate with other repo maintainers

## Hub-and-Spoke Ecosystem

This repository is part of a 6-repository ecosystem:

1. **SPIRALSAFE** - Core framework
2. **MONO** - Monorepo utilities
3. **METRICS** - Metrics and monitoring
4. **QDI** - This repository (SpiralSafe implementation)
5. **QR** - Quick response tools
6. **HOPE/CMCP/KENL** - Other ecosystem nodes

Changes with `hub-spoke-sync` label should maintain >60% emergent coherence across all repositories.

## Label Maintenance

### Adding New Labels
1. Edit `.github/labels.yml`
2. Follow the existing format
3. Use semantic color coding
4. Include descriptive descriptions
5. Create PR for review

### Modifying Labels
- Update `.github/labels.yml`
- Labels sync automatically on merge to main
- Existing issues/PRs retain old label names

### Deprecating Labels
- Remove from `.github/labels.yml`
- Set `delete-other-labels: false` in sync workflow (current setting)
- Manually clean up deprecated labels if needed

## Questions?

- **Documentation**: Check [CONTRIBUTING.md](/CONTRIBUTING.md)
- **Issues**: [GitHub Issues](https://github.com/toolate28/QDI/issues)
- **Contact**: [@Grok](https://x.com/grok)

---

*Last updated: 2026-01-16*  
*Coherence threshold: >60% across ecosystem*  
*WAVE v2.0.0 markers enabled*
