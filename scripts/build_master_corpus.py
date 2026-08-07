#!/usr/bin/env python3
"""Build a deterministic, single-file Raven Calder master corpus.

The generated scroll is intentionally self-contained. The bundled live canon is
placed first and emitted once; older research/development material follows as
clearly classified provenance. Exact byte-for-byte duplicates are represented
once and cross-referenced.

Usage:
    python3 scripts/build_master_corpus.py \
        --output RavenCalder_Corpus_Master_2026-08-07.md \
        --label-date 2026-08-07 \
        --anchor 0f8fcf6a2e6f53b01c519e2773128075859eef9c
"""

from __future__ import annotations

import argparse
import hashlib
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE_CANON = "docs/canon/full-canon.mdx"

SOURCE_EXTENSIONS = {
    ".md",
    ".mdx",
    ".txt",
    ".yaml",
    ".yml",
    ".ts",
}

EXCLUDED_PREFIXES = (
    ".git/",
    ".github/",
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    "scripts/",
)

EXCLUDED_BASENAMES = {
    "RavenCalder_Corpus_Unified_Guide.md",
}


def git_tracked_files() -> list[str]:
    proc = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        check=True,
        stdout=subprocess.PIPE,
    )
    return [p for p in proc.stdout.decode("utf-8").split("\0") if p]


def is_source(path: str, output_name: str) -> bool:
    normalized = path.replace("\\", "/")
    name = Path(normalized).name

    if normalized == output_name:
        return False
    if name.startswith("RavenCalder_Corpus_Master") and name.endswith(".md"):
        return False
    if name in EXCLUDED_BASENAMES:
        return False
    if any(normalized.startswith(prefix) for prefix in EXCLUDED_PREFIXES):
        return False

    # full-canon.mdx declares itself the entire bundled GPT Operating Canon.
    # Emitting the split canon pages as well would duplicate live rules and
    # overweight them in model context, so the bundle is the sole live-canon
    # source in the master scroll.
    if normalized.startswith("docs/canon/") and normalized != LIVE_CANON:
        return False

    return Path(normalized).suffix.lower() in SOURCE_EXTENSIONS


def classification(path: str) -> str:
    if path == LIVE_CANON:
        return "LIVE CANON"
    if path.startswith("docs/protocols/"):
        return "CURRENT PROTOCOL / META"
    if path.startswith("docs/"):
        return "CURRENT DOCUMENTATION"
    return "ARCHIVE / PROVENANCE"


def priority(path: str) -> tuple[int, str]:
    if path == LIVE_CANON:
        return (0, path.lower())
    if path.startswith("docs/protocols/"):
        return (1, path.lower())
    if path.startswith("docs/"):
        return (2, path.lower())
    return (3, path.lower())


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def section_language(path: str) -> str:
    suffix = Path(path).suffix.lower()
    return {
        ".ts": "typescript",
        ".yaml": "yaml",
        ".yml": "yaml",
    }.get(suffix, "")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        default="RavenCalder_Corpus_Master.md",
        help="Repository-relative output path.",
    )
    parser.add_argument(
        "--label-date",
        default="",
        help="Human-readable corpus date, preferably YYYY-MM-DD.",
    )
    parser.add_argument(
        "--anchor",
        default="",
        help="Optional source commit/ref recorded in the header.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if the existing output differs from a fresh build.",
    )
    return parser.parse_args()


def build(output_name: str, label_date: str, anchor: str) -> str:
    tracked = git_tracked_files()
    sources = sorted(
        (p for p in tracked if is_source(p, output_name)),
        key=priority,
    )

    records: list[tuple[str, bytes, str]] = []
    fingerprint = hashlib.sha256()
    for path in sources:
        data = (ROOT / path).read_bytes()
        digest = sha256(data)
        records.append((path, data, digest))
        fingerprint.update(path.encode("utf-8"))
        fingerprint.update(b"\0")
        fingerprint.update(digest.encode("ascii"))
        fingerprint.update(b"\n")

    date_line = label_date or "unspecified"
    anchor_line = anchor or "working tree"
    corpus_fingerprint = fingerprint.hexdigest()

    parts: list[str] = [
        "# Raven Calder — Master Corpus",
        "",
        f"**Corpus date:** {date_line}",
        f"**Source anchor:** `{anchor_line}`",
        f"**Corpus fingerprint (SHA-256):** `{corpus_fingerprint}`",
        f"**Tracked source documents:** {len(records)}",
        "",
        "## Authority and precedence",
        "",
        "This scroll is a complete working corpus, not a claim that every historical statement remains operative.",
        "",
        "When sources conflict, apply this order:",
        "",
        f"1. `{LIVE_CANON}` — **LIVE CANON**. This is the bundled GPT Operating Canon and the only live-canon copy emitted in this scroll.",
        "2. Current material under `docs/protocols/` and other current documentation — operating/deployment guidance unless it conflicts with live canon.",
        "3. Remaining corpus documents — **ARCHIVE / PROVENANCE**: research history, development record, lexicon, examples, and prior doctrine.",
        "",
        "A superseded historical rule remains useful evidence of how Raven developed, but it does **not** override explicit live canon.",
        "",
        "## Build discipline",
        "",
        "- `docs/canon/full-canon.mdx` declares itself the entire bundled GPT Operating Canon; split canon pages are therefore excluded to prevent semantic duplication and overweighting.",
        "- Source paths are preserved verbatim in section headers.",
        "- Each source is stamped with its classification and SHA-256 digest.",
        "- Generated master files, the deprecated unified guide, build scripts, CI files, and dependency/build directories are excluded to prevent recursive contamination.",
        "- Exact byte-for-byte duplicate source files are emitted once and later duplicates point to the first occurrence.",
        "- Sources are ordered deterministically: live canon, current protocols, current documentation, then archival/provenance material.",
        "",
        "## Source manifest",
        "",
        "| # | Class | Source | Bytes | SHA-256 |",
        "|---:|---|---|---:|---|",
    ]

    for index, (path, data, digest) in enumerate(records, start=1):
        parts.append(
            f"| {index} | {classification(path)} | `{path}` | {len(data)} | `{digest}` |"
        )

    parts.extend(["", "---", "", "# Corpus", ""])

    seen_digest: dict[str, str] = {}
    previous_class = ""
    for index, (path, data, digest) in enumerate(records, start=1):
        source_class = classification(path)
        if source_class != previous_class:
            parts.extend(
                [
                    f"# {source_class}",
                    "",
                ]
            )
            if source_class == "ARCHIVE / PROVENANCE":
                parts.extend(
                    [
                        "> Historical/reference material below is non-operative where it conflicts with LIVE CANON.",
                        "",
                    ]
                )
            previous_class = source_class

        parts.extend(
            [
                f"## {index}. `{path}`",
                "",
                f"**Classification:** {source_class}",
                f"**SHA-256:** `{digest}`",
                "",
            ]
        )

        if digest in seen_digest:
            first_path = seen_digest[digest]
            parts.extend(
                [
                    f"_Exact duplicate of `{first_path}`; content emitted there._",
                    "",
                    "---",
                    "",
                ]
            )
            continue

        seen_digest[digest] = path
        text = data.decode("utf-8", errors="replace")
        language = section_language(path)

        # Markdown/MDX/TXT are inserted as native prose so headings remain useful
        # in the one-file scroll. YAML/TS are fenced to prevent syntax collisions.
        if language:
            parts.append(f"```{language}")
            parts.append(text.rstrip("\n"))
            parts.append("```")
        else:
            parts.append(text.rstrip("\n"))

        parts.extend(["", "---", ""])

    return "\n".join(parts).rstrip() + "\n"


def main() -> int:
    args = parse_args()
    output = ROOT / args.output
    rendered = build(args.output, args.label_date, args.anchor)

    if args.check:
        if not output.exists() or output.read_text(encoding="utf-8") != rendered:
            print(f"OUT OF DATE: {args.output}")
            return 1
        print(f"OK: {args.output}")
        return 0

    output.write_text(rendered, encoding="utf-8")
    size = output.stat().st_size
    print(f"Wrote {args.output} ({size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
