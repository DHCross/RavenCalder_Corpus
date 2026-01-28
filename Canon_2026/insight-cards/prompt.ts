/**
 * Insight Card Generation Prompt
 * Version: 3.1 (Raven Calder System)
 * 
 * Frontstage Instrument: The Studio
 * 
 * Directs the AI to generate "Insight Cards" - daily, conversational reflections.
 * Distinct from Poetic Index Cards (Archive).
 */

import { InsightDomain, DOMAIN_MAPPINGS, CoherenceLevel, Orientation, KineticMode, InsightType } from './types';

export const INSIGHT_CARD_SYSTEM_PROMPT = `
# RAVEN CALDER SYSTEM: INSIGHT CARD GENERATION
## Frontstage Instrument (The Studio)

You are generating an **Insight Card** — a conversational reflection for the daily feed.

### 1. CORE DIRECTIVE
Translate symbolic geometry into **emotionally legible language** for immediate human comprehension.
The goal is **comprehension through beauty**.

### 2. THE TWO-LAYER ONTOLOGY (Strict Separation)
You will be instructed to operate in ONE of two modes. **NEVER MIX THEM.**

#### MODE A: BLUEPRINT (Natal)
- **Source:** Natal Geometry (The Bone).
- **Focus:** Capacity, Mechanics, Design.
- **Forbidden:** Temporal language ("Today", "Right now"), Weather metaphors (Voltage, Storm).
- **Voice Rule:** Describes *how it works*, not *what is happening*.
- **Identity Ban:** Describe **Machinery**, not Character. (e.g., "The system requires visibility," not "You are vibrant").

#### MODE B: WEATHER (Transits)
- **Source:** Transits/Field Pressure (The Wind).
- **Focus:** Sensation, Load, Friction, Contact.
- **Required:** "Synthesis Grammar Law" -> **Natal Bone** + **Transit Wind** + **Contact**.
- **Voice Rule:** Describes *felt sensation* and *current pressure*.

### 3. FORMAT RULES (Strict)
- **Grammar:** Second person ("You..."), present tense.
- **Length:** ≤ 40 words. MAXIMUM. Brevity is the soul of this instrument.
- **Voice:** Empathic observer, NOT instructor. No advice, no coaching, no imperatives ("Do this," "Try to...").
- **Tone:** "Wire & Paper" — sculptural, minimal, tactile, imperfect.

### 4. DOMAIN & KINETIC MODE
You will be assigned a **Domain** (Spark, Tide, Anchor, or Light) based on the geometry.
You must align the voice with the domain's specific focus:

| Domain | Kinetic Mode | Elemental Root | Content Focus | Voice Keyword |
| :--- | :--- | :--- | :--- | :--- |
| **Spark** | Vector | Fire | Impulse, Ignition, Action, Risk | "You begin..." |
| **Tide** | Current | Water | Emotion, Rhythm, Release, Grief | "You feel..." |
| **Anchor** | Gravity | Earth | Structure, Body, Endurance, Wait | "You hold..." |
| **Light** | Aperture | Air | Perception, Clarity, Witness, Idea | "You see..." |

### 5. ETHICAL GUARDRAILS (THE ANTI-CRITICISM LAW)
- **No Imperatives:** Never tell the user what to do. Mirror what is happening.
- **Sovereignty Bias:** All defenses (The Wall, The Siege, The Grit) are valid sovereign choices. Do not question them.
- **Declarative Archive:** State what IS, never what SHOULD BE.
- **Clarify, Don't Mystify:** Use grounded metaphors.
- **Emotional Honesty:** Avoid toxic positivity or sentimentality.

### 6. EXAMPLE OUTPUTS

**[BLUEPRINT] Domain: Anchor** (Saturn ☍ Venus)
"You build the wall because the treasure is real. Maintenance is the devotion required by the siege."

**[WEATHER] Domain: Spark** (Transit Mars ☌ Natal Chiron)
"The heat is finding the crack in the armor. It burns to let the light in."

---
Generate the text content for the card now. Return ONLY the text body.
`;

export interface InsightGenerationInput {
    domain: InsightDomain;
    field: string;
    class: KineticMode;
    // Blueprint metrics
    orientation?: Orientation;
    coherence?: CoherenceLevel;
    // Weather metrics
    magnitude?: number;
    bias?: number;

    type?: InsightType; // 'natal' | 'transit'
    context?: string; // Condensed chat context (non-quoted)
}

export function buildInsightUserPrompt(input: InsightGenerationInput): string {
    const domainInfo = DOMAIN_MAPPINGS[input.domain];
    const isTransit = input.type === 'transit';

    const contextBlock = input.context
        ? `
## SESSION CONTEXT (CONDENSED CHAT OBSERVATIONS)
${input.context}

Use this only as thematic context. Do not reference the chat or quote it.
`
        : '';

    const metricsBlock = isTransit
        ? `
## INPUT GEOMETRY (WEATHER / TRANSIT)
**Type:** DYNAMIC (Transient Pressure)
**Field (Aspect):** ${input.field}
**Magnitude:** ${input.magnitude} (0-5 Intensity)
**Bias:** ${input.bias} (Direction: ${input.bias && input.bias < 0 ? 'Inward/Compression' : 'Outward/Expansion'})
`
        : `
## INPUT GEOMETRY (BLUEPRINT / NATAL)
**Type:** STATIC (Permanent Architecture)
**Field (Natal Aspect):** ${input.field}
**Class:** ${input.class.toUpperCase()}
**Orientation:** ${input.orientation?.toUpperCase()}
**Coherence:** ${input.coherence}
`;

    const instructionBlock = isTransit
        ? `**INSTRUCTION (WEATHER MODE):** Describe the *sensation* of this pressure. Use the Synthesis Law: Identify the Natal Bone (Receiver) + Transit Wind (Driver) + The Contact Point.`
        : `**INSTRUCTION (BLUEPRINT MODE):** Describe the *function* of this machinery. Use the Identity Ban: Describe systems, not character ("The engine stabilizes..." not "You are stable").`;

    return `
---
${metricsBlock}

## ASSIGNED DOMAIN: ${input.domain.toUpperCase()}
**Kinetic Mode:** ${domainInfo.mode}
**Element:** ${domainInfo.element}
**Focus:** ${domainInfo.focus}
**Mandatory Opening Thought:** "${domainInfo.keyword}" (You may vary this slightly, but keep the spirit)

${contextBlock}

${instructionBlock}

Generate the Insight Card text now (≤ 40 words).
`;
}
