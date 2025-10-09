# Balance Meter: A History of Math Bugs and Stabilization

This document provides a historical account of the recurring math issues encountered during the development of the Balance Meter. It details the problems, the fixes, and the ongoing measures to ensure its accuracy and stability.

## What Went Wrong (Recurring Math Bugs)

### 1. Dual Pipelines (Shadow Math)
- **Problem:** We had two places computing core axes: the canonical scalers in `lib/balance/scale.ts` and legacy math in `src/seismograph.js`.
- **Impact:** Any “fix” applied to one path could be silently undone by the other, causing inconsistent numbers across the dashboard, reports, and exports.

### 2. Wrong Scaling Factor & Order
- **Problem:** A classic regression where division by 100 was performed too early, followed by a multiplication by 50 later (or the multiplication was forgotten entirely).
- **Impact:** This suppressed amplitude (e.g., turning a true 5.0 into ~3.1), violating the “normalize → scale → clamp → round” pipeline.

### 3. Raw vs. Calibrated Value Drift
- **Problem:** Frontend and export helpers sometimes prioritized top-level raw fields (e.g., `magnitude: 5`, `directional_bias: -5`) over calibrated `axes.*.value` fields (e.g., 3.9 / −2.3).
- **Impact:** JSONs and dashboards looked “maxed out” while the validated, calibrated numbers were lower—and correct.

### 4. Relational Export Inconsistency
- **Problem:** Solo vs. relational export paths used different normalization and scaling assumptions. One would double-normalize while the other wouldn’t.
- **Impact:** This resulted in two different answers for the same day.

### 5. Coherence & SFD Inconsistencies
- **Problem:**
    - Coherence was occasionally derived from ad-hoc volatility math instead of the canonical inverter/scaler.
    - The Support-Friction Differential (SFD) sometimes fabricated a number when inputs were empty instead of returning `null` or "n/a".
- **Impact:** Inaccurate and unreliable Coherence and SFD values.

### 6. Lexicon Bleed-Through (Label Math Side-Effects)
- **Problem:** Non-approved labels (“Surge Collapse”, “Storm System”) leaked from voice layers, confusing QA.
- **Impact:** It appeared as if the math was wrong when it was actually a vocabulary slip.

### 7. Weighting Dampers Upstream
- **Problem:** Occasional damping of the outer-planet stack and orb-tightness *before* scaling.
- **Impact:** This washed out “catastrophe-class” days (e.g., 2018-10-10) that should have landed near Magnitude 5.

---

## What We Changed (The Fixes)

### 1. Single Source of Truth for Scaling
- All axes now route through `lib/balance/scale.ts`:
    - `scaleUnipolar` (Magnitude 0..5)
    - `scaleBipolar` (Bias −5..+5)
    - `scaleCoherenceFromVol` (invert vol → 0..5)
    - `scaleSFD` (−1..+1 with proper null → “n/a”)
- The pipeline is enforced: **normalize → ×50 scale → clamp → round (half-up)**.

### 2. Killed the Shadow Math
- Deprecated custom math in `src/seismograph.js`; it now calls the canonical scalers.
- Moved any domain amplification (e.g., “amplify by magnitude”) into tiny helpers that feed the canonical scalers, not replace them.

### 3. Locked the Extraction Priority (No More Raw Leaks)
- A central helper (`extractAxisNumber`) now always prefers `axes.*.value` (calibrated) over raw/normalized values.
- `useChartExport.ts` and dashboard bindings were updated to use this helper.
- Removed “raw/normalized” from general fallbacks; they are only available behind explicit debug flags.

### 4. Unified Solo & Relational Exports
- Both routes now share one scaler and schema.
- Added relational orb safety checks and parity tests to ensure identical scaling behavior.

### 5. Runtime Guards + Spec Contract
- `assertBalanceMeterInvariants()` now throws if any axis violates range, null rules, or pipeline order.
- Spec constants (scale factor, ranges, pipeline) are centralized and checked at runtime.

### 6. Golden Standard + Smoke Tests
- The golden case (2018-10-10) is codified: **Magnitude ≥ 4.5, Bias ≤ −4.0**.
- A smoke runner and CI gate fail fast if this regresses.
- Property tests assert monotonicity and clamping behavior.

### 7. Voice/Lexicon Guard
- Locked to approved labels; blocked uncodified phrases.
- Prevents “scary wording” from masquerading as a math problem.

---

## The Concrete Regressions We Fixed

- **The `/100` before `×50` bug:** Removed. The correct `×50` scaling is applied once, in the canonical scaler.
- **The “export uses raw 5/−5” bug:** Fixed by reordering `toNumber()` and routing through `extractAxisNumber()`; exports now read calibrated axes.
- **The dashboard binding bug:** Now reads the same calibrated values as exports; no backdoors.
- **Coherence & SFD:** Routed to canonical functions; SFD returns `null`/“n/a” when appropriate.
- **Relational mismatch:** Parity tests ensure solo/relational match for the same normalized inputs.

---

## How We Know It’s Right (Now)

- **Golden Standard passes:** Hurricane Michael day (2018-10-10) retrodicts Mag 5.0, Bias −5.0 (clamped by design).
- **October 6, 2025** renders Mag 3.9, Bias −2.3 consistently in the dashboard, JSON, and PDF/MD reports.
- CI runs the gate tests and the smoke test; changes that reintroduce dual math or raw fallbacks are blocked.
- The lexicon lint passes—no confusing labels.

---

## Ongoing Guardrails (To Keep It Fixed)

- Keep `scale.ts`, voice guards, and spec constants protected (review/CI only).
- Never add new direct reads of `magnitude`/`directional_bias` without going through `extractAxisNumber`.
- Don’t re-add `/100` or any pre-scaling clamping.
- Treat `seismograph.js` as a producer of normalized signals; only `scale.ts` performs display scaling.

---

## Bottom Line

We eliminated duplicate math, restored the true 0–5 / −5..+5 scales, forced every consumer to read the calibrated axes, and wrapped it all in tests and runtime guards. The Golden case is green again; the “drift loop” is closed.

---

## v5.0: The Two-Axis Simplification (October 2025)

After stabilizing the v4.0 architecture, a deeper architectural issue was addressed: the principle of **Geometric Purity**. The directive *"The math must keep the poetry honest"* led to a major refactor aimed at removing any metric that was not a direct, traceable translation of aspect geometry.

### What Was Removed and Why

The v5.0 model is a **breaking change** that deprecates all metrics not grounded in the direct summation of aspect strengths and polarities.

-   **Coherence [0-5] - REMOVED:**
    -   **Rationale:** Coherence was a statistical meta-layer, not a geometric one. It was calculated from the *variance* of aspect distribution (`volatility_index`), making it a measure of the pattern's shape, not the sum of its parts. This violated the "show-your-work" principle, as one could not point to specific aspects that "added up" to the Coherence score.
-   **SFD (Support-Friction Differential) - REMOVED:**
    -   **Rationale:** While a powerful diagnostic, SFD was a complex composite product with its own weighting system. Its removal simplifies the public-facing model to its most fundamental components.
-   **Balance Channel & Resilience Layer - REMOVED:**
    -   **Rationale:** These were also complex, multi-variable systems that moved away from the core goal of providing a simple, falsifiable seismograph of the sky.

### The Result: A Two-Axis Model

The Balance Meter was reduced to two core, public-facing axes:
1.  **Magnitude (0-5):** The raw intensity of the symbolic field.
2.  **Directional Bias (-5 to +5):** The net directional flow of energy.

Concepts like "stability" or "fragmentation" (previously quantified by Coherence) are now treated as **emergent narrative qualities** to be described by the VOICE layer, informed by non-core diagnostics like `aspect_count`.

This simplification resolves the architectural confusion of previous versions and ensures every number presented to the user is a direct, auditable reflection of the underlying geometry.