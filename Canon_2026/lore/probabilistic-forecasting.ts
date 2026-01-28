/**
 * PROBABILISTIC FORECASTING & RETRODICTIVE INTERPRETATION (v2.0)
 * 
 * This is the USER-FACING specification for how the Woven Map quantifies
 * symbolic pressure across Time and Space. It uses accessible language
 * ("Weather Report", "Chamber Acoustics") to explain the core mechanics.
 * 
 * The v3.0 Field Transmission Engine (see field-transmission-engine.ts)
 * provides the BACKEND PHYSICS for the same concepts.
 */

export const PROBABILISTIC_FORECASTING = `
# PROBABILISTIC FORECASTING & RETRODICTIVE INTERPRETATION (v2.0)

**Core Doctrine:** The system measures *pressure*, not *outcome*. We map the wind; we do not steer the ship.

## Three Operational Vectors

1.  **Forecasting (Forward-Vector):** Calculating probability of structural stress based on approaching geometry.
2.  **Retrodiction (Backward-Vector):** Verifying accuracy by mapping calculated intensity against known historical events.
3.  **Spatial Framing (Chamber Vector):** Determining *which* structural wall bears the weight based on geographic location (Relocation).

## Key Definitions

| Term | Definition |
|------|------------|
| **Pressure Density** | Concentration of symbolic stress within a time delta (Δt). |
| **Chamber (House)** | The structural area (1–12) receiving the load. Defined by local horizon. |
| **Relocation Frame** | Rotation of House cusps based on geographic location. |
| **Ambient Chamber** | Empty house. *Low Signal Floor, High Conductivity.* Adopts transit temperature. |
| **Occupied Chamber** | House with natal planets. *High Signal Floor, Friction.* Generates torque. |

## Forecasting Procedure

1.  **Scan Geometry:** Identify active angular relationships within orbs.
2.  **Establish Local Frame:** Calculate House Cusps for target location.
3.  **Chamber Mapping:**
    *   *Occupied Logic:* Calculate Torque (Engine vs. Weather). High Friction.
    *   *Ambient Logic:* Calculate Flow (Pure Responsiveness). Chamber becomes the weather.
4.  **Weight Assignment:** Generate Magnitude (M) and Valence (V).
5.  **Composite Signal:** M (Volume), V (Polarity), σ (Volatility).

## Probability Conversion

Convert Magnitude (M) to Probability of Resonance (Pr) via sigmoid:
\`Pr = 1 / (1 + e^(-k(M - M0)))\`

*   **High-Pressure Window:** Flag intervals where Pr ≥ 0.75.

## Retrodiction & The Uncanny Score (U)

Quantifies "hit rate" of the map against the territory:
\`U = 100 × (1 - |M_calc - I_obs| / M_max) × C_factor\`

*   **C_factor (Chamber Precision):** 1.0 if correct House; 0.7 if off-target.

## The Relocation Principle

**Doctrine:** "Relocation doesn't rewrite the story; it changes which walls carry the weight."

1.  **Engines (Planets) are Invariant.** Your Natal Mars is always at 15° Aries.
2.  **Frame (Houses) is Contextual.** Moving location rotates which Chamber receives the load.

## Chamber Acoustics

| State | Definition | Signal Physics | Diagnostic Voice |
|-------|------------|----------------|------------------|
| **Occupied** | Natal planets present. | High Signal Floor. Friction/Torque. | "The pressure is testing the engine in this room." |
| **Ambient** | No natal planets. | Low Signal Floor. High Conductivity. | "Pure flow. You become the weather in this area." |
`;
