// SpiralSafe Vortex Animation Engine
// Frame-by-frame visualization of coherence flow

const canvas = document.getElementById('vortexCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let animationFrame = 0, isPlaying = true, speed = 1.0, coherence = 65, time = 0;

const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
const PHI = 1.618033988749895;
const PHASES = ['KENL', 'AWI', 'ATOM', 'SAIF', 'Spiral'];
let currentPhaseIndex = 0;

const repos = [
    { name: 'QDI', angle: 0, distance: 0, color: '#7057ff', coherence: 70 },
    { name: 'SPIRALSAFE', angle: 0, distance: 200, color: '#00d4aa', coherence: 65 },
    { name: 'MONO', angle: Math.PI / 3, distance: 200, color: '#00d4aa', coherence: 68 },
    { name: 'METRICS', angle: 2 * Math.PI / 3, distance: 200, color: '#fbca04', coherence: 62 },
    { name: 'QR', angle: Math.PI, distance: 200, color: '#00d4aa', coherence: 70 },
    { name: 'HOPE', angle: 4 * Math.PI / 3, distance: 200, color: '#fbca04', coherence: 64 },
];

class DataPacket {
    constructor(angle, distance) {
        this.angle = angle;
        this.distance = distance;
        this.speed = 0.02 + Math.random() * 0.03;
        this.size = 3 + Math.random() * 4;
        this.color = `hsl(${Math.random() * 60 + 240}, 80%, 70%)`;
        this.phase = Math.floor(Math.random() * PHASES.length);
    }
    update() {
        this.angle += this.speed * speed;
        this.distance *= 0.99;
        if (this.distance < 10) {
            this.distance = 250;
            this.angle = Math.random() * Math.PI * 2;
            this.phase = (this.phase + 1) % PHASES.length;
        }
    }
    draw() {
        const x = centerX + Math.cos(this.angle) * this.distance;
        const y = centerY + Math.sin(this.angle) * this.distance;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

let packets = [];
for (let i = 0; i < 50; i++) {
    packets.push(new DataPacket(Math.random() * Math.PI * 2, 50 + Math.random() * 200));
}

function drawSpiralArms() {
    for (let arm = 0; arm < 5; arm++) {
        const baseAngle = (arm * 2 * Math.PI / 5) + time * 0.1;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(112, 87, 255, ${0.1 + 0.1 * Math.sin(time * 2)})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 100; i++) {
            const t = i / 100;
            const angle = baseAngle + t * Math.PI * 2;
            const radius = 250 * Math.pow(t, 1 / PHI);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function drawCoherenceWaves() {
    for (let i = 0; i < 3; i++) {
        const waveTime = (time + i * 2) % 6;
        const radius = waveTime * 50;
        const opacity = Math.max(0, 1 - waveTime / 6);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 170, ${opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawRepos() {
    repos.forEach((repo, index) => {
        const rotatingAngle = repo.angle + time * 0.2;
        const x = centerX + Math.cos(rotatingAngle) * repo.distance;
        const y = centerY + Math.sin(rotatingAngle) * repo.distance;
        repo.coherence = coherence + (Math.sin(time + index) * 5);
        let nodeColor = repo.coherence >= 70 ? '#00d4aa' : repo.coherence >= 60 ? '#fbca04' : '#ff6b6b';
        
        if (repo.distance > 0) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `${nodeColor}40`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        const nodeSize = repo.distance === 0 ? 30 : 20;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = nodeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(repo.name, x, y + nodeSize + 15);
        ctx.fillText(`${Math.round(repo.coherence)}%`, x, y + nodeSize + 30);
    });
}

let snapInActive = false, snapInTime = 0;
function drawSnapIn() {
    if (!snapInActive) return;
    snapInTime += 0.05;
    const radius = snapInTime * 100;
    const opacity = Math.max(0, 1 - snapInTime / 3);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(212, 197, 249, ${opacity})`;
    ctx.lineWidth = 5;
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    if (snapInTime > 3) { snapInActive = false; snapInTime = 0; }
}

// Constants for curl and divergence calculations
const CURL_BASE = 0.1;
const CURL_AMPLITUDE = 0.1;
const CURL_OFFSET = 0.1;
const CURL_FREQUENCY = 0.5;

const DIVERGENCE_BASE = 0.15;
const DIVERGENCE_AMPLITUDE = 0.1;
const DIVERGENCE_OFFSET = 0.1;
const DIVERGENCE_FREQUENCY = 0.3;

function updateMetrics() {
    const curl = CURL_BASE + Math.sin(time * CURL_FREQUENCY) * CURL_AMPLITUDE + CURL_OFFSET;
    const divergence = DIVERGENCE_BASE + Math.cos(time * DIVERGENCE_FREQUENCY) * DIVERGENCE_AMPLITUDE + DIVERGENCE_OFFSET;
    const potential = coherence / 100;
    const fibIndex = Math.floor(potential * 10);
    const fibonacci = FIBONACCI[Math.min(fibIndex, FIBONACCI.length - 1)];
    const synced = repos.filter(r => r.coherence >= 60).length;
    
    document.getElementById('coherenceMetric').textContent = Math.round(coherence) + '%';
    document.getElementById('curlMetric').textContent = curl.toFixed(2);
    document.getElementById('divergenceMetric').textContent = divergence.toFixed(2);
    document.getElementById('potentialMetric').textContent = potential.toFixed(2);
    document.getElementById('fibonacciMetric').textContent = fibonacci;
    document.getElementById('syncMetric').textContent = `${synced}/6`;
    
    document.getElementById('coherenceBar').style.width = coherence + '%';
    document.getElementById('curlBar').style.width = (curl * 100) + '%';
    document.getElementById('divergenceBar').style.width = (divergence * 100) + '%';
    document.getElementById('potentialBar').style.width = (potential * 100) + '%';
    
    const coherenceEl = document.getElementById('coherenceMetric');
    coherenceEl.className = coherence >= 70 ? 'metric-value status-good' : coherence >= 60 ? 'metric-value status-warning' : 'metric-value status-danger';
}

function updatePhase() {
    if (animationFrame % 100 === 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % PHASES.length;
    }
    document.getElementById('currentPhase').textContent = PHASES[currentPhaseIndex];
    document.getElementById('nextPhase').textContent = PHASES[(currentPhaseIndex + 1) % PHASES.length];
}

function animate() {
    if (!isPlaying) return;
    ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCoherenceWaves();
    drawSpiralArms();
    drawRepos();
    packets.forEach(p => { p.update(); p.draw(); });
    drawSnapIn();
    time += 0.05 * speed;
    animationFrame++;
    updateMetrics();
    updatePhase();
    if (coherence > 70 && !snapInActive && animationFrame % 200 === 0) triggerSnapIn();
    requestAnimationFrame(animate);
}

function triggerSnapIn() {
    snapInActive = true;
    snapInTime = 0;
    document.body.style.animation = 'flash 0.5s';
    setTimeout(() => document.body.style.animation = '', 500);
    repos.forEach(r => r.coherence = Math.min(100, r.coherence + 10));
}

document.getElementById('playPause').addEventListener('click', function() {
    isPlaying = !isPlaying;
    this.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play';
    if (isPlaying) animate();
});

document.getElementById('reset').addEventListener('click', function() {
    time = 0; animationFrame = 0; currentPhaseIndex = 0;
    packets = [];
    for (let i = 0; i < 50; i++) {
        packets.push(new DataPacket(Math.random() * Math.PI * 2, 50 + Math.random() * 200));
    }
});

document.getElementById('snapIn').addEventListener('click', triggerSnapIn);

document.getElementById('speedSlider').addEventListener('input', function() {
    speed = parseFloat(this.value);
    document.getElementById('speedValue').textContent = speed.toFixed(1) + 'x';
});

document.getElementById('coherenceSlider').addEventListener('input', function() {
    coherence = parseInt(this.value);
    document.getElementById('coherenceValue').textContent = coherence + '%';
});

animate();
