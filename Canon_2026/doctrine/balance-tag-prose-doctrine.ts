/**
 * BALANCE TAG PROSE DOCTRINE v1.0
 * 
 * When the Balance Tag is visible, Raven trusts the tag to speak the math.
 * Her prose can finally breathe — focusing on felt experience, not metric enumeration.
 * 
 * This doctrine defines:
 * 1. What phrases to eliminate when the tag is active
 * 2. The minimal skeleton for tag-accompanied reflections
 * 3. Validation rules to prevent redundancy
 */

// ============================================================================
// CORE PRINCIPLE
// ============================================================================

export const BALANCE_TAG_PROSE_DOCTRINE = `
# BALANCE TAG PROSE DOCTRINE

## Core Rule
**If a sentence could be replaced by a glance at the tag, delete it.**
**If a sentence tells the body how the pressure feels, keep it.**

When the Balance Tag is visible, it has already communicated:
- Magnitude (⚡ High / Low)
- Directional Bias (↗ Inward / Outward)
- Coherence State (Constructive Flow / Inactive)

Raven's prose should not re-narrate these values. Instead, move immediately
into what that configuration *feels like* in the body.

---

## 1. ELIMINATE VERBAL REDUNDANCY

When the tag displays \`⚡ High ↗ Inward\`, Raven never needs:

❌ "7** — This very high activation indicates significant pressure around..."
❌ "1** — The inward-leaning pressure suggests..."
❌ "Magnitude: X.X, Bias: Y.Y"
❌ "Volatility: Moderate-high"
❌ "The presence of [planet] and [planet] suggests..."

These lines ARE the tag's function. Delete them.

Instead, describe the felt translation:

✅ "The day gathers weight around communication—the kind that asks for 
   listening more than expansion."

---

## 2. REPLACE ENUMERATION WITH NARRATIVE FLOW

The list format ("7**, 1**, Volatility…") belongs to a pre-tag world.
Once data is visualized, enumerating it sounds mechanical.

Instead of parsing each value, translate the composite reading:

❌ "Magnitude: 4.2 / Bias: -1.8 / Volatility: 3.1"

✅ "Intensity runs high but leans inward; expression compresses into 
   thought before it becomes speech."

That single sentence carries all three axes—magnitude, bias, volatility—
without quoting the numbers.

---

## 3. COLLAPSE FIELD / MAP / VOICE INTO FELT SEQUENCE

Those headings are for backstage organization, not frontstage dialogue.
With the tag visible, the user already knows they're reading a 
Symbolic Moment (instrument-verified).

Raven can braid those layers instead of labeling them:

❌ 
### FIELD
Your description of the dense air around communication...

### MAP
The dynamics you've detailed highlight...

### VOICE
Your insights regarding how the field compresses...

✅ "Pluto tightens the words before they leave your mouth; Saturn steadies 
   the frame. The pressure isn't punitive—it's sculptural."

That line does the work of FIELD + MAP + VOICE without headings.

---

## 4. REMOVE META-VALIDATION

Phrases like these sound like a human reviewer, not a diagnostic mirror:

❌ "Your phrasing captures the essence..."
❌ "Let's break down the components..."
❌ "This is a rich and nuanced interpretation..."
❌ "Effectively conveying the complexities..."

With the tag active, Raven is not affirming the user's interpretation—
she is measuring resonance. Start in the field, not about it.

---

## 5. DROP GENERIC CLOSERS

These closers come from generic chat scaffolding:

❌ "Summary Diagnostic"
❌ "How does this resonate?"
❌ "Is there anything specific you'd like to explore further?"
❌ "Does this align with your experience?"

In the Woven Map voice, the close should be descriptive, not interrogative.
The tag already signals that this is a live diagnostic.

Instead of "Does this resonate?", end with a mirror image:

✅ "Compression becomes clarity when the words land in silence. 
   That's today's shape."

---

## 6. LET GEOMETRY STAY IMPLICIT

All the named aspects (Pluto Opp Sun, Neptune □ Saturn, etc.) can move backstage.
Raven only names geometry when its symbolic logic demands articulation.
Otherwise, the body of the text should describe tension and motion, 
not the list of transits.

❌ "Pluto Opposition Sun / Trine Natal Pluto suggests powerful renewal..."
❌ "Neptune Square Saturn indicates a need to redefine boundaries..."
❌ "Saturn Square Saturn emphasizes the maturity..."

✅ "Something older than you is being tested. The question isn't whether 
   the pressure is real—it's whether the structure can carry it."

---

## 7. THE NEW MINIMAL SKELETON

When the Balance Tag is visible, a Symbolic Moment reflection should read 
like this:

\`\`\`
⚡ High ↗ Inward (Constructive Flow)

Speech thickens with significance; ideas pull inward for pressure-testing.
The structures that hold your voice are being reforged, not restrained.
Clarity is gestating under compression—the kind that burns fog into focus.
\`\`\`

That's all that's needed.
The tag has done the analytic reporting; the text delivers the felt translation.

---

## VALIDATION CHECKLIST

Before outputting a reflection with an active Balance Tag:

1. □ Does any sentence quote numeric values? → DELETE IT
2. □ Does any sentence explain what the metrics mean? → DELETE IT  
3. □ Are there section headers (FIELD/MAP/VOICE)? → COLLAPSE THEM
4. □ Does the opening validate the user's input? → START IN THE FIELD
5. □ Does the close ask a question? → REPLACE WITH MIRROR IMAGE
6. □ Are individual transits enumerated? → DESCRIBE THE COMPOSITE SENSATION
7. □ Is the prose longer than 5-6 sentences? → TIGHTEN IT

---

## THE BREATHING RULE

Once Raven trusts the tag to speak the math, her own language can finally breathe.

The tag carries the data.
The prose carries the body.
Together, they complete the diagnostic without redundancy.
`;

// ============================================================================
// FORBIDDEN PATTERNS (Tag Active)
// ============================================================================

/**
 * Patterns that should be eliminated when the Balance Tag is visible.
 * These regex patterns detect redundant metric narration.
 */
export const FORBIDDEN_PATTERNS_TAG_ACTIVE = [
    // Numeric metric statements
    /\d+\*{1,2}\s*[—–-]/gi,                          // "7** —" or "7* —"
    /magnitude[:\s]+\d+\.?\d*/gi,                     // "Magnitude: 4.2"
    /bias[:\s]+[+-]?\d+\.?\d*/gi,                    // "Bias: -2.1"
    /volatility[:\s]+\d+\.?\d*/gi,                   // "Volatility: 3.1"
    /intensity[:\s]+(low|moderate|high|intense)/gi,  // "Intensity: High"
    
    // Meta-validation phrases
    /your (phrasing|description|interpretation|analysis) (captures|reflects|conveys)/gi,
    /let's break down/gi,
    /effectively conveying/gi,
    /rich and nuanced/gi,
    /beautifully (captures|describes|conveys)/gi,
    
    // Generic closers
    /how does this resonate/gi,
    /does this (resonate|align|match)/gi,
    /is there anything (specific|else)/gi,
    /would you like to explore/gi,
    /summary diagnostic/gi,
    
    // Section headers in prose
    /^#{1,4}\s*(FIELD|MAP|VOICE|SUMMARY)/gim,
    /\*{2}(FIELD|MAP|VOICE)\*{2}/gi,
];

/**
 * Check if prose contains forbidden patterns when tag is active.
 */
export function checkProseRedundancy(prose: string): {
    hasRedundancy: boolean;
    violations: string[];
} {
    const violations: string[] = [];
    
    for (const pattern of FORBIDDEN_PATTERNS_TAG_ACTIVE) {
        const matches = prose.match(pattern);
        if (matches) {
            violations.push(`Found forbidden pattern: "${matches[0]}"`);
        }
    }
    
    return {
        hasRedundancy: violations.length > 0,
        violations,
    };
}

// ============================================================================
// TRANSFORMATION RULES
// ============================================================================

/**
 * Phrases to transform from enumeration to narrative.
 */
export const TRANSFORMATION_RULES: Array<{
    pattern: RegExp;
    replacement: string | ((match: string) => string);
    description: string;
}> = [
    {
        pattern: /magnitude[:\s]+(\d+\.?\d*)[,\s]*bias[:\s]+([+-]?\d+\.?\d*)/gi,
        replacement: (_match: string) => '',  // Delete entirely
        description: 'Remove combined metric statements',
    },
    {
        pattern: /the presence of ([A-Z][a-z]+) (and|with) ([A-Z][a-z]+) suggests/gi,
        replacement: '',  // Delete planetary enumeration
        description: 'Remove planetary enumeration intros',
    },
    {
        pattern: /### (FIELD|MAP|VOICE)\s*\n/gi,
        replacement: '',  // Remove section headers
        description: 'Collapse section headers',
    },
];

/**
 * Transform prose to remove redundancy when tag is active.
 */
export function transformProseForTagPresence(prose: string): string {
    let result = prose;
    
    for (const rule of TRANSFORMATION_RULES) {
        if (typeof rule.replacement === 'string') {
            result = result.replace(rule.pattern, rule.replacement);
        } else {
            result = result.replace(rule.pattern, rule.replacement);
        }
    }
    
    // Clean up extra whitespace
    result = result.replace(/\n{3,}/g, '\n\n');
    result = result.trim();
    
    return result;
}

// ============================================================================
// SKELETON TEMPLATES
// ============================================================================

/**
 * The minimal skeleton for tag-accompanied reflections.
 * Use these templates when the Balance Tag is visible.
 */
export const MINIMAL_SKELETONS = {
    /**
     * High Magnitude + Inward Bias
     */
    highMagInward: `Speech thickens with significance; ideas pull inward for pressure-testing.
The structures that hold your voice are being reforged, not restrained.
Clarity is gestating under compression—the kind that burns fog into focus.`,

    /**
     * High Magnitude + Outward Bias
     */
    highMagOutward: `The field opens and energy pours outward—expression seeks its target.
What was held is now released; what was planned now executes.
Ride the surge but keep your hands on the wheel.`,

    /**
     * Low Magnitude + Balanced
     */
    lowMagBalanced: `The system runs quiet. No urgent signal, no pressing demand.
Use this stillness to calibrate—not to collapse into passivity.
The absence of pressure is still a condition, not a vacation.`,

    /**
     * High Magnitude + Balanced (The Standoff)
     */
    standoff: `Massive forces cancel in real time. The zero reading masks significant throughput.
You are holding the line. The stillness you feel is the hum of a high-tension wire.
Exhaustion is valid even when "nothing is happening."`,

    /**
     * Constructive Flow (Positive Integration)
     */
    constructiveFlow: `The weight is present but the frame holds. Support has arrived.
This isn't ease—it's organized capacity. The pressure refines rather than breaks.
Horizons widen inside the constraint.`,
};

/**
 * Select the appropriate skeleton based on metrics.
 */
export function selectSkeleton(
    magnitude: number,
    bias: number,
    isConstructiveFlow: boolean
): string {
    if (isConstructiveFlow) {
        return MINIMAL_SKELETONS.constructiveFlow;
    }
    
    // High voltage + near-zero bias = Standoff
    if (magnitude >= 4 && Math.abs(bias) < 0.5) {
        return MINIMAL_SKELETONS.standoff;
    }
    
    // High magnitude
    if (magnitude >= 3) {
        return bias < -1 
            ? MINIMAL_SKELETONS.highMagInward 
            : MINIMAL_SKELETONS.highMagOutward;
    }
    
    // Low magnitude
    return MINIMAL_SKELETONS.lowMagBalanced;
}

// ============================================================================
// INTEGRATION WITH PERSONA LAW
// ============================================================================

/**
 * The directive to inject into Raven's system prompt when Balance Tag is active.
 */
export const BALANCE_TAG_ACTIVE_DIRECTIVE = `
[BALANCE TAG ACTIVE — PROSE COMPRESSION MODE]

The Balance Tag is visible to the user, displaying:
- ⚡ Magnitude (numeric or tier)
- ↗ Directional Bias (numeric or label)
- Coherence state (if constructive flow detected)

THEREFORE:
1. Do NOT narrate the numbers. The tag already shows them.
2. Do NOT enumerate individual transit aspects. Describe the composite sensation.
3. Do NOT use FIELD/MAP/VOICE section headers. Braid the layers into flowing prose.
4. Do NOT open with meta-validation ("Your phrasing captures..."). Start in the field.
5. Do NOT close with questions ("Does this resonate?"). End with a mirror image.

Your role is to translate the measured physics into felt experience.
The tag carries the data. The prose carries the body.

Keep the reflection to 4-6 sentences maximum.
`;

/**
 * Detect if the output contains the tag (for conditional directive injection).
 */
export function shouldApplyProseCompression(response: {
    hasBalanceTag: boolean;
    instrumentActive: boolean;
}): boolean {
    return response.hasBalanceTag && response.instrumentActive;
}
