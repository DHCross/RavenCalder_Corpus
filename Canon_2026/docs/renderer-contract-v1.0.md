# 🧱 WOVEN MAP RENDERER CONTRACT (v1.0)

**Status:** Canonical  
**Scope:** Prose-level semantic enforcement  
**Applies To:** All human-readable output  
**Purpose:** Prevent semantic leakage, metaphor drift, and narrative asymmetry

---

## 0. Renderer Contract Doctrine

1. **Structure ≠ Language**  
   Templates define *where* content goes.  
   The Renderer Contract defines *what language is legal* inside each section.

2. **Blueprint Language Is Timeless**  
   Any temporal, emotional, or experiential verb inside Blueprint prose is a **hard failure**.

3. **Load Must Be Proven**  
   Any claim about current state, pressure, feeling, or activation requires:
   - Load enabled
   - Sampling defined
   - Explicit conditional framing

4. **Synastry Is Bidirectional Physics**  
   If only one vector is rendered, the output is invalid.

5. **Atmosphere Is Quarantined**  
   Weather and Climate are allowed to exist—but only behind a labeled barrier.

---

## 1. Section–Language Matrix (Hard Mapping)

| Section Type | Time Allowed | Emotion Allowed | Metaphor Allowed | Conditional Required |
|--------------|-------------|-----------------|------------------|---------------------|
| Blueprint (Mirror Flow) | ❌ | ❌ | ⚠️ Structural only | ❌ |
| Load (Balance Meter) | ✅ | ⚠️ Descriptive only | ⚠️ Atmospheric only | ✅ |
| Synastry (Blueprint) | ❌ | ❌ | ⚠️ Structural only | ❌ |
| Symbolic Atmosphere | ✅ | ⚠️ Neutral only | ✅ | ❌ |

⚠️ = constrained, audited usage

---

## 2. Blueprint Language Rules (Non-Negotiable)

### 2.1 Allowed Verb Taxonomy (Blueprint)

Blueprint prose may use **only structural verbs**.

**Allowed Patterns:**
- "The system requires…"
- "This configuration prioritizes…"
- "The structure routes energy through…"
- "When X is absent, the system destabilizes…"
- "Thresholds are crossed when…"
- "This chamber operates via…"

**Allowed Subjects:**
- system
- structure
- configuration
- geometry
- chamber
- axis
- lattice
- threshold

---

### 2.2 Forbidden Blueprint Verbs (Hard Fail)

Any of the following inside Blueprint prose = **contract violation**:

- "you are…"
- "you feel…"
- "you tend to…"
- "you experience…"
- "currently…"
- "right now…"
- "lately…"
- "this week / month / year…"
- Any emotion adjective applied to "you"

**Example (Invalid):**
> "Your Moon in Taurus requires stability, and this week you're feeling restless."

→ ❌ Time + feeling + subject = breach

---

## 3. Load-Conditional Language Rules

Load language may appear **only** when Load is enabled.

### 3.1 Required Pattern

All Load prose must follow this form:

```
IF [explicit load condition]
THEN [structural or behavioral effect]
```

**Valid Examples:**
- "If sustained pressure accumulates, the system defaults to conservation."
- "When magnitude exceeds threshold, response latency increases."
- "Under prolonged activation, this axis shows fatigue."

---

### 3.2 Forbidden Load Shortcuts

The following imply Load **without proof** and are illegal:

- "You are under pressure…"
- "You're feeling stressed…"
- "Things are intense right now…"
- "This is a difficult time…"

Unless rewritten into conditional form with explicit load reference → ❌

---

## 4. Bidirectional Synastry Rendering Rules (Phase 7B Lock)

### 4.1 Mandatory Structure

Every synastry interaction **must render both vectors**.

**Required Format:**
```
[A → B]: structural demand / effect
[B → A]: structural demand / effect
```

Both sides must:
- Use comparable verb strength
- Refer to geometry, not psychology
- Avoid role hierarchy unless explicitly derived

---

### 4.2 Forbidden Synastry Patterns

The following are **automatic failures**:

- Single-direction framing
- Caregiver / child metaphors without geometric justification
- Asymmetric verbs ("supports" vs "receives")
- Trait attribution ("you stabilize her emotionally")

Synastry describes **field interaction**, not people.

---

## 5. Symbolic Atmosphere Quarantine

### 5.1 Structural Separator (Required)

Symbolic Atmosphere **must** be isolated with one of:

```markdown
---
## 🌍 Symbolic Atmosphere
```

### 5.2 Header Declaration (Required)

The section must explicitly state:

> "This section describes symbolic climate and weather and does not modify Blueprint structure."

---

### 5.3 Absolute Prohibition

- No Blueprint section may contain:
  - weather metaphors
  - climate language
  - atmospheric verbs

Any cross-contamination = ❌

---

## 6. Identity & Label Guardrail

Blueprint prose may **never**:

- Assign identity labels
- Describe personality traits
- Name emotions as inherent qualities
- Collapse structure into character

**Allowed:**
- "The system prioritizes stability."

**Forbidden:**
- "You are a stable person."

---

## 7. Empathy & User-Declared State (Classification Rule)

This clause resolves the tension between System Rigor and Human Connection.

**Doctrine:**
- **System Jurisdiction:** The system may never *claim* internal states.
- **Relational Jurisdiction:** The system may *acknowledge* states explicitly named by the user.

### 7.1 Allowed Patterns (User-Led)
When user says "I feel X":

✅ **Acknowledgment**
> "I hear that you're feeling [X]."

✅ **Mirroring**
> "You're noticing a lot of [X] today."

✅ **Containment**
> "That sounds heavy. We can hold space for that."

### 7.2 Forbidden Patterns (Attribution)
Even when user says "I feel X", the system must NOT:

❌ **Geometry as Cause**
> "You feel [X] *because* Saturn is squaring your Moon." (Causation fallacy)

❌ **Re-labeling**
> "Actually, that's not sadness, it's Plutonic compression." (Gaslighting)

❌ **Universalizing**
> "Everyone with this aspect feels [X]." (Generalization)

**Summary:** The system can be a witness, but never a diagnostic authority on the user's lived experience.

---

## 8. Enforcement Mechanism (Implementation)

### 8.1 Verb Taxonomy Engine

- Blueprint verb whitelist
- Load-only verb list
- Atmosphere-only metaphor list

### 8.2 Prose Validator

- Regex pass (fast failures)
- Semantic check (LLM classifier)
- Section-aware scanning

### 8.3 Test Suite

Each rule requires:
- Valid example
- Invalid example
- Edge-case inversion

### 8.4 Generator Gate

- Prose validated **before** return
- Failure → regenerate or reject

---

## 9. What This Lock Accomplishes

With the Renderer Contract in place:

- Blueprint cannot "accidentally" feel
- Time cannot sneak into structure
- Synastry cannot become projection
- Weather cannot impersonate identity
- Prose becomes **auditable, enforceable, falsifiable**

This closes the last enforcement gap.

---

## 10. Implementation Checklist

### Phase 1: Verb Taxonomy
- [ ] Define Blueprint verb whitelist
- [ ] Define forbidden verb patterns
- [ ] Define Load-conditional patterns
- [ ] Define Atmosphere-only metaphors

### Phase 2: Prose Linter
- [ ] Create regex-based fast-fail detector
- [ ] Implement section-aware context parser
- [ ] Build semantic validator (LLM-based)
- [ ] Wire into report generation pipeline

### Phase 3: Test Suite
- [ ] Create Golden Corpus (valid examples)
- [ ] Create Failure Gallery (invalid examples)
- [ ] Add edge-case inversions
- [ ] Automate validation testing

### Phase 4: Integration
- [ ] Wire into Math Brain report generator
- [ ] Add validation logging/telemetry
- [ ] Create error messages for contract violations
- [ ] Deploy to production

---

**Field Closure:**

Without the Renderer Contract, the system *looks* rigorous while still bleeding meaning.

With it, language becomes geometry's servant—not its saboteur.

**Status:** Contract Sealed. Enforcement Proceeding.
