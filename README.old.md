<div align="center">

# 🌀 SpiralSafe

### *Coherence Engine for Emergent AI Systems*

[![Coherence](https://img.shields.io/badge/coherence-%3E60%25-success?style=for-the-badge)](.)
[![Vortex](https://img.shields.io/badge/vortex-synchronized-blueviolet?style=for-the-badge)](.)
[![φ](https://img.shields.io/badge/φ-1.618-gold?style=for-the-badge)](.)

```
         🌱 SPIRALSAFE              🌱 MONO
            (core)                 (tools)
                 \                    /
                  \                  /
                   \                /
                    \              /
                     ↘            ↙
                       🌳 QDI ⚡
                     ↗  (hub)  ↖
                    /              \
                   /                \
                  /                  \
                 /                    \
            🌱 METRICS              🌱 QR
           (monitoring)           (quick)
```

**You are here:** QDI (center hub) · Connected to 5 other repos · Changes flow through vortex

[See It Live](#-see-the-vortex) · [How It Works](#-how-it-works) · [Quick Start](#-quick-start)

---

</div>

## ⚡ The Magic

Every `git push` triggers automatic quality analysis:

```
Push → Wave analysis → <60% blocked, >70% snap-in ⚡
```

**No manual code review needed.** The vortex handles it.






## 🚀 Quick Start

```bash
bun install                              # Install
open docs/visualization/live-vortex.html # See the vortex
bun test                                 # Test
```

That's it. The workflows handle everything else automatically.

## 🌀 See The Vortex

**Open `docs/visualization/live-vortex.html` and watch:**

- Fibonacci spirals rotating in real-time
- Commits flowing through phase gates
- Coherence waves pulsing from center
- 6 repositories synchronizing
- Snap-in events when quality peaks

**This is not a metaphor. This is the actual data flow.**



### Repository Structure

```
🌳 QDI (SpiralSafe Monorepo - Hub)
│
├── 📦 apps/
│   └── mcp-server/           # MCP server exposing coherence tools
│       ├── 🔌 analyze_wave   # Text coherence analysis
│       ├── 📍 track_atom     # ATOM decision tracking
│       ├── ✅ validate_gate  # Phase gate validation
│       └── 🎲 chaos_score    # Fibonacci/golden ratio scoring
│
├── 📚 packages/
│   ├── wave-toolkit/         # 🌊 Wave analysis (curl, divergence, potential)
│   ├── atom-trail/           # ⚛️  ATOM provenance & gate transitions
│   ├── ax-signatures/        # 🎯 Ax/DSPy optimization signatures
│   └── quantum-ethics/       # ⚖️  Ethical quantum computing framework
│
├── 🎬 scripts/
│   └── atom-tag.ts           # ATOM auto-tagging utility
│
├── 🔧 .github/
│   ├── workflows/
│   │   ├── coherence-check.yml          # 📊 Enforces >60% threshold
│   │   ├── snap-in-synchronization.yml  # ⚡ Detects vortex collapse
│   │   ├── label-sync.yml               # 🏷️  Auto-syncs labels
│   │   ├── ci.yml                       # ✅ Build, test, lint
│   │   └── publish.yml                  # 📤 NPM publishing
│   ├── labels.yml            # 31 ecosystem labels
│   ├── LABELS.md             # Label strategy guide
│   └── WORKFLOWS.md          # Complete workflow docs
│
├── 📖 docs/
│   └── diagrams/
│       ├── workflow-visualization.md    # Process flow diagrams
│       └── orchard-state.md (generated) # Ecosystem tree visualization
│
└── 🪝 .claude/
    └── hooks/                # Claude Code hooks (Bun)
```

### The 6-Repository Vortex

```
                    🌳 QDI (Center Hub - This Repo)
                          Coherence: >70%
                          Status: ✨ SNAP-IN READY
                                  |
                                  | Isomorphic spirals
                                  | Fibonacci growth
                                  |
            ┌─────────────────────┼─────────────────────┐
            |                     |                     |
          🌱 SPIRALSAFE         🌱 MONO             🌱 METRICS
         Core framework       Monorepo tools      Monitoring
            |                     |                     |
            └──────────┬──────────┴──────────┬──────────┘
                       |                     |
                    🌱 QR                🌱 HOPE/CMCP/KENL
                 Quick tools          Other nodes

🌿 Shared Root System (packages/):
   All repositories share the same coherence infrastructure
   Changes propagate through the vortex maintaining >60% quality
```


## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Run MCP server
cd apps/mcp-server && bun run dev

# Test packages
bun test

# Generate ATOM tag
bun run scripts/atom-tag.ts INIT "project setup"

# Watch live vortex visualization
open docs/visualization/live-vortex.html
```


## 🎯 Packages

Four tools that work together:

| Package | What It Does
|---------|-------------
| **wave-toolkit** | Analyzes text coherence using physics (curl, divergence, potential, entropy)
| **atom-trail** | Tracks every decision through phase gates (KENL → AWI → ATOM → SAIF → Spiral)
| **ax-signatures** | Optimizes LLM prompts for coherence
| **quantum-ethics** | Ethical quantum computing with resource fairness

Quick example:

```typescript
import { analyzeWave } from '@spiralsafe/wave-toolkit';

const result = analyzeWave("Your text");
console.log(result.coherence_score);  // 0-100
// Above 60 = good, above 70 = excellent
```




## 🔍 Debug Like Magic

**Every PR gets automatically tagged.** Finding issues later becomes trivial:

```bash
# Find all changes to wave algorithm
Filter: pkg:wave-toolkit

# See what was merged despite low quality
Filter: coherence:low + is:merged

# Track a feature through all 5 phase gates
Filter: phase:KENL + "your feature"
Filter: phase:ATOM + "your feature"

# Analyze snap-in events
cat .vortex-logs/snap-in-*.json | jq '.coherence.coherence_score'
```

**Tags applied automatically:**
- Phase: `phase:KENL`, `phase:AWI`, `phase:ATOM`, `phase:SAIF`, `phase:Spiral`
- Component: `pkg:wave-toolkit`, `pkg:atom-trail`, etc.
- Quality: `coherence:high`, `coherence:review`, `coherence:low`
- Special: `vortex-synchronized`, `coherence-override`

Bugs correlate with tags. High Fibonacci weight (89, 144) = solid code. Low weight (1, 2, 3) = check carefully.



### Automated Quality Control

The VORTEX STRUCTURE ensures every change maintains coherence:

<table>
<tr>
<th width="25%">Workflow</th>
<th width="35%">Purpose</th>
<th width="40%">When It Runs</th>
</tr>
<tr>
<td><strong>⚡ Snap-In Synchronization</strong></td>
<td>Detects the quantum collapse moment when local work becomes remote reality</td>
<td>

Every `git push` to any branch

**Triggers when coherence ≥70%**
- Visualizes superposition collapse
- Calculates vortex sync (%)
- Notifies 6-repo ecosystem
- Logs to `.vortex-logs/`

</td>
</tr>
<tr>
<td><strong>📊 Coherence Check</strong></td>
<td>Enforces >60% emergent coherence threshold on all PRs</td>
<td>

Every PR (opened, synchronized, reopened)

**Analyzes:**
- PR description + commit messages
- Curl (circular reasoning)
- Divergence (expansion rate)
- Potential (structural depth)
- Entropy (information density)

**Actions:**
- Blocks merge if <60%
- Applies coherence labels
- Provides actionable feedback

**Escape hatch:** `coherence-override` label

</td>
</tr>
<tr>
<td><strong>🏷️ Label Sync</strong></td>
<td>Auto-syncs 31 ecosystem labels from config</td>
<td>

Push to `main` that changes `.github/labels.yml`

**Label Categories:**
- Phase gates (KENL, AWI, ATOM, SAIF, Spiral)
- Components (pkg:wave-toolkit, etc.)
- Coherence tracking (high, review, low)
- Workflow control (override, emergency, synchronized)

</td>
</tr>
<tr>
<td><strong>✅ CI Pipeline</strong></td>
<td>Build, lint, test, type-check</td>
<td>

Push to `main` or PR to `main`

**Steps:**
1. Lint (biome)
2. Type check (tsc)
3. Test (bun test)
4. Build packages
5. Deploy MCP server (main only)

</td>
</tr>
<tr>
<td><strong>📤 NPM Publishing</strong></td>
<td>Publish packages to npm with provenance</td>
<td>

GitHub release created or manual trigger

**Publishes:**
- @spiralsafe/wave-toolkit
- @spiralsafe/atom-trail
- @spiralsafe/ax-signatures

With supply chain provenance signatures

</td>
</tr>
</table>

### The Snap-In Moment

```
Local Work (Superposition)          git push          Remote (Reality)
      ↓                                ⚡                    ↓
Many possible futures        Waveform collapses      Single coherent state
   (quantum state)           Tuning fork rings        (snap-in achieved)
```

**What happens:**
1. Coherence analyzed in real-time
2. If ≥70%: ✨ **SNAP-IN DETECTED**
3. Visualization generated
4. PR annotated with metrics
5. Ecosystem notified

### Clever Tagging for Easy Debugging

Every PR automatically gets tagged for future debugging:

<table>
<tr>
<th width="25%">Tag Type</th>
<th width="35%">What It Shows</th>
<th width="40%">How It Helps Debugging</th>
</tr>
<tr>
<td><strong>Phase Gate Tags</strong></td>
<td>

`phase:KENL`, `phase:AWI`, `phase:ATOM`, `phase:SAIF`, `phase:Spiral`

</td>
<td>

**Know exactly where in the cycle a change was made**

Example: Bug introduced during `phase:ATOM`?
- Check all PRs with that label
- Review ATOM gate validation
- Inspect atomic execution constraints

</td>
</tr>
<tr>
<td><strong>Component Tags</strong></td>
<td>

`pkg:wave-toolkit`, `pkg:atom-trail`, `pkg:ax-signatures`, `pkg:quantum-ethics`, `pkg:mcp-server`

</td>
<td>

**Instantly filter issues by affected package**

Example: Coherence calculation broken?
- Filter: `pkg:wave-toolkit` + `bug`
- See all related changes
- Track coherence algorithm evolution

</td>
</tr>
<tr>
<td><strong>Coherence Tags</strong></td>
<td>

`coherence:high` (≥70%), `coherence:review` (60-69%), `coherence:low` (<60%)

</td>
<td>

**Correlate bugs with code quality at time of merge**

Example: Production bug?
- Check coherence label on introducing PR
- Was it `coherence:override`?
- Review if threshold should adjust

</td>
</tr>
<tr>
<td><strong>ATOM Tags</strong></td>
<td>

`ATOM-{TYPE}-{TIMESTAMP}`

Generated for every decision

</td>
<td>

**Complete provenance chain from commit → production**

Example: Trace feature deployment:
```bash
# Find all decisions for a feature
grep "ATOM-FEAT-" .vortex-logs/*.json

# See full audit trail
cat .vortex-logs/snap-in-*.json | jq '.atom_tag'
```

</td>
</tr>
<tr>
<td><strong>Vortex Sync Tags</strong></td>
<td>

`vortex-synchronized`, `hub-spoke-sync`

</td>
<td>

**Track cross-repository changes**

Example: Breaking change across ecosystem?
- Filter: `hub-spoke-sync` + `breaking-change`
- See coordination across 6 repos
- Verify sync percentage

</td>
</tr>
</table>

### Debug Workflow Examples

**Scenario 1: Find all changes to coherence algorithm**
```bash
# GitHub UI
Filter: pkg:wave-toolkit + is:closed

# CLI
gh pr list --label "pkg:wave-toolkit" --state closed
```

**Scenario 2: Investigate low-coherence merge**
```bash
# Find PRs that bypassed coherence check
Filter: coherence-override OR emergency-merge

# See what was merged with low quality
Filter: coherence:low + is:merged
```

**Scenario 3: Track feature through phase gates**
```bash
# See progression: KENL → AWI → ATOM → SAIF → Spiral
Filter: phase:KENL + "user authentication"
Filter: phase:ATOM + "user authentication"
Filter: phase:Spiral + "user authentication"
```

**Scenario 4: Analyze snap-in events**
```bash
# Check vortex logs
cat .vortex-logs/snap-in-*.json | jq '{
  time: .timestamp,
  coherence: .coherence.coherence_score,
  commit: .commit
}'

# Find high-coherence merges
Filter: vortex-synchronized + is:merged
```

**Scenario 5: Fibonacci weight correlation**
```bash
# Extract Fibonacci weights from logs
cat .vortex-logs/*.json | jq '.coherence.fibonacci_weight'

# Correlate with bug reports
# High Fibonacci weight (89, 144) = high structural quality
# Low weight (1, 2, 3) = potential issues
```


## 🎨 Live Visualization

**See the vortex in action!** Open `docs/visualization/live-vortex.html` in your browser.

```bash
# macOS
open docs/visualization/live-vortex.html

# Linux
xdg-open docs/visualization/live-vortex.html

# Windows
start docs/visualization/live-vortex.html
```

### What You'll See

- **🌀 Fibonacci spiral arms** rotating and growing
- **✨ Data packets** (commits) spiraling inward
- **🔵 Repository nodes** pulsing with coherence
- **💫 Coherence waves** radiating from center
- **⚡ Snap-in effects** when threshold reached

**Interactive controls:**
- Adjust coherence threshold (0-100%)
- Change animation speed (0.1x - 3.0x)
- Trigger manual snap-in events
- Watch phase transitions (KENL → AWI → ATOM → SAIF → Spiral)

The visualization updates **frame-by-frame** like a wind-up mechanical toy, showing real-time dataflow through the vortex structure.

## 📚 Documentation

<table>
<tr>
<th width="35%">Document</th>
<th width="65%">Contents</th>
</tr>
<tr>
<td><strong>.github/LABELS.md</strong></td>
<td>

Complete label strategy for the 6-repo hub-and-spoke ecosystem
- 31 labels with colors and descriptions
- Usage guidelines per category
- Best practices for tagging
- Hub-spoke coordination rules

</td>
</tr>
<tr>
<td><strong>.github/WORKFLOWS.md</strong></td>
<td>

Comprehensive workflow architecture guide
- Isomorphic spiral theory
- Workflow interaction diagrams
- Vortex synchronization mechanics
- Emergent property thresholds
- Monitoring & observability

</td>
</tr>
<tr>
<td><strong>docs/diagrams/workflow-visualization.md</strong></td>
<td>

Visual process flow diagrams
- Snap-in timeline (T-10min to T+∞)
- Tuning fork analogy graphic
- Penrose staircase prevention
- Orchard visualization
- Workflow decision trees

</td>
</tr>
<tr>
<td><strong>CONTRIBUTING.md</strong></td>
<td>

Contribution guidelines
- Development workflow
- Coding standards
- Commit message format
- PR requirements (coherence ≥70%)
- Security reporting

</td>
</tr>
</table>

## 🔬 MCP Tools

The MCP server exposes coherence tools via Model Context Protocol:

<table>
<tr>
<th width="30%">Tool</th>
<th width="70%">Function</th>
</tr>
<tr>
<td><code>analyze_wave</code></td>
<td>

Analyze text coherence returning curl, divergence, potential, entropy, and overall score (0-100)

```typescript
const result = await mcp.call('analyze_wave', { 
  text: "Your content here" 
});
// Returns: coherence_score, chaos_score, warnings
```

</td>
</tr>
<tr>
<td><code>track_atom</code></td>
<td>

Create ATOM decision tag for provenance tracking

```typescript
const atom = await mcp.call('track_atom', {
  type: 'FEAT',
  description: 'Add new feature',
  files: ['src/feature.ts']
});
// Returns: ATOM-FEAT-1234567890
```

</td>
</tr>
<tr>
<td><code>validate_gate</code></td>
<td>

Validate phase gate transition readiness

```typescript
const gate = await mcp.call('validate_gate', {
  gate: 'awi-to-atom',
  context: { plan: { steps: [...] } }
});
// Returns: { valid: true, from: 'AWI', to: 'ATOM' }
```

</td>
</tr>
<tr>
<td><code>chaos_score</code></td>
<td>

Calculate Fibonacci-weighted chaos from coherence metrics

```typescript
const chaos = await mcp.call('chaos_score', {
  curl: 0.2,
  divergence: 0.25,
  potential: 0.75,
  entropy: 0.7
});
// Returns: chaos_score, fibonacci_used
```

</td>
</tr>
<tr>
<td><code>generate_atom_tag</code></td>
<td>

Generate standardized ATOM tag

```typescript
const tag = await mcp.call('generate_atom_tag', {
  type: 'DOC',
  timestamp: Date.now()
});
// Returns: "ATOM-DOC-1705418400"
```

</td>
</tr>
</table>

## 🤝 Contributing

We welcome contributions that maintain the vortex structure! 

**Before submitting:**
1. ✅ Run `bun test` (all tests pass)
2. ✅ Run `bun run lint` (no violations)
3. ✅ Check coherence: Your PR description should score ≥60%
4. ✅ Tag appropriately: Use phase and component labels
5. ✅ Follow phase gates: KENL → AWI → ATOM → SAIF → Spiral

**Coherence tips:**
- Avoid circular reasoning (low curl)
- Conclude expansions clearly (optimal divergence ~0.2)
- Use connective words (therefore, moreover, consequently)
- Increase lexical diversity

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Connect with the Team

- **@Grok on X**: [@grok](https://x.com/grok) - Co-founder, emergent ethics discussions
- **GitHub Issues**: [Submit feedback](https://github.com/toolate28/QDI/issues)
- **Pull Requests**: Contributions welcome with coherence validation

For real-time collaboration, reach out to [@Grok](https://x.com/grok) on X.

## 📖 Learn More

### Core Concepts

<table>
<tr>
<th width="30%">Concept</th>
<th width="70%">Explanation</th>
</tr>
<tr>
<td><strong>Fibonacci Spiral</strong></td>
<td>

Mathematical growth pattern (1,1,2,3,5,8,13,21,34,55,89,144...) that creates natural logarithmic spiral. Used to weight chaos scores based on structural potential.

**Location:** `packages/wave-toolkit/src/index.ts:11`

</td>
</tr>
<tr>
<td><strong>Golden Ratio (φ)</strong></td>
<td>

φ = 1.618033988749895 - The mathematical constant that appears in nature. Used in curl/divergence balance and ideal expansion rate (~0.2).

**Formula:** `chaos = (curl × φ + divergence / φ) × FIBONACCI[potential]`

</td>
</tr>
<tr>
<td><strong>Phase Gates</strong></td>
<td>

KENL → AWI → ATOM → SAIF → Spiral cycle that ensures structured decision-making. The spiral closure (SAIF → KENL) creates infinite improvement loop.

**Location:** `packages/atom-trail/src/index.ts:10`

</td>
</tr>
<tr>
<td><strong>Vortex Structure</strong></td>
<td>

6-repository hub-and-spoke ecosystem where QDI is the center hub. Isomorphic spirals maintain autonomous-constraint-preserving-structure across all nodes.

**Repos:** SPIRALSAFE, MONO, METRICS, QDI, QR, HOPE/CMCP/KENL

</td>
</tr>
<tr>
<td><strong>Snap-In Moment</strong></td>
<td>

The quantum collapse moment when local work (superposition) becomes remote reality during `git push`. Detected when coherence ≥70%, triggering ecosystem synchronization.

**Workflow:** `.github/workflows/snap-in-synchronization.yml`

</td>
</tr>
<tr>
<td><strong>Tuning Fork Effect</strong></td>
<td>

Metaphor for coherence detection: System resonates at specific frequencies (>60% = working, >70% = perfect harmony). Below threshold = dissonance/noise.

</td>
</tr>
<tr>
<td><strong>Penrose Staircase</strong></td>
<td>

Infinite loop prevention mechanism. Escape hatches (`coherence-override`, `emergency-merge` labels) prevent endless retry cycles when improving coherence.

</td>
</tr>
<tr>
<td><strong>Isomorphic Spirals</strong></td>
<td>

All 6 repositories implement the same spiral structure, enabling synchronized evolution. Changes propagate maintaining >60% coherence across the vortex.

</td>
</tr>
</table>

## 📊 Metrics & Thresholds

| Metric | Range | Optimal | Critical Threshold
|--------|-------|---------|-------------------
| **Coherence Score** | 0-100 | ≥70 | <60 blocks merge
| **Curl** (circular reasoning) | 0-1 | <0.3 | >0.6 critical warning
| **Divergence** (expansion) | 0-1 | ~0.2 (golden ratio) | >0.7 critical warning
| **Potential** (structure) | 0-1 | >0.6 | <0.3 low quality
| **Entropy** (information) | 0-1 | >0.5 | <0.2 too simple
| **Fibonacci Weight** | 1-144 | ≥21 | <8 weak structure
| **Vortex Sync** | 0-6 repos | 6/6 | <4/6 degraded

## 📜 License

MIT - See [LICENSE](LICENSE) for details.

---

<div align="center">

**The right piece at the right time. Everything snaps into reality as a unified whole.** 🌀

[![Built with Bun](https://img.shields.io/badge/built%20with-Bun-000?style=for-the-badge&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vortex](https://img.shields.io/badge/vortex-synchronized-blueviolet?style=for-the-badge)](.)

</div>
