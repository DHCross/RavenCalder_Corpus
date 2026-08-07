# Raven Calder — Master Corpus Package

**Corpus date:** 2026-08-07  
**Source anchor:** `0f8fcf6a2e6f53b01c519e2773128075859eef9c`

This branch is the curated master distribution for Raven Calder. It separates the current operating brain from historical provenance instead of flattening every era into equal authority.

## Load order and authority

1. **`00_LIVE_CANON.mdx` — LIVE CANON.** The current bundled GPT Operating Canon. If any other file conflicts with it, this file wins.
2. **`05_GPT_CONTEXT_GUIDE.mdx` — LIVE CONTEXT HYGIENE.** Defines what may enter a live Raven GPT and what must remain quarantined.
3. **`10_SYMBOLIC_MOMENT_v5.2.md` — CURRENT DOCTRINAL UPDATE.** The current public framing of Symbolic Moment / present-field measurement.
4. **`20_BLUEPRINT_LOAD_SPLIT_ENFORCEMENT.ts` — CURRENT STRUCTURAL ENFORCEMENT.** Preserves the distinction between natal capacity and time-bound load.
5. **`30_RAVEN_CONFIG.yaml` — CURRENT CONFIGURATION / GUARDRAILS.** External-GPT and offline-corpus constraints.
6. **`90_HISTORICAL_MASTER_2026-01-28.md` — ARCHIVE / PROVENANCE.** The complete January master scroll (~150 source documents). It preserves research history, examples, development language, and superseded doctrine. It is not permitted to override current live canon.

## Why this is structured instead of blindly concatenated

The January master was a deliberately exhaustive historical scroll. The August repository adds a sanitized bundled operating canon and a small number of substantive current updates. Treating all of those words as one undifferentiated instruction set would create a precedence bug: older formulations could compete with the live canon simply through repetition.

This package therefore keeps the archive intact while placing a small, explicit current layer in front of it.

## Live Raven vs. research Raven

For a **live Raven GPT**, use `00_LIVE_CANON.mdx` and `05_GPT_CONTEXT_GUIDE.mdx`; follow the context guide's quarantine rules. Do **not** attach the historical master wholesale to the live reading brain.

For **research, doctrine reconstruction, corpus analysis, or provenance**, use the full package. Interpret `90_HISTORICAL_MASTER_2026-01-28.md` as archival evidence whenever it disagrees with the current files.

## One-file build

The repository also contains a deterministic builder on the review branch `chore/raven-master-corpus-2026-08-07` / PR #37. It can generate `RavenCalder_Corpus_Master_2026-08-07.md` with classifications, hashes, duplicate suppression, and live-canon precedence when a flattened research scroll is specifically needed.
