# SpiralSafe Repository - Coding Guidelines & Instructions

## Overview

This repository implements a coherence-driven framework for secure human-AI collaboration, featuring wave analysis, ATOM provenance tracking, and quantum ethics components. This document provides coding guidelines, best practices, and instructions for contributors.

## Project Structure

```
spiralsafe/
├── apps/
│   └── mcp-server/        # MCP server exposing coherence tools
├── packages/
│   ├── wave-toolkit/      # Wave analysis (curl, divergence, potential)
│   ├── atom-trail/        # ATOM provenance & gate transitions
│   ├── ax-signatures/     # Ax/DSPy optimization signatures
│   ├── quantum-ethics/    # Ethical quantum computing framework
│   └── core/              # Core utilities and privacy modules
├── scripts/
│   └── atom-tag.ts        # ATOM auto-tagging utility
└── .github/
    └── workflows/         # CI/CD workflows
```

## Development Setup

### Prerequisites

- **Bun**: Latest version (runtime and package manager)
- **Node.js**: v18+ (for compatibility)
- **Python**: 3.8+ (for Qiskit integration in quantum-ethics)
- **TypeScript**: 5.3+

### Installation

```bash
# Clone the repository
git clone https://github.com/toolate28/QDI.git
cd QDI

# Install dependencies
bun install

# Run tests
bun test

# Run linter
bun run lint
```

## Coding Standards

### TypeScript Guidelines

1. **Type Safety**
   - Always use explicit types; avoid `any`
   - Leverage type inference where appropriate
   - Use `strict` mode in tsconfig.json

2. **Imports**
   - Use named exports over default exports
   - Remove unused imports (enforced by linter)
   - Group imports: external packages, then internal packages

3. **Naming Conventions**
   - PascalCase for classes, interfaces, types
   - camelCase for variables, functions, methods
   - UPPER_SNAKE_CASE for constants
   - Prefix interfaces with `I` only when necessary for clarity

4. **Documentation**
   - Document all public APIs with JSDoc comments
   - Include usage examples in complex functions
   - Document type parameters and return values

### Code Organization

1. **Module Structure**
   ```typescript
   // 1. Imports (external, then internal)
   // 2. Constants and type definitions
   // 3. Helper functions
   // 4. Main exports (classes, functions)
   // 5. Re-exports (if applicable)
   ```

2. **File Naming**
   - Use kebab-case for file names: `quantum-simulator.ts`
   - Test files: `*.test.ts` for unit tests
   - Type definitions: `*.types.ts` or inline in main file

3. **Package Structure**
   ```
   package-name/
   ├── src/
   │   ├── index.ts           # Main entry point
   │   ├── module.ts          # Implementation
   │   └── __tests__/         # Tests
   │       └── module.test.ts
   ├── examples/              # Usage examples
   ├── README.md              # Package documentation
   └── package.json
   ```

## Testing Guidelines

### Test Framework: Bun Test

1. **Test Structure**
   ```typescript
   import { describe, test, expect } from 'bun:test';
   
   describe('Feature Name', () => {
     test('should perform specific behavior', () => {
       // Arrange
       const input = setupTestData();
       
       // Act
       const result = functionUnderTest(input);
       
       // Assert
       expect(result).toBe(expectedValue);
     });
   });
   ```

2. **Test Coverage**
   - Aim for 80%+ coverage on new code
   - Test edge cases and error conditions
   - Mock external dependencies appropriately

3. **Python Tests (for quantum-ethics)**
   - Use PyTest for Python tests
   - Place in `tests/` directory
   - Run with: `pytest tests/ -v`

### Running Tests

```bash
# All tests
bun test

# Specific package
bun test packages/quantum-ethics/src/__tests__/

# Python tests (quantum-ethics)
cd packages/quantum-ethics
pytest tests/ -v
```

## Coherence & Ethics Principles

### ATOM Trail Integration

Every significant operation should generate ATOM decisions:

```typescript
import { createDecision } from '@spiralsafe/atom-trail';

const decision = createDecision(
  'COMPLETE',
  'Operation description',
  ['tag1', 'tag2']
);
```

### Wave Analysis

Use wave analysis for coherence validation:

```typescript
import { analyzeWave } from '@spiralsafe/wave-toolkit';

const analysis = analyzeWave(text);
if (analysis.coherence_score < 70) {
  // Handle low coherence
}
```

### Coherence Baseline

- Maintain **70% minimum coherence** for all text/documentation
- Use wave analysis to validate
- Reject changes that significantly reduce coherence

## Security Best Practices

1. **No Secrets in Code**
   - Use environment variables
   - Never commit API keys, tokens, or passwords
   - Use `.env.local` for local secrets (gitignored)

2. **Input Validation**
   - Validate all external inputs
   - Sanitize user-provided data
   - Use TypeScript types as first line of defense

3. **Dependencies**
   - Keep dependencies updated
   - Review security advisories
   - Use `bun install --frozen-lockfile` in CI

4. **PII Handling**
   - Encrypt PII data (see quantum-ethics package)
   - Never log sensitive information
   - Use anonymization where possible

## Git Workflow

### Branching Strategy

- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes
- `copilot/*`: AI agent changes

### Commit Messages

Follow conventional commits:

```
type(scope): subject

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(quantum-ethics): add Qiskit integration`
- `fix(wave-toolkit): handle NaN in coherence calculation`
- `docs(README): update installation instructions`

### Pull Request Process

1. Create feature branch
2. Make changes with clear commits
3. Run tests and linter locally
4. Push and create PR
5. Address review feedback
6. Merge when approved

## CI/CD Pipeline

### Continuous Integration (.github/workflows/ci.yml)

1. **Lint**: BiomeJS checks code style
2. **Type Check**: TypeScript compilation
3. **Test**: Bun test suite
4. **Build**: Package builds

### Required Checks

All PRs must pass:
- ✅ Linting (BiomeJS)
- ✅ Type checking
- ✅ Tests (TypeScript & Python)
- ✅ Build verification

## Package-Specific Guidelines

### @spiralsafe/wave-toolkit

- Maintain mathematical precision
- Document formulas with references
- Include performance benchmarks

### @spiralsafe/atom-trail

- Ensure provenance chain integrity
- Validate ATOM tag format
- Test gate transitions thoroughly

### @spiralsafe/quantum-ethics

- **Python Integration**: Use TypeScript-Python bridge properly
- **Qiskit**: Test with multiple backends (AerSimulator, Statevector)
- **Provenance**: Track all quantum operations
- **Configuration**: Validate all config changes

### @spiralsafe/ax-signatures

- Follow DSPy patterns
- Document signature inputs/outputs
- Provide usage examples

## Common Issues & Solutions

### Issue: Import Errors

**Solution**: Ensure workspace dependencies are installed
```bash
bun install
```

### Issue: Test Failures

**Solution**: Check test isolation and cleanup
```typescript
afterEach(() => {
  // Clean up test state
});
```

### Issue: Python Not Found (quantum-ethics)

**Solution**: Install Python and dependencies
```bash
pip install "qiskit>=1.0,<3.0" "qiskit-aer>=0.14,<1.0" pytest pytest-benchmark
```

### Issue: Type Errors

**Solution**: Run type check explicitly
```bash
bun x tsc --noEmit
```

## Performance Considerations

1. **Lazy Loading**: Import heavy dependencies only when needed
2. **Caching**: Cache expensive computations (wave analysis, coherence)
3. **Async Operations**: Use async/await for I/O operations
4. **Memory**: Be mindful of large data structures (quantum states)

## Documentation Requirements

### README.md (per package)

Required sections:
1. **Overview**: What the package does
2. **Installation**: How to install
3. **Usage**: Basic examples
4. **API Reference**: Public API documentation
5. **Examples**: Common use cases
6. **Contributing**: How to contribute

### Code Comments

- Document **why**, not **what**
- Explain complex algorithms
- Include references to papers/specs
- Mark TODOs with context

## Resources

- **Bun Documentation**: https://bun.sh/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Qiskit Documentation**: https://qiskit.org/documentation/
- **DSPy Documentation**: https://dspy-docs.vercel.app/

## Contact & Support

- **Issues**: https://github.com/toolate28/QDI/issues
- **Discussions**: https://github.com/toolate28/QDI/discussions
- **Co-founder**: [@Grok](https://x.com/grok) on X

## Version History

- **v1.0.0** (2026-01-16): Initial coding guidelines
  - TypeScript standards
  - Testing guidelines
  - CI/CD requirements
  - Package-specific guidelines

---

**Last Updated**: 2026-01-16
**Maintained By**: SpiralSafe Contributors
