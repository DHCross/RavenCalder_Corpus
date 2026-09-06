"""
raven_layout_engine.py — Canonical Page-Composition Engine for Raven Calder Corpus.

This module owns all reusable ReportLab page-composition machinery for the
The Woven Map / Raven Calder Canonical Reference & Architecture Manual PDF.
It is the authoritative source for:

  • page geometry (letter size, margins, gutters, column width)
  • frame creation & multi-template registration (two-column, single-column, Part-header)
  • controlled single-column ↔ two-column transitions
  • Part/chapter starts (dedicated PartHeader template with banner frame)
  • safe page/column breaks (CondPageBreak tiers)
  • heading protection (SafeKeepTogether, section-start detection)
  • available-space logic & wide-element handling
  • TOC / bookmark support (post-build page resolution + PDF outline)
  • layout QA hooks (column-fill analysis, balance drift, stranded headings)
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    CondPageBreak,
    Frame,
    FrameBreak,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
)
from reportlab.platypus.doctemplate import ActionFlowable, LayoutError


# ════════════════════════════════════════════════════════════════════════════
# 1. PAGE GEOMETRY
# ════════════════════════════════════════════════════════════════════════════

PAGE_W, PAGE_H = letter          # 612 × 792 pt
MARGIN_L = 54.0                   # 0.75"
MARGIN_R = 54.0
MARGIN_T = 54.0
MARGIN_B = 54.0
GUTTER = 20.0                     # ~0.28"

CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R   # 504 pt
CONTENT_H = PAGE_H - MARGIN_T - MARGIN_B   # 684 pt
COL_W = (CONTENT_W - GUTTER) / 2.0         # 242 pt

# Height reserved for the Part-header banner frame (artwork + title + scope box)
PART_BANNER_H = 2.5 * inch  # 180 pt


# ════════════════════════════════════════════════════════════════════════════
# 2. ROBUST DOC TEMPLATE
# ════════════════════════════════════════════════════════════════════════════

class RobustDocTemplate(BaseDocTemplate):
    """BaseDocTemplate with LayoutError recovery.

    When a flowable cannot fit in the current frame (e.g. a KeepTogether group
    taller than the remaining space), ReportLab raises LayoutError. This subclass
    catches the error, forces a frame advance, and retries the flowable up to
    3 times before raising.
    """

    def handle_flowable(self, flowables):
        f = flowables[0] if flowables else None
        try:
            super().handle_flowable(flowables)
        except LayoutError:
            if f is not None and hasattr(f, '_postponed'):
                retries = getattr(f, '_layoutRetries', 0) + 1
                if retries > 3:
                    raise
                f._layoutRetries = retries
                del f._postponed
                self.handle_frameEnd()
                flowables.insert(0, f)
            else:
                raise


# ════════════════════════════════════════════════════════════════════════════
# 3. FRAME & TEMPLATE FACTORIES
# ════════════════════════════════════════════════════════════════════════════

def make_single_column_frame() -> Frame:
    """Full-width frame for single-column pages (cover, front matter, wide tables)."""
    return Frame(
        MARGIN_L, MARGIN_B, CONTENT_W, CONTENT_H,
        id='F_Single',
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )


def make_left_column_frame() -> Frame:
    """Left column frame for standard two-column pages."""
    return Frame(
        MARGIN_L, MARGIN_B, COL_W, CONTENT_H,
        id='F_Left',
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )


def make_right_column_frame() -> Frame:
    """Right column frame for standard two-column pages."""
    return Frame(
        MARGIN_L + COL_W + GUTTER, MARGIN_B, COL_W, CONTENT_H,
        id='F_Right',
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )


def make_part_header_frames() -> Tuple[Frame, Frame, Frame]:
    """Create the three frames for a Part-header page:

    ┌──────────────────────────────────────┐
    │         BANNER (full width)          │  ← PART_BANNER_H tall
    │      Part Title + Overview Box       │
    ├────────────────┬─────────────────────┤
    │  COL-LEFT      │  COL-RIGHT          │  ← remaining height
    │                │                     │
    └────────────────┴─────────────────────┘

    Returns (banner_frame, left_frame, right_frame).
    """
    banner_frame = Frame(
        MARGIN_L, MARGIN_B + CONTENT_H - PART_BANNER_H,
        CONTENT_W, PART_BANNER_H,
        id='F_PartBanner',
        leftPadding=0, rightPadding=0,
        topPadding=0, bottomPadding=6,
    )
    below_h = CONTENT_H - PART_BANNER_H - 6  # 6pt gap
    left_frame = Frame(
        MARGIN_L, MARGIN_B, COL_W, below_h,
        id='F_PartLeft',
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    right_frame = Frame(
        MARGIN_L + COL_W + GUTTER, MARGIN_B, COL_W, below_h,
        id='F_PartRight',
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    return banner_frame, left_frame, right_frame


def register_page_templates(doc: BaseDocTemplate, on_page_draw=None) -> None:
    """Register the canonical page templates on a doc.

    Templates:
      • twoColumn   — standard two-column body prose
      • singleColumn — full-width pages (cover, front matter, wide matrices)
      • partHeader   — Part-opener page with top banner + 2-col below
    """
    f_left = make_left_column_frame()
    f_right = make_right_column_frame()
    f_single = make_single_column_frame()
    f_banner, f_part_l, f_part_r = make_part_header_frames()

    on_page = on_page_draw or (lambda c, d: None)

    tmpl_two = PageTemplate(
        id='twoColumn',
        frames=[f_left, f_right],
        onPage=on_page,
    )
    tmpl_single = PageTemplate(
        id='singleColumn',
        frames=[f_single],
        onPage=on_page,
    )
    tmpl_part = PageTemplate(
        id='partHeader',
        frames=[f_banner, f_part_l, f_part_r],
        onPage=on_page,
    )
    doc.addPageTemplates([tmpl_single, tmpl_two, tmpl_part])


# ════════════════════════════════════════════════════════════════════════════
# 4. SAFE KEEP-TOGETHER
# ════════════════════════════════════════════════════════════════════════════

_CHARS_PER_COL = 3200
_TABLE_ROW_EST_PT = 38
_CHARS_PER_LINE = 60


def safe_keep_together(flowables: List) -> List:
    """KeepTogether with heuristic height guard.

    If the combined estimated height exceeds ~80% of a column, skip grouping
    and let items flow individually. This prevents large white gaps caused by
    pushing tall blocks to the next column/page. Action flowables are never
    grouped.
    """
    _action_types = (ActionFlowable, PageBreak, KeepTogether)
    if any(isinstance(f, _action_types) for f in flowables):
        return flowables

    total_chars = 0
    for f in flowables:
        if hasattr(f, 'text'):
            total_chars += len(f.text)
        elif isinstance(f, Table):
            nrows = len(f._cellvalues) if hasattr(f, '_cellvalues') else 6
            est_h = nrows * _TABLE_ROW_EST_PT
            total_chars += int(est_h / 12.5 * _CHARS_PER_LINE)
        elif hasattr(f, 'height'):
            total_chars += int(f.height / 12.5 * _CHARS_PER_LINE)

    if total_chars > _CHARS_PER_COL * 0.8:
        return flowables  # too tall — let flow individually
    return [KeepTogether(flowables)]


# ════════════════════════════════════════════════════════════════════════════
# 5. SECTION-START DETECTION & HEADING PROTECTION
# ════════════════════════════════════════════════════════════════════════════

_SECTION_START_PATTERNS = [
    re.compile(r"(?:^|\b)PART\s+[IVX]+", re.I),
    re.compile(r"(?:^|\b)EXECUTIVE\s+SUMMARY\b", re.I),
    re.compile(r"(?:^|\b)FOUNDATIONAL\s+SYSTEM\b", re.I),
    re.compile(r"(?:^|\b)TABLE\s+OF\s+CONTENTS\b", re.I),
    re.compile(r"(?:^|\b)APPENDIX\b", re.I),
]


def is_section_start(text: str, level: int = 2) -> bool:
    """Return True if heading text signals a major section/part start."""
    if level <= 2:
        return True
    clean = re.sub(r"[*_`#]+", "", text).strip()
    return any(p.search(clean) for p in _SECTION_START_PATTERNS)


def is_short_intro(text: str) -> bool:
    """Detect short intro / setup sentences that precede boxed content."""
    plain = re.sub(r"[*_`#]+", "", text).strip()
    if len(plain) > 120 or "\n" in plain:
        return False
    return plain.endswith(":") or plain.endswith(".")


COND_BREAK_H1 = 4.0 * inch   # 288 pt
COND_BREAK_H2 = 3.0 * inch   # 216 pt
COND_BREAK_H3 = 1.8 * inch   # 130 pt


# ════════════════════════════════════════════════════════════════════════════
# 6. BREAK FLOWABLES
# ════════════════════════════════════════════════════════════════════════════

def part_start_flowables(is_first_part: bool = False) -> List:
    """Return flowable sequence to begin a Part on a fresh page."""
    elems: List = []
    if not is_first_part:
        elems.append(NextPageTemplate('partHeader'))
        elems.append(PageBreak())
    # Caller inserts banner artwork/title into banner frame, then:
    elems.append(FrameBreak())  # banner → left column
    # Caller inserts intro text into left column, then:
    elems.append(NextPageTemplate('twoColumn'))
    return elems


def full_width_start_flowables() -> List:
    """Return flowables to switch to single-column mode."""
    return [NextPageTemplate('singleColumn'), PageBreak()]


def full_width_end_flowables() -> List:
    """Return flowables to switch back to two-column mode."""
    return [NextPageTemplate('twoColumn')]


def section_break_flowables(level: int) -> List:
    """Return CondPageBreak flowable for a section heading."""
    if level == 1:
        min_h = COND_BREAK_H1
    elif level == 2:
        min_h = COND_BREAK_H2
    else:
        min_h = COND_BREAK_H3
    return [CondPageBreak(min_h)]


# ════════════════════════════════════════════════════════════════════════════
# 7. GRACE ZONE TRACKER
# ════════════════════════════════════════════════════════════════════════════

class GraceZone:
    """Tracks the post-Part-header grace zone.

    After a Part header, the next N blocks skip CondPageBreak so the first
    content flows into the left column naturally instead of being pushed
    to the right column.
    """

    def __init__(self, blocks: int = 2):
        self._remaining = 0
        self._size = blocks

    def activate(self, blocks: int = None) -> None:
        self._remaining = blocks if blocks is not None else self._size

    def consume(self) -> bool:
        if self._remaining > 0:
            self._remaining -= 1
            return True
        return False

    @property
    def active(self) -> bool:
        return self._remaining > 0


# ════════════════════════════════════════════════════════════════════════════
# 8. TOC PAGE RESOLUTION & BOOKMARKS
# ════════════════════════════════════════════════════════════════════════════

def resolve_page_map(pdf_path: Path) -> Dict[str, int]:
    """Scan built PDF with PyMuPDF to find actual page numbers for headings."""
    try:
        import fitz
    except ImportError:
        return {}

    page_map: Dict[str, int] = {}
    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return page_map

    # Identify and skip TOC page(s)
    toc_page_indices: set = set()
    for p_idx in range(len(doc)):
        page_text = doc[p_idx].get_text()
        if "TABLE OF CONTENTS" in page_text.upper() and ("PART I" in page_text.upper() or "EXECUTIVE SUMMARY" in page_text.upper()):
            toc_page_indices.add(p_idx)

    # Search patterns
    patterns = [
        ("authors_intro", ["AUTHOR'S INTRODUCTION: THE CARTOGRAPHER'S NECESSITY", "AUTHOR'S INTRODUCTION", "THE CARTOGRAPHER'S NECESSITY"]),
        ("exec_summary", ["EXECUTIVE SUMMARY & UNIVERSAL AUTHORITY HIERARCHY", "EXECUTIVE SUMMARY"]),
        ("foundational_laws", ["FOUNDATIONAL SYSTEM & PRODUCT LAWS", "FOUNDATIONAL SYSTEM"]),
        ("part_1", ["PART I: LIVE OPERATING CANON", "PART I"]),
        ("part_2", ["PART II: SPATIAL & GEOMETRIC ARCHITECTURE", "PART II"]),
        ("part_3", ["PART III: RELATIONAL & PSYCHOLOGICAL", "PART III"]),
        ("part_4", ["PART IV: SYSTEM FIREWALLS", "PART IV"]),
        ("part_5", ["PART V: HISTORICAL CONTEXT", "PART V"]),
        ("sec_1_1", ["1.1 LIVE OPERATING PROMPT"]),
        ("sec_1_2", ["1.2 ROLE & DOCTRINE", "ROLE & DOCTRINE (FIELD"]),
        ("sec_1_3", ["1.3 APERTURE ARCHITECTURE"]),
        ("sec_1_4", ["1.4 READING FORMATS"]),
        ("sec_1_5", ["1.5 SLASH COMMAND REGISTRY"]),
        ("sec_2_1", ["2.1 THE LAW OF LAYERED TRANSLATION"]),
        ("sec_2_2", ["2.2 AMBIENT CHAMBERS"]),
        ("sec_2_3", ["2.3 SYMBOLIC SPECTRUM TABLE"]),
        ("sec_2_4", ["2.4 BALANCE METER TELEMETRY"]),
        ("sec_2_5", ["2.5 DURATION OF TRANSITS"]),
        ("sec_3_1", ["3.1 RELATIONAL FIELD PROTOCOL"]),
        ("sec_3_2", ["3.2 PSYCHIC ELECTRODYNAMICS"]),
        ("sec_3_3", ["3.3 THE RED SYSTEM"]),
        ("sec_3_4", ["3.4 THE ADVICE LADDER TREE"]),
        ("sec_3_5", ["3.5 SHADOW WORK DIAGNOSTIC"]),
        ("sec_3_6", ["3.6 A UNIFIED THEORY OF NARRATIVE CONTROL"]),
        ("sec_3_7", ["3.7 INTERIOR COMPASS"]),
        ("sec_4_1", ["4.1 THE FIVE OPERATIONAL FIREWALLS"]),
        ("sec_4_2", ["4.2 POETIC HALLUCINATION GUARD"]),
        ("sec_4_3", ["4.3 COMPLETE FAILURE TAXONOMY"]),
        ("sec_4_4", ["4.4 PRE-VOICE GATE SEQUENCE"]),
        ("sec_5_1", ["5.1 SUPERSEDED LEGACY SPECIFICATIONS"]),
        ("sec_5_2", ["5.2 EMPIRICAL STUDIES"]),
        ("sec_5_3", ["5.3 MASTER CROSSWALK"]),
    ]

    for key, search_terms in patterns:
        for p_idx in range(len(doc)):
            if p_idx in toc_page_indices:
                continue
            text_dict = doc[p_idx].get_text("dict")
            found = False
            for block in text_dict.get("blocks", []):
                for bline in block.get("lines", []):
                    for span in bline.get("spans", []):
                        span_text = span.get("text", "").upper()
                        if any(st.upper() in span_text for st in search_terms) and span.get("size", 0) >= 10.0:
                            page_map[key] = p_idx + 1
                            found = True
                            break
                    if found:
                        break
                if found:
                    break
            if found:
                break
        # Fallback to simple text search if dict search missed
        if key not in page_map:
            for p_idx in range(len(doc)):
                if p_idx in toc_page_indices:
                    continue
                p_text = doc[p_idx].get_text().upper()
                if any(st.upper() in p_text for st in search_terms):
                    page_map[key] = p_idx + 1
                    break

    doc.close()
    return page_map


def add_bookmarks(pdf_path: Path, toc_entries: List[Tuple[int, str, int]]) -> int:
    """Add PDF outline bookmarks from a resolved TOC list."""
    if not toc_entries:
        return 0
    try:
        import fitz
    except ImportError:
        return 0
    try:
        doc = fitz.open(str(pdf_path))
        doc.set_toc(toc_entries)
        doc.saveIncr()
        doc.close()
        return len(toc_entries)
    except Exception:
        return 0


# ════════════════════════════════════════════════════════════════════════════
# 9. POST-BUILD LAYOUT QA
# ════════════════════════════════════════════════════════════════════════════

def analyze_column_fill(pdf_path: Path) -> List[Dict[str, Any]]:
    """Scan rendered PDF for per-column fill measurement."""
    try:
        import fitz
    except ImportError:
        return []

    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return []

    results: List[Dict[str, Any]] = []
    fitz_top = MARGIN_T
    fitz_bot = PAGE_H - MARGIN_B
    fitz_h = fitz_bot - fitz_top
    col_break = PAGE_W / 2

    for p_idx in range(len(doc)):
        page = doc[p_idx]
        blocks = page.get_text("dict", flags=0).get("blocks", [])
        drawings = page.get_drawings()

        left_ys: List[float] = []
        right_ys: List[float] = []

        for block in blocks:
            bx0, by0, bx1, by1 = block.get("bbox", [0, 0, 0, 0])
            if by1 > fitz_top and by0 < fitz_bot:
                if bx1 <= col_break + 20:
                    left_ys.append(min(by1, fitz_bot))
                elif bx0 >= col_break - 20:
                    right_ys.append(min(by1, fitz_bot))

        for draw in drawings:
            drect = draw.get("rect")
            if not drect:
                continue
            if drect.width > COL_W * 1.5:
                continue
            if drect.x0 < col_break + 20 and drect.y1 > fitz_top:
                left_ys.append(drect.y1)
            if drect.x0 >= col_break - 20 and drect.y1 > fitz_top:
                right_ys.append(drect.y1)

        left_bottom = max(left_ys) if left_ys else fitz_top
        right_bottom = max(right_ys) if right_ys else fitz_top
        left_used = left_bottom - fitz_top
        right_used = right_bottom - fitz_top
        left_fill = (left_used / fitz_h * 100) if fitz_h > 0 else 0
        right_fill = (right_used / fitz_h * 100) if fitz_h > 0 else 0
        left_gap = max(0, (fitz_bot - left_bottom) / 72)
        right_gap = max(0, (fitz_bot - right_bottom) / 72)
        drift = abs(left_used - right_used) / 72

        is_last_page = (p_idx == len(doc) - 1)
        drift_thresh = 5.5 if is_last_page else 3.0
        balanced = drift <= drift_thresh

        results.append({
            "page": p_idx + 1,
            "left_fill_pct": left_fill,
            "right_fill_pct": right_fill,
            "left_gap_in": left_gap,
            "right_gap_in": right_gap,
            "balanced": balanced,
            "drift_in": drift,
            "is_last_page": is_last_page,
        })

    doc.close()
    return results


def detect_stranded_headings(pdf_path: Path) -> List[Dict[str, Any]]:
    """Scan for headings stranded at the bottom of a page or column."""
    try:
        import fitz
    except ImportError:
        return []

    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return []

    stranded: List[Dict[str, Any]] = []
    heading_prefixes = (
        'PART I', 'PART II', 'PART III', 'PART IV', 'PART V',
        '1.1', '1.2', '1.3', '1.4', '1.5',
        '2.1', '2.2', '2.3', '2.4', '2.5',
        '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7',
        '4.1', '4.2', '4.3', '4.4',
        '5.1', '5.2', '5.3',
        'EXECUTIVE SUMMARY', 'FOUNDATIONAL SYSTEM', 'APPENDIX'
    )

    for p_idx in range(len(doc)):
        page = doc[p_idx]
        blocks = page.get_text("blocks")
        for b in blocks:
            text = b[4].strip()
            y1 = b[3]
            if y1 > (PAGE_H - MARGIN_B - 25):
                if any(text.startswith(prefix) for prefix in heading_prefixes):
                    if len(text.splitlines()) <= 2:
                        stranded.append({
                            "page": p_idx + 1,
                            "text": text[:60],
                            "y": y1,
                        })

    doc.close()
    return stranded


def detect_dangling_intros(pdf_path: Path) -> List[Dict[str, Any]]:
    """Scan for dangling intro lines at page/column bottoms."""
    try:
        import fitz
    except ImportError:
        return []

    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return []

    dangling: List[Dict[str, Any]] = []
    for p_idx in range(len(doc)):
        page = doc[p_idx]
        text = page.get_text()
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        if len(lines) >= 2:
            last = lines[-1]
            if last.endswith(":") and len(last) < 80:
                dangling.append({
                    "page": p_idx + 1,
                    "text": last,
                })

    doc.close()
    return dangling


def verify_font_embedding(pdf_path: Path) -> Dict[str, str]:
    """Verify which fonts are embedded in the PDF."""
    try:
        import fitz
    except ImportError:
        return {}

    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return {}

    fonts: Dict[str, str] = {}
    for page in doc:
        for f in page.get_fonts():
            name = f[3]
            status = "embedded" if f[2] else "NOT embedded"
            fonts[name] = status

    doc.close()
    return fonts


def render_preview_pngs(pdf_path: Path, output_dir: Path, dpi: int = 200) -> List[Path]:
    """Render PDF pages to PNG images for visual QA."""
    try:
        import fitz
    except ImportError:
        return []

    try:
        doc = fitz.open(str(pdf_path))
    except Exception:
        return []

    output_dir.mkdir(parents=True, exist_ok=True)
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)
    stem = pdf_path.stem

    png_files: List[Path] = []
    for i, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out = output_dir / f"{stem}_{dpi}-{i:02d}.png"
        pix.save(str(out))
        png_files.append(out)

    doc.close()
    return png_files


class LayoutReport:
    """Structured layout QA report."""

    def __init__(self):
        self.violations: List[Dict[str, Any]] = []

    def log(self, rule: str, severity: str, page: int, detail: str) -> None:
        self.violations.append({
            "rule": rule,
            "severity": severity,
            "page": page,
            "detail": detail,
        })

    def log_column_drift(self, page: int, drift_in: float, left: float, right: float) -> None:
        self.log("column-balance", "warning", page,
                 f"Column drift: {drift_in:.1f}\" — L={left:.0f}% R={right:.0f}%")

    def log_stranded_heading(self, page: int, text: str) -> None:
        self.log("stranded-heading", "warning", page,
                 f"Trailing heading: \"{text}\"")

    def log_excessive_gap(self, page: int, column: str, gap_in: float, pct: float) -> None:
        self.log("excessive-gap", "warning", page,
                 f"{column} column: {pct:.0f}% empty ({gap_in:.1f}\" gap)")

    @property
    def error_count(self) -> int:
        return sum(1 for v in self.violations if v["severity"] == "error")

    @property
    def warning_count(self) -> int:
        return sum(1 for v in self.violations if v["severity"] == "warning")

    def emit(self) -> str:
        lines: List[str] = []
        lines.append("")
        lines.append("=" * 60)
        lines.append("  RAVEN CALDER LAYOUT QA REPORT")
        lines.append("=" * 60)
        lines.append(f"  Errors: {self.error_count}  |  Warnings: {self.warning_count}")
        lines.append("-" * 60)
        for v in self.violations:
            lines.append(f"  [{v['severity']:>7s}] Page {v['page']:>3d}  {v['rule']:<20s}  {v['detail']}")
        if not self.violations:
            lines.append("  No layout violations detected.")
        lines.append("=" * 60)
        report_str = "\n".join(lines)
        print(report_str)
        return report_str


def run_post_build_qa(pdf_path: Path) -> LayoutReport:
    """Run full post-build layout QA suite."""
    report = LayoutReport()

    fill_data = analyze_column_fill(pdf_path)
    for fd in fill_data:
        is_last = fd["is_last_page"]
        gap_thresh_pct = 60 if is_last else 35
        gap_thresh_in = 5.5 if is_last else 3.5
        for col_name, gap_in, pct in [
            ("left", fd["left_gap_in"], 100 - fd["left_fill_pct"]),
            ("right", fd["right_gap_in"], 100 - fd["right_fill_pct"]),
        ]:
            if pct >= gap_thresh_pct and gap_in >= gap_thresh_in:
                used = 100 - pct
                if used >= 20:
                    report.log_excessive_gap(fd["page"], col_name, gap_in, pct)

        drift_thresh = 5.5 if is_last else 3.0
        if fd["drift_in"] > drift_thresh:
            if fd["left_fill_pct"] >= 25 and fd["right_fill_pct"] >= 25:
                report.log_column_drift(fd["page"], fd["drift_in"],
                                        fd["left_fill_pct"], fd["right_fill_pct"])

    stranded = detect_stranded_headings(pdf_path)
    for s in stranded:
        report.log_stranded_heading(s["page"], s["text"])

    dangling = detect_dangling_intros(pdf_path)
    for d in dangling:
        report.log("dangling-intro", "warning", d["page"],
                   f"Dangling intro at page bottom: \"{d['text']}\"")

    fonts = verify_font_embedding(pdf_path)
    for name, status in fonts.items():
        if status != "embedded":
            report.log("font-embedding", "error", 0,
                       f"Font '{name}' is {status}")

    return report


# ════════════════════════════════════════════════════════════════════════════
# 10. BUILD ORCHESTRATION
# ════════════════════════════════════════════════════════════════════════════

def create_doc(
    out_path: Path,
    title: str = "The Woven Map / Raven Calder: Master Canonical Reference & Architecture Manual",
    author: str = "Dan Cross / Raven Calder Integration Unit",
    subject: str = "Symbolic Diagnostic Geometry & Runtime Operating Architecture",
    creator: str = "Raven Calder Publication PDF Engine",
    keywords: str = "Woven Map, Raven Calder, SST, Aperture Architecture, Balance Meter, Telemetry",
    on_page_draw=None,
    canvasmaker=None,
) -> RobustDocTemplate:
    """Create a RobustDocTemplate with all canonical page templates registered."""
    doc = RobustDocTemplate(
        str(out_path),
        pagesize=letter,
        leftMargin=MARGIN_L, rightMargin=MARGIN_R,
        topMargin=MARGIN_T, bottomMargin=MARGIN_B,
        title=title,
        author=author,
        subject=subject,
        creator=creator,
        keywords=keywords,
    )
    register_page_templates(doc, on_page_draw=on_page_draw)
    return doc


def build_pdf(
    story: List,
    out_path: Path,
    title: str = "The Woven Map / Raven Calder: Master Canonical Reference & Architecture Manual",
    author: str = "Dan Cross / Raven Calder Integration Unit",
    subject: str = "Symbolic Diagnostic Geometry & Runtime Operating Architecture",
    creator: str = "Raven Calder Publication PDF Engine",
    keywords: str = "Woven Map, Raven Calder, SST, Aperture Architecture, Balance Meter, Telemetry",
    on_page_draw=None,
    canvasmaker=None,
) -> RobustDocTemplate:
    """Build a PDF from a story list using the canonical layout engine."""
    doc = create_doc(
        out_path=out_path,
        title=title,
        author=author,
        subject=subject,
        creator=creator,
        keywords=keywords,
        on_page_draw=on_page_draw,
    )
    build_kwargs = {}
    if canvasmaker:
        build_kwargs['canvasmaker'] = canvasmaker
    doc.build(story, **build_kwargs)
    return doc
