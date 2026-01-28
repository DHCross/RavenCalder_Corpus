# Woven Map Output Format Templates

**Purpose**: Canonical output templates that enforce the "separate sections" integration policy for Blueprint vs Symbolic Atmosphere.

**Architecture Principle**: "The Geometry Precedes the Story."

---

## Core Separation Rules

1. **Blueprint Section**: ALWAYS first. Contains capacity/structure only. No state claims without verified load data.
2. **Symbolic Atmosphere Section**: ALWAYS separate. Optional. Never interwoven with Blueprint prose.
3. **Integration Policy**: `separate_sections` (enforced by JSON Schema)

---

## Template 1: Solo Mirror Flow (Blueprint-only)

```markdown
# Constitutional Blueprint: {Name}

**Status:** Field Data Accepted.
**Mode:** Solo Mirror (Blueprint-only) | Compressed.

---

## 📡 Provenance

**Subject:** {Name}
- **Birth:** {YYYY-MM-DD} {HH:MM} {TZ}
- **Location:** {City, Region, Country} ({lat}, {lon})

**Math Spec:**
- **House System:** {Placidus|WholeSign}
- **Ephemeris:** {source} v{version}
- **Orbs Profile:** {profile}
- **Math Brain:** v{version}
- **Build:** {timestamp}

**Enforcement Locks:**
- Blueprint/Load Split: ✅ ENFORCED
- Weather Language: ❌ BLOCKED (Mirror Flow)
- Geometric Validator: ✅ REQUIRED

---

## 🧭 Orientation Plate (Core Anchors)

| Component | Function | Position | House |
|-----------|----------|----------|-------|
| **Sun** | Core Purpose / Engine | {sign} {deg}° | H{n} |
| **Moon** | Emotional Rhythm | {sign} {deg}° | H{n} |
| **Ascendant** | Interface / Hull | {sign} {deg}° | — |
| **Midheaven** | Public Direction | {sign} {deg}° | — |

---

## 🏗️ Chamber Audit (The Acorn)

*Occupancy status & material physics*

| Chamber | Label | Material (Sign) | Engines (Planets) |
|---------|-------|-----------------|-------------------|
| **H1** | The Gate | {sign} | {planets or "Ambient"} |
| **H2** | The Store | {sign} | {planets or "Ambient"} |
| **H3** | The Path | {sign} | {planets or "Ambient"} |
| **H4** | The Root | {sign} | {planets or "Ambient"} |
| **H5** | The Forge | {sign} | {planets or "Ambient"} |
| **H6** | The Field | {sign} | {planets or "Ambient"} |
| **H7** | The Mirror | {sign} | {planets or "Ambient"} |
| **H8** | The Core | {sign} | {planets or "Ambient"} |
| **H9** | The Horizon | {sign} | {planets or "Ambient"} |
| **H10** | The Canopy | {sign} | {planets or "Ambient"} |
| **H11** | The Grove | {sign} | {planets or "Ambient"} |
| **H12** | The Shell | {sign} | {planets or "Ambient"} |

---

## 📐 Geometric Stress Vectors

*Tight orb aspects (≤3°) only*

- **{Planet1} {aspect} {Planet2}** ({orb}° orb): {structural description}
- **{Planet1} {aspect} {Planet2}** ({orb}° orb): {structural description}

---

## 🔧 Constitutional Architecture

### Primary Movement
{Description of dominant modality/element flow}

### Stress Points
- **{Label}:** {Requirement + Failure Mode}
- **{Label}:** {Requirement + Failure Mode}

### Core Polarity
**{Word A} · {Word B}**
{Structural tension description - capacity language only}

---

## 🌍 Symbolic Atmosphere (Optional Climate Module)

> **Note:** This section is optional and independent of the Blueprint above. It describes slow-planet structural currents using symbolic language. It is never interwoven with Blueprint prose.

### Climate Currents (Slow Planets)

**Jupiter {sign} (H{n})**
{Symbolic expansion/philosophical current}

**Saturn {sign} (H{n})**
{Symbolic structure/limitation current}

**Uranus {sign} (H{n})**
{Symbolic innovation/disruption current}

**Neptune {sign} (H{n})**
{Symbolic dissolution/vision current}

**Pluto {sign} (H{n})**
{Symbolic transformation/power current}

---

**END OF REPORT**
```

---

## Template 2: Solo Balance Meter (Blueprint + Weather)

```markdown
# Balance Meter Report: {Name}

**Status:** Field Data Accepted.
**Mode:** Solo Balance Meter | Auditable.

---

## 📡 Provenance

**Subject:** {Name}
- **Birth:** {YYYY-MM-DD} {HH:MM} {TZ}
- **Location:** {City, Region, Country} ({lat}, {lon})

**Sampling Window:**
- **Range:** {start_date} → {end_date}
- **Anchor Time:** {HH:MM} local daily
- **Relocation:** {mode}

**Math Spec:**
{same as Solo Mirror Flow}

**Enforcement Locks:**
- Blueprint/Load Split: ✅ ENFORCED
- Weather Language: ✅ ALLOWED (Balance Meter only)
- Geometric Validator: ✅ REQUIRED

---

## 🧭 Orientation Plate (Core Anchors)

{same as Solo Mirror Flow}

---

## 🏗️ Chamber Audit (The Acorn)

{same as Solo Mirror Flow}

---

## 📊 Balance Meter (Load Data)

### Daily Readings ({start} → {end})

| Date | Balance Score | Top Driver | Orb | Valence |
|------|---------------|------------|-----|---------|
| {date} | {score} | {aspect} | {orb}° | {+/-} |
| {date} | {score} | {aspect} | {orb}° | {+/-} |

### Load Summary
- **Average Balance:** {avg}
- **Peak Compression:** {date} ({score})
- **Peak Flow:** {date} ({score})

---

## 🌍 Symbolic Atmosphere (Weather + Climate)

> **Note:** This section uses symbolic language to describe transiting conditions. It is independent of the Blueprint and never interwoven with capacity descriptions.

### Weather Patterns (Fast Planets - Time-Bound)

**{Date}**
- **Sun {transit aspect}:** {symbolic weather description}
- **Moon {transit aspect}:** {symbolic weather description}
- **Mercury {transit aspect}:** {symbolic weather description}

### Climate Currents (Slow Planets - Structural)

{same climate section as Solo Mirror Flow if enabled}

---

**END OF REPORT**
```

---

## Template 3: Synastry Mirror Flow (Bidirectional Blueprint)

```markdown
# Relational Mirror: {Name A} + {Name B}

**Status:** Field Data Accepted.
**Mode:** Relational Mirror (Blueprint-only) | Bidirectional.

---

## 📡 Provenance

**Subjects:**
- **A:** {Name A} — {birth data}
- **B:** {Name B} — {birth data}

**Relationship Context:**
- **Type:** {partners|parent-child|etc}
- **Tier:** Structural Only

**Math Spec:**
{same as before}

**Enforcement Locks:**
- Blueprint/Load Split: ✅ ENFORCED
- Bidirectionality: ✅ REQUIRED
- Weather Language: ❌ BLOCKED (Mirror Flow)
- Geometric Validator: ✅ REQUIRED

---

## 🪞 Interface Comparison

| Feature | Subject A ({Name}) | Subject B ({Name}) |
|---------|-------------------|-------------------|
| **Interface (ASC)** | {sign} | {sign} |
| **Drive (Mars)** | {sign} (H{n}) | {sign} (H{n}) |
| **Needs (Moon)** | {sign} (H{n}) | {sign} (H{n}) |

---

## 🔄 Contact Mechanics (Bidirectional)

### Contact 1: {Aspect Name}

**Mechanic (Neutral):** {Geometric description}

**[{A} → {B}]:**
- **Requirement:** {What A's structure introduces into B's system}
- **Tolerance:** {B's capacity to handle A's input}

**[{B} → {A}]:**
- **Requirement:** {What B's structure introduces into A's system}
- **Tolerance:** {A's capacity to handle B's input}

**Risk (Under Load):** {Failure mode when resources depleted}

**Stabilizer:** {What reduces friction}

---

### Contact 2: {Aspect Name}

{repeat bidirectional format}

---

## 🏛️ Chamber Mechanics (Both Perspectives)

**{A}'s 7th (Mirror):** {sign} – {Requirement + Failure Mode}

**{B}'s 6th (Field):** {sign} – {Requirement + Failure Mode}

**Friction:** {When mismatched, what happens}

---

## 🔧 Relational Architecture

**This is a coupled system; both sides apply pressure and both sides supply stability.**

{Summary of primary tensions and stabilizers - bidirectional language only}

---

## 🌍 Symbolic Atmosphere (Optional Climate Module)

{If enabled, describe slow-planet currents for both A and B}

---

**END OF REPORT**
```

---

## Template 4: Synastry Balance Meter (Bidirectional + Weather)

```markdown
# Relational Balance Meter: {Name A} + {Name B}

**Status:** Field Data Accepted.
**Mode:** Relational Balance Meter | Bidirectional | Auditable.

---

## 📡 Provenance

{Same context as Synastry Mirror Flow}

**Sampling Window:**
- **Range:** {start} → {end}
- **Anchor Time:** {HH:MM} local daily
- **Relocation:** {mode}
- **Directionality:** Bidirectional (A→B, B→A)

**Enforcement Locks:**
- Blueprint/Load Split: ✅ ENFORCED
- Bidirectionality: ✅ REQUIRED
- Weather Language: ✅ ALLOWED (Balance Meter)
- Geometric Validator: ✅ REQUIRED

---

## 🪞 Interface Comparison

{same as Synastry Mirror Flow}

---

## 🔄 Contact Mechanics (Bidirectional)

{same bidirectional format as Synastry Mirror Flow}

---

## 📊 Relational Balance Meter (Load Data)

| Date | A→B Pressure | B→A Pressure | Net Balance | Top Driver |
|------|-------------|-------------|-------------|------------|
| {date} | {score} | {score} | {net} | {aspect} |
| {date} | {score} | {score} | {net} | {aspect} |

---

## 🌍 Symbolic Atmosphere (Weather + Climate)

### Weather Patterns (Transits - Time-Bound)

**{Date}**
- **Transiting {Planet} {aspect} {A}'s {Planet}:** {symbolic effect A→B}
- **Transiting {Planet} {aspect} {B}'s {Planet}:** {symbolic effect B→A}

### Climate Currents (Slow Planets)

{Describe slow-planet currents for both A and B if enabled}

---

**END OF REPORT**
```

---

## Integration Policy Enforcement

**Rule**: When `integration_policy: "separate_sections"` is set (required), AI systems MUST:

1. Render Blueprint first, complete
2. Add clear visual separator (horizontal rule or section break)
3. Render Symbolic Atmosphere second, with explicit header noting it's optional/independent
4. NEVER blend weather/climate language into Blueprint prose
5. Use conditional language in Blueprint only when Load data (transits/Balance Meter) is present

**Violation Example (Forbidden)**:
```
Your Taurus Moon craves stability [BLUEPRINT] but with Mars transiting your 4th House,
you may feel restless [WEATHER INTERWOVEN - VIOLATION]
```

**Compliant Example**:
```
Blueprint: Your system requires stable relational ground (Taurus Moon, 7th).

---

Symbolic Atmosphere (Weather): Mars transiting 4th introduces restlessness.
```

---

## Backend Validation Checklist

Before rendering any report, validate:

- [ ] JSON Schema validation passes
- [ ] If `report_kind === "Mirror Flow"` → `include_weather === false`
- [ ] If `is_relational === true` → `subjects.length === 2` AND `bidirectional === true`
- [ ] If `include_weather === true` → `sampling` is fully populated
- [ ] `integration_policy === "separate_sections"` is honored in prose structure
- [ ] All aspects passed through Geometric Accuracy Validator
- [ ] Retrograde status is present for all planets

---

**Protocol Status:** Architecture Locked.
**Enforcement Layer:** JSON Schema + Template Compliance.
