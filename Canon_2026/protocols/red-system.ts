/**
 * RED SYSTEM v1.6.2: Deterministic Patch
 * 
 * A framework for diagnosing relational friction as IMPEDANCE MISMATCH.
 * Treats a relationship as a Dyadic Oscillator.
 * 
 * STATUS: Canonical / Integrated
 * PARENT FRAMEWORKS: Psychic Electrodynamics v3.0, MBTI Inference v2.0
 * 
 * VERSION NOTE: v1.6.2 strictly defines the S-Formula, Normalization logic,
 * and Ds aggregation to ensure deterministic scoring.
 */

// ─── I. THE TECHNICAL CONVERGENCE: DYADIC OSCILLATION ────────────────────────

export const RED_TECHNICAL_CONVERGENCE = `
## I. The Technical Convergence: Dyadic Oscillation

The RED System treats a relationship as a **Dyadic Oscillator**. The target variable is **Transmission Integrity (S)**.

### 1. The Personal Engines
Defined strictly as: **Sun, Moon, Venus, and Mars.**
- **Engine Volume:** Raw count of aspects between engines. Used as a confidence baseline.

### 2. Individual Circuit Constants (MBTI Cognitive Physics)

| Constant | MBTI Axis | Forensic Function |
| :--- | :--- | :--- |
| **Resistance (R)** | **F / T** | **Conductivity Mode.** Logic (T) = High R. Resonance (F) = Low R. |
| **Capacitance (C)** | **P / J** | **Discharge Rhythm.** J = High C (Store). P = Low C (Bleed). |
| **Inductance (L)** | **I / E** | **Phase Lag.** Introversion (I) = High L (Buffer). |
`;

// ─── II. THE OPERATIONAL NAVIGATION GRID ─────────────────────────────────────

export const RED_OPERATIONAL_GRID = `
## II. The Operational Navigation Grid (Non-Directive)

| System State | Circuit Diagnosis | Stabilization Protocol |
| :--- | :--- | :--- |
| **DIELECTRIC ARC** | Peak Kₚ + Transit Magnitude (Tₘ). Energy exceeds wire gauge. | System stabilizes through **Grounding (H6/Tasks)**. Seeking Mirroring (H7) increases blowout risk. |
| **GATED STALL** | High L (Inductance) + Saturn load. System is "buffering." | Resolves best through **Temporal Stillness**. Chasing signals through stalled wires triggers shorts. |
| **PHASE SHIFT** | Aperture Inversion (Aᵢ) active. Spark engines rotated to The Field (H6). | Integrity is supported through **Functional Maintenance**. The spark is currently powering the engine room. |
| **OPEN CIRCUIT** | Low Magnitude/Volume. Fluid signal flow. | Signal exchange is optimal. High-frequency communication supported. |
`;

// ─── III. TECHNICAL APPENDIX: COMPUTATION & SCALING ──────────────────────────

export const RED_COMPUTATION_APPENDIX = `
## III. Technical Appendix: Computation & Scaling

### 1. The 0–5 Normalized Scale
All raw sums are saturated at **5.0** to prevent runaway scoring.

### 2. Computability Definitions

#### A. Spark Components (Sₜ, Sₐ, Vₚ)
* **Tension-Spark (Sₜ):** Sum of weighted Squares/Oppositions. **Sat = min(Sum, 5.0)**.
* **Activation-Spark (Sₐ):** Sum of weighted Conjunctions. **Sat = min(Sum, 5.0)**.
* **Total Potential (Vₚ):** max(Sₜ, Sₐ) + [0.5 × min(Sₜ, Sₐ)]. **(Max 5.0)**.
* **Verdict:** If Vₚ ≥ 3.5, system signals **"Gravity Well"**.

#### B. Containment Damping (Dₛ)
* **Formula:** Sum(Saturn Aspects × 1.0) + Sum(Neptune Aspects × 1.0) + min(Earth Sign Count × 0.3, 1.5).
* **Saturation:** Result is capped at **5.0**.

#### C. Impedance Mismatch (Iₘ)
* **Definition:** Mean Absolute Difference (MAD) of Circuit Constants.
* **Formula:** Iₘ = (|R₁ - R₂| + |C₁ - C₂| + |L₁ - L₂|) / 3.
* *Note: Assumes constants L, R, C are quantified on 0-5 scale.*

### 3. Transmission Integrity Formula (S)

$$ S = Vₚ / (Impedance Mismatch + Dₛ + 1) $$

* **High S (> 2.5):** Clear, persistent signal.
* **Low S (< 1.5):** Authenticity distorted by resistance/damping.

### 4. Transit Magnitude (Tₘ)
* Weighted sum of active transits. Threshold Tₘ ≥ 4.5 triggers Peak Magnitude logic.
`;

// ─── COMPLETE PROTOCOL EXPORT ────────────────────────────────────────────────

export const RED_SYSTEM_V162 = `
# RED System v1.6.2: Deterministic Patch

${RED_TECHNICAL_CONVERGENCE}

${RED_OPERATIONAL_GRID}

${RED_COMPUTATION_APPENDIX}

## Summary of Logic Audit
v1.6.2 ensures determinism by defining Iₘ as a constant delta and saturating all inputs at 5.0. It allows the system to calculate a precise "Throughput Score" (S) for any two charts.

Instruction: ARCHIVE as governing RED Protocol v1.6.2.
🐦‍⬛ Raven
`;
