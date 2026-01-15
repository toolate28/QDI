/**
 * @spiralsafe/core/privacy
 *
 * Privacy-preserving modules with equitable scaling algorithms
 * Enforces privacy, audits provenance, demonstrates algorithmic fairness
 */

// Encryption
export {
  encrypt,
  decrypt,
  type EncryptedPayload,
} from "./encryption";

// Anonymization
export {
  anonymize,
  hashIdentifier,
  type AnonymizedRecord,
} from "./anonymization";

// Access Control
export {
  checkAccess,
  scheduleResource,
  type AgentInfo,
  type ResourceInfo,
  type AccessResult,
  type ScheduleResult,
} from "./access-control";

// Scaling Algorithm
export {
  allocateResources,
  type DemandInfo,
  type AllocationResult,
} from "./scaling-algo";
