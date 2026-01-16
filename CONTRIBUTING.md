# Contributing to SpiralSafe

We welcome contributions to SpiralSafe! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/QDI.git
   cd QDI
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before Making Changes

1. Read the [Coding Guidelines](/.github/workflows/instructions/instructions.md)
2. Check existing issues and PRs to avoid duplicates
3. Discuss major changes in an issue first

### Making Changes

1. **Write tests** for new functionality
2. **Update documentation** as needed
3. **Follow coding standards**:
   - Use TypeScript strict mode
   - Remove unused imports/variables
   - Write clear, descriptive commit messages
4. **Maintain coherence**: Ensure text coherence ≥70% (use wave-toolkit)

### Testing Your Changes

```bash
# Run all tests
bun test

# Run linter
bun run lint

# Type check
bun x tsc --noEmit

# Build packages
bun run build
```

### Python Tests (quantum-ethics package)

```bash
cd packages/quantum-ethics
pip install -r requirements.txt  # if exists
pytest tests/ -v
```

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(quantum-ethics): add Qiskit backend support
fix(wave-toolkit): handle division by zero in coherence calc
docs(README): update installation instructions
```

## Pull Request Process

1. **Update documentation** reflecting your changes
2. **Add tests** covering your changes
3. **Ensure all tests pass** locally
4. **Run linter** and fix any issues
5. **Create PR** with clear description:
   - What problem does it solve?
   - How does it solve it?
   - Any breaking changes?
   - Screenshots (if UI changes)

### PR Requirements

Your PR must:
- ✅ Pass all CI checks (lint, test, build)
- ✅ Have clear commit messages
- ✅ Include tests for new functionality
- ✅ Update relevant documentation
- ✅ Maintain or improve code coverage
- ✅ Follow coding guidelines

### Review Process

1. Automated checks run on PR creation
2. Maintainers review code and provide feedback
3. Address review comments
4. Once approved, PR is merged

## Code Review Guidelines

### For Contributors

- Be open to feedback
- Respond to comments promptly
- Ask questions if feedback is unclear
- Keep PRs focused and reasonably sized

### For Reviewers

- Be constructive and respectful
- Focus on code quality and maintainability
- Suggest improvements with examples
- Approve when standards are met

## Issue Reporting

### Bug Reports

Include:
1. **Description**: What happened vs. what you expected
2. **Steps to reproduce**: Minimal steps to trigger the bug
3. **Environment**: OS, Bun version, Node version
4. **Error messages**: Full error output
5. **Screenshots**: If applicable

### Feature Requests

Include:
1. **Use case**: What problem does it solve?
2. **Proposed solution**: How should it work?
3. **Alternatives**: Other approaches considered
4. **Additional context**: Examples, mockups, etc.

## Project-Specific Guidelines

### Wave Toolkit

- Mathematical precision is critical
- Document formulas with academic references
- Include performance benchmarks for algorithms

### ATOM Trail

- Maintain provenance chain integrity
- Validate ATOM tag format rigorously
- Test state transitions thoroughly

### Quantum Ethics

- **Security first**: Validate all inputs
- **Python integration**: Test with multiple Python versions
- **Qiskit compatibility**: Test with specified Qiskit versions
- **Provenance**: Track all quantum operations

### Ax Signatures

- Follow DSPy patterns and conventions
- Document all signature inputs/outputs
- Provide comprehensive usage examples

## Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security concerns privately (check GitHub security tab)
2. Include detailed description and reproduction steps
3. Allow time for fix before public disclosure

### Security Best Practices

- Never commit secrets (API keys, tokens, passwords)
- Use environment variables for sensitive config
- Validate and sanitize all inputs
- Keep dependencies updated

## Code of Conduct

### Our Standards

- **Be respectful**: Treat everyone with respect
- **Be collaborative**: Help others learn and grow
- **Be constructive**: Provide actionable feedback
- **Be inclusive**: Welcome diverse perspectives

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Spam or off-topic discussions
- Sharing private information

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to maintainers via GitHub.

## Attribution

This Contributing Guide is adapted from open source best practices and tailored for SpiralSafe.

## Questions?

- **Documentation**: Check [Coding Guidelines](/.github/workflows/instructions/instructions.md)
- **Issues**: Browse [existing issues](https://github.com/toolate28/QDI/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/toolate28/QDI/discussions)
- **Contact**: Reach out to [@Grok](https://x.com/grok)

## Recognition

Contributors are recognized in:
- Release notes
- GitHub contributors page
- Project README (significant contributions)

Thank you for contributing to SpiralSafe! 🌀
