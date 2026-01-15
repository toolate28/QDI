/**
 * Tests for privacy modules
 */

import { describe, expect, it } from "bun:test";
import { checkAccess, scheduleResource } from "../access-control";
import { anonymize, hashIdentifier } from "../anonymization";
import { decrypt, encrypt } from "../encryption";
import { allocateResources } from "../scaling-algo";

// ===== Encryption Tests =====
describe("Encryption Module", () => {
  it("should encrypt and decrypt data successfully", async () => {
    const data = "sensitive quantum data";
    const key = "test-secret-key";

    const encrypted = await encrypt(data, key);
    expect(encrypted.algorithm).toBe("AES-256-GCM");
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();
    expect(encrypted.provenance).toBeDefined();
    expect(encrypted.provenance?.atom_tag).toContain("ATOM-ENCRYPT");

    const decrypted = await decrypt(encrypted, key);
    expect(decrypted).toBe(data);
  });

  it("should generate different ciphertexts for same data", async () => {
    const data = "test data";
    const key = "same-key";

    const encrypted1 = await encrypt(data, key);
    const encrypted2 = await encrypt(data, key);

    // Different IVs should produce different ciphertexts
    expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
  });

  it("should fail to decrypt with wrong key", async () => {
    const data = "secret data";
    const correctKey = "correct-key";
    const wrongKey = "wrong-key";

    const encrypted = await encrypt(data, correctKey);

    await expect(decrypt(encrypted, wrongKey)).rejects.toThrow();
  });

  it("should include provenance metadata", async () => {
    const data = "test";
    const encrypted = await encrypt(data);

    expect(encrypted.provenance).toBeDefined();
    expect(encrypted.provenance?.atom_tag).toBeDefined();
    expect(encrypted.provenance?.trail_id).toBeDefined();
    expect(encrypted.timestamp).toBeDefined();
  });
});

// ===== Anonymization Tests =====
describe("Anonymization Module", () => {
  it("should hash PII fields", async () => {
    const record = {
      name: "Alice Smith",
      email: "alice@example.com",
      age: 30,
      city: "New York",
    };

    const result = await anonymize(record);

    // PII should be hashed
    expect(result.data.name).not.toBe("Alice Smith");
    expect(result.data.email).not.toBe("alice@example.com");
    expect(typeof result.data.name).toBe("string");
    expect(typeof result.data.email).toBe("string");

    // Non-PII should remain
    expect(result.data.age).toBe(30);
    expect(result.data.city).toBe("New York");

    // Metadata
    expect(result.anonymized_fields).toContain("name");
    expect(result.anonymized_fields).toContain("email");
    expect(result.hash_algorithm).toBe("SHA-256");
  });

  it("should preserve structure of anonymized data", async () => {
    const record = {
      user: {
        firstName: "Bob",
        lastName: "Jones",
        metadata: {
          age: 25,
        },
      },
    };

    const result = await anonymize(record);

    expect(result.data.user).toBeDefined();
    expect(typeof result.data.user).toBe("object");

    // Type assertion for nested structure
    interface NestedUser {
      metadata: { age: number };
    }
    const user = result.data.user as NestedUser;
    expect(user.metadata).toBeDefined();
    expect(user.metadata.age).toBe(25);
  });

  it("should handle custom PII fields", async () => {
    const record = {
      username: "alice123",
      secret: "my-secret",
      public: "public-data",
    };

    const result = await anonymize(record, ["secret"]);

    expect(result.data.username).toBe("alice123"); // Not in custom list
    expect(result.data.secret).not.toBe("my-secret"); // In custom list
    expect(result.data.public).toBe("public-data");
    expect(result.anonymized_fields).toContain("secret");
  });

  it("should generate consistent hashes for same identifier", async () => {
    const id = "user-12345";
    const hash1 = await hashIdentifier(id);
    const hash2 = await hashIdentifier(id);

    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 produces 64 hex chars
  });

  it("should include provenance", async () => {
    const record = { name: "Test" };
    const result = await anonymize(record);

    expect(result.provenance).toBeDefined();
    expect(result.provenance.atom_tag).toContain("ATOM-ANON");
    expect(result.provenance.trail_id).toBeDefined();
  });
});

// ===== Access Control Tests =====
describe("Access Control Module", () => {
  it("should grant access when resource is available", () => {
    const agent = { id: "agent-1", type: "worker" };
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 5,
      available: true,
    };

    const result = checkAccess(agent, resource);

    expect(result.granted).toBe(true);
    expect(result.reason).toContain("granted");
    expect(result.provenance).toBeDefined();
  });

  it("should deny access when resource is unavailable", () => {
    const agent = { id: "agent-1", type: "worker" };
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 5,
      available: false,
    };

    const result = checkAccess(agent, resource);

    expect(result.granted).toBe(false);
    expect(result.reason).toContain("denied");
  });

  it("should not discriminate by location or timezone", () => {
    const agent1 = {
      id: "agent-1",
      type: "worker",
      location: "US",
      timezone: "America/New_York",
    };
    const agent2 = {
      id: "agent-2",
      type: "worker",
      location: "Japan",
      timezone: "Asia/Tokyo",
    };
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 5,
      available: true,
    };

    const result1 = checkAccess(agent1, resource);
    const result2 = checkAccess(agent2, resource);

    // Both should get same result based on resource availability
    expect(result1.granted).toBe(result2.granted);
  });

  it("should schedule agents fairly by coherence score", () => {
    const agents = [
      { id: "agent-1", type: "worker", coherence_score: 85 },
      { id: "agent-2", type: "worker", coherence_score: 92 },
      { id: "agent-3", type: "worker", coherence_score: 78 },
    ];
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 2,
      available: true,
    };

    const result = scheduleResource(agents, resource);

    expect(result.schedule.length).toBe(2);
    // Higher coherence should come first
    expect(result.schedule[0]?.agent.id).toBe("agent-2"); // 92
    expect(result.schedule[1]?.agent.id).toBe("agent-1"); // 85
    expect(result.fairness_score).toBeGreaterThan(0);
  });

  it("should apply 80% baseline to agents without coherence score", () => {
    const agents = [
      { id: "agent-1", type: "worker" }, // No score, should get 80
      { id: "agent-2", type: "worker", coherence_score: 85 },
    ];
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 2,
      available: true,
    };

    const result = scheduleResource(agents, resource);

    expect(result.schedule.length).toBe(2);
    // Both should be scheduled
    expect(result.schedule.some((s) => s.agent.id === "agent-1")).toBe(true);
    expect(result.schedule.some((s) => s.agent.id === "agent-2")).toBe(true);
  });

  it("should calculate fairness score", () => {
    const agents = [
      { id: "agent-1", type: "worker", coherence_score: 85 },
      { id: "agent-2", type: "worker", coherence_score: 85 },
      { id: "agent-3", type: "worker", coherence_score: 85 },
    ];
    const resource = {
      id: "res-1",
      name: "Processor",
      capacity: 3,
      available: true,
    };

    const result = scheduleResource(agents, resource);

    // All same score should have high fairness (low variance)
    expect(result.fairness_score).toBeGreaterThan(90);
  });
});

// ===== Scaling Algorithm Tests =====
describe("Scaling Algorithm Module", () => {
  it("should allocate resources proportionally", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 20);

    expect(result.total_allocated).toBe(20);
    expect(result.allocations[0]?.allocated).toBe(10);
    expect(result.allocations[1]?.allocated).toBe(10);
    expect(result.efficiency).toBe(100);
  });

  it("should enforce 80% coherence baseline", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 90,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 10,
        coherence_score: 60,
        timestamp: new Date().toISOString(),
      }, // Below 64 threshold
    ];

    const result = allocateResources(demands, 20);

    // Only agent-1 should get allocation
    const agent1 = result.allocations.find((a) => a.agent_id === "agent-1");
    const agent2 = result.allocations.find((a) => a.agent_id === "agent-2");

    expect(agent1?.allocated).toBeGreaterThan(0);
    expect(agent2?.allocated).toBe(0);
  });

  it("should not penalize off-peak timezones", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timezone: "America/New_York",
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timezone: "Asia/Tokyo",
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 20);

    // Both should get equal allocation regardless of timezone
    expect(result.allocations[0]?.allocated).toBe(
      result.allocations[1]?.allocated,
    );
    expect(result.fairness_metrics.timezone_parity).toBeGreaterThan(95);
  });

  it("should calculate fairness metrics correctly", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 20,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 15);

    expect(result.fairness_metrics.gini_coefficient).toBeDefined();
    expect(result.fairness_metrics.min_fill_rate).toBeDefined();
    expect(result.fairness_metrics.max_fill_rate).toBeDefined();
    expect(result.fairness_metrics.avg_fill_rate).toBeDefined();
    expect(result.fairness_metrics.timezone_parity).toBeDefined();

    // Gini should be between 0 and 1
    expect(result.fairness_metrics.gini_coefficient).toBeGreaterThanOrEqual(0);
    expect(result.fairness_metrics.gini_coefficient).toBeLessThanOrEqual(1);
  });

  it("should implement max-min fairness", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 5,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 20,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 15);

    // Agent-1 should get full allocation first (max-min)
    const agent1 = result.allocations.find((a) => a.agent_id === "agent-1");
    const agent2 = result.allocations.find((a) => a.agent_id === "agent-2");

    expect(agent1?.fill_rate).toBeGreaterThanOrEqual(agent2?.fill_rate || 0);
  });

  it("should handle capacity constraints", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 100,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 100,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 50);

    expect(result.total_allocated).toBeLessThanOrEqual(50);
    expect(result.efficiency).toBeLessThanOrEqual(100);
  });

  it("should include provenance", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 10);

    expect(result.provenance).toBeDefined();
    expect(result.provenance.atom_tag).toContain("ATOM-ALLOC");
    expect(result.provenance.trail_id).toBeDefined();
  });

  it("should handle multiple timezones with parity", () => {
    const demands = [
      {
        agent_id: "agent-1",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timezone: "America/New_York",
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-2",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timezone: "Europe/London",
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: "agent-3",
        resource_type: "compute",
        amount: 10,
        coherence_score: 85,
        timezone: "Asia/Tokyo",
        timestamp: new Date().toISOString(),
      },
    ];

    const result = allocateResources(demands, 30);

    // All agents should get equal allocation
    expect(result.allocations[0]?.allocated).toBe(10);
    expect(result.allocations[1]?.allocated).toBe(10);
    expect(result.allocations[2]?.allocated).toBe(10);
    expect(result.fairness_metrics.timezone_parity).toBeGreaterThan(95);
  });
});
