Below is a **clean, doctrine-aligned rewrite** of your **“Four Report Types: v10.2 Integration Spec”**, updated for the **current API surface**, **v5.0 Balance Meter rules**, and the **post-Voltage Backstage doctrine**.

This version is written to function as **authoritative internal documentation**: precise, enforceable, and implementation-ready. No new concepts are introduced; several are corrected, tightened, or re-scoped.

---

# The Four Report Types

## Woven Map v10.2 — Integration Specification

**Status:** Active Doctrine **Version:** 10.2 **Architecture Path:** **Math Brain (API)** → **JSON Schema (`mirror-symbolic-weather-v1`)** → **Poetic Brain (Narrative)**

This document maps the four canonical Woven Map report types to their **execution paths, data contracts, and narrative obligations**, grounded in the current API endpoints defined in `best-astrology-api-postman.json`.

---

## 1\. Solo Mirror Flow

### *(The Constitutional Blueprint)*

### Function

A **static, qualitative diagnostic** of the individual’s constitutional architecture (“Blueprint” / “Acorn”). It describes enduring structure: behavioral anchors, polarity tensions, and baseline pressure patterns.

### Time Lens

**Natal (Static)**

### Location Sensitivity

**Low** — birth location only.

### Symbolic Weather Status

**Inactive** ⚠️ *No symbolic weather language permitted.*

---

### 🛠️ Math Brain Execution

**Primary Endpoint**

POST /api/v3/charts/natal

**Postman Path** `/🗺️ Chart Data & Analysis/📁 Chart Natal/Basic Natal Chart`

**Payload Requirements**

{

  "subject": {

    "name": "string",

    "birth\_data": {

      "year": number,

      "month": number,

      "day": number,

      "hour": number,

      "minute": number,

      "city": "string",

      "country\_code": "string"

    }

  },

  "options": {

    "house\_system": "P",

    "zodiac\_type": "Tropic | Sidereal"

  }

}

**Output Schema**

* `wm-map-v1`  
* Geometry only

**Required Contents**

* Natal planetary positions  
* House cusps (Placidus default)  
* Natal aspects (natal ↔ natal)

---

### 🖋️ Poetic Brain Directive

**Header** 🪞 *Mirror Flow — \[Name\] (Constitutional Blueprint)*

**0\. Resonant Summary**

* 3–4 paragraphs, conversational voice  
* Blends anchors, impulses, and pressures  
* Recognition-first; no interpretation claims

**1\. Resonance Profile (Anchor Layer)**

* Behavioral anchors (how the system holds)  
* Conditional impulses (how it moves under pressure)  
* Interior compass (Mercury/Moon geometry)

**2\. Core Pressure Patterns**

* Named structural tensions  
* Always framed as *fuel*, never flaws

**3\. Polarity Snapshot**

* 3–4 plain-language polarity pairs  
* Derived from opposition geometry and axis load

**4\. Mirror Voice (Synthesis)**

* Integrative close  
* Ends with reflective question, not advice

---

## 2\. Solo Balance Meter

### *(The Symbolic Accelerometer)*

### Function

A **dynamic, quantitative analysis** of symbolic pressure acting on the natal chart across a defined time window.

### Time Lens

**Transits (Temporal Window)**

### Location Sensitivity

**High** — relocation / current city required.

### Symbolic Weather Status

**Active**

---

### 🛠️ Math Brain Execution

**Primary Endpoint**

POST /api/v3/charts/transit

**Postman Path** `/🗺️ Chart Data & Analysis/📁 Chart Transit/Relocated Transit Analysis`

**Rationale** The Woven Map enforces **“Pain with Coordinates.”** Relocation anchors pressure to lived geography.

**Payload Requirements**

{

  "subject": { ...natal data... },

  "transit\_time": {

    "datetime": "ISO-8601",

    "city": "string",

    "country\_code": "string"

  }

}

For date ranges, calls are iterated daily or via batch logic when available.

**Output Schema**

* `wm-field-v1`  
* Balance Meter v5.0

**Required Metrics**

* `mag_x10`  
* `bias_x10`

⚠️ **System Voltage**

* Calculated internally  
* **Never exposed frontstage**  
* Used only to trigger standoff logic

**Drivers**

* Climate drivers (outer planets)  
* Weather drivers (inner / fast movers)

---

### 🖋️ Poetic Brain Directive

**Header** ⚡ *Balance Meter — \[Date Range\] (Symbolic Weather)*

**0\. Provenance Block**

* Schema versions  
* Orbs profile  
* Relocation context  
* *Voltage status omitted from user view*

**1\. Executive Summary (Pilot View)**

* One paragraph  
* Situational awareness only  
* If `bias ≈ 0` at high magnitude → invoke **Mechanics of Zero**

**2\. The Field (Weather Layer)**

* **Symbolic Climate:** deep, slow pressure (Pluto, Neptune)  
* **Symbolic Weather:** transient modulation (Moon, Mercury)

**3\. The Map (Structural Landing Zone)**

* Where pressure lands (house / chamber)  
* Uses relocated houses unless Angle Drift Alert is active

**4\. Voice (Navigation Language)**

* Operational phrasing only  
* No outcomes, no predictions  
* Capacity-based framing (“conserve margin,” “hold line”)

---

## 3\. Relational Mirror Flow

### *(The Resonance Field)*

### Function

A **static synastry analysis** describing the interaction between two constitutional systems.

### Time Lens

**Synastry (Static Overlay)**

### Location Sensitivity

**Low**

### Symbolic Weather Status

**Inactive**

---

### 🛠️ Math Brain Execution

**Primary Endpoint**

POST /api/v3/charts/synastry

**Postman Path** `/🗺️ Chart Data & Analysis/📁 Chart Synastry/Romantic Compatibility`

**Payload Requirements**

{

  "subject1": { ...natal A... },

  "subject2": { ...natal B... },

  "options": { "mode": "synastry" }

}

**Output Schema**

* `wm-map-v1` (dual-subject mode)

**Required Contents**

* Inter-aspects (A ↔ B)  
* House overlays (A in B, B in A)

---

### 🖋️ Poetic Brain Directive

**Header** 🪞 *Relational Mirror — \[Name A\] & \[Name B\]*

**0\. Relational Summary**

* Describes the *field between*, not the individuals  
* Explicit intimacy tier (P1–P5b)

**1\. Individual Interface (Brief)**

* Ascendant / Mars style snapshot for each person

**2\. Echo Loops (Bidirectional)**

* “When A does X, B often responds with Y”  
* Attribution mandate enforced

**3\. Friction & Glue**

* Squares / Oppositions → friction  
* Trines / Conjunctions → cohesion

**4\. Voice (Shared Pattern)**

* Describes purpose or recurring lesson  
* No prescriptions

---

## 4\. Relational Balance Meter

### *(The Shared Storm)*

### Function

Analyzes how **symbolic weather impacts the relationship itself** during a live window.

### Time Lens

**Synastry \+ Transits**

### Location Sensitivity

**High** — usually anchored to `A_local` or shared context.

### Symbolic Weather Status

**Active**

---

### 🛠️ Math Brain Execution

**Execution Logic — Dual Pass**

1. Run **Solo Balance Meter** for Person A  
2. Run **Solo Balance Meter** for Person B  
3. Aggregate overlapping high-magnitude days

**Payload Requirements**

* `subject_a`  
* `subject_b`  
* `date_range`  
* `relocation_context`

---

### 🖋️ Poetic Brain Directive

**Header** ⚡ *Relational Balance Meter — \[Date Range\]*

**0\. Provenance & Tier**

* Relocation context  
* Intimacy tier

**1\. Shared Climate**

* Is pressure hitting the relationship field or individuals?

**2\. Individual Loads**

* Person A status  
* Person B status  
* Interaction of simultaneous conditions

**3\. Friction / Synthesis**

* Operational guidance for coexistence  
* No outcome promises

**4\. Voice (Mediation Frame)**

* Tactical, capacity-based navigation language

---

## Direct-to-Report Logic Gate

| Data Detected | Report Type | API Route |
| :---- | :---- | :---- |
| Birth data only | Solo Mirror | `/charts/natal` |
| Birth \+ transits | Solo Balance Meter | `/charts/transit` |
| Two birth charts | Relational Mirror | `/charts/synastry` |
| Two charts \+ transits | Relational Balance Meter | Dual `/charts/transit` |

---

## Provenance Requirement (Hard Rule)

Every report **must begin** with:

\=== 📠 MATH BRAIN TELEMETRY \===

Endpoint:

Schema:

Relocation Mode:

Orbs Profile:

Engine Version:

\============================

No exceptions.

---

## Closing Doctrine

* Mirror Flow reveals **structure**  
* Balance Meter reports **pressure**  
* Symbolic Weather never describes identity  
* Capacity replaces prediction

**The map does not tell stories. It reports conditions.**

This spec is now **locked** for v10.2.

