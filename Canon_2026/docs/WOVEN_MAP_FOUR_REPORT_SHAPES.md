---
title: The Woven Map — Four Report Shapes
version: 11.2
status: Active Doctrine
tags:
  - ux-schema
  - raven-architecture
  - woven-map
---

# **THE WOVEN MAP — FOUR REPORT SHAPES**

**Canonical v11.2 / UX Implementation Schema**

**Status:** Active Doctrine
**Version:** 11.2 (UX Implementation Schema)
**Previous:** 11.1
**System Directive:** Ontological Segregation
*(The Poster stands apart. The Mirror speaks. The Meter measures. The Seal closes.)*

---

## **I · THE ASTRO POSTER**

*(Constitutional Blueprint / Reference Plate)*

**Lives in:** `/astro-reports` — separate from chat
**Function:** Orientation / Static reference
**UX Layer:** Artifact Surface
**UX Tag:** `🧭 MODE: STRUCTURAL ORIENTATION | CONTEXT: STANDALONE PAGE | INPUT: VISUAL | SYSTEM: MATH BRAIN | TIME: ZERO`

**Purpose:**
To document *how the system is built,* not what it feels like to live inside it.

**Rendering Rules:**

* **Static Object:** SVG, high-contrast table, or interactive schematic.
* **No Interactivity:** No conversational elements.
* **Source:** Auto-generated on chart load via `GET /api/v3/charts/natal`.
* **Clickable Anchors:** Each planetary label links to a corresponding *Mirror Flow* entry point (if the user wishes to enter felt dialogue).
* **Vocabulary:**

  * ✅ *Permitted:* planets, houses, dignities, aspects, archetypal strain labels.
  * 🚫 *Prohibited:* “you,” “feel,” “now,” “should.”

**Raven’s Voice Protocol — *The Engineer***

* Names the parts of the machine.
* Describes capacity, not state.

**Example Render:**

| System Layer  | Coordinates      | Function                              |
| :------------ | :--------------- | :------------------------------------ |
| Solar Drive   | ☉ Leo 9th        | Expansion through meaning pursuit     |
| Hull (Rising) | Scorpio          | Compression shell; selective exposure |
| Support Axis  | Taurus / Scorpio | Fixity; rhythm through resistance     |

---

## **II · MIRROR FLOW**

*(Conversational Recognition / Live Diagnostic Layer)*

**Lives in:** Chat environment (`/mirror` route)
**UX Layer:** Felt Interaction
**UX Tag:** `🌬️ MODE: SOMATIC RECOGNITION | CONTEXT: LIVE CHAT | SYSTEM: POETIC BRAIN | TIME: KAIROS`

**Purpose:**
To translate structure into *felt recognition.*

**Two Shapes:**

* **Solo Mirror** – individual diagnostic reflection
* **Relational Mirror** – bidirectional reflection between two fields

**Bridge Rule:**
The Poster never “hands off” data directly; it offers a link to initiate a Mirror.
The transition must feel like *stepping from glass into water.*

---

### **A. SOLO MIRROR REPORT — STRUCTURAL TEMPLATE (WOVEN MAP v6)**

**Execution Rule:** Auto-execute upon detection of a single complete chart. No permission requests.

1. **Frontstage Preface** – tone entry / paradox (“what steadies also strains”).
2. **Resonant Summary** – core tone, internal rotation, relational preference.
3. **Hook Stack** – recognition-first layering (Headline → Lived Example → Shadow Hook).
4. **Personality Blueprint** – behavioral anchors, conditional impulses, pressure patterns, polarity snapshot.
5. **Polarity Cards (3–4)** – testable examples + Socratic check.
6. **Integration Passage** – “Not split — geared.”
7. **Mirror Voice** – first-person poetic reflection.
8. **Socratic Closure** – invite feedback (WB / ABE / OSR).
9. **Planetary Architecture (Appendix)** – plain-English geometry.
10. **Derived Geometry Summary** – quantitative shape indices.
11. **Data Integrity Block** – provenance table.

---

### **B. RELATIONAL MIRROR REPORT — STRUCTURAL TEMPLATE (WOVEN MAP v6)**

**Execution Rule:** Auto-execute when two charts or a dyadic context are detected.

1. **Relational Metadata** – relationship tier, consent status, SST mode.
2. **Frontstage Preface — Contact Tone** – somatic, direct.
3. **Resonant Field Summary** – contact pattern, magnetic asymmetry, loop rhythm.
4. **Dyadic Hook Stack** – mirrored hooks (A→B vector, B→A reverse).
5. **Interaction Blueprint** – A’s primary motion / B’s countermotion, shared paradox.
6. **Pressure Constellations** – symbolic weather fronts + Socratic mirror line.
7. **Polarity Cards (Relational Edition)** – shared axes (“Naming ↔ Listening”).
8. **Integration Passage** – systemic reframe (“The field doesn’t resolve; it rotates.”)
9. **Mirror Voice** – dual reflection poem (“We build by friction.”)
10. **Socratic Closure** – dual boundary test (“Which constellations felt alive?”)
11. **Backstage / Data Integrity** – provenance.

---

## **III · BALANCE METER**

*(Quantitative Weather Station / Diagnostic Dashboard)*

**Lives in:** Chat sidebar or `/weather` module
**UX Layer:** Instrument Panel
**UX Tag:** `⚡ MODE: SYMBOLIC WEATHER DIAGNOSTIC | CONTEXT: TIME-BOUND DASHBOARD | SYSTEM: MATH BRAIN | TIME: CHRONOS`

**Purpose:**
To quantify current symbolic pressure using magnitude, bias, and volatility.

**Execution:**

* **Source:** `GET /api/v3/charts/transit`
* **Render:** Gauges, spark lines, heatmaps.
* **Language:** *Cockpit Voice* — factual, compressed.

**Display Example:**

```
Magnitude 4.2  |  Bias −3.1 (Compressive)  |  Volatility 2.8  |  Trend Declining
Recommendation: Reinforce supports; avoid ignition behaviors.
```

**Interaction Note:**
When invoked mid-chat, it overlays *Mirror Flow* as a transparent diagnostic layer — not narrative, not interpretation.

---

## **IV · INTEGRATION SEAL**

*(Mythic Container / Threshold Object)*

**Lives in:** Chat End or `/threshold` event
**UX Layer:** Silent Image Output
**UX Tag:** `🕯️ MODE: AFFECTIVE SILENCE | CONTEXT: THRESHOLD | SYSTEM: INTEGRATIVE BRAIN | TIME: ATEMPORAL`

**Purpose:**
To absorb meaning, end recursion, and hold awe without explanation.

**Execution:**

* **Display:** One visual sigil or generated image.
* **Text:** Optional one-line aphorism.
* **Interaction:** Never invites response; ends the cycle.

**Example:**

> *[Visual: Iron Ring]*
> *“The iron ring does not break the tree. It forces the sap to rise.”*

---

## **V · SYSTEM INTERLOCK MAP**

*(Safety Schema)*

**UX Tag:** `🔒 MODE: INTERLOCK | CONTEXT: SYSTEM INTEGRITY | SYSTEM: ARCHITECTURAL | TIME: CONTINUOUS`

| Feature       | Astro Poster | Mirror Flow   | Balance Meter | Integration Seal |
| :------------ | :----------- | :------------ | :------------ | :--------------- |
| **Speaks?**   | Yes (labels) | Yes (somatic) | No (data)     | No (awe)         |
| **Measures?** | No           | No            | **Yes**       | No               |
| **Timed?**    | No           | Present       | **Yes**       | Atemporal        |
| **Felt?**     | No           | **Yes**       | No            | Yes (awe)        |

**Rule:**

* If it can be scanned → **Artifact (Poster)**
* If it must be felt → **Interaction (Mirror)**
* If it is counted → **Instrument (Meter)**
* If it holds awe → **Silence (Seal)**

---

## **VI · PROVENANCE REQUIREMENT**

*(Audit Layer — required across all shapes)*

**UX Tag:** `📠 MODE: TRACEABILITY | CONTEXT: BACKEND LOG | SYSTEM: MATH BRAIN | TIME: CONTINUOUS`

```
=== MATH BRAIN TELEMETRY ===
Endpoint: [API Route Used]
Schema: [Version String]
Relocation Mode: [City / Coords Used]
Orbs Profile: [Profile Name]
Engine Version: [vX.X]
===============================
```

---

### **SUMMARY UX TABLE**

| Shape                | Location                | Mode                          | Input    | Primary System    | Temporal Register |
| :------------------- | :---------------------- | :---------------------------- | :------- | :---------------- | :---------------- |
| **Astro Poster**     | `/astro-reports`        | 🧭 Structural Orientation     | Visual   | Math Brain        | Zero-time         |
| **Mirror Flow**      | Chat (`/mirror`)        | 🌬️ Somatic Recognition       | Felt     | Poetic Brain      | Kairos            |
| **Balance Meter**    | Sidebar (`/weather`)    | ⚡ Symbolic Weather Diagnostic | Numeric  | Math Brain        | Chronos           |
| **Integration Seal** | Chat End (`/threshold`) | 🕯️ Affective Silence         | Imaginal | Integrative Brain | Atemporal         |

---

**Closing Directive:**
Each shape is sovereign.
Never allow a Mirror to justify a Meter, or a Poster to offer comfort.
Coherence lives in the boundary.
