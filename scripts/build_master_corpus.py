#!/usr/bin/env python3
"""Build a deterministic, single-file Raven Calder master corpus.

The generated scroll is intentionally self-contained. Current live canon is
placed first; older research/development material follows as provenance. Exact
byte-for-byte duplicates are represented once and cross-referenced.

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

PRIORITY_PATHS = (
    "docs/canon/full-canon.mdx",
    "docs/canon/overview.mdx",
    "docs/protocols/gpt-context-guide.mdx",
)


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
    return Path(normalized).suffix.lower() in SOURCE_EXTENSIONS


def priority(path: str) -> tuple[int, int, str]:
    if path in PRIORITY_PATHS:
        return (0, PRIORITY_PATHS.index(path), path.lower())
    if path.startswith("docs/canon/"):
        return (1, 0, path.lower())
    if path.startswith("docs/protocols/"):
        return (2, 0, path.lower())
    if path.startswith("docs/"):
        return (3, 0, path.lower())
    return (4, 0, path.lower())


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
        "1. `docs/canon/full-canon.mdx` — live GPT Operating Canon.",
        "2. Current material under `docs/canon/` and `docs/protocols/`.",
        "3. Remaining corpus documents as research history, development record, lexicon, examples, and provenance.",
        "",
        "A superseded historical rule remains useful evidence of how Raven developed, but it does **not** override explicit live canon.",
        "",
        "## Build discipline",
        "",
        "- Source paths are preserved verbatim in section headers.",
        "- Each source is stamped with its SHA-256 digest.",
        "- Generated master files, the deprecated unified guide, build scripts, CI files, and dependency/build directories are excluded to prevent recursive contamination.",
        "- Exact byte-for-byte duplicate source files are emitted once and later duplicates point to the first occurrence.",
        "- Canon/protocol sources are ordered before archival and research material; other sources are sorted deterministically by path.",
        "",
        "## Source manifest",
        "",
        "| # | Source | Bytes | SHA-256 |",
        "|---:|---|---:|---|",
    ]

    for index, (path, data, digest) in enumerate(records, start=1):
        parts.append(f"| {index} | `{path}` | {len(data)} | `{digest}` |")

    parts.extend(["", "---", "", "# Corpus", ""])

    seen_digest: dict[str, str] = {}
    for index, (path, data, digest) in enumerate(records, start=1):
        parts.extend(
            [
                f"## {index}. `{path}`",
                "",
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
