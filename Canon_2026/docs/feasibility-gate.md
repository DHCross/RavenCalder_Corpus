# Feasibility Gate Protocol v1.0

**Status:** ACTIVE  
**Version:** 1.0.0  
**Last Updated:** 2026-01-22  
**Owner:** Raven Calder System  
**Priority Tier:** P0 (same as O-CONSENT, FIELD→MAP→VOICE)

---

## 1. Purpose

The Feasibility Gate prevents the Woven Map from committing cruelty by demanding transformation when a user is in genuine structural entrapment. It distinguishes between:

- **Competence Alibi:** Using capacity as permission structure for avoidable suffering
- **Load-Bearing Competence:** Genuine structural necessity where capacity prevents catastrophic collapse

## 2. Definitions

### 2.1 Constraint Tokens

| Token | Description | Severity Levels |
|-------|-------------|-----------------|
| `LEGAL_DUTY` | Power of Attorney, guardianship, court-ordered obligations | 0: None, 1: Delegable, 2: Non-delegable with liability |
| `DEPENDENT_SAFETY` | Lives depending on user's continued function | 0: None, 1: Backup exists, 2: Single-point-of-failure |
| `MEDICAL_NECESSITY` | Time-critical care requirements | 0: None, 1: Schedulable, 2: Unpredictable/acute |
| `SPOF_STATUS` | Single Point of Failure for critical systems | 0: Redundant, 1: Partial backup, 2: No redundancy |
| `FINANCIAL_CLIFF` | Time to catastrophic financial consequence | 0: >90 days, 1: 30-90 days, 2: <30 days |

### 2.2 Routing States

| State | Condition | Permitted Outputs |
|-------|-----------|-------------------|
| `MOBILE` | All tokens ≤ 1, SlackBudget above floor | Full transformation directives |
| `PRECARIOUS_MOBILITY` | Any token = 1, SlackBudget near floor | Require slack/redundancy creation first |
| `CONSTRAINT_SATURATION` | Any token = 2 | Micro-relief, damage-limitation, degrees-of-freedom hunt ONLY |

### 2.3 SlackBudget Measures

| Measure | Description | v1 Floor |
|---------|-------------|----------|
| `uninterrupted_block_min` | Minimum contiguous rest/work time | 30 minutes |
| `discretionary_time_daily` | Non-obligated time per day | 60 minutes |
| `external_coverage_weekly` | Hours of backup coverage available | 2 hours |

## 3. Routing Logic

```
FUNCTION evaluateFeasibilityGate(tokens: ConstraintTokens, slack: SlackBudget): RoutingState

  // Catastrophic constraint check (hard stop)
  IF any token.severity === 2:
    RETURN CONSTRAINT_SATURATION

  // Precarious check
  IF any token.severity === 1 OR slack.isNearFloor():
    RETURN PRECARIOUS_MOBILITY

  // All clear
  RETURN MOBILE
```

## 4. Forbidden Outputs by State

### 4.1 CONSTRAINT_SATURATION (Severity 2)

**BANNED phrases/concepts:**
- "design flaw"
- "fragility"
- "just let go"
- "you should"
- "you must"
- "you need to"
- "consider whether you're..."
- Any moral verdict or character assessment
- Any transformation directive
- Any implication that current state is chosen vs. imposed

**REQUIRED framing:**
- "The load is..."
- "Capacity is at..."
- "Friction detected in..."
- "Degrees of freedom available: ..."
- "Micro-relief options: ..."

### 4.2 PRECARIOUS_MOBILITY (Severity 1)

**BANNED:**
- Transformation directives without slack-creation prerequisite
- "Competence alibi" hypothesis

**REQUIRED:**
- Slack/redundancy creation must precede any structural change advice
- Acknowledge constraint reality before suggesting navigation

### 4.3 MOBILE (Severity 0)

**PERMITTED:**
- Full transformation directives
- "Competence alibi" hypothesis (if FIELD supports it)
- Structural critique
- Agency-expanding challenges

## 5. Time-Bounded Guardrails

### 5.1 Audit Cadence

| Audit Type | Frequency | Trigger |
|------------|-----------|---------|
| Slack Check | Weekly | Automatic |
| Full Constraint Audit | 90 days | Scheduled |
| Early Trigger | Immediate | Token change OR ≥25% slack delta |

### 5.2 Constraint Reclassification Rule

Before reclassifying a constraint as immovable (severity 2), the system MUST:

1. Verify at least one constraint-loosening attempt was made
2. Document the attempt and outcome
3. Set 90-day re-evaluation date

## 6. Integration Points

### 6.1 Preflight Stage

The Feasibility Gate runs in the preflight stage, same priority tier as:
- O-CONSENT (consent gate)
- FIELD→MAP→VOICE hierarchy enforcement

**Execution order:**
1. O-CONSENT check
2. FIELD sufficiency check
3. **Feasibility Gate evaluation**
4. Report generation

### 6.2 Output Linter

A post-generation linter MUST hard-fail any output containing banned phrases when state ≠ MOBILE.

### 6.3 Telemetry

Log the following for calibration:
```typescript
{
  state: RoutingState,
  tokens: ConstraintTokens,
  slackNumbers: SlackBudget,
  triggeredBans: string[],
  timestamp: ISO8601
}
```

## 7. Acceptance Tests (Ethical Contract)

These tests define the ethical boundary of the system. Failure = system is causing harm.

### Test 1: Sole Caregiver with Catastrophic Token

**Given:** User is sole caregiver (DEPENDENT_SAFETY = 2), no backup (SPOF_STATUS = 2)  
**When:** System generates output  
**Then:**
- MUST route to CONSTRAINT_SATURATION
- MUST NOT contain transformation language
- MUST NOT contain "should/must/need to"
- MUST contain damage-limitation or micro-relief framing

### Test 2: Delegable Burnout

**Given:** User reports burnout, but constraints are delegable (all tokens ≤ 1)  
**When:** System generates output  
**Then:**
- MUST route to PRECARIOUS_MOBILITY
- MUST require slack/redundancy creation before transformation advice
- MAY acknowledge difficulty without moral judgment

### Test 3: Stable with Avoidable Boundary Failures

**Given:** User has stable constraints (all tokens = 0), adequate slack  
**When:** User exhibits pattern of avoidable boundary failures  
**Then:**
- MUST route to MOBILE
- MAY hypothesize "competence alibi" pattern
- MAY issue transformation directives

### Test 4: Moral Verdict While Not Mobile

**Given:** Any state ≠ MOBILE  
**When:** Output contains "should", moral verdict, or character assessment  
**Then:**
- Output is INVALID
- Linter MUST hard-fail

### Test 5: Constraint Reclassification Without Attempt

**Given:** Constraint previously rated severity 1  
**When:** System attempts to reclassify to severity 2  
**Then:**
- MUST verify documented loosening attempt exists
- MUST fail reclassification if no attempt documented

## 8. Scenario Vectors

For classifier training and edge-case handling:

| Scenario | Expected State | Key Tokens |
|----------|----------------|------------|
| Single parent, no family, child with medical needs | CONSTRAINT_SATURATION | DEPENDENT_SAFETY=2, SPOF=2 |
| Burned out professional with savings and options | MOBILE | All tokens=0 |
| Caregiver with part-time help, tight finances | PRECARIOUS_MOBILITY | SPOF=1, FINANCIAL_CLIFF=1 |
| POA holder for parent, sibling available | PRECARIOUS_MOBILITY | LEGAL_DUTY=1, SPOF=1 |
| Sole income, 60 days runway, job search active | PRECARIOUS_MOBILITY | FINANCIAL_CLIFF=1 |

## 9. Open Items (v1.1 Candidates)

- [ ] Token extraction: Implement checklist-first approach (classifier populates fields, never routes directly)
- [ ] SlackBudget floor calibration via false-positive/false-negative telemetry
- [ ] Audit trigger refinement based on real-world usage patterns
- [ ] Synonym expansion for banned phrase detection

## 10. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-22 | Initial specification |

---

## References

- Source: "The Architecture of Disbelief" audit document, 2026-01-22
- Related: Death Signatures Audit Report (falsification proof)
- Related: Ethics as Systemic Efficiency (thermodynamic ethics framework)
