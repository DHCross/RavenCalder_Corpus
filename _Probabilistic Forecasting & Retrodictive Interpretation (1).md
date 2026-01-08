# **PROTOCOL: Probabilistic Forecasting & Retrodictive Interpretation**

System Version: 2.2 (Technical Standard)  
Component: Diagnostic Engine / Temporal Logic / Spatial Framing  
Status: Operational

## **1.0 Purpose and Scope**

This protocol defines the mechanics by which the **Woven Map** quantifies symbolic pressure across both **Time** and **Space**. It replaces deterministic prediction ("what will happen") with diagnostic probability ("where the load will fall").

The system operates on three vectors:

1. **Forecasting (Forward-Vector):** Calculating the probability of structural stress based on approaching geometry.  
2. **Retrodiction (Backward-Vector):** Verifying system accuracy by mapping calculated field intensity against known historical events.  
3. **Spatial Framing (The Chamber Vector):** Determining *which* structural wall bears the weight based on the subject's geographic location (Relocation).

**Core Doctrine:** The system measures *pressure*, not *outcome*. We map the wind; we do not steer the ship.

## **2.0 Definitions**

| Term | Definition |
| :---- | :---- |
| **Forecasting** | The computation of future *Field Pressure Probability* based on the intersection of transiting engines (planets) and natal structure (anchors). |
| **Retrodiction** | The retrospective computation of field intensity for a specific past coordinate (time/location) to validate symbolic correspondence with empirical events. |
| **Pressure Density** | The quantitative concentration of symbolic stress within a specific time delta (Δt), derived from the *Composite Signal* magnitude. |
| **Chamber (House)** | The specific structural area (1–12) receiving the load. Defined by the local horizon (Location). |
| **Relocation Frame** | The rotation of the House cusps based on geographic location, altering which Chambers receive planetary pressure. |
| **Ambient Chamber** | A House containing no natal planets. Physics: *Low Signal Floor, High Conductivity.* It adopts the temperature of the transit. |
| **Occupied Chamber** | A House containing natal planets. Physics: *High Signal Floor, Friction.* It generates torque when the transit meets the resident engine. |

## **3.0 Forecasting Procedure (The Forward Vector)**

### **3.1 Input Acquisition**

The engine requires the following SymbolicMoment data structure:

* **Natal Anchors:** Blueprint coordinates (Planets) in Absolute Ecliptic Longitude.  
* **Geographic Reference:** The subject's current or target location (Lat/Lon) to define the *Local Frame* (Houses).  
* **Temporal Range:** Start Date ($t\_{start}$), End Date ($t\_{end}$), and Resolution Step.  
* **Transiting Engines:** Real-time positions of planetary bodies relative to the Natal Anchors.

### **3.2 Computation Logic**

For each time step $t$ in the range:

1. **Scan Geometry:** Identify all active angular relationships between *Transiting Engines* and *Natal Anchors* within active orbs.  
2. **Establish Local Frame:** Calculate the House Cusps (Chambers) for the target location.  
3. **Chamber Mapping (Load Distribution):**  
   * Map the active geometry to specific *Chambers* (Houses 1–12).  
   * **Occupied Logic:** If the Chamber contains Natal Anchors, calculate *Torque* (Engine vs. Weather). High Friction.  
   * **Ambient Logic:** If the Chamber is empty, calculate *Flow* (Pure Responsiveness). The Chamber *becomes* the weather.  
4. **Weight Assignment:** Apply the *Balance Meter Weighting Standard* (Appendix A) to generate Magnitude ($M$) and Valence ($V$).  
5. **Composite Signal Derivation:**  
   * **Magnitude (**$M$**)**: Total volume of pressure.  
   * **Directional Bias (**$V$**)**: Polarity (Inward/Outward).  
   * **Volatility (**$\\sigma$**)**: Rate of change.  
6. **SFD Calculation:** Determine the *Support–Friction Differential* (Appendix B).

### **3.3 Probability Conversion**

Convert the normalized Magnitude ($M$) into a *Probability of Resonance* ($P\_r$) using a sigmoid activation function:

$$P\_r \= \\frac{1}{1 \+ e^{-k(M \- M\_0)}}$$

### **3.4 Threshold Flagging & Output**

* **High-Pressure Window:** Flag intervals where $P\_r \\ge 0.75$.  
* **Output Object:**  
  {  
    "window\_type": "COMPRESSION",  
    "start": "ISO\_DATE",  
    "end": "ISO\_DATE",  
    "peak\_magnitude": 4.8,  
    "dominant\_bias": "NEGATIVE\_CONSTRICTIVE",  
    "target\_chamber": "10th\_HOUSE\_CANOPY",  
    "chamber\_physics": "OCCUPIED\_FRICTION",  
    "active\_geometry": \["Saturn\_Square\_Sun"\]  
  }

## **4.0 Retrodiction (The Backward Vector)**

### **4.1 Historical Selection**

Select a target event with empirically verifiable intensity.

* *Input:* Event\_Timestamp, Event\_Location (Critical for House precision).

### **4.2 Computation & Comparison**

1. Run the *Balance Meter* protocol for the historical coordinates.  
2. **Chamber Audit:** Verify if the pressure registered in the *thematically correct* Chamber (e.g., 10th House for a career crisis, 4th House for a home flood).  
3. Capture metrics: $M\_{calc}$, $V\_{calc}$.

### **4.3 The Uncanny Score ($U$)**

Quantify the "hit rate" of the map against the territory, penalizing for Chamber misses:

$$U \= 100 \\times \\left( 1 \- \\frac{|M\_{calc} \- I\_{obs}|}{M\_{max}} \\right) \\times C\_{factor}$$

* $C\_{factor}$ **(Chamber Precision):** $1.0$ if the load hit the correct House; $0.7$ if the load was general but off-target.

## **5.0 Mathematical Appendix (Technical Standard)**

*(See previous version for Signal Weights and SFD formulas. Unchanged.)*

## **6.0 The Relocation Principle (Frame Rotation)**

**Doctrine:** "Relocation doesn't rewrite the story; it changes which walls carry the weight."

The Woven Map separates the **Invariant** from the **Contextual**:

1. **The Engines (Planets) are Invariant.** \* Your Natal Mars is always at $15^\\circ$ Aries. This does not change when you move. The engine remains the engine.  
2. **The Frame (Houses) is Contextual.**  
   * The Earth's rotation relative to your specific location defines the *Chambers*.  
   * Moving location **rotates the frame**, shifting which Chamber (Life Area) receives the planetary load.

Diagnostic Implication:  
A transit hitting the Store (2nd House) in New York may rotate to hit the Gate (1st House) in London.

* **Forecasting:** Must calculate based on the *current/projected* location.  
* **Retrodiction:** Must calculate based on the *event* location.

## **Appendix C: Chamber Acoustics**

| State | Definition | Signal Physics | Diagnostic Voice |
| :---- | :---- | :---- | :---- |
| **Occupied** | Chamber contains Natal Planets. | **High Signal Floor.** The room is already loud. Incoming weather creates *Friction* or *Torque*. | "The pressure is testing the engine in this room." |
| **Ambient** | Chamber contains no Natal Planets. | **Low Signal Floor.** High Conductivity. The room adopts the temperature of the transit. | "Pure flow. You become the weather in this area." |

## **7.0 Summary of Integration**

This protocol forms the "temporal and spatial lungs" of the Woven Map system:

* **Forecasting** estimates **when** and **where** (which Chamber) tension accumulates.  
* **Relocation** acknowledges that the "where" shifts with the subject's stance.  
* **Retrodiction** validates that the geometry aligned with the lived experience in both time and place.