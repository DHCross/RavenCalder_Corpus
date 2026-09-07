#!/usr/bin/env python3
"""
build_raven_pdf.py — Publication-Grade PDF Compiler for Raven Calder Corpus.

Compiles the master canonical reference and architecture manual into a
publication-grade PDF utilizing the Woven Map visual grammar:
  • Two-column responsive prose with intelligent orphan/widow protection
  • Controlled full-width switching for wide matrices and tables
  • Diagnostic callout boxes (Firewalls, Ground Signs, Warnings, Notes)
  • Part banner headers with single visual unit composition
  • NumberedCanvas with running headers, footers, corner registration marks
  • Dynamic 2-pass TOC resolution & PDF outline bookmarks
  • Post-build layout QA verification
"""

from __future__ import annotations

import os
import sys
import re
import math
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    BaseDocTemplate,
    PageTemplate,
    Frame,
    FrameBreak,
    PageBreak,
    CondPageBreak,
    NextPageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
    Flowable,
)
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Canonical Layout Engine ──────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from raven_layout_engine import (
    PAGE_W, PAGE_H, MARGIN_L, MARGIN_R, MARGIN_T, MARGIN_B,
    GUTTER, CONTENT_W, CONTENT_H, COL_W, PART_BANNER_H,
    RobustDocTemplate, register_page_templates,
    safe_keep_together, is_section_start, is_short_intro,
    part_start_flowables, full_width_start_flowables, full_width_end_flowables,
    section_break_flowables, GraceZone,
    COND_BREAK_H1, COND_BREAK_H2, COND_BREAK_H3,
    resolve_page_map, add_bookmarks,
    analyze_column_fill, detect_stranded_headings, run_post_build_qa,
    detect_dangling_intros, verify_font_embedding, render_preview_pngs,
    LayoutReport, create_doc, build_pdf,
)

# ── Color Palette: The Woven Map Diagnostic Grammar ──────────────────────────
INK_PRIMARY = colors.HexColor('#0f172a')      # Deep Obsidian / Slate
INK_MUTED = colors.HexColor('#475569')        # Slate Grey (Metadata, Subtitles)
INK_COBALT = colors.HexColor('#1d4ed8')       # Primary Accent / Woven Map Cobalt
INK_COBALT_DARK = colors.HexColor('#1e3a8a')  # Dark Cobalt for Part Titles
INK_CRIMSON = colors.HexColor('#b91c1c')      # Firewall / Failure / Warning Red
INK_AMBER = colors.HexColor('#b45309')        # Circuit Potency / Telemetry Amber
INK_EMERALD = colors.HexColor('#047857')      # Within Boundary / Ground Sign Green
INK_INDIGO = colors.HexColor('#4338ca')       # Deep Geometry / Harmonic Indigo

BG_PAGE = colors.HexColor('#faf9f6')          # Clean Archival Ivory
BG_CARD = colors.HexColor('#f8fafc')          # Diagnostic Card Fill
BG_HEADER = colors.HexColor('#f1f5f9')        # Subtle Table Header Tone
BORDER_RULE = colors.HexColor('#e2e8f0')      # Fine Rule Border
BORDER_HEAVY = colors.HexColor('#334155')     # Heavy Structure Border
BORDER_COBALT = colors.HexColor('#93c5fd')    # Accent Border Light


# ── Font Registration ────────────────────────────────────────────────────────
FONT_DIR = SCRIPT_DIR / "fonts"

def register_fonts():
    """Register TTF fonts with graceful fallbacks."""
    # Cormorant Garamond (Headers)
    cormorant_paths = [
        ("CormorantGaramond-Bold", "/Users/dancross/Library/Fonts/CORMORANTGARAMOND-BOLD.TTF"),
        ("CormorantGaramond-SemiBold", "/Users/dancross/Library/Fonts/CORMORANTGARAMOND-SEMIBOLD.TTF"),
        ("CormorantGaramond-SemiBoldItalic", "/Users/dancross/Library/Fonts/CORMORANTGARAMOND-SEMIBOLDITALIC.TTF"),
        ("CormorantGaramond-Regular", "/Users/dancross/Library/Fonts/CORMORANTGARAMOND-REGULAR.TTF"),
    ]
    for name, path in cormorant_paths:
        if Path(path).exists():
            try:
                pdfmetrics.registerFont(TTFont(name, path))
            except Exception:
                pass

    # Tinos (Prose Serif)
    tinos_paths = [
        ("Tinos", "/Users/dancross/Library/Fonts/Tinos-Regular.ttf"),
        ("Tinos-Bold", "/Users/dancross/Library/Fonts/Tinos-Bold.ttf"),
        ("Tinos-Italic", "/Users/dancross/Library/Fonts/Tinos-Italic.ttf"),
        ("Tinos-BoldItalic", "/Users/dancross/Library/Fonts/Tinos-BoldItalic.ttf"),
    ]
    for name, path in tinos_paths:
        if Path(path).exists():
            try:
                pdfmetrics.registerFont(TTFont(name, path))
            except Exception:
                pass

    # Courier Prime (Monospace / AST / Telemetry)
    courier_dir = FONT_DIR / "CourierPrime"
    if courier_dir.exists():
        for name, filename in [
            ("CourierPrime", "CourierPrime-Regular.ttf"),
            ("CourierPrime-Bold", "CourierPrime-Bold.ttf"),
            ("CourierPrime-Italic", "CourierPrime-Italic.ttf"),
            ("CourierPrime-BoldItalic", "CourierPrime-BoldItalic.ttf"),
        ]:
            f_path = courier_dir / filename
            if f_path.exists():
                try:
                    pdfmetrics.registerFont(TTFont(name, str(f_path)))
                except Exception:
                    pass

register_fonts()

def _font_available(name: str) -> bool:
    try:
        pdfmetrics.getFont(name)
        return True
    except Exception:
        return False

FONT_BODY = "Tinos" if _font_available("Tinos") else "Times-Roman"
FONT_BODY_BOLD = "Tinos-Bold" if _font_available("Tinos-Bold") else "Times-Bold"
FONT_BODY_ITALIC = "Tinos-Italic" if _font_available("Tinos-Italic") else "Times-Italic"
FONT_BODY_BOLDITALIC = "Tinos-BoldItalic" if _font_available("Tinos-BoldItalic") else "Times-BoldItalic"

FONT_DISPLAY_BOLD = "CormorantGaramond-Bold" if _font_available("CormorantGaramond-Bold") else "Helvetica-Bold"
FONT_DISPLAY_SEMIBOLD = "CormorantGaramond-SemiBold" if _font_available("CormorantGaramond-SemiBold") else "Helvetica-Bold"
FONT_DISPLAY_ITALIC = "CormorantGaramond-SemiBoldItalic" if _font_available("CormorantGaramond-SemiBoldItalic") else "Helvetica-Oblique"

FONT_MONO = "CourierPrime" if _font_available("CourierPrime") else "Courier"
FONT_MONO_BOLD = "CourierPrime-Bold" if _font_available("CourierPrime-Bold") else "Courier-Bold"


# ── Stylesheet Factory ───────────────────────────────────────────────────────
def get_raven_styles():
    """Build stylesheet for Raven Calder publication manual."""
    ss = getSampleStyleSheet()

    styles = {
        'Normal': ss['Normal'],
        'CoverTitle': ParagraphStyle(
            'CoverTitle', parent=ss['Normal'],
            fontName=FONT_DISPLAY_BOLD, fontSize=24, leading=28,
            textColor=INK_PRIMARY, alignment=TA_CENTER, spaceAfter=8,
        ),
        'CoverSubtitle': ParagraphStyle(
            'CoverSubtitle', parent=ss['Normal'],
            fontName=FONT_DISPLAY_SEMIBOLD, fontSize=13, leading=17,
            textColor=INK_COBALT, alignment=TA_CENTER, spaceAfter=14,
        ),
        'CoverMeta': ParagraphStyle(
            'CoverMeta', parent=ss['Normal'],
            fontName=FONT_MONO, fontSize=8.5, leading=12,
            textColor=INK_MUTED, alignment=TA_CENTER,
        ),
        'PartBannerNumeral': ParagraphStyle(
            'PartBannerNumeral', parent=ss['Normal'],
            fontName=FONT_MONO_BOLD, fontSize=10, leading=13,
            textColor=INK_COBALT, alignment=TA_LEFT,
        ),
        'PartBannerTitle': ParagraphStyle(
            'PartBannerTitle', parent=ss['Normal'],
            fontName=FONT_DISPLAY_BOLD, fontSize=18, leading=21,
            textColor=INK_PRIMARY, alignment=TA_LEFT, spaceAfter=4,
        ),
        'PartBannerDesc': ParagraphStyle(
            'PartBannerDesc', parent=ss['Normal'],
            fontName=FONT_BODY_ITALIC, fontSize=9.5, leading=13,
            textColor=INK_MUTED, alignment=TA_LEFT,
        ),
        'Heading1': ParagraphStyle(
            'Heading1', parent=ss['Heading1'],
            fontName=FONT_DISPLAY_BOLD, fontSize=15, leading=18,
            textColor=INK_PRIMARY, spaceBefore=14, spaceAfter=6,
            keepWithNext=True,
        ),
        'Heading2': ParagraphStyle(
            'Heading2', parent=ss['Heading2'],
            fontName=FONT_DISPLAY_BOLD, fontSize=12.5, leading=15,
            textColor=INK_COBALT_DARK, spaceBefore=11, spaceAfter=4,
            keepWithNext=True,
        ),
        'Heading3': ParagraphStyle(
            'Heading3', parent=ss['Heading3'],
            fontName=FONT_BODY_BOLD, fontSize=10.5, leading=13.5,
            textColor=INK_PRIMARY, spaceBefore=8, spaceAfter=3,
            keepWithNext=True,
        ),
        'Heading4': ParagraphStyle(
            'Heading4', parent=ss['Normal'],
            fontName=FONT_BODY_BOLDITALIC, fontSize=9.5, leading=12.5,
            textColor=INK_MUTED, spaceBefore=6, spaceAfter=2,
            keepWithNext=True,
        ),
        'Body': ParagraphStyle(
            'Body', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=9.2, leading=12.4,
            textColor=INK_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=5,
            allowWidows=0, allowOrphans=0,
        ),
        'BodyLeft': ParagraphStyle(
            'BodyLeft', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=9.2, leading=12.4,
            textColor=INK_PRIMARY, alignment=TA_LEFT, spaceAfter=5,
            allowWidows=0, allowOrphans=0,
        ),
        'Bullet': ParagraphStyle(
            'Bullet', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=9.0, leading=12.0,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
            leftIndent=12, firstLineIndent=-8, spaceAfter=3,
        ),
        'CalloutTitle': ParagraphStyle(
            'CalloutTitle', parent=ss['Normal'],
            fontName=FONT_BODY_BOLD, fontSize=9.5, leading=12.5,
            textColor=INK_PRIMARY, spaceAfter=3,
        ),
        'CalloutText': ParagraphStyle(
            'CalloutText', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=8.8, leading=11.8,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'CalloutCode': ParagraphStyle(
            'CalloutCode', parent=ss['Normal'],
            fontName=FONT_MONO, fontSize=8.0, leading=10.5,
            textColor=INK_PRIMARY,
        ),
        'CodeBlock': ParagraphStyle(
            'CodeBlock', parent=ss['Normal'],
            fontName=FONT_MONO, fontSize=7.8, leading=10.2,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'FormulaText': ParagraphStyle(
            'FormulaText', parent=ss['Normal'],
            fontName=FONT_BODY_ITALIC, fontSize=10.0, leading=14.0,
            textColor=INK_COBALT_DARK, alignment=TA_CENTER, spaceBefore=4, spaceAfter=4,
        ),
        'TableHeader': ParagraphStyle(
            'TableHeader', parent=ss['Normal'],
            fontName=FONT_BODY_BOLD, fontSize=8.5, leading=11.0,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'TableCell': ParagraphStyle(
            'TableCell', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=8.0, leading=10.5,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'TableCellBold': ParagraphStyle(
            'TableCellBold', parent=ss['Normal'],
            fontName=FONT_BODY_BOLD, fontSize=8.0, leading=10.5,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'TableCellMono': ParagraphStyle(
            'TableCellMono', parent=ss['Normal'],
            fontName=FONT_MONO, fontSize=6.5, leading=8.0,
            textColor=INK_PRIMARY, alignment=TA_LEFT,
        ),
        'TOCPart': ParagraphStyle(
            'TOCPart', parent=ss['Normal'],
            fontName=FONT_DISPLAY_BOLD, fontSize=8.5, leading=10.5,
            textColor=INK_COBALT_DARK, spaceBefore=3, spaceAfter=1,
        ),
        'TOCSection': ParagraphStyle(
            'TOCSection', parent=ss['Normal'],
            fontName=FONT_BODY, fontSize=7.8, leading=9.8,
            textColor=INK_PRIMARY, leftIndent=8,
        ),
        'TOCPageNum': ParagraphStyle(
            'TOCPageNum', parent=ss['Normal'],
            fontName=FONT_MONO, fontSize=7.5, leading=9.8,
            textColor=INK_MUTED, alignment=TA_RIGHT,
        ),
    }
    return styles


# ── Inline Formatting Cleaner & Sanitizer ────────────────────────────────────
BOX_UNICODE_MAP = {
    '─': '-', '━': '=', '│': '|', '┃': '|',
    '┌': '+', '┐': '+', '└': '+', '┘': '+',
    '├': '+', '┤': '+', '┬': '+', '┴': '+', '┼': '+',
    '═': '=', '║': '|', '╒': '+', '╕': '+', '╘': '+', '╛': '+',
    '►': '>', '◄': '<', '▲': '^', '▼': 'v',
    '→': '->', '←': '<-', '⇒': '=>', '⇐': '<=',
    '⚡': '[VOLT]', '🌪': '[WIND]',
}


def escape_code_line(text: str) -> str:
    """Render a code-block line literally: escape HTML entities only.

    Code content is literal text and must NOT be run through markdown-inline
    conversion. Running `clean_markdown_inline` here would turn backticked
    filenames and bold markers inside code into `<font>`/`<b>` ReportLab tags,
    which can leave the mini-HTML parser with unbalanced tags and crash the
    build (e.g. 'saw </font> instead of expected </para>').
    """
    if not text:
        return ""
    for k, v in BOX_UNICODE_MAP.items():
        text = text.replace(k, v)
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    return text


def clean_markdown_inline(text: str) -> str:
    """Escape XML entities and translate markdown inline formatting to ReportLab tags."""
    if not text:
        return ""

    # Translate unrenderable Unicode box/symbol glyphs to standard ASCII
    for k, v in BOX_UNICODE_MAP.items():
        text = text.replace(k, v)

    # 1. Escape literal XML entities first
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")

    # 2. Extract and protect inline code
    code_placeholders: Dict[str, str] = {}
    def save_code(m):
        k = f"XXCODE{len(code_placeholders)}XX"
        code_content = m.group(1)
        code_placeholders[k] = f'<font face="{FONT_MONO}" color="#1e3a8a"><b>{code_content}</b></font>'
        return k
    text = re.sub(r'`([^`]+)`', save_code, text)

    # 3. Extract and protect LaTeX math expressions ($...$)
    math_placeholders: Dict[str, str] = {}
    def clean_math_expr(expr: str) -> str:
        # Fractions
        expr = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1 / \2)', expr)
        expr = re.sub(r'\\text\{([^}]+)\}', r'\1', expr)
        # Operators & Arrows
        expr = expr.replace(r'\ge', '≥').replace(r'\le', '≤').replace(r'\times', '×').replace(r'\to', '->')
        expr = expr.replace(r'\longrightarrow', '->')
        # Subscripts
        expr = re.sub(r'_\{([^}]+)\}', r'<sub>\1</sub>', expr)
        expr = re.sub(r'_([a-zA-Z0-9])', r'<sub>\1</sub>', expr)
        return f'<i><b>{expr}</b></i>'

    def save_math(m):
        k = f"XXMATH{len(math_placeholders)}XX"
        math_placeholders[k] = clean_math_expr(m.group(1))
        return k
    text = re.sub(r'\$\$([^\$]+)\$\$', save_math, text)
    text = re.sub(r'\$([^\$]+)\$', save_math, text)

    # 4. Bold-Italic (***text*** or ___text___)
    text = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><i>\1</i></b>', text)

    # 5. Bold (**text** or __text__)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)

    # 6. Italic (*text* or _text_)
    text = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<i>\1</i>', text)
    text = re.sub(r'\b_([^_]+)_\b', r'<i>\1</i>', text)

    # 7. Restore code and math placeholders
    for k, v in code_placeholders.items():
        text = text.replace(k, v)
    for k, v in math_placeholders.items():
        text = text.replace(k, v)

    return text


# ── Custom Flowables ─────────────────────────────────────────────────────────

class PartBannerFlowable(Flowable):
    """Visual opener for Part transitions."""

    def __init__(self, part_num: str, title: str, subtitle: str = "", width: float = COL_W, height: float = 54):
        super().__init__()
        self.part_num = part_num
        self.title = title
        self.subtitle = subtitle
        self.width = width
        self.height = height

    def wrap(self, availWidth, availHeight):
        self.width = min(self.width, availWidth)
        return self.width, self.height

    def draw(self):
        canv = self.canv
        w, h = self.width, self.height
        canv.saveState()

        # Shaded Background Card
        canv.setFillColor(BG_CARD)
        canv.setStrokeColor(BORDER_RULE)
        canv.setLineWidth(0.75)
        canv.roundRect(0, 0, w, h, 3, fill=1, stroke=1)

        # Left Cobalt Anchor Bar
        canv.setFillColor(INK_COBALT)
        canv.rect(0, 0, 4, h, fill=1, stroke=0)

        # Top Badge & Filing Code
        canv.setFont(FONT_MONO_BOLD, 7.0)
        canv.setFillColor(INK_COBALT)
        canv.drawString(10, h - 13, self.part_num.upper())

        canv.setFont(FONT_MONO, 5.5)
        canv.setFillColor(INK_MUTED)
        canv.drawRightString(w - 8, h - 13, "WOVEN MAP // SPECIFICATION")

        # Part Title
        canv.setFont(FONT_DISPLAY_BOLD, 11.5)
        canv.setFillColor(INK_PRIMARY)
        disp_title = self.title if len(self.title) <= 38 else self.title[:35] + "..."
        canv.drawString(10, h - 28, disp_title)

        # Horizontal accent rule
        canv.setStrokeColor(BORDER_RULE)
        canv.setLineWidth(0.5)
        canv.line(10, h - 33, w - 8, h - 33)

        # Subtitle / Scope statement
        if self.subtitle:
            canv.setFont(FONT_BODY_ITALIC, 7.0)
            canv.setFillColor(INK_MUTED)
            disp_sub = self.subtitle if len(self.subtitle) <= 54 else self.subtitle[:51] + "..."
            canv.drawString(10, h - 44, disp_sub)

        canv.restoreState()


def create_callout_card(
    title: str,
    content: str,
    callout_type: str = "note",
    styles: Optional[Dict[str, ParagraphStyle]] = None,
    width: float = COL_W
) -> Table:
    """Build a styled callout card table with colored left accent bar."""
    st = styles or get_raven_styles()

    # Color definitions based on callout type
    accent_map = {
        "warning": (INK_CRIMSON, colors.HexColor("#fef2f2"), "WARNING / RETIRED SPECIFICATION"),
        "caution": (INK_CRIMSON, colors.HexColor("#fef2f2"), "CAUTION / HIGH RISK"),
        "important": (INK_COBALT, colors.HexColor("#eff6ff"), "IMPORTANT SYSTEM LAW"),
        "tip": (INK_EMERALD, colors.HexColor("#f0fdf4"), "OPERATIONAL PROTOCOL"),
        "note": (INK_MUTED, colors.HexColor("#f8fafc"), "NOTE / SPECIFICATION"),
        "telemetry": (INK_AMBER, colors.HexColor("#fffbeb"), "BALANCE METER TELEMETRY"),
        "groundsign": (INK_EMERALD, colors.HexColor("#f0fdf4"), "GROUND SIGN TEST"),
    }
    bar_color, bg_color, default_title = accent_map.get(callout_type.lower(), accent_map["note"])

    card_title = title or default_title
    title_p = Paragraph(f"<b><font color='{bar_color.hexval()}'>{clean_markdown_inline(card_title)}</font></b>", st['CalloutTitle'])
    body_p = Paragraph(clean_markdown_inline(content), st['CalloutText'])

    cell_flowables = [title_p, Spacer(1, 2), body_p]

    table = Table([[cell_flowables]], colWidths=[width])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg_color),
        ('BOX', (0, 0), (-1, -1), 0.75, BORDER_RULE),
        ('LINEBEFORE', (0, 0), (0, 0), 3.0, bar_color),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    return table


# ── NumberedCanvas (Running Headers, Footers, Page Numbers, Frame Marks) ─────
class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas for dynamic total page count and running decorations."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []
        self.section_tracker: Dict[int, str] = {}

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count: int):
        page_num = self._pageNumber
        self.saveState()

        # 1. Archival Background Fill (Substrate)
        self.setFillColor(BG_PAGE)
        self.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

        # 2. Corner Framing Brackets
        self.setStrokeColor(BORDER_RULE)
        self.setLineWidth(0.5)
        bracket_len = 10
        margin_x = MARGIN_L - 10
        margin_y = MARGIN_B - 10
        right_x = PAGE_W - MARGIN_R + 10
        top_y = PAGE_H - MARGIN_T + 10

        # Top-Left ┌
        self.line(margin_x, top_y, margin_x + bracket_len, top_y)
        self.line(margin_x, top_y, margin_x, top_y - bracket_len)
        # Top-Right ┐
        self.line(right_x, top_y, right_x - bracket_len, top_y)
        self.line(right_x, top_y, right_x, top_y - bracket_len)
        # Bottom-Left └
        self.line(margin_x, margin_y, margin_x + bracket_len, margin_y)
        self.line(margin_x, margin_y, margin_x, margin_y + bracket_len)
        # Bottom-Right ┘
        self.line(right_x, margin_y, right_x - bracket_len, margin_y)
        self.line(right_x, margin_y, right_x, margin_y + bracket_len)

        # On Cover Page (Page 1): Draw specialized filing frame instead of standard running header/footer
        if page_num == 1:
            self.setFont(FONT_MONO, 7.5)
            self.setFillColor(INK_MUTED)
            self.drawCentredString(PAGE_W / 2, 28, "THE WOVEN MAP CANONICAL REFERENCE • RELEASE v3.2 • 2026 EDITION")
            self.restoreState()
            return

        # 3. Running Top Header
        self.setFont(FONT_MONO, 7.5)
        self.setFillColor(INK_MUTED)
        self.drawString(MARGIN_L, PAGE_H - MARGIN_T + 16, "THE WOVEN MAP / RAVEN CALDER: MASTER CANONICAL REFERENCE")
        self.drawRightString(PAGE_W - MARGIN_R, PAGE_H - MARGIN_T + 16, "SYSTEM ARCHITECTURE MANUAL (v3.2)")

        self.setStrokeColor(BORDER_RULE)
        self.setLineWidth(0.5)
        self.line(MARGIN_L, PAGE_H - MARGIN_T + 10, PAGE_W - MARGIN_R, PAGE_H - MARGIN_T + 10)

        # 4. Running Bottom Footer
        self.line(MARGIN_L, MARGIN_B - 10, PAGE_W - MARGIN_R, MARGIN_B - 10)
        self.setFont(FONT_MONO, 7.5)
        self.setFillColor(INK_MUTED)
        self.drawString(MARGIN_L, MARGIN_B - 22, "CONFIDENTIAL / REUSABLE OPERATING SPECIFICATION")
        page_str = f"Page {page_num} of {page_count}"
        self.drawRightString(PAGE_W - MARGIN_R, MARGIN_B - 22, page_str)

        self.restoreState()


# ── Markdown Parser & Story Compiler ─────────────────────────────────────────

def parse_markdown_to_story(md_path: Path, page_map: Optional[Dict[str, int]] = None) -> List:
    """Parse Markdown source into ReportLab story flowables."""
    with open(md_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    styles = get_raven_styles()
    story: List = []

    lines = raw_text.splitlines()
    i = 0
    num_lines = len(lines)

    in_code_block = False
    code_block_lines: List[str] = []
    code_lang = ""

    in_table = False
    table_lines: List[str] = []

    in_blockquote = False
    blockquote_lines: List[str] = []
    blockquote_type = "note"
    blockquote_title = ""

    grace = GraceZone(blocks=2)

    while i < num_lines:
        line = lines[i]
        stripped = line.strip()

        # ── Code Fences ──────────────────────────────────────────────────────
        if stripped.startswith("```"):
            if not in_code_block:
                in_code_block = True
                code_lang = stripped[3:].strip()
                code_block_lines = []
                i += 1
                continue
            else:
                in_code_block = False
                # Build multi-row table so ReportLab can split across columns/pages
                row_data = []
                for cb_line in code_block_lines:
                    # Render code literally; do NOT translate markdown to HTML tags.
                    cleaned_l = escape_code_line(cb_line).replace(" ", "&nbsp;")
                    if not cleaned_l.strip():
                        cleaned_l = "&nbsp;"
                    p_line = Paragraph(cleaned_l, styles['CodeBlock'])
                    row_data.append([p_line])

                if not row_data:
                    row_data = [[Paragraph("&nbsp;", styles['CodeBlock'])]]

                card_t = Table(row_data, colWidths=[COL_W])
                card_t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
                    ('BOX', (0, 0), (-1, -1), 0.75, BORDER_RULE),
                    ('TOPPADDING', (0, 0), (-1, -1), 1.5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ]))
                story.append(Spacer(1, 3))
                story.append(card_t)
                story.append(Spacer(1, 5))
                i += 1
                continue

        if in_code_block:
            code_block_lines.append(line)
            i += 1
            continue

        # ── Tables ───────────────────────────────────────────────────────────
        if stripped.startswith("|") and stripped.endswith("|"):
            if not in_table:
                in_table = True
                table_lines = [stripped]
            else:
                table_lines.append(stripped)
            i += 1
            continue
        elif in_table:
            in_table = False
            # Render accumulated table
            table_flowable = render_markdown_table(table_lines, styles, width=COL_W)
            story.append(Spacer(1, 2))
            story.append(table_flowable)
            story.append(Spacer(1, 4))
            table_lines = []
            # Do not increment i, let current line be processed

        # ── Blockquotes / Callout Alerts ─────────────────────────────────────
        if stripped.startswith(">"):
            if not in_blockquote:
                in_blockquote = True
                blockquote_lines = []
                blockquote_type = "note"
                blockquote_title = ""

            content = stripped[1:].strip()
            # Detect GitHub Alert tag e.g. [!WARNING]
            alert_match = re.match(r'\[!(WARNING|IMPORTANT|NOTE|CAUTION|TIP)\]\s*(.*)', content, re.I)
            if alert_match:
                blockquote_type = alert_match.group(1).lower()
                blockquote_title = alert_match.group(2).strip()
            else:
                blockquote_lines.append(content)
            i += 1
            continue
        elif in_blockquote:
            in_blockquote = False
            b_content = " ".join(blockquote_lines)
            callout = create_callout_card(blockquote_title, b_content, blockquote_type, styles, width=COL_W)
            story.append(Spacer(1, 4))
            story.append(callout)
            story.append(Spacer(1, 5))
            blockquote_lines = []
            # Do not increment i, process current line

        # ── Empty lines ──────────────────────────────────────────────────────
        if not stripped:
            i += 1
            continue

        # ── Horizontal Rules ─────────────────────────────────────────────────
        if re.match(r'^---+$', stripped):
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.75, color=BORDER_RULE, spaceBefore=3, spaceAfter=4))
            i += 1
            continue

        # ── Cover Title Block Handling ───────────────────────────────────────
        if stripped.startswith("# The Woven Map / Raven Calder"):
            # Render publication cover block on single column (Page 1)
            story.append(Spacer(1, 4))

            # Docket border block
            title_p = Paragraph("THE WOVEN MAP / RAVEN CALDER", styles['CoverTitle'])
            sub_p = Paragraph("MASTER CANONICAL REFERENCE &amp; ARCHITECTURE MANUAL", styles['CoverSubtitle'])
            meta_text = (
                "<b>Author:</b> Dan Cross / Raven Calder Integration Unit &nbsp;&nbsp;•&nbsp;&nbsp; "
                "<b>Version:</b> 3.2 Canonical Architecture (2026 Edition)<br/>"
                "<b>Publication Date:</b> August 30, 2026 &nbsp;&nbsp;•&nbsp;&nbsp; "
                "<b>Classification:</b> Unified Canonical Master Volume"
            )
            meta_p = Paragraph(meta_text, styles['CoverMeta'])

            header_table = Table([[title_p], [sub_p], [Spacer(1, 2)], [meta_p]], colWidths=[CONTENT_W])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), BG_CARD),
                ('BOX', (0, 0), (-1, -1), 1.0, INK_COBALT),
                ('TOPPADDING', (0, 0), (-1, -1), 7),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ]))
            story.append(header_table)
            story.append(Spacer(1, 8))

            # Render Table of Contents directly on Page 1
            story.append(Paragraph("TABLE OF CONTENTS", styles['Heading2']))
            story.append(Spacer(1, 3))
            toc_table = render_toc_table(styles, page_map)
            story.append(toc_table)
            story.append(Spacer(1, 6))
            story.append(HRFlowable(width="100%", thickness=0.75, color=INK_COBALT, spaceBefore=2, spaceAfter=4))
            story.append(NextPageTemplate('twoColumn'))
            story.append(PageBreak())

            # Skip forward until Author's Introduction or Executive Summary
            i += 1
            while i < num_lines:
                nxt = lines[i].strip()
                if nxt.startswith("# Author's Introduction") or nxt.startswith("# Executive Summary"):
                    break
                i += 1
            continue

        # ── Table of Contents (Skip if encountered in body) ──────────────────
        if stripped.startswith("# Table of Contents"):
            i += 1
            while i < num_lines and not (lines[i].strip().startswith("# ") and "Table of Contents" not in lines[i]):
                if lines[i].strip().startswith("# Executive Summary") or lines[i].strip().startswith("# Foundational"):
                    break
                i += 1
            continue

        # ── Part Headers (e.g. # Part I: Live Operating Canon) ───────────────
        part_match = re.match(r'^#\s+(Part\s+[IVX]+):\s*(.+)$', stripped, re.I)
        if part_match:
            part_num = part_match.group(1).strip()
            part_title = part_match.group(2).strip()

            subtitle_map = {
                "Part I": "Runtime Governance, Operating Directives, Lexicon Gate & Scope Discipline",
                "Part II": "Spatial Dimensions, The Twelve Chambers, SST Admissibility & Balance Telemetry",
                "Part III": "Universal Relational Custody, Psychic Electrodynamics & Psychological Models",
                "Part IV": "Operational Firewalls, Failure Taxonomies, Hallucination Guard & Gate Sequencing",
                "Part V": "Historical Context, Empirical Studies, Superseded Doctrine & Crosswalk Matrix",
            }
            sub_text = subtitle_map.get(part_num, "Canonical Domain Specification")

            # Execute Part Opener in two-column flow with CondPageBreak
            story.append(CondPageBreak(180))
            story.append(Spacer(1, 4))
            story.append(PartBannerFlowable(part_num, part_title, sub_text, width=COL_W, height=54))
            story.append(Spacer(1, 4))
            grace.activate(2)
            i += 1
            continue

        # ── Major Headings (H1, H2, H3, H4) ──────────────────────────────────
        if stripped.startswith("#"):
            h_match = re.match(r'^(#{1,4})\s+(.+)$', stripped)
            if h_match:
                level = len(h_match.group(1))
                h_text = h_match.group(2).strip()

                if not grace.consume():
                    story.extend(section_break_flowables(level))

                if level == 1:
                    style_key = 'Heading1'
                elif level == 2:
                    style_key = 'Heading2'
                elif level == 3:
                    style_key = 'Heading3'
                else:
                    style_key = 'Heading4'

                p_head = Paragraph(clean_markdown_inline(h_text), styles[style_key])

                # Peek ahead for short intro or body paragraph to bind with safe_keep_together
                peek_flowables = [p_head]
                if i + 1 < num_lines and lines[i + 1].strip() and not lines[i + 1].strip().startswith("#"):
                    next_text = lines[i + 1].strip()
                    if not next_text.startswith("|") and not next_text.startswith("```") and not next_text.startswith(">"):
                        p_next = Paragraph(clean_markdown_inline(next_text), styles['Body'])
                        peek_flowables.append(p_next)
                        i += 1

                story.extend(safe_keep_together(peek_flowables))
                i += 1
                continue

        # ── Bullet & Numbered Lists ──────────────────────────────────────────
        list_match = re.match(r'^([\*\-]\s+|\d+\.\s+)(.+)$', stripped)
        if list_match:
            bullet_prefix = "• &nbsp;" if not list_match.group(1).endswith(". ") else f"{list_match.group(1)}&nbsp;"
            item_text = bullet_prefix + clean_markdown_inline(list_match.group(2).strip())
            p_bullet = Paragraph(item_text, styles['Bullet'])
            story.append(p_bullet)
            i += 1
            continue

        # ── Mathematical Display Equations ($$...$$) ─────────────────────────
        if stripped.startswith("$$") and stripped.endswith("$$") and len(stripped) > 4:
            raw_eq = stripped[2:-2].strip()
            clean_eq = clean_markdown_inline(raw_eq)
            clean_eq = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1 / \2)', clean_eq)
            clean_eq = re.sub(r'\\text\{([^}]+)\}', r'\1', clean_eq)
            clean_eq = clean_eq.replace(r'\ge', '≥').replace(r'\le', '≤').replace(r'\times', '×').replace(r'\to', '->')
            clean_eq = re.sub(r'_\{([^}]+)\}', r'<sub>\1</sub>', clean_eq)
            clean_eq = re.sub(r'_([a-zA-Z0-9]+)', r'<sub>\1</sub>', clean_eq)

            eq_p = Paragraph(f"<i><b><font size='9.5' color='#1d4ed8'>{clean_eq}</font></b></i>", styles['FormulaText'])
            eq_card = Table([[eq_p]], colWidths=[COL_W])
            eq_card.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
                ('BOX', (0, 0), (-1, -1), 0.5, BORDER_COBALT),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ]))
            story.append(Spacer(1, 2))
            story.append(eq_card)
            story.append(Spacer(1, 4))
            i += 1
            continue

        # ── Standard Body Paragraph ──────────────────────────────────────────
        p_body = Paragraph(clean_markdown_inline(stripped), styles['Body'])
        story.append(p_body)
        i += 1

    # Close any trailing block
    if in_table and table_lines:
        t_flowable, is_wide = render_markdown_table(table_lines, styles)
        story.append(t_flowable)

    return story


# ── Table Renderer ───────────────────────────────────────────────────────────

def render_markdown_table(lines: List[str], styles: Dict[str, ParagraphStyle], width: float = COL_W) -> Table:
    """Parse Markdown table lines into a styled ReportLab Table sized for width."""
    if len(lines) < 2:
        return Spacer(1, 1)

    # Extract header and rows
    header_cells = [c.strip() for c in lines[0].strip('|').split('|')]
    num_cols = len(header_cells)

    # Check separator
    row_start_idx = 2 if len(lines) > 1 and re.match(r'^[|\s\-:]+$', lines[1]) else 1

    table_data = []

    # Header Row
    header_row = [Paragraph(f"<b>{clean_markdown_inline(c)}</b>", styles['TableHeader']) for c in header_cells]
    table_data.append(header_row)

    for line in lines[row_start_idx:]:
        raw_cells = [c.strip() for c in line.strip('|').split('|')]
        # Pad or trim to num_cols
        while len(raw_cells) < num_cols:
            raw_cells.append("")
        raw_cells = raw_cells[:num_cols]

        row_data = []
        for j, cell_text in enumerate(raw_cells):
            clean_c = clean_markdown_inline(cell_text)
            if j == 0 and ("**" in cell_text or "House" in header_cells[0] or "Command" in header_cells[0]):
                p = Paragraph(clean_c, styles['TableCellBold'])
            elif cell_text.startswith("/") or cell_text.startswith("`") or ".md" in cell_text or "_FAILURE" in cell_text:
                soft_c = clean_c.replace("_", "_ ")
                p = Paragraph(soft_c, styles['TableCellMono'])
            else:
                p = Paragraph(clean_c, styles['TableCell'])
            row_data.append(p)
        table_data.append(row_data)

    avail_w = width

    # Calculate column widths proportionally
    if num_cols == 2:
        col_widths = [avail_w * 0.32, avail_w * 0.68]
    elif num_cols == 3:
        col_widths = [avail_w * 0.25, avail_w * 0.35, avail_w * 0.40]
    elif num_cols == 4:
        if "Component" in header_cells[0] or "File" in header_cells[0]:
            col_widths = [avail_w * 0.28, avail_w * 0.22, avail_w * 0.25, avail_w * 0.25]
        else:
            col_widths = [avail_w * 0.14, avail_w * 0.24, avail_w * 0.31, avail_w * 0.31]
    else:
        col_widths = [avail_w / num_cols] * num_cols

    t = Table(table_data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_HEADER),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 3),
        ('TOPPADDING', (0, 0), (-1, 0), 3),
        ('LINEBELOW', (0, 0), (-1, 0), 1.0, INK_COBALT),
        ('LINEBELOW', (0, 1), (-1, -1), 0.5, BORDER_RULE),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_RULE),
        ('TOPPADDING', (0, 1), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


# ── Interactive Table of Contents Table ──────────────────────────────────────

def render_toc_table(styles: Dict[str, ParagraphStyle], page_map: Optional[Dict[str, int]] = None) -> Table:
    """Render interactive TOC table with resolved page numbers."""
    pm = page_map or {}

    toc_entries = [
        ("Author's Introduction: The Cartographer's Necessity", pm.get("authors_intro", 2), False),
        ("Executive Summary & Universal Authority Hierarchy", pm.get("exec_summary", 2), False),
        ("Foundational System & Product Laws", pm.get("foundational_laws", 2), False),
        ("PART I: LIVE OPERATING CANON & RUNTIME GOVERNANCE", pm.get("part_1", 3), True),
        ("1.1 Live Operating Prompt", pm.get("sec_1_1", 3), False),
        ("1.2 Role & Doctrine (FIELD → MAP → VOICE)", pm.get("sec_1_2", 3), False),
        ("1.3 Aperture Architecture & Scope Discipline", pm.get("sec_1_3", 4), False),
        ("1.4 Reading Formats & Consultation Flow", pm.get("sec_1_4", 4), False),
        ("1.5 Slash Command Registry", pm.get("sec_1_5", 5), False),
        ("PART II: SPATIAL & GEOMETRIC ARCHITECTURE", pm.get("part_2", 6), True),
        ("2.1 The Law of Layered Translation & The Twelve Chambers", pm.get("sec_2_1", 6), False),
        ("2.2 Ambient Chambers & Landing Dynamics", pm.get("sec_2_2", 7), False),
        ("2.3 Symbolic Spectrum Table (SST) & Clean Miss (OSR)", pm.get("sec_2_3", 7), False),
        ("2.4 Balance Meter Telemetry & Seismograph", pm.get("sec_2_4", 7), False),
        ("2.5 Duration of Transits & Planetary Potencies", pm.get("sec_2_5", 8), False),
        ("PART III: RELATIONAL & PSYCHOLOGICAL DIAGNOSTIC MODELS", pm.get("part_3", 9), True),
        ("3.1 Relational Field Protocol & Universal Relational Custody", pm.get("sec_3_1", 9), False),
        ("3.2 Psychic Electrodynamics (Transmission Circuit Model)", pm.get("sec_3_2", 9), False),
        ("3.3 The RED System (Dyadic Oscillator & Integrity S)", pm.get("sec_3_3", 10), False),
        ("3.4 The Advice Ladder Tree & Concrete Exit Protocol", pm.get("sec_3_4", 10), False),
        ("3.5 Shadow Work Diagnostic Reference", pm.get("sec_3_5", 10), False),
        ("3.6 A Unified Theory of Narrative Control", pm.get("sec_3_6", 11), False),
        ("3.7 Interior Compass & Cognitive Function Mapping (MBTI)", pm.get("sec_3_7", 11), False),
        ("PART IV: SYSTEM FIREWALLS, VERIFICATION & FAILURE TAXONOMIES", pm.get("part_4", 12), True),
        ("4.1 The Five Operational Firewalls", pm.get("sec_4_1", 12), False),
        ("4.2 Poetic Hallucination Guard & Strict Payload Isolation", pm.get("sec_4_2", 12), False),
        ("4.3 Complete Failure Taxonomy & Error Codes", pm.get("sec_4_3", 13), False),
        ("4.4 Pre-VOICE Gate Sequence & Fail-Closed Behavior", pm.get("sec_4_4", 13), False),
        ("PART V: HISTORICAL CONTEXT, VALIDATION & CROSSWALK MATRIX", pm.get("part_5", 14), True),
        ("5.1 Superseded Legacy Specifications Notice", pm.get("sec_5_1", 14), False),
        ("5.2 Empirical Studies, Stress Tests & Case Histories", pm.get("sec_5_2", 14), False),
        ("5.3 Master Crosswalk & Dependency Matrix", pm.get("sec_5_3", 15), False),
    ]

    table_data = []
    for title, page_num, is_part in toc_entries:
        if is_part:
            p_title = Paragraph(f"<b>{title}</b>", styles['TOCPart'])
            p_num = Paragraph(f"<b>{page_num}</b>", styles['TOCPageNum'])
        else:
            p_title = Paragraph(title, styles['TOCSection'])
            p_num = Paragraph(str(page_num), styles['TOCPageNum'])
        table_data.append([p_title, p_num])

    col_widths = [CONTENT_W - 35, 35]
    t = Table(table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 0.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LINEBELOW', (0, 0), (-1, -1), 0.25, colors.HexColor('#e2e8f0')),
    ]))
    return t


# ── Master Build Pipeline ────────────────────────────────────────────────────

def compile_raven_pdf(
    md_path: Path,
    out_path: Path,
    verbose: bool = True
) -> Path:
    """Compile Raven Calder Master Reference PDF with 2-pass TOC resolution and bookmarks."""
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if verbose:
        print("=" * 65)
        print("  THE WOVEN MAP / RAVEN CALDER PDF COMPILER")
        print("=" * 65)
        print(f"  Source Manuscript : {md_path}")
        print(f"  Target Deliverable: {out_path}")
        print("-" * 65)

    # Pass 1: Build temporary PDF to discover physical page numbers
    if verbose:
        print("  [Pass 1/2] Building preliminary layout to resolve page map...")

    initial_story = parse_markdown_to_story(md_path, page_map=None)
    doc1 = create_doc(out_path, canvasmaker=NumberedCanvas)
    doc1.build(initial_story)

    resolved_map = resolve_page_map(out_path)
    if verbose:
        print(f"  Resolved {len(resolved_map)} section anchors.")

    # Pass 2: Build final PDF with resolved TOC page numbers
    if verbose:
        print("  [Pass 2/2] Generating final publication PDF with resolved TOC...")

    final_story = parse_markdown_to_story(md_path, page_map=resolved_map)
    doc2 = create_doc(out_path, canvasmaker=NumberedCanvas)
    doc2.build(final_story)

    # Pass 3: Inject PDF Outline Bookmarks via PyMuPDF
    toc_bookmarks = [
        (1, "Author's Introduction: The Cartographer's Necessity", resolved_map.get("authors_intro", 2)),
        (1, "Executive Summary & Universal Authority Hierarchy", resolved_map.get("exec_summary", 2)),
        (1, "Foundational System & Product Laws", resolved_map.get("foundational_laws", 2)),
        (1, "Part I: Live Operating Canon & Runtime Governance", resolved_map.get("part_1", 3)),
        (2, "1.1 Live Operating Prompt", resolved_map.get("sec_1_1", 3)),
        (2, "1.2 Role & Doctrine (FIELD → MAP → VOICE)", resolved_map.get("sec_1_2", 3)),
        (2, "1.3 Aperture Architecture & Scope Discipline", resolved_map.get("sec_1_3", 4)),
        (2, "1.4 Reading Formats & Consultation Flow", resolved_map.get("sec_1_4", 4)),
        (2, "1.5 Slash Command Registry", resolved_map.get("sec_1_5", 5)),
        (1, "Part II: Spatial & Geometric Architecture", resolved_map.get("part_2", 6)),
        (2, "2.1 The Law of Layered Translation & The Twelve Chambers", resolved_map.get("sec_2_1", 6)),
        (2, "2.2 Ambient Chambers & Landing Dynamics", resolved_map.get("sec_2_2", 7)),
        (2, "2.3 Symbolic Spectrum Table (SST) & Clean Miss (OSR)", resolved_map.get("sec_2_3", 7)),
        (2, "2.4 Balance Meter Telemetry & Seismograph", resolved_map.get("sec_2_4", 7)),
        (2, "2.5 Duration of Transits & Planetary Potencies", resolved_map.get("sec_2_5", 8)),
        (1, "Part III: Relational & Psychological Diagnostic Models", resolved_map.get("part_3", 9)),
        (2, "3.1 Relational Field Protocol & Universal Relational Custody", resolved_map.get("sec_3_1", 9)),
        (2, "3.2 Psychic Electrodynamics (Transmission Circuit Model)", resolved_map.get("sec_3_2", 9)),
        (2, "3.3 The RED System (Dyadic Oscillator & Integrity S)", resolved_map.get("sec_3_3", 10)),
        (2, "3.4 The Advice Ladder Tree & Concrete Exit Protocol", resolved_map.get("sec_3_4", 10)),
        (2, "3.5 Shadow Work Diagnostic Reference", resolved_map.get("sec_3_5", 10)),
        (2, "3.6 A Unified Theory of Narrative Control", resolved_map.get("sec_3_6", 11)),
        (2, "3.7 Interior Compass & Cognitive Function Mapping (MBTI)", resolved_map.get("sec_3_7", 11)),
        (1, "Part IV: System Firewalls, Verification & Failure Taxonomies", resolved_map.get("part_4", 12)),
        (2, "4.1 The Five Operational Firewalls", resolved_map.get("sec_4_1", 12)),
        (2, "4.2 Poetic Hallucination Guard & Strict Payload Isolation", resolved_map.get("sec_4_2", 12)),
        (2, "4.3 Complete Failure Taxonomy & Error Codes", resolved_map.get("sec_4_3", 13)),
        (2, "4.4 Pre-VOICE Gate Sequence & Fail-Closed Behavior", resolved_map.get("sec_4_4", 13)),
        (1, "Part V: Historical Context, Validation & Crosswalk Matrix", resolved_map.get("part_5", 14)),
        (2, "5.1 Superseded Legacy Specifications Notice", resolved_map.get("sec_5_1", 14)),
        (2, "5.2 Empirical Studies, Stress Tests & Case Histories", resolved_map.get("sec_5_2", 14)),
        (2, "5.3 Master Crosswalk & Dependency Matrix", resolved_map.get("sec_5_3", 15)),
    ]

    added_count = add_bookmarks(out_path, toc_bookmarks)
    if verbose:
        print(f"  Injected {added_count} interactive bookmarks into PDF outline.")

    # Pass 4: Run Post-Build QA
    if verbose:
        print("-" * 65)
        print("  Running post-build layout QA suite...")
        qa_report = run_post_build_qa(out_path)
        qa_report.emit()

    print("=" * 65)
    print(f"  ✓ PDF Compilation Complete: {out_path}")
    print("=" * 65)
    return out_path


def main():
    repo_root = Path(__file__).resolve().parent.parent
    md_source = repo_root / "The_Woven_Map_Raven_Calder_Master_Reference_2026.md"
    pdf_dest = repo_root / "output" / "pdf" / "The_Woven_Map_Raven_Calder_Master_Reference_2026.pdf"

    if not md_source.exists():
        print(f"Error: Source manuscript not found at {md_source}", file=sys.stderr)
        sys.exit(1)

    compile_raven_pdf(md_source, pdf_dest)


if __name__ == "__main__":
    main()
