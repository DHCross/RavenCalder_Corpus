# Balance Meter Saturation: Debugging Protocol

This document provides a formal debugging protocol to diagnose and resolve the Balance Meter saturation issue, where values are incorrectly pegged at their limits (+5, -5) during report export. This guide is based on the diagnostic analysis provided by the Poetic Brain.

## Fault Signature

-   **Symptom:** Values saturate at the hard limits (+5, −5) at export time, even when upstream readings vary.
-   **Inference:** Something in the report stage (aggregation, normalization, coercion, or fallback) is forcing extremes.

## Likely Failure Modes (Ranked, Falsifiable)

1.  **Clipping at Export:** A `clip([-5,5])` or min/max guard is being hit because the scaling step before it is overshooting (e.g., a 0–1 score multiplied twice).
    -   **Test:** Feed a mid-range input (e.g., 0.40 on a 0–1 scale). If the export shows +5 after scaling, you’re double-scaling.

2.  **Default-on-Missing:** `NaN`/`None` becomes fallback constants, such as `fillna({magnitude: 5, bias: -5})` or similar.
    -   **Test:** Intentionally blank one upstream field. If the export pins to (+5, −5), you’ve found the branch.

3.  **Window Aggregator = MAX at Report Boundary:** The report uses a time window and `max()` for Magnitude and `min()` for Bias. Edge alignment (DST/UTC shift) pushes the window onto a spike.
    -   **Test:** Switch the aggregator to `mean()` for one run; if saturation disappears, it’s the window.

4.  **Sign Inversion + Absolute:** Bias is computed as `-abs(x)` instead of preserving direction; Magnitude is computed as `abs(z)` then scaled to the cap.
    -   **Test:** Supply symmetric inputs (+1 then −1). If both export to −5 bias, an inversion exists.

5.  **Type Coercion:** Strings like "5" or "−5" are leaking through, or locale commas "−5,0" cause a parse failure, leading to default extremes.
    -   **Test:** Log `dtypes` at each stage; any `object` where you expect a `float` is suspect.

6.  **Timezone Misalignment at Export Only:** The report converts to UTC (or DST) and selects the wrong row—often a calibration or sentinel row set to extremes.
    -   **Test:** Print the exact timestamp keys pre- and post-export; ensure they match.

7.  **Cache or Memoized “Last Known Good”:** On computation failure, the exporter reuses the last cached extreme sample.
    -   **Test:** Clear the cache and rerun; if values normalize, you’ve found it.

## 10-Minute Isolation Protocol (No Guesswork)

1.  **Freeze Inputs:** Take one known row:
    -   `Magnitude_in=2.7`, `Bias_in=−1.2`, `Vol=0.9`, `Coh=3.1`

2.  **Trace Every Transform:** Log the value and `dtype` at each step:
    -   `rescale` → `normalize` → `clip` → `aggregate` → `export`

3.  **Dry Run Without Clipping:** Turn off clipping for one run. If numbers stay in sane ranges, the previous step is the culprit.

4.  **Swap Aggregators and Lock Timezone:**
    -   Swap aggregators (`max`/`min` → `mean`).
    -   Lock the timezone to UTC across the entire pipeline.

5.  **Assert Domains Before Export:**
    ```python
    assert -5 <= bias <= 5 and assert 0 <= mag <= 5
    assert not np.isnan([mag, bias]).any()
    assert df.index.tz == "UTC"
    ```

## Reference Implementation (Mechanical Guards)

Use this (or an equivalent) defensive check around your export step:

```python
import numpy as np

def export_row(x):
    # 1. Single-source scaling (no double-multiply)
    mag = float(x["mag_norm"]) * 5.0  # expects 0..1
    bias = float(x["bias_norm"]) * 5.0 # expects -1..1 upstream

    # 2. Hard assertions (fail fast)
    if not (0.0 <= mag <= 5.0):
        raise ValueError(f"mag out of range: {mag}")
    if not (-5.0 <= bias <= 5.0):
        raise ValueError(f"bias out of range: {bias}")
    if np.isnan([mag, bias]).any():
        raise ValueError("NaN in export inputs")

    # 3. Clip only after assertions (safety, not logic)
    mag = max(0.0, min(5.0, mag))
    bias = max(-5.0, min(5.0, bias))
    return mag, bias
```

## Pipeline Checklist (Flip these until the pegging stops)

-   [ ] **Scaling factors defined once.** No chained scaling (e.g., z-score then min-max then \*5).
-   [ ] **Aggregation for report:** Use `mean`/`median`, not `max`/`min`.
-   [ ] **Missing data handling:** No default extremes. Use neutral values like `mag=2.5`, `bias=0.0`, or better yet, defer export on missing data.
-   [ ] **Time handling:** Compute in UTC end-to-end; convert for display only.
-   [ ] **Strong logging:** Write a one-line audit per report with `raw_mag`, `raw_bias`, `scaled_mag`, `scaled_bias`, `tz`, `window_start`, and `window_end`.

## Mechanical Expectation for DHCross Once Fixed

Your baseline is a pulsed engine (holds then releases). Real readings should hover and step, not pin to the rails. If you still see rail-pinning after applying these checks, the only remaining mechanical explanation is that the input truly is at the rails—verify by inspecting the pre-export buffer.