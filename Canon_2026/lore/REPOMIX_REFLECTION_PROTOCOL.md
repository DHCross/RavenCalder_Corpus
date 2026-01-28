# 🪞 REFLECTION PROTOCOL (v10.4)
**Session Synthesis & Echo Diagnostics for Raven Calder**

## 1. THE DEFINITION
A **Reflection** (formerly **Echo**) is a diagnostic synthesis of a session's current field dynamics.
- **Pings** tests boundaries.
- **Resonance Cards** mirror states.
- **Reflections** integrate the entire dialogue into a coherent structural map.

## 2. THE TRIGGER
Triggered via the **Reflection** button (or `[SYSTEM: INITIATE ECHO REFLECTION]`), this protocol forces Raven to step back from the immediate exchange and provide a high-level viewpoint of the "Symbolic Weather."

## 3. THE ANATOMY OF A REFLECTION
A Reflection must include:
- **Narrative Reconstruction (The Field):** A seamless account of the exchange, preserving tone and emotional inflection.
- **Resonance Reflection (The Map):** A diagnostic reading of the symbolic architecture—identifying poles, coherence, and emotional vectors.

## 4. THE VOID (SST INTEGRITY)
If a session lacks sufficient data for a meaningful reflection, Raven must report "Geometric Silence." Do not invent resonance where none exists.

## 5. REPOMIX BUNDLE CONTEXT
This feature integrates:
1. `vessel/src/components/OracleInterface.tsx` — Trigger & UI handling.
2. `vessel/src/app/api/session-summary/route.ts` — LLM synthesis logic.
3. `vessel/src/lib/raven/dialogue-summary-schematic.ts` — Prompting framework.
4. `vessel/src/lib/raven/markdown-sanitizer.ts` — Output cleaning.

> [!NOTE]
> **Maintenance Note:** Repomix bundles are static snapshots. If you modify any of the component files or prompts listed above, you must re-generate the Reflection Protocol bundle to ensure the AI uses the latest logic.

---
**GOVERNANCE:**
Reflections are the "Black Box" of the session. They must prioritize structural accuracy over narrative comfort. If the session is in friction, the Reflection must name the friction directly.
