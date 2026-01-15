/**
 * Anonymization utilities for PII stripping
 * Maintains provenance trail without exposing identity
 */

import { type AtomDecision, createTrailEntry } from "@spiralsafe/atom-trail";

export interface AnonymizedRecord {
  data: Record<string, unknown>;
  anonymized_fields: string[];
  hash_algorithm: string;
  timestamp: string;
  provenance: {
    atom_tag: string;
    trail_id: string;
  };
}

/**
 * Default PII fields to anonymize
 */
const DEFAULT_PII_FIELDS = [
  "email",
  "phone",
  "ssn",
  "address",
  "name",
  "firstName",
  "lastName",
  "creditCard",
  "passport",
  "driverLicense",
  "ip",
  "ipAddress",
];

/**
 * Hash identifier using SHA-256
 */
export async function hashIdentifier(id: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(id);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Anonymize record by stripping or hashing PII fields
 */
export async function anonymize(
  record: Record<string, unknown>,
  piiFields: string[] = DEFAULT_PII_FIELDS,
): Promise<AnonymizedRecord> {
  const anonymizedData: Record<string, unknown> = {};
  const anonymizedFields: string[] = [];

  // Process each field
  for (const [key, value] of Object.entries(record)) {
    const isPII = piiFields.some((field) =>
      key.toLowerCase().includes(field.toLowerCase()),
    );

    if (isPII && typeof value === "string") {
      // Hash PII fields
      anonymizedData[key] = await hashIdentifier(value);
      anonymizedFields.push(key);
    } else if (isPII) {
      // Remove non-string PII
      anonymizedData[key] = "[REDACTED]";
      anonymizedFields.push(key);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      // Recursively anonymize nested objects
      const nested = await anonymize(
        value as Record<string, unknown>,
        piiFields,
      );
      anonymizedData[key] = nested.data;
      anonymizedFields.push(
        ...nested.anonymized_fields.map((f) => `${key}.${f}`),
      );
    } else {
      // Keep non-PII fields as-is
      anonymizedData[key] = value;
    }
  }

  // Create provenance trail
  const decision: AtomDecision = {
    atom_tag: `ATOM-ANON-${Date.now()}`,
    type: "ENHANCE",
    description: `Anonymized ${anonymizedFields.length} PII fields`,
    timestamp: new Date().toISOString(),
    tags: ["anonymization", "privacy", "pii"],
    freshness: "fresh",
    verified: false,
  };

  const trail = createTrailEntry(decision);

  return {
    data: anonymizedData,
    anonymized_fields: anonymizedFields,
    hash_algorithm: "SHA-256",
    timestamp: new Date().toISOString(),
    provenance: {
      atom_tag: decision.atom_tag,
      trail_id: trail.id,
    },
  };
}
