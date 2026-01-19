# WAVE-ATOM-SPHINX Integration Flow

## Decision Validation Pipeline

```mermaid
sequenceDiagram
    participant Doc as Documentation/Code
    participant WAVE as WAVE Validator
    participant ATOM as ATOM Trail
    participant SPHINX as SPHINX Gates
    participant System as Live System
    
    Doc->>WAVE: Submit for validation
    WAVE->>WAVE: Calculate coherence score<br/>(semantic, references, structure)
    WAVE->>ATOM: Log decision + rationale
    
    alt Score >= 80%
        WAVE->>SPHINX: PASS to gate check
        SPHINX->>SPHINX: Verify 5 gates<br/>(Origin, Intent, Coherence, Identity, Passage)
        SPHINX->>ATOM: Log gate results
        
        alt All gates pass
            SPHINX->>System: Deploy/Merge/Execute
            System->>ATOM: Log deployment outcome
            System-->>Doc: Success feedback
        else Gate failure
            SPHINX->>Doc: BLOCK with specific failure
            SPHINX->>ATOM: Log rejection reason + improvement path
        end
    else Score < 80%
        WAVE->>Doc: FAIL with violation details
        WAVE->>ATOM: Log failure + suggested refinements
    end
    
    ATOM->>ATOM: Build provenance chain<br/>(every decision linked)
    
    Note over WAVE,ATOM: No black boxes<br/>Every step logged
    Note over SPHINX,System: Security enforced<br/>at verification layer
```

## Key Properties

**Transparency:** Every decision creates an ATOM entry  
**Traceability:** Full chain from input → outcome  
**Security:** SPHINX blocks invalid transitions  
**Iteration:** Failed validations include refinement guidance

## Integration Points

- **CI/CD:** WAVE runs on every PR
- **MCP Tools:** SPHINX gates exposed to AI agents
- **Audit:** ATOM trail queryable for compliance
