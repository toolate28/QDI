# Privacy Module

Privacy-preserving modules with equitable scaling algorithms for the QDI system. These modules enforce privacy, audit provenance through ATOM trail integration, and demonstrate algorithmic fairness across global time zones.

## Modules

### 🔒 encryption.ts

Quantum-safe encryption utilities using AES-256-GCM with HMAC for post-quantum security baseline.

**API:**

```typescript
import { encrypt, decrypt } from '@spiralsafe/core/privacy';

// Encrypt data
const payload = await encrypt("sensitive data", "my-secret-key");
console.log(payload.algorithm); // "AES-256-GCM"
console.log(payload.provenance); // ATOM trail metadata

// Decrypt data
const decrypted = await decrypt(payload, "my-secret-key");
```

**Algorithm Choice:**
- Current: AES-256-GCM (NIST-approved, quantum-resistant baseline)
- Future: CRYSTALS-Kyber or other NIST PQC standards for full quantum resistance

**Provenance:**
Each encryption operation creates an ATOM trail entry for full auditability.

---

### 🎭 anonymization.ts

Strip or hash PII (Personally Identifiable Information) from quantum transactions while maintaining provenance trail.

**API:**

```typescript
import { anonymize, hashIdentifier } from '@spiralsafe/core/privacy';

// Anonymize record
const record = {
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  city: "New York"
};

const result = await anonymize(record);
console.log(result.data.name); // SHA-256 hash
console.log(result.data.email); // SHA-256 hash
console.log(result.data.age); // 30 (not PII)
console.log(result.anonymized_fields); // ["name", "email"]

// Hash identifier directly
const hash = await hashIdentifier("user-12345");
```

**Configurable PII Fields:**
Default list includes: email, phone, ssn, address, name, firstName, lastName, creditCard, passport, driverLicense, ip, ipAddress.

You can provide custom PII fields:
```typescript
const result = await anonymize(record, ['customField', 'secretData']);
```

---

### ⚖️ access-control.ts

Equitable resource scheduling with no exclusion by geography, agent type, or time zone.

**API:**

```typescript
import { checkAccess, scheduleResource } from '@spiralsafe/core/privacy';

// Check access
const agent = { id: "agent-1", type: "worker", timezone: "America/New_York" };
const resource = { id: "res-1", name: "Quantum Processor", capacity: 5, available: true };

const access = checkAccess(agent, resource);
console.log(access.granted); // true
console.log(access.provenance); // ATOM trail

// Schedule resources fairly
const agents = [
  { id: "agent-1", type: "worker", coherence_score: 85, timezone: "America/New_York" },
  { id: "agent-2", type: "worker", coherence_score: 90, timezone: "Asia/Tokyo" },
  { id: "agent-3", type: "worker", coherence_score: 78, timezone: "Europe/London" }
];

const schedule = scheduleResource(agents, resource);
console.log(schedule.schedule); // Sorted by coherence-weighted priority
console.log(schedule.fairness_score); // 0-100, higher is better
```

**Fairness Principles:**
- **No geographic exclusion**: All locations treated equally
- **No agent type discrimination**: Worker, manager, or any type gets fair access
- **No timezone penalty**: 24/7 global equity
- **Coherence-weighted priority**: Higher coherence scores get priority, but minimum 80% baseline enforced
- **Full auditability**: All access decisions logged via ATOM trail

---

### 📊 scaling-algo.ts

Equitable resource allocation algorithm with time-zone awareness and coherence score integration.

**API:**

```typescript
import { allocateResources } from '@spiralsafe/core/privacy';

const demands = [
  { 
    agent_id: "agent-1", 
    resource_type: "compute", 
    amount: 10, 
    coherence_score: 85,
    timezone: "America/New_York",
    timestamp: new Date().toISOString()
  },
  { 
    agent_id: "agent-2", 
    resource_type: "compute", 
    amount: 15, 
    coherence_score: 92,
    timezone: "Asia/Tokyo",
    timestamp: new Date().toISOString()
  },
  { 
    agent_id: "agent-3", 
    resource_type: "compute", 
    amount: 8, 
    coherence_score: 88,
    timezone: "Europe/London",
    timestamp: new Date().toISOString()
  }
];

const result = allocateResources(demands, 25);

console.log(result.allocations);
// [
//   { agent_id: "agent-1", allocated: 8, requested: 10, fill_rate: 0.8 },
//   { agent_id: "agent-2", allocated: 11, requested: 15, fill_rate: 0.73 },
//   { agent_id: "agent-3", allocated: 6, requested: 8, fill_rate: 0.75 }
// ]

console.log(result.fairness_metrics);
// {
//   gini_coefficient: 0.05,  // Lower is better (0 = perfect equality)
//   min_fill_rate: 0.73,
//   max_fill_rate: 0.8,
//   avg_fill_rate: 0.76,
//   timezone_parity: 98.5    // 100 = perfect parity across timezones
// }

console.log(result.efficiency); // 100% (all capacity used)
```

**Fairness Criteria:**

1. **Proportional Allocation**: Resources distributed based on coherence-weighted demand
2. **80% Coherence Baseline**: Minimum threshold enforced (agents below 64 score are filtered)
3. **No Timezone Penalties**: Off-peak regions get same treatment as peak regions
4. **Max-Min Fairness**: Algorithm prioritizes filling minimum demands first
5. **Global Equity**: Equal weight regardless of geographic location

**Fairness Metrics:**

- **Gini Coefficient**: Measures inequality (0 = perfect equality, 1 = perfect inequality)
- **Fill Rates**: Min, max, and average fill rates across all agents
- **Timezone Parity**: Variance measure across timezones (100 = perfect parity)
- **Efficiency**: Percentage of capacity utilized

---

## Ethics Baseline

All modules enforce a **80% coherence baseline** as the ethical minimum for participation. This ensures:

- Quality of service maintained across all participants
- No gaming of the system through low-quality requests
- Fair comparison basis for resource allocation
- Alignment with SpiralSafe coherence principles

Agents below 64 coherence score (80% of baseline) are filtered from resource allocation.

---

## ATOM Trail Integration

Every privacy operation integrates with `@spiralsafe/atom-trail` for full provenance tracking:

```typescript
import { createTrailEntry } from '@spiralsafe/atom-trail';

// Example: Encryption creates ATOM trail
const decision = {
  atom_tag: "ATOM-ENCRYPT-1234567890",
  type: "DOC",
  description: "Data encrypted with quantum-safe algorithm",
  timestamp: new Date().toISOString(),
  tags: ["encryption", "privacy", "quantum-safe"],
  freshness: "fresh",
  verified: false
};

const trail = createTrailEntry(decision);
// trail.id is included in payload.provenance.trail_id
```

This enables:
- Full audit trail of all privacy operations
- Compliance with data protection regulations
- Forensic analysis of data flows
- Accountability and transparency

---

## Wave Toolkit Integration

Access control and scheduling integrate with `@spiralsafe/wave-toolkit` for coherence scoring:

```typescript
import { analyzeWave } from '@spiralsafe/wave-toolkit';

// Example: Calculate coherence score for agent
const text = "Agent request description...";
const analysis = analyzeWave(text);
const coherence_score = analysis.coherence_score; // 0-100

// Use in scheduling
const agent = { 
  id: "agent-1", 
  type: "worker", 
  coherence_score 
};
```

---

## Installation & Usage

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build
```

**Import in your code:**

```typescript
import { 
  encrypt, 
  decrypt, 
  anonymize, 
  checkAccess, 
  scheduleResource, 
  allocateResources 
} from '@spiralsafe/core/privacy';
```

---

## Testing

Tests are located in `__tests__/` directory. Run with:

```bash
bun test
```

Test coverage includes:
- Encryption/decryption round-trip
- Anonymization preserves structure while removing PII
- Access control fairness across global agents
- Scaling algorithm equitable distribution under various scenarios

---

## Contributing

**We invite collaboration to improve and extend these modules!**

Areas for contribution:
- **Quantum Cryptography**: Implement full CRYSTALS-Kyber or other NIST PQC standards
- **Advanced Anonymization**: Differential privacy, k-anonymity, or l-diversity techniques
- **Fairness Algorithms**: Explore alternative fair allocation algorithms (e.g., proportional fairness, Nash bargaining)
- **Performance**: Optimize for large-scale deployments
- **Testing**: Add more edge cases and stress tests
- **Documentation**: Improve examples and tutorials

Please open issues or PRs on GitHub! All contributions should maintain:
- 80% coherence baseline
- Global equity principles
- ATOM trail integration
- Comprehensive test coverage

---

## License

MIT License - see repository root for details.

---

## References

- [NIST Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [ATOM Provenance Tracking](../atom-trail/)
- [Wave Coherence Analysis](../wave-toolkit/)
- [Max-Min Fairness](https://en.wikipedia.org/wiki/Max-min_fairness)
- [Gini Coefficient](https://en.wikipedia.org/wiki/Gini_coefficient)
