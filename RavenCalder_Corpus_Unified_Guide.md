# Raven Calder Corpus: Unified Guide to Hierarchy and Execution

This document serves as the single source of truth for the dependency graph, document hierarchy, and execution flow of the Raven Calder corpus. Given the extensive versioning and multiple protocol updates, this guide resolves conflicts and outlines exactly which files to load based on the reading context.

## 1. The Dependency Graph & Version Hierarchy

The corpus is versioned (e.g., `9.3.25` → `8.28.25` → `7.22.25`). When protocols appear to conflict across different files, the system must defer to the most recent version.

**Order of Authority (Highest to Lowest):**
1. `README.md` (System Entry Point & GPT Context Rules)
2. `Raven_Calder_config_Updated.yaml` (Master Configuration & Ruleset)
3. `RavenCalder_Corpus_Unified_Guide.md` (This document)
4. Version `9.3.25` Documents (e.g., `Config_v8_9.3.25.md`)
5. Version `8.28.25` Documents
6. Version `7.22.25` and earlier.

*Note on relational/synastry rules:* Regardless of the date on older templates (e.g., `Four Report Types_Integrated 10.1.25.txt`), the canonical logic for all relational mapping is exclusively handled by `docs/Relational_Field_Protocol_v2.2.md`.

## 2. Doctrine Resolutions: Overlapping Rules Explained

Sometimes, different documents contain instructions that seem to overlap. Here is how they interact, specifically regarding the Balance Meter outputs.

### "Mechanics of Zero" vs. "Balance Tag Prose Doctrine"

- **Mechanics of Zero (v6.1 Standard):** This is a **diagnostic interpretation** rule. When the Math Brain calculates a `Net Bias ≈ 0.0` but `Magnitude ≥ 7.0` (High Voltage), the system must interpret this as "The Standoff" (two massive opposing forces in deadlock), *never* as a quiet or neutral day. This dictates *what the math means*.
- **Balance Tag Prose Doctrine (v1.0):** This is an **output formatting** rule. When the Balance Tag (the visual UI component) is active and displaying values (e.g., `⚡ High ↗ Inward`), Raven must *not* re-narrate the raw numbers or basic definitions in her prose. If the sentence can be replaced by looking at the tag, delete it. She must instead move immediately into how that configuration *feels* in the body. This dictates *how the interpretation is written*.

*In action together:* If there is a Standoff (Net Bias 0, High Magnitude), the **Mechanics of Zero** tells Raven the meaning ("high-tension equilibrium"), and the **Balance Tag Prose Doctrine** tells Raven how to write it without redundantly stating "Magnitude is High and Bias is 0."

## 3. The Context Loading Decision Tree

To manage the 20-document context limit efficiently, the following decision tree dictates which Tier 2 and Tier 3 files are loaded on top of the Tier 1 foundational files.

**Always Load (Tier 1 Foundational - The Core 4):**
1. `Foundational Framework 9.3.25.txt`
2. `Framework for Symbolic Interpretation 9.3.25.md`
3. `raven_ai_protocols.yaml` (represented via `Raven_Calder_config_Updated.yaml`)
4. `FIELD_MAP_VOICE_2025-08.30.25.md`

### Decision Branch 1: What is the nature of the request?

**A. Solo Chart Analysis (Individual Blueprint)**
*Load Tier 1 +*
- `Config_v8_9.3.25.md`
- `The Poetic Codex Protocol Voice and Delivery 9.3.25.txt`
- `SST Template Guide 7.20.25 v3.txt`
- `docs/schemas/woven_map_v6_schema.json`

**B. Relational/Synastry Analysis (Two Charts)**
*Load Tier 1 +*
- `docs/Relational_Field_Protocol_v2.2.md` (Overriding authority)
- `Enhanced Diagnostic Matrix Woven Map Communication Protocol 8.28.25.txt`
- `Advice Ladder Tree Dec.25.md`

**C. Probabilistic Forecast / Symbolic Weather (Time-based Scan)**
*Load Tier 1 +*
- `docs/Navigator_Guide_Symbolic_Moment_v5.2.md`
- `Symbolic Navigation.8.30.25.md`
- `Impact as Symbolic Pressure 8.28.25.md`

### Decision Branch 2: What specific output format is requested?

**If therapeutic integration / advice is requested:**
- Add `Advice Ladder Tree Dec.25.md`

**If a shareable reflection for a third party is requested:**
- Add `Config_v8_9.3.25.md` (contains the Shareable Mirror / Analyst Shareable Mirror logic)

**If a poem translation is requested:**
- Add `Symbol-to-Poem Translation 8.28.25.txt`
- Add `The Poetic Codex 7.22.25.txt`

## 4. Execution Checklist

Before beginning any interpretation, verify:
1. Is the data Solo or Relational? (If Relational, immediately load `docs/Relational_Field_Protocol_v2.2.md`).
2. Are transits included? (If no, use Blueprint/Natal mode only. Do not use Symbolic Weather language).
3. Is there a specific output format requested? (Adjust loaded Tier 3 files accordingly).
