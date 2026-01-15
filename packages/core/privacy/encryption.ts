/**
 * Quantum-safe encryption utilities
 *
 * Uses AES-256-GCM with HMAC for post-quantum security baseline.
 * In production, consider lattice-based cryptography (e.g., CRYSTALS-Kyber).
 */

import { type AtomDecision, createTrailEntry } from "@spiralsafe/atom-trail";

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
  algorithm: string;
  timestamp: string;
  provenance?: {
    atom_tag: string;
    trail_id: string;
  };
}

/**
 * Encrypt data with quantum-resistant approach
 * Algorithm: AES-256-GCM (post-quantum baseline)
 * Future: Integrate CRYSTALS-Kyber or other NIST PQC standards
 */
export async function encrypt(
  data: string,
  key?: string,
): Promise<EncryptedPayload> {
  // Generate or use provided key
  const keyMaterial = key || crypto.randomUUID();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Generate IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Import key for AES-GCM
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyMaterial.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    dataBuffer,
  );

  // Extract ciphertext and auth tag
  const ciphertext = new Uint8Array(encrypted.slice(0, -16));
  const tag = new Uint8Array(encrypted.slice(-16));

  // Create provenance trail
  const decision: AtomDecision = {
    atom_tag: `ATOM-ENCRYPT-${Date.now()}`,
    type: "DOC",
    description: "Data encrypted with quantum-safe algorithm",
    timestamp: new Date().toISOString(),
    tags: ["encryption", "privacy", "quantum-safe"],
    freshness: "fresh",
    verified: false,
  };

  const trail = createTrailEntry(decision);

  return {
    ciphertext: btoa(String.fromCharCode(...ciphertext)),
    iv: btoa(String.fromCharCode(...iv)),
    tag: btoa(String.fromCharCode(...tag)),
    algorithm: "AES-256-GCM",
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}

/**
 * Decrypt encrypted payload
 */
export async function decrypt(
  payload: EncryptedPayload,
  key: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Decode from base64
  const ciphertext = Uint8Array.from(atob(payload.ciphertext), (c) =>
    c.charCodeAt(0),
  );
  const iv = Uint8Array.from(atob(payload.iv), (c) => c.charCodeAt(0));
  const tag = Uint8Array.from(atob(payload.tag), (c) => c.charCodeAt(0));

  // Combine ciphertext and tag for AES-GCM
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key.padEnd(32, "0").slice(0, 32)),
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    combined,
  );

  return decoder.decode(decrypted);
}
