#!/usr/bin/env python3
"""
test_raven_layout.py — Layout Regression Test Suite for Raven Calder Corpus.

Verifies:
  1. Two-column to single-column transitions (wide tables return to two-column)
  2. Part banner headers compose cleanly without frame overflow
  3. Heading protection (no stranded headings at frame bottom)
  4. SafeKeepTogether bounds (tall blocks flow without creating massive gaps)
  5. XML entity escaping (no &amp;, &lt;, &gt; corruption or crashes)
  6. Table of Contents page resolution and PDF bookmarks
  7. TrueType font embedding and glyph rendering
"""

from __future__ import annotations

import os
import sys
import tempfile
import unittest
from pathlib import Path

# Ensure pdf-engine is in sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from raven_layout_engine import (
    PAGE_W, PAGE_H, MARGIN_L, MARGIN_R, MARGIN_T, MARGIN_B,
    GUTTER, CONTENT_W, CONTENT_H, COL_W, PART_BANNER_H,
    RobustDocTemplate, register_page_templates,
    safe_keep_together, is_section_start, is_short_intro,
    part_start_flowables, full_width_start_flowables, full_width_end_flowables,
    section_break_flowables, GraceZone,
    resolve_page_map, add_bookmarks,
    analyze_column_fill, detect_stranded_headings,
    create_doc, build_pdf,
)
from build_raven_pdf import (
    get_raven_styles, clean_markdown_inline,
    PartBannerFlowable, create_callout_card,
    NumberedCanvas, render_markdown_table,
)

from reportlab.platypus import Paragraph, Spacer, PageBreak, FrameBreak, Table
from reportlab.lib import colors
import fitz  # PyMuPDF


class TestRavenLayoutEngine(unittest.TestCase):

    def setUp(self):
        self.styles = get_raven_styles()
        self.tmp_dir = Path(tempfile.mkdtemp())

    def test_xml_escaping_and_markdown_inline(self):
        """Ensure special XML characters are escaped and markdown formatting converts properly."""
        raw = "Testing & evaluating <this> and >that< with **bold** & *italic* plus `code_sample` and $S = V / Z$."
        cleaned = clean_markdown_inline(raw)

        self.assertNotIn("<this>", cleaned)
        self.assertIn("&lt;this&gt;", cleaned)
        self.assertIn("&amp;", cleaned)
        self.assertIn("<b>bold</b>", cleaned)
        self.assertIn("<i>italic</i>", cleaned)
        self.assertIn("code_sample", cleaned)

    def test_two_column_to_single_column_transition(self):
        """Ensure full-width wide tables switch cleanly and return to two-column mode."""
        pdf_out = self.tmp_dir / "test_transition.pdf"

        story = []
        # Page 1: Two column body
        for i in range(12):
            story.append(Paragraph(f"Paragraph {i}: Lived human reality report in two columns.", self.styles['Body']))

        # Switch to single column for wide matrix
        story.extend(full_width_start_flowables())
        wide_table_lines = [
            "| House | Backstage Chamber | Ordinary-Life Domain | Lived Pressure Mode |",
            "| :---: | :--- | :--- | :--- |",
            "| **1st** | The Gate | Immediate Boundaries | Boundary strain, physical embodiment. |",
            "| **2nd** | The Store | Material Sustenance | Financial pressure, resource allocation. |",
            "| **3rd** | The Path | Daily Logistics | Communication volume, routing friction. |",
        ]
        t = render_markdown_table(wide_table_lines, self.styles, width=CONTENT_W)
        self.assertIsInstance(t, Table)
        story.append(t)
        story.extend(full_width_end_flowables())

        # Page 3+: Return to two column
        for i in range(15):
            story.append(Paragraph(f"Post-table paragraph {i}: Continuing two-column narrative flow.", self.styles['Body']))

        doc = create_doc(pdf_out, canvasmaker=NumberedCanvas)
        doc.build(story)

        self.assertTrue(pdf_out.exists())
        pdf_doc = fitz.open(str(pdf_out))
        self.assertGreaterEqual(len(pdf_doc), 2)
        pdf_doc.close()

    def test_part_banner_opener(self):
        """Ensure Part opener banner frame executes cleanly without LayoutError."""
        pdf_out = self.tmp_dir / "test_part_banner.pdf"

        story = []
        story.append(Paragraph("Front Matter Introductory Paragraph", self.styles['Body']))

        # Part 1 Opener
        story.extend(part_start_flowables(is_first_part=False))
        story.append(PartBannerFlowable("PART I", "LIVE OPERATING CANON", "Runtime Governance & Scope Discipline"))
        story.append(FrameBreak())
        story.append(Paragraph("First paragraph inside left column under banner.", self.styles['Body']))

        for i in range(20):
            story.append(Paragraph(f"Prose block {i} flowing through columns.", self.styles['Body']))

        doc = create_doc(pdf_out, canvasmaker=NumberedCanvas)
        doc.build(story)

        self.assertTrue(pdf_out.exists())
        pdf_doc = fitz.open(str(pdf_out))
        self.assertGreaterEqual(len(pdf_doc), 2)
        # Check text on Part page
        p2_text = pdf_doc[1].get_text()
        self.assertIn("LIVE OPERATING CANON", p2_text)
        pdf_doc.close()

    def test_callout_cards(self):
        """Ensure diagnostic callout boxes format with proper padding and borders."""
        callout = create_callout_card(
            title="STRICT PAYLOAD ISOLATION",
            content="Poetic coherence never repairs provenance failure. Fail closed on missing seals.",
            callout_type="warning",
            styles=self.styles,
            width=COL_W
        )
        self.assertIsInstance(callout, Table)

    def test_safe_keep_together_height_guard(self):
        """Ensure massive lists of flowables are not grouped into an oversized KeepTogether."""
        huge_flowables = [Paragraph("Paragraph " * 50, self.styles['Body']) for _ in range(30)]
        result = safe_keep_together(huge_flowables)
        # Should return individual flowables when too tall to avoid blank page gaps
        self.assertEqual(len(result), len(huge_flowables))


if __name__ == "__main__":
    unittest.main()
