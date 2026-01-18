"""
PyTest tests for agent_skills.py

Tests quantum circuit simulation, coherence checking, cascade integration,
and PR review functionality for the QDI agent script.
"""

import pytest
import sys
from pathlib import Path

# Add parent directory to path to import agent_skills module
# This is necessary since agent_skills.py is a standalone script at the repo root
# and not part of an installed package
repo_root = Path(__file__).parent.parent
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

import agent_skills


class TestParseGate:
    """Test gate parsing functionality"""
    
    def test_parse_hadamard_gate(self):
        """Test parsing H gate"""
        result = agent_skills._parse_gate("h(0)")
        assert result == ('h', (0,))
        
        result = agent_skills._parse_gate("H(1)")
        assert result == ('h', (1,))
    
    def test_parse_x_gate(self):
        """Test parsing X gate"""
        result = agent_skills._parse_gate("x(0)")
        assert result == ('x', (0,))
        
        result = agent_skills._parse_gate("X(2)")
        assert result == ('x', (2,))
    
    def test_parse_cx_gate(self):
        """Test parsing CX gate"""
        result = agent_skills._parse_gate("cx(0,1)")
        assert result == ('cx', (0, 1))
        
        result = agent_skills._parse_gate("CX(2, 3)")
        assert result == ('cx', (2, 3))
    
    def test_parse_invalid_gate(self):
        """Test parsing invalid gates"""
        assert agent_skills._parse_gate("invalid") is None
        assert agent_skills._parse_gate("h(a)") is None
        assert agent_skills._parse_gate("cx(0)") is None
        assert agent_skills._parse_gate("cx(0,1,2)") is None
        assert agent_skills._parse_gate("") is None
        assert agent_skills._parse_gate("   ") is None
    
    def test_parse_gate_with_whitespace(self):
        """Test parsing gates with extra whitespace"""
        result = agent_skills._parse_gate("  h(0)  ")
        assert result == ('h', (0,))
        
        result = agent_skills._parse_gate("cx( 0 , 1 )")
        assert result == ('cx', (0, 1))


class TestSimulateCircuit:
    """Test circuit simulation functionality"""
    
    def test_default_bell_state(self):
        """Test default Bell state circuit simulation"""
        result = agent_skills.simulate_circuit()
        
        assert result['status'] in ['success', 'simulated']
        assert 'counts' in result
        assert 'circuit_depth' in result
        assert 'num_qubits' in result
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        # Check for Bell state outcomes (00 or 11)
        counts = result['counts']
        assert isinstance(counts, dict)
        # Bell state should have 2 qubits
        assert result['num_qubits'] == 2
    
    def test_single_hadamard_gate(self):
        """Test circuit with single Hadamard gate"""
        result = agent_skills.simulate_circuit("h(0)")
        
        assert result['status'] in ['success', 'simulated', 'error']
        assert 'vortex' in result
        
        if result['status'] == 'success':
            assert 'counts' in result
            assert result['num_qubits'] >= 1
    
    def test_bell_state_explicit(self):
        """Test explicit Bell state circuit"""
        result = agent_skills.simulate_circuit("h(0); cx(0,1)")
        
        assert result['status'] in ['success', 'simulated', 'error']
        assert 'vortex' in result
        
        if result['status'] == 'success':
            assert 'counts' in result
            assert result['num_qubits'] >= 2
    
    def test_multiple_gates(self):
        """Test circuit with multiple gates"""
        result = agent_skills.simulate_circuit("h(0); x(1); cx(0,1)")
        
        assert result['status'] in ['success', 'simulated', 'error']
        assert 'vortex' in result
        
        if result['status'] in ['success', 'simulated']:
            assert 'counts' in result
    
    def test_invalid_gate_syntax(self):
        """Test circuit with invalid gate syntax"""
        result = agent_skills.simulate_circuit("invalid_gate")
        
        # When Qiskit is available, should return error
        # When Qiskit is not available, returns simulated (fallback)
        assert result['status'] in ['error', 'simulated']
        assert 'vortex' in result
    
    def test_empty_circuit(self):
        """Test empty circuit string"""
        result = agent_skills.simulate_circuit("")
        
        # Empty string should fall through to default Bell state
        assert result['status'] in ['success', 'simulated']
        assert 'vortex' in result
    
    def test_circuit_with_spaces(self):
        """Test circuit with extra spaces"""
        result = agent_skills.simulate_circuit("  h(0)  ;  cx(0,1)  ")
        
        assert result['status'] in ['success', 'simulated', 'error']
        assert 'vortex' in result
    
    def test_circuit_depth_calculation(self):
        """Test circuit depth is calculated"""
        result = agent_skills.simulate_circuit("h(0); cx(0,1)")
        
        if result['status'] in ['success', 'simulated']:
            assert 'circuit_depth' in result
            assert isinstance(result['circuit_depth'], int)
            assert result['circuit_depth'] >= 0
    
    def test_vortex_marker_present(self):
        """Test VORTEX marker is always present"""
        result = agent_skills.simulate_circuit()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        result = agent_skills.simulate_circuit("h(0)")
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        result = agent_skills.simulate_circuit("invalid")
        assert result['vortex'] == agent_skills.VORTEX_MARKER


class TestCheckCoherence:
    """Test coherence checking functionality"""
    
    def test_default_threshold(self):
        """Test coherence check with default threshold"""
        result = agent_skills.check_coherence()
        
        assert 'coherence' in result
        assert 'threshold' in result
        assert 'passed' in result
        assert 'message' in result
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        # Default threshold is 0.6
        assert result['threshold'] == 0.6
        assert isinstance(result['passed'], bool)
    
    def test_custom_threshold_pass(self):
        """Test coherence check that passes"""
        result = agent_skills.check_coherence(threshold=0.5)
        
        assert result['threshold'] == 0.5
        # With simulated coherence of 0.6, should pass 0.5 threshold
        assert result['coherence'] == agent_skills.DEFAULT_SIMULATED_COHERENCE
        assert result['passed'] is True
    
    def test_custom_threshold_fail(self):
        """Test coherence check that fails"""
        result = agent_skills.check_coherence(threshold=0.7)
        
        assert result['threshold'] == 0.7
        # With simulated coherence of 0.6, should fail 0.7 threshold
        assert result['coherence'] == agent_skills.DEFAULT_SIMULATED_COHERENCE
        assert result['passed'] is False
    
    def test_threshold_edge_case_equal(self):
        """Test coherence check at exact threshold"""
        result = agent_skills.check_coherence(threshold=0.6)
        
        assert result['threshold'] == 0.6
        assert result['coherence'] == 0.6
        # Equal should pass (>=)
        assert result['passed'] is True
    
    def test_threshold_zero(self):
        """Test coherence check with zero threshold"""
        result = agent_skills.check_coherence(threshold=0.0)
        
        assert result['threshold'] == 0.0
        assert result['passed'] is True
    
    def test_threshold_one(self):
        """Test coherence check with threshold of 1.0"""
        result = agent_skills.check_coherence(threshold=1.0)
        
        assert result['threshold'] == 1.0
        # Simulated coherence is 0.6, should fail
        assert result['passed'] is False
    
    def test_message_format(self):
        """Test message format is correct"""
        result = agent_skills.check_coherence(threshold=0.6)
        
        assert 'message' in result
        assert isinstance(result['message'], str)
        assert '60%' in result['message'] or '0.60' in result['message']
    
    def test_vortex_marker_present(self):
        """Test VORTEX marker is always present"""
        result = agent_skills.check_coherence()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        result = agent_skills.check_coherence(threshold=0.5)
        assert result['vortex'] == agent_skills.VORTEX_MARKER


class TestCascadeIntegration:
    """Test cascade provenance integration"""
    
    def test_no_pr_body(self):
        """Test cascade with no PR body"""
        result = agent_skills.cascade_integration()
        
        assert result['status'] == 'cascaded'
        assert result['keywords_found'] == []
        assert result['provenance_tracked'] is True
        assert result['vortex'] == agent_skills.VORTEX_MARKER
    
    def test_empty_pr_body(self):
        """Test cascade with empty PR body"""
        result = agent_skills.cascade_integration("")
        
        assert result['status'] == 'cascaded'
        assert result['keywords_found'] == []
        assert result['provenance_tracked'] is True
    
    def test_single_keyword(self):
        """Test cascade with single keyword"""
        result = agent_skills.cascade_integration("This PR improves quantum coherence")
        
        assert result['status'] == 'cascaded'
        assert 'quantum' in result['keywords_found']
        assert 'coherence' in result['keywords_found']
        assert len(result['keywords_found']) >= 2
    
    def test_multiple_keywords(self):
        """Test cascade with multiple keywords"""
        pr_body = "This PR adds quantum provenance tracking with ethical vortex spiral"
        result = agent_skills.cascade_integration(pr_body)
        
        assert result['status'] == 'cascaded'
        keywords = result['keywords_found']
        assert 'quantum' in keywords
        assert 'provenance' in keywords
        assert 'ethical' in keywords
        assert 'vortex' in keywords
        assert 'spiral' in keywords
    
    def test_case_insensitive(self):
        """Test cascade is case-insensitive"""
        result = agent_skills.cascade_integration("QUANTUM Provenance ETHICAL")
        
        keywords = result['keywords_found']
        assert 'quantum' in keywords
        assert 'provenance' in keywords
        assert 'ethical' in keywords
    
    def test_no_keywords(self):
        """Test cascade with no matching keywords"""
        result = agent_skills.cascade_integration("This is a simple bug fix")
        
        assert result['status'] == 'cascaded'
        assert result['keywords_found'] == []
        assert result['provenance_tracked'] is True
    
    def test_message_format(self):
        """Test message format includes count"""
        result = agent_skills.cascade_integration("quantum atom spiral")
        
        assert 'message' in result
        assert isinstance(result['message'], str)
        count = len(result['keywords_found'])
        assert str(count) in result['message']
    
    def test_vortex_marker_present(self):
        """Test VORTEX marker is always present"""
        result = agent_skills.cascade_integration()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        result = agent_skills.cascade_integration("test body")
        assert result['vortex'] == agent_skills.VORTEX_MARKER
    
    def test_atom_decision_present(self):
        """Test that ATOM decision is present in result"""
        result = agent_skills.cascade_integration("quantum provenance test")
        
        assert 'atom_decision' in result
        assert isinstance(result['atom_decision'], dict)
    
    def test_atom_tag_present(self):
        """Test that ATOM tag is present in result"""
        result = agent_skills.cascade_integration("ethical review test")
        
        assert 'atom_tag' in result
        assert isinstance(result['atom_tag'], str)
        assert result['atom_tag'].startswith('ATOM-')
    
    def test_atom_decision_structure(self):
        """Test that ATOM decision has correct structure"""
        result = agent_skills.cascade_integration("quantum coherence test")
        
        decision = result['atom_decision']
        
        # Verify required fields
        assert 'atom_tag' in decision
        assert 'type' in decision
        assert 'description' in decision
        assert 'timestamp' in decision
        assert 'files' in decision
        assert 'tags' in decision
        assert 'freshness' in decision
        assert 'verified' in decision
        
        # Verify field types and values
        assert decision['type'] == 'VERIFY'
        assert isinstance(decision['description'], str)
        assert isinstance(decision['timestamp'], str)
        assert isinstance(decision['files'], list)
        assert isinstance(decision['tags'], list)
        assert decision['freshness'] == 'fresh'
        assert decision['verified'] is False
    
    def test_atom_decision_tags_include_keywords(self):
        """Test that ATOM decision tags include detected keywords"""
        result = agent_skills.cascade_integration("quantum provenance ethical test")
        
        decision = result['atom_decision']
        tags = decision['tags']
        
        # Base tags should always be present
        assert 'cascade' in tags
        assert 'provenance' in tags
        assert 'ethical-review' in tags
        
        # Keywords found should be in tags
        assert 'quantum' in tags
        assert 'ethical' in tags
    
    def test_atom_trail_file_created(self, tmp_path, monkeypatch):
        """Test that ATOM trail decision file is created"""
        # Use temporary directory for ATOM trail
        atom_trail_dir = tmp_path / ".atom-trail"
        atom_counters_dir = atom_trail_dir / "counters"
        atom_decisions_dir = atom_trail_dir / "decisions"
        
        # Monkey patch the ATOM trail directories
        monkeypatch.setattr(agent_skills, 'ATOM_TRAIL_DIR', atom_trail_dir)
        monkeypatch.setattr(agent_skills, 'ATOM_COUNTERS_DIR', atom_counters_dir)
        monkeypatch.setattr(agent_skills, 'ATOM_DECISIONS_DIR', atom_decisions_dir)
        
        result = agent_skills.cascade_integration("test body")
        
        # Verify directories were created
        assert atom_trail_dir.exists()
        assert atom_counters_dir.exists()
        assert atom_decisions_dir.exists()
        
        # Verify decision file was created
        atom_tag = result['atom_tag']
        decision_file = atom_decisions_dir / f"{atom_tag}.json"
        assert decision_file.exists()
        
        # Verify file content
        import json
        with open(decision_file, 'r') as f:
            file_decision = json.load(f)
        
        assert file_decision['atom_tag'] == atom_tag
        assert file_decision['type'] == 'VERIFY'
    
    def test_atom_tag_format(self):
        """Test that ATOM tag follows correct format"""
        result = agent_skills.cascade_integration("test")
        
        atom_tag = result['atom_tag']
        
        # Format: ATOM-TYPE-YYYYMMDD-NNN-description
        parts = atom_tag.split('-')
        assert len(parts) >= 5  # At least 5 parts
        assert parts[0] == 'ATOM'
        assert parts[1] == 'VERIFY'
        assert len(parts[2]) == 8  # YYYYMMDD
        assert parts[3].isdigit()  # Counter
        assert len(parts[3]) == 3  # Three-digit counter
    
    def test_atom_decision_consistency(self):
        """Test that atom_decision and atom_tag are consistent"""
        result = agent_skills.cascade_integration("consistency test")
        
        # The atom_tag in result should match the one in atom_decision
        assert result['atom_tag'] == result['atom_decision']['atom_tag']


class TestReviewPR:
    """Test PR review functionality"""
    
    def test_review_pr_returns_coherence_check(self):
        """Test review_pr performs coherence check"""
        result = agent_skills.review_pr()
        
        assert 'status' in result
        assert 'coherence_check' in result
        assert 'ethical_review' in result
        assert 'message' in result
        assert 'coherence_details' in result
        assert result['vortex'] == agent_skills.VORTEX_MARKER
    
    def test_review_pr_coherence_pass(self):
        """Test review when coherence passes"""
        result = agent_skills.review_pr()
        
        # With default simulated coherence of 0.6 and threshold 0.6
        assert result['coherence_check'] in ['passed', 'failed']
        
        if result['coherence_check'] == 'passed':
            assert result['status'] == 'reviewed'
            assert result['ethical_review'] == 'approved'
            assert 'Ready for merge' in result['message']
    
    def test_review_pr_message_format(self):
        """Test review message format"""
        result = agent_skills.review_pr()
        
        assert 'message' in result
        message = result['message']
        assert isinstance(message, str)
        assert '🌀' in message  # Vortex emoji
        assert 'Coherence' in message
    
    def test_review_pr_coherence_details(self):
        """Test review includes coherence details"""
        result = agent_skills.review_pr()
        
        assert 'coherence_details' in result
        details = result['coherence_details']
        assert isinstance(details, dict)
        assert 'coherence' in details
        assert 'threshold' in details
        assert 'passed' in details
    
    def test_review_pr_status_consistency(self):
        """Test status is consistent with coherence check"""
        result = agent_skills.review_pr()
        
        coherence_passed = result['coherence_details']['passed']
        
        if coherence_passed:
            assert result['status'] == 'reviewed'
            assert result['coherence_check'] == 'passed'
            assert result['ethical_review'] == 'approved'
        else:
            assert result['status'] == 'review_required'
            assert result['coherence_check'] == 'failed'
            assert result['ethical_review'] == 'requires_additional_review'
    
    def test_vortex_marker_present(self):
        """Test VORTEX marker is always present"""
        result = agent_skills.review_pr()
        assert result['vortex'] == agent_skills.VORTEX_MARKER


class TestCLIArguments:
    """Test command-line argument parsing"""
    
    def test_simulate_command_default(self):
        """Test simulate command with default circuit"""
        # This would be tested through main() integration
        # Here we test the function directly
        result = agent_skills.simulate_circuit()
        assert result['status'] in ['success', 'simulated']
    
    def test_simulate_command_with_circuit(self):
        """Test simulate command with custom circuit"""
        result = agent_skills.simulate_circuit("h(0); cx(0,1)")
        assert result['status'] in ['success', 'simulated', 'error']
    
    def test_check_coherence_command_default(self):
        """Test check_coherence command with default threshold"""
        result = agent_skills.check_coherence()
        assert result['threshold'] == 0.6
    
    def test_check_coherence_command_custom(self):
        """Test check_coherence command with custom threshold"""
        result = agent_skills.check_coherence(0.8)
        assert result['threshold'] == 0.8
    
    def test_cascade_command_no_body(self):
        """Test cascade command without PR body"""
        result = agent_skills.cascade_integration()
        assert result['status'] == 'cascaded'
    
    def test_cascade_command_with_body(self):
        """Test cascade command with PR body"""
        result = agent_skills.cascade_integration("test body")
        assert result['status'] == 'cascaded'
    
    def test_review_pr_command(self):
        """Test review_pr command"""
        result = agent_skills.review_pr()
        assert 'status' in result
        assert 'coherence_check' in result


class TestVortexMarker:
    """Test VORTEX marker integration"""
    
    def test_vortex_marker_constant(self):
        """Test VORTEX marker constant"""
        assert agent_skills.VORTEX_MARKER == "VORTEX::QDI::v1"
    
    def test_all_functions_include_vortex(self):
        """Test all functions include VORTEX marker"""
        # simulate_circuit
        result = agent_skills.simulate_circuit()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        # check_coherence
        result = agent_skills.check_coherence()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        # cascade_integration
        result = agent_skills.cascade_integration()
        assert result['vortex'] == agent_skills.VORTEX_MARKER
        
        # review_pr
        result = agent_skills.review_pr()
        assert result['vortex'] == agent_skills.VORTEX_MARKER


class TestDefaultCoherence:
    """Test default simulated coherence constant"""
    
    def test_default_coherence_value(self):
        """Test default coherence is 0.6"""
        assert agent_skills.DEFAULT_SIMULATED_COHERENCE == 0.6
    
    def test_default_coherence_used(self):
        """Test default coherence is used in check_coherence"""
        result = agent_skills.check_coherence()
        assert result['coherence'] == agent_skills.DEFAULT_SIMULATED_COHERENCE


class TestErrorHandling:
    """Test error handling in various scenarios"""
    
    def test_invalid_circuit_returns_error(self):
        """Test invalid circuit syntax returns error"""
        result = agent_skills.simulate_circuit("bad_gate()")
        # When Qiskit is available, should return error
        # When Qiskit is not available, returns simulated (fallback)
        assert result['status'] in ['error', 'simulated']
    
    def test_malformed_gate_returns_error(self):
        """Test malformed gate returns error"""
        result = agent_skills.simulate_circuit("h()")
        # When Qiskit is available, should return error
        # When Qiskit is not available, returns simulated (fallback)
        assert result['status'] in ['error', 'simulated']
    
    def test_functions_never_raise_exceptions(self):
        """Test functions handle exceptions gracefully"""
        # All these should return dict results, not raise exceptions
        result = agent_skills.simulate_circuit("invalid")
        assert isinstance(result, dict)
        
        result = agent_skills.check_coherence(-1)
        assert isinstance(result, dict)
        
        result = agent_skills.cascade_integration(None)
        assert isinstance(result, dict)
        
        result = agent_skills.review_pr()
        assert isinstance(result, dict)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
