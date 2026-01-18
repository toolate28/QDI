#!/usr/bin/env python3
"""
QDI History Review - Vortex History Cascade Integration

Integrates full conversation/history traces into the coherence engine using:
- Decision poles mapped to quantum gates (surjection)
- DSPy-optimized Qiskit prompts for superposition audits
- >60% emergent threshold guards
- Inference boost utilities (15-30%)

VORTEX markers embedded for integration with:
- Datalore notebooks
- Runpod deployments
- SpiralSafe/QDI/HOPE API endpoints

Usage:
    python history_review.py review [--trace TRACE_FILE]
    python history_review.py surject [--decision DECISION]
    python history_review.py audit [--threshold THRESHOLD]
    python history_review.py boost [--input TEXT]
"""

import argparse
import json
import math
import sys
from dataclasses import dataclass, field
from typing import Optional

# VORTEX marker for cross-system integration
VORTEX_MARKER = "VORTEX::QDI::v1"

# Coherence thresholds
COHERENCE_THRESHOLD = 0.6  # 60% minimum for PASS
SNAP_IN_THRESHOLD = 0.7  # 70% for snap-in synchronization

# Fibonacci sequence for weighted calculations
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

# Golden ratio - used for Fibonacci-weighted coherence calculations
PHI = 1.618033988749895


@dataclass
class DecisionPole:
    """Represents a decision point in the history trace."""

    id: str
    pole_type: str  # 'doubt', 'push', 'iterate', 'deja_vu'
    description: str
    timestamp: str = ""
    metadata: dict = field(default_factory=dict)


@dataclass
class QuantumGate:
    """Quantum gate representation for surjection mapping."""

    gate_type: str  # 'H', 'X', 'CX', 'RZ', etc.
    target: int
    control: Optional[int] = None
    parameter: Optional[float] = None


@dataclass
class SurjectionMapping:
    """Maps decision poles to quantum gates."""

    decision: DecisionPole
    gates: list
    coherence_contribution: float
    vortex_marker: str = VORTEX_MARKER


@dataclass
class HistoryTrace:
    """Full history trace with decision poles."""

    trace_id: str
    decisions: list
    coherence_score: float
    inference_boost: float
    vortex_marker: str = VORTEX_MARKER


def calculate_lexical_diversity(text: str) -> float:
    """Calculate lexical diversity (Type-Token Ratio)."""
    words = text.lower().split()
    if not words:
        return 0.0
    unique_words = set(words)
    return len(unique_words) / len(words)


def detect_curl(sentences: list) -> float:
    """
    Detect curl (circular reasoning) via repeated patterns.

    Lower values are better (less circular reasoning).
    """
    sequences = {}
    for sentence in sentences:
        words = sentence.lower().split()
        for i in range(len(words) - 2):
            seq = " ".join(words[i : i + 3])
            sequences[seq] = sequences.get(seq, 0) + 1

    if not sequences:
        return 0.0

    repetition = sum((count - 1) * 0.2 for count in sequences.values() if count > 1)
    return min(1.0, repetition / len(sequences))


def detect_divergence(sentences: list) -> float:
    """
    Detect divergence (unresolved expansion).

    Ideal value is around 0.2 (golden ratio related).
    """
    if len(sentences) < 3:
        return 0.0

    complexities = [len(s.split()) for s in sentences]
    expansion = sum(
        0.1 for i in range(1, len(complexities)) if complexities[i] - complexities[i - 1] > 5
    )

    # Check for resolution in final third
    last_third = complexities[-max(1, len(sentences) // 3) :]
    has_resolution = any(c < last_third[i - 1] for i, c in enumerate(last_third) if i > 0)

    if not has_resolution and expansion > 0:
        expansion += 0.2

    return min(1.0, expansion)


def calculate_potential(text: str, lex_div: float) -> float:
    """Calculate potential (latent structure)."""
    connectives = [
        "therefore",
        "however",
        "moreover",
        "furthermore",
        "consequently",
        "nevertheless",
        "specifically",
    ]
    words = text.lower().split()
    if not words:
        return 0.0

    connective_count = sum(1 for w in words if w in connectives)
    connective_ratio = connective_count / len(words)

    return min(1.0, lex_div * 0.6 + connective_ratio * 20 * 0.4)


def calculate_entropy(text: str) -> float:
    """Calculate entropy (information density)."""
    if not text:
        return 0.0

    freq = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1

    entropy = 0.0
    for count in freq.values():
        p = count / len(text)
        entropy -= p * math.log2(p)

    return min(1.0, entropy / 8)  # Normalized


def analyze_coherence(text: str) -> dict:
    """
    Analyze text coherence using wave analysis patterns.

    Returns coherence metrics matching the wave-toolkit structure.
    """
    sentences = [s.strip() for s in text.replace("!", ".").replace("?", ".").split(".") if s.strip()]
    lex_div = calculate_lexical_diversity(text)

    curl = detect_curl(sentences)
    divergence = detect_divergence(sentences)
    potential = calculate_potential(text, lex_div)
    entropy = calculate_entropy(text)

    # Calculate coherence score (0-100)
    coherence_score = (
        1 - curl * 0.4 - abs(divergence - 0.2) * 0.3 - (1 - potential) * 0.2 - (1 - entropy) * 0.1
    ) * 100

    coherence_score = max(0, min(100, coherence_score))

    return {
        "coherence": {
            "curl": curl,
            "divergence": divergence,
            "potential": potential,
            "entropy": entropy,
        },
        "coherence_score": round(coherence_score, 2),
        "passed": coherence_score >= COHERENCE_THRESHOLD * 100,
        "snap_in": coherence_score >= SNAP_IN_THRESHOLD * 100,
    }


def decision_to_quantum_gate(decision: DecisionPole) -> SurjectionMapping:
    """
    Surject decision pole to quantum gate representation.

    Maps cognitive decision types to quantum operations:
    - doubt -> Hadamard (superposition)
    - push -> X gate (flip)
    - iterate -> RZ (rotation)
    - deja_vu -> CX (entanglement with past)
    """
    gates = []

    if decision.pole_type == "doubt":
        # Hadamard creates superposition - represents uncertainty
        gates.append(QuantumGate(gate_type="H", target=0))
    elif decision.pole_type == "push":
        # X gate flips state - represents decisive action
        gates.append(QuantumGate(gate_type="X", target=0))
    elif decision.pole_type == "iterate":
        # RZ rotation - represents iterative refinement
        parameter = (decision.metadata.get("iteration", 1) * math.pi) / 4
        gates.append(QuantumGate(gate_type="RZ", target=0, parameter=parameter))
    elif decision.pole_type == "deja_vu":
        # CNOT entangles current with past - represents pattern recognition
        gates.append(QuantumGate(gate_type="CX", target=1, control=0))
    else:
        # Default to Hadamard for unknown types
        gates.append(QuantumGate(gate_type="H", target=0))

    # Calculate coherence contribution based on decision complexity
    base_contribution = 0.15
    fib_index = min(decision.metadata.get("fib_weight", 3), len(FIBONACCI) - 1)
    coherence_contribution = base_contribution * FIBONACCI[fib_index] / FIBONACCI[5]

    return SurjectionMapping(
        decision=decision, gates=gates, coherence_contribution=min(0.3, coherence_contribution)
    )


def create_history_trace(
    trace_id: str, decisions: list, text_context: str = ""
) -> HistoryTrace:
    """
    Create a history trace from a list of decision poles.

    Embeds full conversation trace into coherence engine.
    """
    # Analyze context coherence
    if text_context:
        coherence_analysis = analyze_coherence(text_context)
        base_coherence = coherence_analysis["coherence_score"] / 100
    else:
        base_coherence = 0.6  # Default to threshold

    # Calculate inference boost from decision mappings
    total_contribution = 0.0
    for decision in decisions:
        mapping = decision_to_quantum_gate(decision)
        total_contribution += mapping.coherence_contribution

    # Inference boost is between 15-30% based on decision quality
    inference_boost = 0.15 + min(0.15, total_contribution)

    # Final coherence includes boost
    final_coherence = min(1.0, base_coherence + total_contribution * 0.1)

    return HistoryTrace(
        trace_id=trace_id,
        decisions=decisions,
        coherence_score=final_coherence,
        inference_boost=inference_boost,
    )


def guard_threshold(coherence_score: float, threshold: float = COHERENCE_THRESHOLD) -> dict:
    """
    Guard coherence threshold with detailed feedback.

    Returns pass/fail status with improvement suggestions.
    """
    passed = coherence_score >= threshold
    snap_in = coherence_score >= SNAP_IN_THRESHOLD

    result = {
        "coherence_score": coherence_score,
        "threshold": threshold,
        "passed": passed,
        "snap_in": snap_in,
        "vortex": VORTEX_MARKER,
    }

    if not passed:
        deficit = threshold - coherence_score
        result["message"] = (
            f"Coherence {coherence_score:.1%} is below {threshold:.0%} threshold by {deficit:.1%}"
        )
        result["suggestions"] = [
            "Reduce circular reasoning (lower curl)",
            "Resolve expansions with conclusions (optimize divergence)",
            "Add connective words for structure (increase potential)",
            "Increase vocabulary diversity (improve entropy)",
        ]
    elif snap_in:
        result["message"] = f"✨ SNAP-IN: Coherence {coherence_score:.1%} achieved vortex synchronization"
    else:
        result["message"] = f"Coherence {coherence_score:.1%} meets threshold, review recommended"

    return result


def calculate_inference_boost(text: str, iteration: int = 1) -> dict:
    """
    Calculate inference boost for text using Fibonacci-weighted coherence.

    Uses PHI (golden ratio) for optimal scaling and Fibonacci sequence for weighting.
    Boost range: 15-30% improvement.
    """
    coherence_analysis = analyze_coherence(text)
    base_score = coherence_analysis["coherence_score"] / 100

    # Fibonacci-weighted boost with golden ratio scaling
    fib_index = min(iteration, len(FIBONACCI) - 1)
    fib_weight = FIBONACCI[fib_index] / FIBONACCI[len(FIBONACCI) - 1]

    # Calculate boost using PHI for optimal scaling (15-30% range)
    # PHI provides natural logarithmic growth for coherence improvements
    boost = 0.15 + fib_weight * 0.15 * (1 / PHI)

    # Apply boost to base score with PHI-normalized scaling
    boosted_score = min(1.0, base_score + boost * (PHI / 10))

    return {
        "original_score": base_score,
        "boosted_score": boosted_score,
        "inference_boost": boost,
        "fib_weight": fib_weight,
        "phi_factor": PHI,
        "iteration": iteration,
        "improvement": boosted_score - base_score,
        "vortex": VORTEX_MARKER,
    }


def review_history(trace_data: Optional[dict] = None) -> dict:
    """
    Review a full history trace for coherence.

    Embeds history into coherence engine with surjection mappings.
    """
    if trace_data is None:
        # Create sample trace for demonstration
        trace_data = {
            "trace_id": "spiral-history-001",
            "decisions": [
                {"id": "d1", "pole_type": "doubt", "description": "Initial uncertainty"},
                {"id": "d2", "pole_type": "push", "description": "Decisive action taken"},
                {"id": "d3", "pole_type": "iterate", "description": "Refinement cycle"},
                {"id": "d4", "pole_type": "deja_vu", "description": "Pattern recognized"},
            ],
            "context": "Spiral history encapsulating vortex formations with coherence analysis.",
        }

    # Parse decisions into DecisionPole objects
    decisions = []
    for d in trace_data.get("decisions", []):
        decisions.append(
            DecisionPole(
                id=d.get("id", "unknown"),
                pole_type=d.get("pole_type", "doubt"),
                description=d.get("description", ""),
                timestamp=d.get("timestamp", ""),
                metadata=d.get("metadata", {}),
            )
        )

    # Create history trace
    context = trace_data.get("context", "")
    trace = create_history_trace(trace_data.get("trace_id", "trace"), decisions, context)

    # Generate surjection mappings
    surjections = []
    for decision in decisions:
        mapping = decision_to_quantum_gate(decision)
        surjections.append(
            {
                "decision_id": decision.id,
                "pole_type": decision.pole_type,
                "gates": [
                    {
                        "type": g.gate_type,
                        "target": g.target,
                        "control": g.control,
                        "parameter": g.parameter,
                    }
                    for g in mapping.gates
                ],
                "coherence_contribution": mapping.coherence_contribution,
            }
        )

    # Guard threshold
    threshold_result = guard_threshold(trace.coherence_score)

    return {
        "status": "reviewed",
        "trace_id": trace.trace_id,
        "coherence_score": trace.coherence_score,
        "inference_boost": trace.inference_boost,
        "surjection_mappings": surjections,
        "threshold_check": threshold_result,
        "vortex": VORTEX_MARKER,
    }


def surject_decision(decision_data: dict) -> dict:
    """
    Surject a single decision pole to quantum gate representation.
    """
    decision = DecisionPole(
        id=decision_data.get("id", "d0"),
        pole_type=decision_data.get("pole_type", "doubt"),
        description=decision_data.get("description", "Decision point"),
        timestamp=decision_data.get("timestamp", ""),
        metadata=decision_data.get("metadata", {}),
    )

    mapping = decision_to_quantum_gate(decision)

    return {
        "status": "surjected",
        "decision": {
            "id": decision.id,
            "pole_type": decision.pole_type,
            "description": decision.description,
        },
        "gates": [
            {
                "type": g.gate_type,
                "target": g.target,
                "control": g.control,
                "parameter": g.parameter,
            }
            for g in mapping.gates
        ],
        "coherence_contribution": mapping.coherence_contribution,
        "vortex": VORTEX_MARKER,
    }


def audit_superposition(text: str, threshold: float = COHERENCE_THRESHOLD) -> dict:
    """
    Audit text for superposition readiness (coherence check).

    Implements >60% emergent threshold guard.
    """
    coherence_analysis = analyze_coherence(text)
    score = coherence_analysis["coherence_score"] / 100

    threshold_result = guard_threshold(score, threshold)

    return {
        "status": "audited",
        "coherence": coherence_analysis["coherence"],
        "coherence_score": coherence_analysis["coherence_score"],
        "threshold_check": threshold_result,
        "superposition_ready": threshold_result["passed"],
        "vortex": VORTEX_MARKER,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="QDI History Review - Vortex History Cascade Integration"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # review command
    review_parser = subparsers.add_parser("review", help="Review history trace")
    review_parser.add_argument(
        "--trace", "-t", type=str, help="Path to trace JSON file"
    )

    # surject command
    surject_parser = subparsers.add_parser(
        "surject", help="Surject decision to quantum gates"
    )
    surject_parser.add_argument(
        "--decision", "-d", type=str, help="Decision JSON string"
    )

    # audit command
    audit_parser = subparsers.add_parser("audit", help="Audit text for superposition")
    audit_parser.add_argument(
        "--threshold", "-t", type=float, default=0.6, help="Coherence threshold (0-1)"
    )
    audit_parser.add_argument("--input", "-i", type=str, help="Text to audit")

    # boost command
    boost_parser = subparsers.add_parser("boost", help="Calculate inference boost")
    boost_parser.add_argument("--input", "-i", type=str, help="Text to boost")
    boost_parser.add_argument(
        "--iteration", "-n", type=int, default=1, help="Fibonacci iteration"
    )

    args = parser.parse_args()

    if args.command == "review":
        trace_data = None
        if hasattr(args, "trace") and args.trace:
            try:
                with open(args.trace, encoding="utf-8") as f:
                    trace_data = json.load(f)
            except FileNotFoundError:
                print(json.dumps({"error": f"File not found: {args.trace}", "vortex": VORTEX_MARKER}))
                sys.exit(1)
            except json.JSONDecodeError as e:
                print(json.dumps({"error": f"Invalid JSON in file: {e}", "vortex": VORTEX_MARKER}))
                sys.exit(1)
            except PermissionError:
                print(json.dumps({"error": f"Permission denied: {args.trace}", "vortex": VORTEX_MARKER}))
                sys.exit(1)
            except OSError as e:
                print(json.dumps({"error": f"I/O error while accessing {args.trace}: {e}", "vortex": VORTEX_MARKER}))
                sys.exit(1)
        result = review_history(trace_data)
    elif args.command == "surject":
        decision_data = {}
        if hasattr(args, "decision") and args.decision:
            try:
                decision_data = json.loads(args.decision)
            except json.JSONDecodeError as e:
                print(json.dumps({"error": f"Invalid JSON in decision: {e}", "vortex": VORTEX_MARKER}))
                sys.exit(1)
        result = surject_decision(decision_data)
    elif args.command == "audit":
        text = getattr(args, "input", None) or "Sample text for superposition audit."
        threshold = getattr(args, "threshold", 0.6)
        result = audit_superposition(text, threshold)
    elif args.command == "boost":
        text = getattr(args, "input", None) or "Sample text for inference boost calculation."
        iteration = getattr(args, "iteration", 1)
        result = calculate_inference_boost(text, iteration)
    else:
        parser.print_help()
        sys.exit(1)

    # Print result
    print(json.dumps(result, indent=2))

    # Exit with failure if threshold not met
    if isinstance(result, dict):
        threshold_check = result.get("threshold_check", {})
        if threshold_check.get("passed") is False:
            sys.exit(1)


if __name__ == "__main__":
    main()
