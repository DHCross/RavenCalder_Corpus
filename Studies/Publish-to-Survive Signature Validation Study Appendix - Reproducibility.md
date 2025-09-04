# Publish-to-Survive Validation — Reproducibility Checklist & Open Items

This appendix enumerates the concrete data, definitions, and artifacts required for independent replication and external review of the Publish-to-Survive validation results. It does not alter findings; it specifies what must be provided to fully reproduce them.

## Required Data & Artifacts
- Dataset: full subject list, inclusion/exclusion rules, and labels with an operational definition of “public vs private release,” coder instructions, and rater details.
- Geometric inputs: natal positions (with house calculations) for all subjects, including time zone normalization and any rectification notes.
- Results bundle: serialized outputs for the reported run(s), including model configs, cross‑validation splits, per‑fold metrics, and calibration bins.

## Metric Definitions (Specify Exact Formulas)
- Total Bias Risk (e.g., 46.7%): factor list, weights, rubric, and a worked example for the reported cohort.
- Alignment score (e.g., 94.25%): exact function mapping ML probabilities and Uncanny scores, aggregation method, and confidence intervals.
- Stability deltas (e.g., 0.0%, 21.7%, avg 10.9%): the underlying quantity (AUC, thresholded hits, or other), with before/after tables per subject.
- Subtype confidence (e.g., 82.4%, 68.8%): derivation from the 15‑point rubric and/or other signals; reconcile with raw ratios (e.g., 14/15 ≠ 82.4% without scaling).

## Algorithmic Transparency
- Geometric Signature (15‑point) rubric: criteria, weights, thresholds, and deterministic scoring examples (Daniel Cross; Trent Reznor).
- Subtype classifier (Broadcaster‑Architect vs Live‑Pressure Loop): explicit differentiators, thresholds, conflict resolution rules, and worked examples.
- House/aspect computation: house system, coordinate system, orb tolerances, and aspect detection procedure.

## ML Pipeline Specifics
- Feature encoding: how signs, degrees, houses, retrogrades, and aspects are encoded (e.g., one‑hot vs circular sin/cos; aspect matrices and orbs).
- Evaluation protocol: exact CV strategy (splits, seeds), class distribution per fold, confidence intervals, calibration metrics (Brier, ECE), and permutation tests.
- Independence and circularity: how validation layers are independent, preregistration or blinding steps, and safeguards against tuning to focal subjects.

## Quantified Limitations
- Power analysis for the reported N and detectable effect sizes at chosen α.
- External validity: performance on held‑out, unseen individuals (if available) and deltas vs. in‑sample.

## Release Checklist
- Data dictionary and label protocol (with inter‑rater agreement where applicable)
- Code version (commit hash), environment, and seeds
- Geometric scoring code and configuration
- ML feature builder and evaluation script
- Results JSON and calibration artifacts

Providing the above enables third‑party replication, alignment verification, and robustness stress‑testing without access to the author’s internal context.

