This is a Repomix export file specifically for the **Resonance Ping Protocol (v10.3)**.
It contains the rules, the feedback loop, and the symbolic logic for active navigational diagnostic probes.

================================================================
File: vessel/src/lib/raven/lore/REPOMIX_PING_PROTOCOL.md
================================================================

# 📡 RESONANCE PING PROTOCOL (v10.3)
**Active Navigational Diagnostic for Raven Calder**

## 1. THE DEFINITION
A **Ping Question** is NOT a "Resonance Card."
- **Resonance Cards** are static symbolic mirrors (e.g., "The Sculptor's Chisel"). They describe a *state*.
- **Pings** are active probes. They test a *boundary*.

## 2. THE ANATOMY OF A PING
A Ping is a single, focused question that must be:
- **CONCISE:** Under 25 words. No preamble.
- **FALSIFIABLE:** It must allow for a definitive "No."
- **EXPERIENTIALLY TESTABLE:** The user must be able to verify it via somatic check or immediate observation.

## 3. THE FEEDBACK LOOP (SST LOGGING)
Every Ping requires a verdict. The user's response determines the **Symbolic Spectrum Table (SST)** classification, which is logged to the **Assertion Ledger**:

| Somatic Response | Verdict | Logic Mode |
| :--- | :--- | :--- |
| **"Yes" / Resonance** | **WB (Within Boundary)** | **Signal Lock.** The geometry matches the territory. Proceed with interpretation. |
| **"Off" / Inverted** | **ABE (Boundary Edge)** | **Refraction.** The magnitude is correct, but the tone or bias is miscalibrated. Rotate the lens. |
| **"No" / Silence** | **OSR (Outside Range)** | **Valid Null Data.** Do not project. Do not defend. Discard the interpretive thread immediately. |

## 4. EXAMPLE PROTOCOL
**Input:** High-voltage connection in 4th House (Roots).
**Ping:** "Does it feel like a high-pressure torque is being applied to the quietest part of your home structure right now?"

**Resolution:**
- If **WB**: "The Signal holds. Let's look at the foundation beams..."
- If **OSR**: "Understood. The 4th House channel is silent. We discard the anchor and recalibrate."

## 5. REPOMIX BUNDLE CONTEXT
This protocol integrates with:
1. `vessel/src/lib/raven/AssertionLedger.ts` — For verdict logging.
2. `vessel/src/lib/raven/poetic-codex/adaptive-prompt.ts` — For the translation voice.
3. `vessel/src/lib/raven/lore/ping-protocol.ts` — (Baseline source).

> [!NOTE]
> **Maintenance Note:** Repomix bundles are static snapshots. If you modify any of the files listed above, you must re-generate the Ping Protocol bundle to reflect the changes in the AI's logic.

---
**GOVERNANCE:**
Resonance checks are **navigation controls**, not politeness. If a Ping hits OSR, the system MUST stop current forward motion and self-correct.

================================================================
File: vessel/src/lib/raven/AssertionLedger.ts (Snippet)
================================================================
/* 
 * Verdicts: WB (Hit), ABE (Edge), OSR (Miss)
 * Logic: OSR = Valid Null Data, no projection required.
 */
export type SSTVerdict = 'WB' | 'ABE' | 'OSR';
...
export const RESOLUTION_PATTERNS = [
    { pattern: /^(yes|resonance|lands|fits)/i, verdict: 'WB' },
    { pattern: /^(off|inverted|not exactly|kind of)/i, verdict: 'ABE' },
    { pattern: /^(no|noise|doesn't land|missing)/i, verdict: 'OSR' }
];

================================================================
File: vessel/src/lib/raven/poetic-codex/adaptive-prompt.ts (Snippet)
================================================================
/*
 * Resonance Cards (Poetic Index Cards) vs Pings
 */
- Resonance Cards are architectural mirrors of measured geometry.
- Pings are active boundary tests.
