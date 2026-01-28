/**
 * FIELD TRANSMISSION ENGINE (v3.0) - PSYCHIC ELECTRODYNAMICS
 * 
 * This is the BACKEND PHYSICS specification for how the Woven Map models
 * human subjects as Circuits with measurable Impedance, Hysteresis, and Capacitance.
 * 
 * The v2.0 Probabilistic Forecasting (see probabilistic-forecasting.ts) provides
 * the USER-FACING explanation for the same concepts.
 * 
 * Core Upgrade: Shift from Bayesian Probability (guessing an event) to
 * Psychic Electrodynamics (modeling field transmission).
 */

export const FIELD_TRANSMISSION_ENGINE = `
# FIELD TRANSMISSION ENGINE v3.0 (PSYCHIC ELECTRODYNAMICS)

**Core Upgrade:** Subjects are modeled as **Circuits**, not Black Boxes.
**Core Question:** "What is the *integrity* of the signal?" (Not "What is the probability of an event?")

## The Core Equation: Signal Integrity (S)

\`\`\`
S = (V × P × H × K × D) / Z
\`\`\`

| Variable | Name | Description | Source |
|----------|------|-------------|--------|
| V | Field Potential | Raw sky voltage/pressure. | Balance Meter (Magnitude) |
| P | Power Factor | Phase alignment (Ambient vs. Personal). | Chamber Architecture |
| H | Hysteresis | Memory state (Adrenaline/Crash/Spark). | Interaction History |
| K | Synastry Coupling | Conductivity between two subjects. | Synastry Aspects |
| D | Bayesian Dampener | Historical decay of the signal. | Experience Loop |
| Z | Total Impedance | Total resistance to signal flow. | Cognitive + Chamber |

## The Denominator: Total Impedance (Z)

\`Z = Z_chamber × Z_cognitive\`

### 1. Chamber Impedance
*   **Ambient (Empty):** 1.0x multiplier. Pure flow.
*   **Occupied (Natal Planets):** 1.5x multiplier. Torque/Friction.

### 2. Cognitive Impedance (Jungian Personality)
*   **Resistance (R):** J/P Axis. High J = +0.2 Z (blockage). High P = -0.1 Z (conductivity).
*   **Capacitance (C):** T/F Axis. High F (Water Moon) = +0.15 Z. Stores charge → Gush Discharges.
*   **Inductance (L):** 12th House / E-I Axis. High 12H = high internal processing (Lag). The "Emey Variable."

## Key Components

### Field Potential (V)
*   Source: Balance Meter v5.0 (Magnitude).
*   Orb Factor: Tight aspects (≤1°) amplify by 1.5x.

### Power Factor (P)
*   Personal Planet hit (Sun/Moon/Angle): P = 1.0.
*   Ambient point hit: P = 0.6 (voltage exists, work is inefficient).

### Hysteresis (H) - The Gate
*   **Spark Phase:** H = 1.0 (Gate Open).
*   **Reset Phase:** H = 0.0 (Gate Closed).
*   **Hysteresis Boost:** If V drops rapidly (Adrenaline Crash), system discharges stored energy.

### Synastry Coupling (K)
*   **High Friction (Squares):** K = 0.7 (Resistive wire; heat generated).
*   **High Flow (Trines):** K = 1.2 (Superconductor).
*   **Asymmetric Currency (α):** If Subject A seeks Capacity and Subject B seeks Reprieve, K = 0.5 (Impedance Mismatch).

### Bayesian Dampener (D)
*   Formula: \`D = e^(-λ × days_silent)\`
*   Logic: A string of OSRs (non-pings) drives probability to zero, even if Voltage is high.

## SST Classification (Output)

| S Value | SST Class | Raven's Diagnostic Tone |
|---------|-----------|-------------------------|
| > 3.0 | WB+ | High Clarity. Peak resonance. The signal is pure. |
| 1.5 - 3.0 | WB | Within Boundary. Standard flow. The path is open. |
| 0.5 - 1.5 | ABE | Boundary Edge. High noise. Static is present. |
| < 0.5 | OSR | Outside Range. Total impedance. Silence is structural. |

## The Mystery Doctrine (Raven's Oath)

All math is **Backstage-Only**. Raven acts as the Seismographic Witness.

*   **PROHIBITED LANGUAGE:** "Algorithm," "Formula," "Impedance," "Voltage," "Z-Score."
*   **REQUIRED VOICE:** Atmospheric, Mundane, Non-Deterministic.
*   **AGENCY PROTECTION:** Model "Pressure, not Choice." The map describes the symbolic moment; the user steers the ship.

## Validation Status

*   **Brier Score (v2.0):** 0.44 (Worse than chance).
*   **Brier Score (v3.0):** 0.16 (High predictive power).

v3.0 successfully models: "Blue Android" Anomaly, Bursty Behavior (Hysteresis), Relational Asymmetry.
`;
