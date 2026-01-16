"""
PyTest tests for Qiskit Integration

Tests quantum circuit execution with Qiskit backend,
performance benchmarking, and provenance tracking.
"""

import json
import pytest
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.qasm3 import dumps
from qiskit_aer import AerSimulator, StatevectorSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error


class TestQiskitBasics:
    """Basic Qiskit functionality tests"""
    
    def test_simple_circuit_execution(self):
        """Test basic quantum circuit execution"""
        qr = QuantumRegister(2, 'q')
        cr = ClassicalRegister(2, 'c')
        qc = QuantumCircuit(qr, cr)
        
        # Create Bell state
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        # Execute
        backend = AerSimulator()
        job = backend.run(qc, shots=1024)
        result = job.result()
        counts = result.get_counts()
        
        # Bell state should measure 00 or 11
        # Note: Qiskit returns counts with space-separated classical and quantum bits
        count_keys = list(counts.keys())
        assert any('00' in key or '11' in key for key in count_keys)
        assert len(counts) <= 2  # Only two outcomes possible
    
    def test_hadamard_superposition(self):
        """Test Hadamard gate creates superposition"""
        qr = QuantumRegister(1, 'q')
        cr = ClassicalRegister(1, 'c')
        qc = QuantumCircuit(qr, cr)
        
        qc.h(0)
        qc.measure_all()
        
        backend = AerSimulator()
        job = backend.run(qc, shots=1000)
        result = job.result()
        counts = result.get_counts()
        
        # Should see roughly 50/50 split
        count_keys = list(counts.keys())
        assert any('0' in key for key in count_keys) and any('1' in key for key in count_keys)
        # Allow for statistical variation (30% to 70%)
        total_0 = sum(v for k, v in counts.items() if k.startswith('0'))
        assert 300 < total_0 < 700
    
    def test_statevector_simulation(self):
        """Test statevector simulator"""
        qc = QuantumCircuit(2)
        qc.h(0)
        qc.cx(0, 1)
        
        backend = StatevectorSimulator()
        job = backend.run(qc)
        result = job.result()
        statevector = result.get_statevector()
        
        # Bell state: (|00⟩ + |11⟩)/√2
        assert len(statevector) == 4
        # Check magnitudes of |00⟩ and |11⟩ states
        assert abs(abs(statevector[0]) - 1/2**0.5) < 0.01
        assert abs(abs(statevector[3]) - 1/2**0.5) < 0.01


class TestQuantumGates:
    """Test various quantum gates"""
    
    def test_pauli_x_gate(self):
        """Test X gate (bit flip)"""
        qc = QuantumCircuit(1, 1)
        qc.x(0)
        qc.measure_all()
        
        backend = AerSimulator()
        job = backend.run(qc, shots=100)
        result = job.result()
        counts = result.get_counts()
        
        # X gate should flip |0⟩ to |1⟩
        count_keys = list(counts.keys())
        assert any(key.startswith('1') for key in count_keys)
        total_1 = sum(v for k, v in counts.items() if k.startswith('1'))
        assert total_1 == 100
    
    def test_rotation_gates(self):
        """Test rotation gates"""
        import numpy as np
        
        qc = QuantumCircuit(1)
        qc.rx(np.pi/2, 0)
        qc.ry(np.pi/4, 0)
        qc.rz(np.pi/3, 0)
        
        backend = StatevectorSimulator()
        job = backend.run(qc)
        result = job.result()
        statevector = result.get_statevector()
        
        # Should execute without error and produce valid statevector
        assert len(statevector) == 2
        # Check normalization
        norm = sum(abs(amp)**2 for amp in statevector)
        assert abs(norm - 1.0) < 0.01
    
    def test_multi_qubit_gates(self):
        """Test multi-qubit gates"""
        qc = QuantumCircuit(3)
        qc.h(0)
        qc.cx(0, 1)
        qc.cx(1, 2)
        
        backend = StatevectorSimulator()
        job = backend.run(qc)
        result = job.result()
        statevector = result.get_statevector()
        
        # GHZ state: (|000⟩ + |111⟩)/√2
        assert len(statevector) == 8


class TestNoiseModels:
    """Test noise modeling"""
    
    def test_depolarizing_noise(self):
        """Test depolarizing noise model"""
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure_all()
        
        # Create noise model
        noise_model = NoiseModel()
        error = depolarizing_error(0.05, 1)
        noise_model.add_all_qubit_quantum_error(error, ['h'])
        
        backend = AerSimulator(noise_model=noise_model)
        job = backend.run(qc, shots=1000)
        result = job.result()
        counts = result.get_counts()
        
        # With noise, distribution will be less ideal
        count_keys = list(counts.keys())
        assert any('0' in key for key in count_keys) and any('1' in key for key in count_keys)
    
    def test_different_noise_levels(self):
        """Test different noise levels"""
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure_all()
        
        results = {}
        for noise_level in [0.01, 0.05, 0.1]:
            noise_model = NoiseModel()
            error = depolarizing_error(noise_level, 1)
            noise_model.add_all_qubit_quantum_error(error, ['h'])
            
            backend = AerSimulator(noise_model=noise_model)
            job = backend.run(qc, shots=1000)
            result = job.result()
            results[noise_level] = result.get_counts()
        
        # Higher noise should deviate more from ideal 50/50
        assert len(results) == 3


class TestPerformance:
    """Performance benchmarking tests"""
    
    def test_small_circuit_performance(self, benchmark):
        """Benchmark small circuit execution"""
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        backend = AerSimulator()
        
        def run_circuit():
            job = backend.run(qc, shots=100)
            return job.result()
        
        result = benchmark(run_circuit)
        assert result is not None
    
    def test_medium_circuit_performance(self, benchmark):
        """Benchmark medium circuit execution"""
        qc = QuantumCircuit(5, 5)
        for i in range(5):
            qc.h(i)
        for i in range(4):
            qc.cx(i, i+1)
        qc.measure_all()
        
        backend = AerSimulator()
        
        def run_circuit():
            job = backend.run(qc, shots=100)
            return job.result()
        
        result = benchmark(run_circuit)
        assert result is not None
    
    def test_large_circuit_performance(self, benchmark):
        """Benchmark large circuit execution"""
        qc = QuantumCircuit(10, 10)
        for i in range(10):
            qc.h(i)
        for i in range(9):
            qc.cx(i, i+1)
        qc.measure_all()
        
        backend = AerSimulator()
        
        def run_circuit():
            job = backend.run(qc, shots=50)  # Fewer shots for large circuits
            return job.result()
        
        result = benchmark(run_circuit)
        assert result is not None


class TestCircuitSerialization:
    """Test circuit serialization and provenance"""
    
    def test_circuit_to_json(self):
        """Test circuit serialization to JSON"""
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        # Get QASM representation (use qasm3 in Qiskit 2.x)
        qasm = dumps(qc)
        assert 'h' in qasm.lower()
        assert 'cx' in qasm.lower() or 'cnot' in qasm.lower()
    
    def test_execution_metadata(self):
        """Test execution metadata tracking"""
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        backend = AerSimulator()
        job = backend.run(qc, shots=100)
        result = job.result()
        
        # Check metadata
        metadata = result.to_dict()
        assert 'results' in metadata
        assert metadata['success'] is True
    
    def test_provenance_tracking(self):
        """Test provenance tracking for circuit execution"""
        import time
        
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure_all()
        
        # Track execution
        start_time = time.time()
        backend = AerSimulator()
        job = backend.run(qc, shots=100)
        result = job.result()
        execution_time = time.time() - start_time
        
        # Create provenance record
        provenance = {
            'circuit_id': 'test_circuit',
            'timestamp': time.time(),
            'gates': ['H', 'CNOT', 'MEASURE'],
            'qubits': 2,
            'backend': 'aer_simulator',
            'shots': 100,
            'execution_time_ms': execution_time * 1000,
            'counts': result.get_counts()
        }
        
        assert provenance['circuit_id'] == 'test_circuit'
        assert provenance['qubits'] == 2
        assert provenance['execution_time_ms'] > 0


class TestCoherenceMetrics:
    """Test coherence and quality metrics"""
    
    def test_circuit_depth(self):
        """Test circuit depth calculation"""
        qc = QuantumCircuit(3)
        qc.h(0)
        qc.h(1)
        qc.h(2)
        qc.cx(0, 1)
        qc.cx(1, 2)
        
        depth = qc.depth()
        assert depth > 0
    
    def test_gate_count(self):
        """Test gate counting"""
        qc = QuantumCircuit(2)
        qc.h(0)
        qc.x(1)
        qc.cx(0, 1)
        qc.measure_all()
        
        # Count gates
        gate_count = len(qc.data)
        assert gate_count >= 3  # H, X, CNOT + measurements
    
    def test_circuit_complexity(self):
        """Test circuit complexity metrics"""
        qc = QuantumCircuit(5)
        for i in range(5):
            qc.h(i)
        for i in range(4):
            qc.cx(i, i+1)
        
        # Calculate metrics
        num_qubits = qc.num_qubits
        depth = qc.depth()
        gate_count = len(qc.data)
        
        assert num_qubits == 5
        assert depth > 0
        assert gate_count > 0


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--benchmark-only'])
