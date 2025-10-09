# Balance Meter Refactor to v5.0: COMPLETE
---
**Date:** October 9, 2025
**Status:** ✅ COMPLETE & ADOPTED

---

## 1. Summary of Changes

The Balance Meter has been successfully refactored from the multi-channel v1.x/v4.0 architecture to the **v5.0 Two-Axis Model**. This represents a fundamental shift in the system's philosophy, prioritizing **geometric purity** and **traceability** above all else.

The system is now defined by two core, public-facing axes:
1.  **Magnitude (0–5):** The raw intensity of the symbolic field.
2.  **Directional Bias (–5 to +5):** The net directional flow of energy (formerly "Valence").

All canonical documentation has been updated to reflect this new standard.

## 2. Rationale: "The Math Must Keep the Poetry Honest"

The driving force behind this refactor was the need to ensure every metric presented to the user is a direct, falsifiable translation of aspect geometry.

The following components were **removed** from the public model:

*   **Coherence / Volatility:** These metrics were derived from the *statistical distribution* of aspects, not from the aspects themselves. This made them a meta-layer that violated the principle of direct traceability.
*   **SFD (Support-Friction Differential):** This was a complex, composite product with its own weighting system, moving it away from the goal of a pure, simple seismograph.
*   **Balance Channel & Resilience Layer:** These were also complex add-ons that diluted the core model.

By removing these layers, the v5.0 model ensures that every score can be explained by pointing to the specific aspects that produced it.

## 3. Impact on System Layers

*   **MATH BRAIN:** The core calculation is simplified to two direct summations (Magnitude and Directional Bias).
*   **VOICE (Narrative Layer):** Concepts like "stability" or "fragmentation" are no longer quantified with a score. Instead, they are described as **emergent narrative qualities**, informed by non-core, backstage diagnostics like `aspect_count`.
*   **DOCUMENTATION:** All relevant documents, including the core specification, glossaries, and the main corpus, have been updated to reflect the v5.0 standard.

## 4. Key Upgrades Integrated

This refactor also incorporated several "surgical upgrades" to tighten the specification:

*   **Terminology Lock:** "Valence" has been officially replaced with "Directional Bias" to avoid moralistic interpretations.
*   **Traceability Mandate:** All outputs must include a `trace` field listing the top contributing aspects.
*   **Fixed Scaling Baseline:** Prevents score saturation artifacts.
*   **Explicit Conjunction Policy:** Clarifies that conjunctions are unpolarized by default.

This refactor marks a significant milestone in the evolution of the Woven Map project, recommitting it to its foundational principles of clarity, traceability, and architectural purity.